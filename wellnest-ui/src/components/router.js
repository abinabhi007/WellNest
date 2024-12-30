import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from './Login';
import Signup from './SignUp';
import BookAppointment from './BookAppointment';
import MyAppointment from './MyAppointment';
import MyProfile from './MyProfile';
import EditProfile from './EditProfile';

const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path: 'login/', element:<Login/>},
    { path: 'signup/', element:<Signup/>},
    {path: 'bookappointment/', element:<BookAppointment/>},
    {path: 'myappointment/', element:<MyAppointment/>},
    {path: 'my-profile/', element:<MyProfile/>},
    {path: 'edit-profile/', element:<EditProfile/>},
]);

export default router;
