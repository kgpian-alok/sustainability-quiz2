const User = require("../models/User");
const QuizSession = require("../models/QuizSession");
const Question = require("../models/Question");
const Submission = require("../models/Submission");

const addQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswers } = req.body;

    if (!question || !options || !correctAnswers) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 options required",
      });
    }

    const invalid = correctAnswers.some((ans) => !options.includes(ans));

    if (invalid) {
      return res.status(400).json({
        success: false,
        message: "Correct answers must be from options",
      });
    }

    const newQuestion = await Question.create({
      question,
      options,
      correctAnswers,
    });

    return res.status(201).json({ success: true, question: newQuestion, message: "Question added successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswers } = req.body;

    if (!question || !options || !correctAnswers) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const invalid = correctAnswers.some((ans) => !options.includes(ans));

    if (invalid) {
      return res.status(400).json({
        success: false,
        message: "Correct answers must be from options",
      });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, correctAnswers },
      { new: true },
    );

    if (!updatedQuestion) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const submissions = await Submission.find({
      "questions.questionId": updatedQuestion._id,
    });

    for (const sub of submissions) {
      let score = 0;

      for (const q of sub.questions) {
        const latestQ = await Question.findById(q.questionId);

        if (!latestQ) continue;

        const isCorrect =
          q.selectedAnswers.length === latestQ.correctAnswers.length &&
          q.selectedAnswers.every((a) => latestQ.correctAnswers.includes(a));

        if (isCorrect) score++;
      }

      sub.score = score;
      await sub.save();
    }

    return res
      .status(200)
      .json({
        success: true,
        question: updatedQuestion,
        message: "Question updated & scores recalculated successfully",
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });

    return res.status(200).json({ success: true, questions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "_id fullName username email role attemptCount",
    );
    return res.status(200).json({ success: true, users, message: "Users fetched successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    await User.findByIdAndUpdate(userId, { role });

    return res.status(200).json({ success: true, message: "Role updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateAttemptCount = async (req, res) => {
  try {
    const { userId, attemptCount } = req.body;

    await User.findByIdAndUpdate(userId, { attemptCount });

    return res.status(200).json({ success: true, message: "Attempt count updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const resetUserQuiz = async (req, res) => {
  try {
    const { userId } = req.body;

    await QuizSession.findOneAndDelete({ userId });

    return res.status(200).json({ success: true, message: "User quiz reset" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getAllUsers,
  updateUserRole,
  updateAttemptCount,
  resetUserQuiz,
};
