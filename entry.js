const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/SignupSchema'); 
const dotenv= require('dotenv');
const app = express();
const PORT = 8001;
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());


// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } )
  .then(() => console.log("MongoDB connection successful"))
  .catch(err => console.log("MongoDB connection unsuccessful:", err));

// Test route
app.get('/', (req, res) => {
  res.send("Welcome to backend server");
});

// JSON test route
app.get('/json', (req, res) => {
  res.json({
    college: "SECE",
    dept: "CYS",
    StuCount: 64
  });
});


// Get all users
app.get('/getallsignup', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required", isSignup: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered", isSignup: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup Successful", isSignup: true });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Signup failed", isSignup: false });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", isLoggedIn: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password", isLoggedIn: false });
    }

    res.status(200).json({ message: "Login successful", isLoggedIn: true });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed", isLoggedIn: false });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});

