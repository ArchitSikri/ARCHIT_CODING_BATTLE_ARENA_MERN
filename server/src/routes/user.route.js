const express = require("express");
const { registerUser, loginUser, logout , getUserProfile , getopponent} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/user.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", authMiddleware.authuser, logout);
router.get("/profile", authMiddleware.authuser, getUserProfile);
router.get("/opponent/:socketId", getopponent);




module.exports = router;