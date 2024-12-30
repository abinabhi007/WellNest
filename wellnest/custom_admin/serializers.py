from rest_framework import serializers
from .models import CustomUser, Appointment, Department, Doctor
from django.conf import settings

class SignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'name', 'age', 'gender', 'contact_number', 'address', 'password', 'confirm_password']

    # Ensure that confirm_password matches password
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(**validated_data)
        return user
    

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'name', 'age', 'gender', 'contact_number', 'address', 'password']


class AppointmentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    doctor = serializers.StringRelatedField()
    department = serializers.StringRelatedField()

    class Meta:
        model = Appointment
        fields = ['id', 'date', 'user', 'doctor', 'department']


# Serializer for Department model
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'department_name']  # Serialize only necessary fields

# Serializer for Doctor model
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'department', 'qualification', 'experience', 'contact_number', 'image', 'is_enabled']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure department is always a string
        representation['department'] = str(representation.get('department', ''))
        return representation
    
    def get_image_url(self, obj):
        if obj.image:
            return settings.MEDIA_URL + str(obj.image)  # Assuming MEDIA_URL is configured correctly
        return None
