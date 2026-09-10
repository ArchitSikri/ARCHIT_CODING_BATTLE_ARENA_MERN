const express = require("express");
const { registerUser,
        loginUser, 
        logout,
        getUserPreferredLanguage,
        getMe,
        getUserById,
        updateMe,
        getMyRecords,
     } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/user.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", authMiddleware.authuser, logout);
router.get("/me", protect, getMe);
router.patch("/updateme", protect, updateMe);
router.get("/me/records", protect, getMyRecords);
router.get("/:id", protect, getUserById);
router.get("/me/preferred-language", protect, getUserPreferredLanguage);



module.exports = router;