import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MyProfile() {
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    email: "",
    address: "",
    contact_number: "",
    image: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
  
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }
    
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/my-profile/', {
          headers: { Authorization: `Token ${token}` }
        });
        setProfileData(response.data.profile);
        setLoading(false);
      } catch (err) {
        console.error('Profile Error:', err.response?.data);
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };
  
    fetchProfileData();
  }, []);
  

 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="container my-5 w-50">
        <div className="mx-auto" style={{ maxWidth: "700px" }}>
          <h3 className="text-center mb-4">My Profile</h3>

         
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={profileData.name} readOnly />
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input type="number" className="form-control" value={profileData.age} readOnly />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={profileData.email} readOnly />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input type="text" className="form-control" value={profileData.address} readOnly />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Number</label>
            <input type="text" className="form-control" value={profileData.contact_number} readOnly />
          </div>

          <div className="d-flex justify-content-center">
            <Link to="/edit-profile/">
              <button type="button" className="btn" style={{ background: "#a5c422", color: "white" }}>
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyProfile;
