const express = require("express");
const router = express.Router();

const {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getAllUsers,
  updateUserRole,
  updateAttemptCount,
  resetUserQuiz,
} = require("../controllers/adminController");

// Admin only routes
// User management
router.put("/role", updateUserRole);
router.put("/attempt", updateAttemptCount);
router.delete("/reset-quiz", resetUserQuiz);
router.get("/users", getAllUsers);

// Question management
router.post("/question", addQuestion);
router.put("/question/:id", updateQuestion);
router.delete("/question/:id", deleteQuestion);
router.get("/questions", getAllQuestions);

module.exports = router;
/****
 * POST   /api/admin/question        → Add question
 * PUT    /api/admin/question/:id    → Update question
 * DELETE /api/admin/question/:id    → Delete question
 * GET    /api/admin/questions       → Get all questions
 * PUT    /api/admin/role            → Update user role
 * PUT    /api/admin/attempt         → Update attempts
 * DELETE /api/admin/reset-quiz      → Reset quiz session
 */