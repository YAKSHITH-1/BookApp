import express from "express";
import User from "../models/User.js";

import jwt from "jsonwebtoken";
import protectRoute from "../src/middleware/auth.middleware.js";





const generateToken = (userId) => {

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

}
const router = express.Router();

router.post("/register", async (req, res) => {

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const emailNorm = email.toLowerCase().trim();


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNorm)) {
      return res.status(400).json({ message: "Email can only contain letters, numbers, @ and ." });
    }


    const existingUser = await User.findOne({ $or: [{ email: emailNorm }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }




    const profileimage = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${encodeURIComponent(
      username
    )}`;


    const newUser = new User({ username, email: emailNorm, password, profileimage });

    await newUser.save();

    console.log("User saved to DB:", { id: newUser._id, email: newUser.email, username: newUser.username });

    const token = generateToken(newUser._id);
 

    return res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileimage: newUser.profileimage,
        cratedAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    res.status(500).json({ message: error.message || "Internal server error" });

  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const emailNorm = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailNorm });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) return res.status(400).json({ message: "Invalid credentials" });



    const token = generateToken(user._id);
    console.log('Login - issued token (truncated):', token?.slice(0, 80));

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileimage: user.profileimage,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {


    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }


});





router.get('/me', protectRoute, (req, res) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    console.error('GET /me error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;