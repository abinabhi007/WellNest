from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_login, name='admin_login'),
    path('login/', views.admin_login,name='admin_login'),
    path('appointments/', views.appointments,name='appointments'),
    path('users/', views.user_list,name='userlist'),
    path('doctors/', views.doctors_list,name='doctorlist'),
    path('reports/', views.doctor_report,name='reports'),
    path('add-doctor/', views.create_doctor,name='create-doctor'),
    path('user-view/<int:id>/', views.user_view,name='user-view'),
    path('doctor/edit/<int:id>/', views.doctor_edit,name='doctor-edit'),
    path('doctor/view/<int:id>/', views.doctor_view,name='doctor-view'),
    path('user-history/<int:id>/', views.user_history,name='user-history'),
    path('doctor/toggle/<int:id>/', views.toggle_doctor_status, name='toggle_doctor_status'),
    path('logout/', views.custom_logout, name='logout'),
    
    path('signup/', views.patient_signup, name='signup'),
    path('user-login/', views.patient_login, name='patient-login'),
    path('book-appointment/', views.book_appointment, name='book-appointment'),
    path('get-appointments/', views.get_appointments, name='get_appointments'),
    path('my-profile/', views.my_profile, name='my-profile'),
    path('edit-profile/', views.edit_profile, name='edit-profile'),
    path('doctor-profile/<int:doctor_id>/', views.doctor_profile, name='doctor-profile'),
    path('available-departments/', views.available_departments, name='get_departments'),
    path('available-doctors/', views.available_doctors, name='get_doctors'),
    path('doctor-profile/', views.doctor_list, name='doctor-list'),
    path('doctor-profile/<int:pk>/', views.doctor_detail, name='doctor-detail'),
]
