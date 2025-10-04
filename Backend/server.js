import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";         // <-- Add this line
import jwt from "jsonwebtoken";        // <-- Add this line
import managerRoutes from "./managerRoutes.js"; // Import the manager routes

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect (manual connection string)
mongoose.connect("mongodb://localhost:27017/hackathon/users", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Use manager routes
app.use("/manager", managerRoutes);

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['admin', 'manager', 'director', 'employee'] // updated roles
    },
});

const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { name, country, number, email, username, password, role } = req.body;
    if (!name || !country || !number || !email || !username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    // If role is manager, always fail registration
    if (role === 'manager') {
        return res.status(400).json({ message: 'Registration failed for manager.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, country, number, email, username, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(400).json({ message: 'User registration failed.', error: err.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        // Generate JWT token with role
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );
        res.json({ token, role: user.role, username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Login failed.', error: err.message });
    }
});

// Example protected route (role-based)
app.get('/api/admin', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }
        res.json({ message: 'Welcome, admin!' });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));