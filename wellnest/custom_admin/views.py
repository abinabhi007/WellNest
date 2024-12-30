from rest_framework.response import Response
from .serializers import SignupSerializer, DepartmentSerializer, DoctorSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from .models import Appointment, Department, Doctor, CustomUser
from rest_framework import status
from django.shortcuts import get_object_or_404, render, redirect
from datetime import date
from django.contrib import messages
from django.core.paginator import Paginator
from datetime import datetime
from django.db.models import Count
from django.contrib.auth.decorators import login_required


# Admin Views...

def admin_login(request):
    if request.method == 'POST':
        email = request.POST.get('username')  # Username field uses email
        password = request.POST.get('password')
        user = authenticate(request, email=email, password=password)

        if user is not None and user.is_superuser:  # Check for superuser
            login(request, user)
            return redirect('/appointments/')
        else:
            messages.error(request, 'Invalid credentials or no admin privileges.')

    return render(request, 'login.html')


@login_required
def appointments(request):
    doctor_name = request.GET.get('doctor_name', '')
    date = request.GET.get('date', '')

    # Filter appointments based on search criteria
    appointments_query = Appointment.objects.all()

    if doctor_name:
        appointments_query = appointments_query.filter(doctor__name__icontains=doctor_name)
    if date:
        appointments_query = appointments_query.filter(date=date)

    # Paginate the filtered appointments
    paginator = Paginator(appointments_query, 10)  # 5 appointments per page
    page_number = request.GET.get('page')  # Get current page number from query params
    page_obj = paginator.get_page(page_number)

    return render(request, 'appointment_list.html', {'appointments': page_obj})

@login_required
def user_list(request):
    # Fetch all patients excluding superusers
    patients = CustomUser.objects.exclude(is_superuser=True)  # Exclude superusers
    paginator = Paginator(patients, 5)  # Show 5 patients per page

    page_number = request.GET.get('page')  # Get the page number from the GET request
    page_obj = paginator.get_page(page_number)  # Get the appropriate page object

    return render(request, 'user_list.html', {'page_obj': page_obj})


@login_required
def doctors_list(request):
    doctors = Doctor.objects.all()  # Get all doctor records

    paginator = Paginator(doctors, 5)  # Paginate with 5 doctors per page
    page_number = request.GET.get('page')  # Get the page number from the request
    page_obj = paginator.get_page(page_number)  # Get the paginated objects

    return render(request, 'doctor_list.html', {'page_obj': page_obj})


@login_required
def doctor_report(request):
    # Get the selected date from the request, default to today if not provided
    selected_date = request.GET.get('date', datetime.today().strftime('%Y-%m-%d'))

    # Query to count appointments per doctor for the selected date
    reports = (
        Appointment.objects
        .filter(date=selected_date)
        .values('doctor__name', 'date')
        .annotate(patient_count=Count('id'))
        .order_by('doctor__name')
    )

    return render(request, 'reports.html', {'reports': reports, 'selected_date': selected_date})
    

@login_required
def user_view(request, id):
    patient = get_object_or_404(CustomUser, id=id)
    return render(request, 'user_view.html', {'patient': patient})


@login_required
def create_doctor(request):
    if request.method == 'POST':
        # Fetch data from the submitted form
        name = request.POST.get('name')
        qualification = request.POST.get('qualification')
        experience = request.POST.get('experience')
        contact_number = request.POST.get('contact_number')
        image = request.FILES.get('image')  # Handling image upload
        department_id = request.POST.get('department')  # Department selection

        # Ensure the department exists
        department = Department.objects.get(id=department_id)

        # Create the Doctor instance
        Doctor.objects.create(
            name=name,
            qualification=qualification,
            experience=experience,
            contact_number=contact_number,
            image=image,
            department=department,
            is_enabled=True  # You can set this to False or True based on your business logic
        )

        # Redirect to the doctor list page or any other page
        return redirect('/doctors/')  # Adjust this based on your URL configuration

    # If the request is GET, fetch all departments to display in the dropdown
    departments = Department.objects.all()

    # Render the create doctor page with the departments
    return render(request, 'create_doctor.html', {'departments': departments})


