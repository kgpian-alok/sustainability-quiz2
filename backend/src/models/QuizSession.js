const mongoose = require("mongoose");

const quizSessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  questionIds: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model("QuizSession", quizSessionSchema);