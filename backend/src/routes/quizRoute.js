const express = require("express");
const router = express.Router();
const {
  getQuiz,
  submitQuiz,
  resetQuiz,
  getMySubmissions,
  getSubmissionById,
} = require("../controllers/quizController");

router.get("/get-quiz", getQuiz);
router.post("/submit-quiz", submitQuiz);
router.delete("/reset-quiz", resetQuiz);
router.get("/my-submissions", getMySubmissions);
router.get("/submission/:id", getSubmissionById);

module.exports = router;
