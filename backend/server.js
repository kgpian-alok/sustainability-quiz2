require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
connectDB();

const authRoutes = require("./src/routes/authRoutes");
const quizRoutes = require("./src/routes/quizRoute.js");
const leaderboardRoutes = require("./src/routes/leaderboardRoute.js");
const adminRoutes = require("./src/routes/adminRoute.js");

const { protect, isAdmin } = require("./src/middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "https://sustainability-quiz2.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
/*
  /register
  /login
  /logout
  /me
*/
app.use("/api/quiz", protect, quizRoutes);
/*
  /get-quiz
  /submit-quiz
  /reset-quiz
  /my-submissions
  /submission/:id
*/
app.use("/api", protect, leaderboardRoutes);
/*
  /leaderboard
*/
app.use("/api/admin", protect, isAdmin, adminRoutes);
/*
  /question
  /question/:id
  /question/:id
  /questions
  /role
  /attempt
  /reset-quiz
  /users
*/

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is up and running." });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
