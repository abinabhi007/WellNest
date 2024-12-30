import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => {
        const handleStorageChange = () => {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        // Clear localStorage to remove session data
        localStorage.clear();
        setIsLoggedIn(false);

        console.log('User logged out');
        window.location.href = '/';  // Redirect to home/login page
    };

    return (
        <div style={{ position: 'sticky', top: '0', zIndex: '1020' }}>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav-div">
                <div className="container-fluid bg-white">
                    <a className="navbar-brand" href="#home-section" style={{ height: '4em' }}>
                        <img src="/images/new-logo.png" alt="logo" id="logo" />
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#about-section">About Us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#doctor-section">Our Doctors</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#service-section">Our Services</a>
                            </li>

                            {/* Conditionally render links if the user is logged in */}
                            {isLoggedIn && (
                                <>
                                    <li className="nav-item">
                                        <Link to="/bookappointment" className="nav-link">Book Appointment</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/myappointment" className="nav-link">My Appointment</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/my-profile" className="nav-link">My Profile</Link>
                                    </li>
                                </>
                            )}
                        </ul>

                        <div className="d-flex justify-content-center justify-content-lg-end">
                            {isLoggedIn ? (
                                <button className="btn btn-danger text-white" onClick={handleLogout}>
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login">
                                    <button className="btn" id='login-btn'>Book Appointment</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
