import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Pagination } from 'react-bootstrap';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

function MyAppointment() {
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [historyAppointments, setHistoryAppointments] = useState([]);
    const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
    const [currentPageHistory, setCurrentPageHistory] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        fetchAppointments('upcoming');
        fetchAppointments('history');
    }, []);

    const fetchAppointments = async (type) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/get-appointments/?type=${type}`, {
                headers: { Authorization: `Token ${token}` }
            });

            if (type === 'upcoming') setUpcomingAppointments(response.data.appointments);
            else setHistoryAppointments(response.data.appointments);

        } catch (error) {
            console.error("Failed to fetch appointments:", error.response?.status, error.message);
        }
    };

    const renderAppointments = (appointments, currentPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = appointments.slice(startIndex, endIndex);

        return (
            <Row>
                {currentItems.map((appointment) => (
                    <Col key={appointment.id} md={6} lg={4} className="mb-4">
                        <Card className="h-100 shadow">
                            {/* Fetching the doctor image from the backend */}
                            <Card.Img
                                variant="top"
                                src={`http://127.0.0.1:8000${appointment.doctor_image}`} // Fetch image URL from database
                                alt={appointment.doctor_name}
                                className="card-img-top"
                            />
                            <Card.Body>
                                <Card.Title>{appointment.doctor_name}</Card.Title>
                                <Card.Text>
                                    <strong>Department:</strong> {appointment.department} <br />
                                    <strong>Qualification:</strong> {appointment.qualification} <br />
                                    <strong>Date:</strong> {appointment.date}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    const handlePageChange = (page, type) => {
        if (type === 'upcoming') setCurrentPageUpcoming(page);
        if (type === 'history') setCurrentPageHistory(page);
    };

    const renderPagination = (appointments, currentPage, type) => {
        const totalPages = Math.ceil(appointments.length / itemsPerPage);

        return (
            <Pagination className="justify-content-center mt-4 custom-pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1, type)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        );
    };

    return (
        <div>
            <Navbar />
            <Container className="my-5">
                <h2 className="text-center mb-4">Your Upcoming Appointments</h2>
                {renderAppointments(upcomingAppointments, currentPageUpcoming)}
                {renderPagination(upcomingAppointments, currentPageUpcoming, 'upcoming')}

                <h2 className="text-center mt-5 mb-4">Appointment History</h2>
                {renderAppointments(historyAppointments, currentPageHistory)}
                {renderPagination(historyAppointments, currentPageHistory, 'history')}
            </Container>
            <Footer />
        </div>
    );
}

export default MyAppointment;
