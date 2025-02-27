const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json()); 
const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};
app.use(cors(corsOptions));


app.use(session({
    secret: "your_secret_key",  // Ensure this is securely generated
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true } // Don't use 'secure: true' unless HTTPS is enabled
}));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// User Schema and Model
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);
// Sign-Up Route
app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "Sign-up successful, you can now log in" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Route (with session)
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email not found" });

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid email or password" });

        // Store user session
        req.session.user = { id: user._id, email: user.email };

        res.json({ message: "Login successful", user: req.session.user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Check if user is logged in
app.get("/api/auth/check", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout Route
app.post("/api/auth/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out successfully" });
})// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));