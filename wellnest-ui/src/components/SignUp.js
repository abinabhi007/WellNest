import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    contactNumber: '',
    address: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert gender value to Django expected format
    const genderValue = formData.gender === "Male" ? "M" :
                        formData.gender === "Female" ? "F" : "O";

    try {
      const response = await axios.post('http://localhost:8000/signup/', {
        email: formData.email,
        name: formData.name,
        age: formData.age,
        gender: genderValue,
        contact_number: formData.contactNumber,
        address: formData.address,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });

      if (response.status === 201) {
        alert('Signup successful!');
      }
    } catch (error) {
      console.error('Signup Error:', error.response?.data);
      alert('Signup failed. Please check the console for details.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg col-12 col-md-10 col-lg-8" style={{ maxWidth: '600px', padding: '20px' }}>
        <div className="text-center">
          <h4>Signup</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Age */}
            <div className="mb-3">
              <label htmlFor="age" className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                placeholder="Enter your Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact Number */}
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">Contact Number</label>
              <input
                type="text"
                className="form-control"
                id="contactNumber"
                name="contactNumber"
                placeholder="Enter your Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                placeholder="Enter your Address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary mt-3"
              style={{ width: '100%', backgroundColor: '#007bff', color: 'white' }}
            >
              Sign Up
            </button>

            {/* Link to Login Page */}
            <div className="mt-3 text-center">
              <p>Already have an Account? <Link to="/login">Login Here</Link></p>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
