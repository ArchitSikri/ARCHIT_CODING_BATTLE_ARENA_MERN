const user = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authuser = async (req, res, next) => {

     const authHeader = req.headers.authorization || "";
     const token = req.cookies?.token || (authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
     if (!token) {
       return res.status(401).json({ message: "Unauthorized" });
    }
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    const authenticatedUser = await user.findById(decoded._id);
    if (!authenticatedUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = authenticatedUser;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

}