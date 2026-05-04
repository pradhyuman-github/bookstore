import express from "express";
import { User } from "../models/registerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js"


export const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts"
});

// POST api to add user from register page
router.post("/register", async (req, res) => {
  try {
    const {username, contact, email, createPassword} = req.body;
    console.log(req.body);
    console.log("Incoming data:", username, contact, email, createPassword);

    if(!username || !contact || !email || !createPassword ) {
        return res.status(400).json({message: "All fields are required"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).json({message: "Email already exists"});
    }

    const hashedPassword = await bcrypt.hash(createPassword, 10);

    const newUser = new User({
        username,
        contact,
        email,
        createPassword: hashedPassword,
    });
    await newUser.save();
    console.log("Saved to database");

    res.status(201).json({ 
      message: "User registered successfully",
      data: newUser,
    });
  } 

  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// post - admin login
router.post("/admin-login", loginLimiter, async(req, res) => {
  const {email , createPassword} = req.body;

  try{
    const user = await User.findOne({email});

    if(!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    if(user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access denied"
      });
    }

    const isMatch = await bcrypt.compare(createPassword, user.createPassword);

    if(!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }
    
    const {createPassword: _, ...safeUser} = user.toObject();

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Admin login successful",
      user: safeUser
    });
  }
  catch(err) {
    console.log(err);

    res.status(500).json({
      message: "Server error"
    });
  }

});

// post - user login 
router.post("/login", loginLimiter, async(req, res) => {
  const {email, createPassword} = req.body;
  try {
    const user = await User.findOne({ email });

    if(!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(createPassword, user.createPassword);

    if(!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // remove password
    const { createPassword: _, ...safeUser } = user.toObject();

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1d"
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      user: safeUser,
    });
  }
  catch(err) {
    res.status(500).json({
      message: "Sever error"
    });
  }

});

// post - logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });

  res.json({
    message: "Logged out"
  });
});

// get - check auth admin
router.get("/admin-check", auth, admin, (req, res) => {
  res.json({
    message: "Admin verified"
  });
});

// get - user profile
router.get("/user-profile", auth, async(req, res) => {

  try {

    const user = await User.findById(req.user.userId).select("-createPassword");

    res.json({
      success: true,
      user
    });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
