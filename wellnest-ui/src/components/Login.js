import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/user-login/', {
                email,
                password
            });

            if (response.status === 200) {
                const { token, user } = response.data;

                // Store token and user info in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('isLoggedIn', 'true');  // Save login status in localStorage

                console.log('Auth Token:', token);
                console.log('Is Logged In: true');

                alert('Login successful!');

                navigate('/');
                
                localStorage.setItem('authToken', token);
                console.log('Token stored in localStorage:', localStorage.getItem('authToken')); // Debugging

            }
        } catch (error) {
            console.error('Login Error:', error.response?.data);
            alert('Invalid email or password');
        }
    };

    

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="cardr bg-white text-center">
                    <h4 className="heading">Welcome Back</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn w-50" id="button">
                            Login
                        </button>

                        {error && <p className="text-danger mt-2">{error}</p>}
                    </form>

                    <div className="signup-link mt-3">
                        <p>Don't have an account?
                            <Link to="/signup">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
