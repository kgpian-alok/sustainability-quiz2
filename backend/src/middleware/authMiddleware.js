const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const User = require("../models/User");

const protect = async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select(
        "_id fullName email role",
      );

      if (!user) {
        return res.status(401).json({
          message: "Not authorized, user for this token no longer exists",
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. You must be an admin." });
  }
};

module.exports = { protect, isAdmin };