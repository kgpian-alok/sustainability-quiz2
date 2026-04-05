const Submission = require("../models/Submission");

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          bestScore: { $max: "$score" },
        },
      },
      { $sort: { bestScore: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          fullName: "$user.fullName",
          email: "$user.email",
          score: "$bestScore",
        },
      },
    ]);

    return res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getLeaderboard };