@login_required
def doctor_edit(request, id):
    doctor = get_object_or_404(Doctor, id=id)
    departments = Department.objects.all()

    if request.method == 'POST':
        doctor.name = request.POST.get('name')
        doctor.qualifications = request.POST.get('qualifications')
        doctor.experience = request.POST.get('experience')
        doctor.contact_number = request.POST.get('contact')
        doctor.department_id = request.POST.get('department')
        
        if request.FILES.get('image'):
            doctor.image = request.FILES['image']
        
        doctor.save()
        return redirect('/doctors/', id=doctor.id)

    return render(request, 'edit_doctor.html', {
        'doctor': doctor,
        'departments': departments  # Pass department list to template
    })


@login_required
def doctor_view(request, id):
    doctor = get_object_or_404(Doctor, id=id)
    return render(request, 'view_doctor.html', {'doctor': doctor})


@login_required
def user_history(request, id):
    patient = get_object_or_404(CustomUser, id=id)
    appointments = patient.appointment_set.all()  # Get all appointments for the patient
    
    # Paginate appointments (show max 5 per page)
    paginator = Paginator(appointments, 5)  # 5 appointments per page
    
    # Get the page number from the GET request, default to 1 if not provided
    page_number = request.GET.get('page', 1)  
    
    try:
        page_obj = paginator.get_page(page_number)  # Get the appointments for the current page
    except ValueError:
        # If the page number is invalid, redirect to page 1
        page_obj = paginator.get_page(1)
    
    return render(request, 'user_history.html', {'patient': patient, 'page_obj': page_obj})


@login_required
def toggle_doctor_status(request, id):
    doctor = get_object_or_404(Doctor, id=id)
    doctor.is_enabled = not doctor.is_enabled
    doctor.save()
    return redirect('/doctors')  # Redirect back to the doctor list



@login_required
def custom_logout(request):
    # Add any custom logic here, if needed
    logout(request)  # This will log out the user and clear the session
    return redirect('admin_login')  # Redirect to login page


















# React Fuctions Start from here....

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow access to unauthenticated users
def patient_signup(request):
    """
    API endpoint for patient signup.
    """
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Patient registered successfully."}, 
            status=status.HTTP_201_CREATED
        )
    return Response(
        {"errors": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def patient_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {"error": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=email, password=password)
    if user:

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Login successful.",
                "token": token.key,
                "user": {
                    "name": user.name,
                    "email": user.email
                }
            },
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )


