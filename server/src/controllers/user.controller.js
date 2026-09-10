const user = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const { name, email, password, preferredLanguage } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ name, email, password: hashedPassword, preferredLanguage });
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ _id: existingUser._id , name: existingUser.name , email: existingUser.email }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1 day" });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful" });
        res.json({
            token : token,
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
        })
    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
};

const logout = (req, res) => {
  try {
    return res.status(200)
      .cookie("token", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      })
      .json({ message: "Buyer logged out successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { registerUser, loginUser, logout };