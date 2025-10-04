import React, { useState } from "react";
import Spline from "@splinetool/react-spline";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    country: "",
    number: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const { confirmPassword, ...signupData } = form;
      const res = await axios.post("http://localhost:5000/api/signup", signupData);
      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Left side: Animation */}
      <div className="w-1/2 h-full flex items-center justify-center bg-blue-100">
        <Spline scene="https://prod.spline.design/G7Jp13jfnptM3ysl/scene.splinecode" />
      </div>

      {/* Right side: Signup form */}
      <div className="w-1/2 h-full flex items-center justify-center bg-blue-200">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-96">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create Account
          </h1>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Country"
              name="country"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Phone Number"
              name="number"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              required
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="director">Director</option>
              <option value="employee">Employee</option>
            </select>
            <button
              type="submit"
              className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
            {message && <div className="text-red-600 text-sm">{message}</div>}
          </form>

          <p className="text-sm text-center mt-6 text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
