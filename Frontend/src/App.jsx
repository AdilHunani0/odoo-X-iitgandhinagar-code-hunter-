import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExpenseFlowLanding from "./pages/Home";   // Landing page
import Login from "./pages/Login";               // Login page
import Signup from "./pages/Signup";             // Signup page
import Usertable from "./pages/Usertable";       // Table page
import AdminView from "./pages/AdminView";       // Admin View
import Dashboard from "./pages/dashboard";       // Employee Dashboard
import Manager from "./pages/Manager";           // Manager Dashboard

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExpenseFlowLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users" element={<Usertable />} />
        <Route path="/adminview" element={<AdminView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manager" element={<Manager />} />
      </Routes>
    </Router>
  );
}
