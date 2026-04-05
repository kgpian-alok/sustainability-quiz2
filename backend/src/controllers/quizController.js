const Question = require("../models/Question");
const QuizSession = require("../models/QuizSession");
const Submission = require("../models/Submission");
const User = require("../models/User");

const getQuiz = async (req, res) => {
  try {
    const userId = req.user._id;

    let session = await QuizSession.findOne({ userId });

    // ✅ CASE 1: Existing session
    if (session) {
      const questions = await Question.find({
        _id: { $in: session.questionIds },
      }).select("question options"); // 🔥 IMPORTANT

      return res.status(200).json({
        success: true,
        questions,
        message: "Existing quiz session found. Resuming...",
      });
    }

    // ✅ CASE 2: New session
    const randomQuestions = await Question.aggregate([
      { $sample: { size: 10 } },
      {
        $project: {
          question: 1,
          options: 1, // 🔥 IMPORTANT
        },
      },
    ]);

    const ids = randomQuestions.map((q) => q._id);

    await QuizSession.create({
      userId,
      questionIds: ids,
    });

    return res.status(200).json({
      success: true,
      questions: randomQuestions, // 🔥 FIXED KEY
      message: "New quiz session created.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    const { answers } = req.body;

    let score = 0;

    // 🔥 Fetch all questions at once
    const questions = await Question.find({
      _id: { $in: answers.map((a) => a.questionId) },
    });

    // 🔥 Create map for fast lookup
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    const formatted = answers
      .map((ans) => {
        const q = questionMap[ans.questionId];

        if (!q) return null;

        const isCorrect =
          ans.selectedAnswers.length === q.correctAnswers.length &&
          ans.selectedAnswers.every((a) => q.correctAnswers.includes(a));

        if (isCorrect) score++;

        return {
          questionId: q._id,
          selectedAnswers: ans.selectedAnswers,
        };
      })
      .filter(Boolean);

    await Submission.create({
      userId,
      questions: formatted,
      score, // snapshot (will be updated later if needed)
      total: questions.length,
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { attemptCount: 1 },
    });

    return res.json({
      success: true,
      score,
      total: questions.length,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const resetQuiz = async (req, res) => {
  try {
    const userId = req.user._id;

    await QuizSession.findOneAndDelete({ userId });

    return res.json({ success: true, message: "Quiz session reset. New questions next time." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const userId = req.user._id;

    const submissions = await Submission.find({ userId }).sort({
      createdAt: -1,
    });

    return res.json({ success: true, submissions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    const user = await User.findById(req.user._id);

    const MAX_ATTEMPTS = 3; // or from env

    // 🔐 Hide correct answers if attempts not finished
    const isUnlocked = user.attemptCount >= MAX_ATTEMPTS;

    const questions = submission.questions.map((q) => ({
      questionId: q.questionId,
      selectedAnswers: q.selectedAnswers,
      ...(isUnlocked && { correctAnswers: q.correctAnswers }),
      isCorrect: q.isCorrect,
    }));

    return res
      .status(200)
      .json({
        success: true,
        message: "Submission details",
        score: submission.score,
        total: submission.total,
        questions,
        isUnlocked,
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getQuiz, submitQuiz, resetQuiz, getMySubmissions, getSubmissionById };