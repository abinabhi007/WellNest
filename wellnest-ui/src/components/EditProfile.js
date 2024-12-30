import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

function EditProfile() {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: "",
        address: "",
        contact_number: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setError("No authentication token found.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/edit-profile/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });

                setFormData({
                    name: response.data.profile.name,
                    age: response.data.profile.age,
                    email: response.data.profile.email,
                    address: response.data.profile.address,
                    contact_number: response.data.profile.contact_number
                });
                setLoading(false);
            } catch (err) {
                console.error("Profile Fetch Error:", err.message);
                setError("Failed to fetch profile data.");
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("No authentication token found.");
                return;
            }

            const response = await axios.put(
                "http://127.0.0.1:8000/edit-profile/",
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            alert(response.data.message || "Profile updated successfully.");
        } catch (err) {
            console.error("Profile Update Error:", err.message);
            setError("Failed to update profile.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Navbar />
            <div className="container my-5 w-50">
                <div className="mx-auto" style={{ maxWidth: "700px" }}>
                    <h3 className="text-center mb-4">Edit Profile</h3>

                   

                    {/* Form to Edit Profile */}
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Age */}
                        <div className="mb-3">
                            <label className="form-label">Age</label>
                            <input
                                type="number"
                                name="age"
                                className="form-control"
                                placeholder="Enter your age"
                                value={formData.age}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                name="address"
                                className="form-control"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="mb-3">
                            <label className="form-label">Contact Number</label>
                            <input
                                type="text"
                                name="contact_number"
                                className="form-control"
                                placeholder="Enter your contact number"
                                value={formData.contact_number}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="d-flex justify-content-center">
                            <Link to="/my-profile">
                                <button type="button" className="btn btn-outline-secondary me-3">
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-warning"
                                style={{
                                    background: "#a5c422",
                                    color: "white",
                                    border: "none",
                                    height: "40px",
                                    marginTop: "8px"
                                }}
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditProfile;
