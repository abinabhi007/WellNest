import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./css/BookAppointment.css";

const SERVER_URL = "http://127.0.0.1:8000"; 

function BookAppointment() {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [appointmentData, setAppointmentData] = useState({
        department_id: "",
        doctor_id: "",
        date: ""
    });
    const [error, setError] = useState("");

    // Fetch departments and doctors
    useEffect(() => {
        axios
            .get(`${SERVER_URL}/available-departments/`)
            .then((response) => setDepartments(response.data))
            .catch((error) => console.error("Failed to fetch departments", error));

        axios
            .get(`${SERVER_URL}/available-doctors/`)
            .then((response) => {
                setDoctors(response.data);
                setFilteredDoctors(response.data);
            })
            .catch((error) => console.error("Failed to fetch doctors", error));
    }, []);

    // Handle department selection
    const handleDepartmentChange = (event) => {
        const departmentId = event.target.value;
        setSelectedDepartment(departmentId);

        if (departmentId) {
            const filtered = doctors.filter(
                (doctor) => doctor.department.id === parseInt(departmentId)
            );
            setFilteredDoctors(filtered);
            setAppointmentData({
                ...appointmentData,
                department_id: departmentId,
                doctor_id: "", // Reset doctor selection
            });
        } else {
            setFilteredDoctors(doctors);
            setAppointmentData({
                ...appointmentData,
                department_id: "",
                doctor_id: "",
            });
        }
    };

    const handleDoctorChange = (event) => {
        const doctorId = event.target.value;
        setAppointmentData({
            ...appointmentData,
            doctor_id: doctorId,
        });
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        setAppointmentData({
            ...appointmentData,
            date,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!appointmentData.department_id || !appointmentData.doctor_id || !appointmentData.date) {
            setError("All fields are required.");
            return;
        }

        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
            setError("No authentication token found. Please log in.");
            return;
        }

        try {
            const response = await axios.post(
                `${SERVER_URL}/book-appointment/`,
                appointmentData,
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                }
            );

            alert(response.data.message);
        } catch (error) {
            setError(
                error.response?.data?.error || "Failed to book appointment. Please try again."
            );
            console.error("Failed to book appointment", error);
        }
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        console.log('Auth Token Found:', authToken); // Debugging log
    
        if (!authToken) {
            console.log('User is not logged in. Redirect to login page.');
            setError("No authentication token found. Please log in.");
        }
    }, []);
    
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        console.log('Auth Token Found:', authToken); // Debugging
        if (!authToken) {
            console.log('User is not logged in. Redirect to login page.');
            setError('No authentication token found. Please log in.');
        }
    }, []);
    

    return (
        <div>
            <Navbar />
            <div className="book-appointment">
                <div className="appointment-header">
                    <h2>
                        We Are
                        <span style={{ color: "#a5c422" }}>Always</span>
                        Ready To Help You.
                        <br />
                        Book An
                        <span style={{ color: "#a5c422" }}>Appointment</span>
                    </h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipiscing elit praesent aliquet,
                        pretium.
                    </p>
                    <hr className="divider" />
                </div>

                <div className="appointment-content">
                    <div className="appointment-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <div className="form-control">
                                    <select
                                        value={selectedDepartment}
                                        onChange={handleDepartmentChange}
                                    >
                                        <option value="">Choose Department</option>
                                        {departments.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.department_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-control">
                                    <select
                                        value={appointmentData.doctor_id}
                                        onChange={handleDoctorChange}
                                    >
                                        <option value="">Select Doctor</option>
                                        {filteredDoctors.map((doctor) => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-control">
                                    <input
                                        type="date"
                                        value={appointmentData.date}
                                        onChange={handleDateChange}
                                    />
                                </div>
                            </div>

                            {error && <p className="text-danger">{error}</p>}

                            <button type="submit" className="appointment-button">
                                Make Appointment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default BookAppointment;