# Book an appointment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_appointment(request):
    """
    Book an appointment for a patient with token authentication.
    """
    department_id = request.data.get('department_id')
    doctor_id = request.data.get('doctor_id')
    date = request.data.get('date')

    # Validate all required fields
    if not department_id or not doctor_id or not date:
        return Response(
            {"error": "Missing required fields. Ensure 'department_id', 'doctor_id', and 'date' are provided."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = request.user

        # Check if department exists
        department = Department.objects.get(id=department_id)

        # Check if doctor exists
        doctor = Doctor.objects.get(id=doctor_id)

        # Save the appointment to the database
        appointment = Appointment.objects.create(
            user=user,
            department=department,
            doctor=doctor,
            date=date
        )

        return Response(
            {
                "message": "Appointment booked successfully!",
                "appointment_id": appointment.id
            },
            status=status.HTTP_201_CREATED
        )

    except Department.DoesNotExist:
        return Response({"error": "Department not found"}, status=status.HTTP_404_NOT_FOUND)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {"error": f"Failed to book appointment: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointments(request):
    try:
        user = request.user
        appointment_type = request.query_params.get('type')

        if appointment_type not in ['upcoming', 'history']:
            return Response(
                {"error": "Invalid type. Use 'upcoming' or 'history' as query parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )

        today = date.today()

        if appointment_type == 'upcoming':
            appointments = Appointment.objects.filter(user=user, date__gte=today)
        else:
            appointments = Appointment.objects.filter(user=user, date__lt=today)

        # Prepare response data
        data = [
            {
                "id": appointment.id,
                "doctor_name": appointment.doctor.name,
                "doctor_image": appointment.doctor.image.url if appointment.doctor.image else '/media/default.jpg',
                "department": appointment.department.department_name,
                "qualification": appointment.doctor.qualification,
                "date": appointment.date
            }
            for appointment in appointments
        ]

        return Response({"appointments": data}, status=status.HTTP_200_OK)

    except Appointment.DoesNotExist:
        return Response({"error": "No appointments found."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(f"Internal Server Error: {str(e)}")
        return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    """
    API to fetch the authenticated user's profile details.
    """
    try:
        user = request.user  # Get the authenticated user
        profile_data = {
            "image": user.image,
            "name": user.name,
            "age": user.age,
            "email": user.email,
            "address": user.address,
            "contact_number": user.contact_number,
        }
        return Response({"profile": profile_data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"Failed to fetch profile: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    """
    API to edit the authenticated user's profile details.
    """
    user = request.user  # Get the authenticated user

    if request.method == 'GET':
        # Return the user's profile data
        return Response(
            {
                "profile": {
                    "name": user.name,
                    "age": user.age,
                    "email": user.email,
                    "address": user.address,
                    "contact_number": user.contact_number,
                    "image": user.image
                }
            },
            status=status.HTTP_200_OK
        )

    elif request.method == 'PUT':
        try:
            # Extract data from the request
            name = request.data.get('name', user.name)
            age = request.data.get('age', user.age)
            email = request.data.get('email', user.email)
            address = request.data.get('address', user.address)
            contact_number = request.data.get('contact_number', user.contact_number)
            image = request.data.get('image', user.image)

            # Update the user's profile fields
            user.name = name
            user.age = age
            user.email = email
            user.address = address
            user.contact_number = contact_number
            user.image = image
            user.save()

            return Response(
                {
                    "message": "Profile updated successfully.",
                    "profile": {
                        "image": user.image,
                        "name": user.name,
                        "age": user.age,
                        "email": user.email,
                        "address": user.address,
                        "contact_number": user.contact_number,
                    },
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to update profile: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(['GET'])
def doctor_profile(request, doctor_id):
    """
    API to fetch the profile of a doctor for a patient.
    """
    try:
        # Fetch the doctor record by ID
        doctor = get_object_or_404(Doctor, id=doctor_id, is_enabled=True)

        # Construct the response data
        data = {
            "id": doctor.id,
            "name": doctor.name,
            "department": doctor.department.department_name,
            "qualification": doctor.qualification,
            "experience": doctor.experience,
            "contact_number": doctor.contact_number,
            "image": doctor.image.url if doctor.image else None,
        }

        return Response(data, status=status.HTTP_200_OK)

    except Doctor.DoesNotExist:  # This won't be triggered as we use get_object_or_404
        return Response(
            {"error": "Doctor not found or is not enabled."},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        # Log the error for debugging purposes
        print(f"Unexpected error: {str(e)}")
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    

@api_view(['GET'])
def available_departments(request):
    departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def available_doctors(request):
    """
    Get a list of available doctors with their departments.
    """
    doctors = Doctor.objects.select_related('department').all()
    data = [
        {
            "id": doctor.id,
            "name": doctor.name,
            "department": {
                "id": doctor.department.id,
                "name": doctor.department.department_name
            }
        }
        for doctor in doctors
    ]
    return Response(data)

# List all doctors
@api_view(['GET'])
def doctor_list(request):
    """
    API to fetch the list of doctors.
    """
    doctors = Doctor.objects.filter(is_enabled=True)
    data = [
        {
            "id": doctor.id,
            "name": doctor.name,
            "department": doctor.department.department_name,  # Fetch department name
            "qualification": doctor.qualification,
            "experience": doctor.experience,
            "contact_number": doctor.contact_number,
            "image": doctor.image.url if doctor.image else None,
        }
        for doctor in doctors
    ]
    return Response(data, status=status.HTTP_200_OK)


# Get a single doctor by ID
@api_view(['GET'])
def doctor_detail(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DoctorSerializer(doctor)
    return Response(serializer.data)