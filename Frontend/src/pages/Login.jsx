import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Admin shortcut
    if (form.username === 'Admin' && form.password === 'admin@123') {
      setMessage('Admin login successfully');
      setTimeout(() => {
        navigate('/adminview', { state: { adminMsg: 'Admin login successfully' } });
      }, 1000);
      return;
    }

    // Manager shortcut
    if (form.username === 'manager' && form.password === 'manager@123') {
      setMessage('Manager login successfully');
      setTimeout(() => {
        navigate('/manager');
      }, 1000);
      return;
    }

    // Employee shortcut (Ramesh)
    if (form.username === 'ramesh' && form.password === 'ramesh@123') {
      setMessage('Employee login successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      return;
    }

    // Backend login API
    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      setMessage('Login successful');
      if (res.data.role === 'employee') {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else if (res.data.role === 'manager') {
        setTimeout(() => {
          navigate('/manager');
        }, 1000);
      } else if (res.data.role === 'admin') {
        setTimeout(() => {
          navigate('/adminview');
        }, 1000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Left side Spline */}
      <div className="w-1/2 h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <Spline scene="https://prod.spline.design/G7Jp13jfnptM3ysl/scene.splinecode" />
      </div>

      {/* Right side login form */}
      <div className="w-1/2 h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
          <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
            Welcome Back 👋
          </h1>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
            {message && <div className="text-red-600 text-sm">{message}</div>}
          </form>

          <p className="text-sm text-center mt-6 text-gray-700">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-500 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
