const express = require("express");
const router = express.Router();

const { getLeaderboard } = require("../controllers/leaderboardController");

// 🔐 Protected (or make public if you want)
router.get("/leaderboard", getLeaderboard);

module.exports = router;
