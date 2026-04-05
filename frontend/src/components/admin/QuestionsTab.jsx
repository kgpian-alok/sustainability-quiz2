import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../common/ConfirmationModal";

const QuestionsTab = () => {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswers: [],
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswers: [],
  });

  // 🔄 Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/questions`,
        {
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to fetch questions");

      const data = await res.json();
      // alert(JSON.stringify(data, null, 2)); // Optional: keep for debugging
      setQuestions(data?.questions || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Could not load questions. Please refresh.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ➕ Add Question
  const handleAdd = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        },
      );

      // Extract data even if response is not OK to see if server sent an error message
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add question.");
      }

      toast.success(data?.message || "Question added successfully!");

      // Reset form
      setForm({
        question: "",
        options: ["", "", "", ""],
        correctAnswers: [],
      });

      fetchQuestions();
    } catch (error) {
      console.error("Add Error:", error);
      toast.error(error.message);
    }
  };

  // ❌ Delete Question
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/question/${selectedQuestionId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete the question.");
      }

      toast.success("Question deleted successfully");
      fetchQuestions();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error.message);
    } finally {
      // Ensure modal closes regardless of success or failure
      setIsDeleteModalOpen(false);
      setSelectedQuestionId(null);
    }
  };

  const handleEditClick = (q) => {
    setEditForm({
      _id: q._id,
      question: q.question,
      options: q.options,
      correctAnswers: q.correctAnswers,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/question/${editForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: editForm.question,
          options: editForm.options,
          correctAnswers: editForm.correctAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to update question.");
        throw new Error(data?.message || "Failed to update question.");
      }

      setIsEditModalOpen(false);
      toast.success("Question updated");
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred while updating the question.");
    }
  };

  return (
    <div className="space-y-8">
      {/* ➕ Add Question Form */}
      <div className="bg-slate-800 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-bold">Add Question</h2>

        <input
          type="text"
          placeholder="Enter question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          className="w-full p-2 rounded bg-slate-700"
        />

        {form.options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => {
              const newOptions = [...form.options];
              newOptions[i] = e.target.value;
              setForm({ ...form, options: newOptions });
            }}
            className="w-full p-2 rounded bg-slate-700"
          />
        ))}

        {/* Correct Answers */}
        <div className="flex flex-wrap gap-2">
          {form.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                const exists = form.correctAnswers.includes(opt);
                setForm({
                  ...form,
                  correctAnswers: exists
                    ? form.correctAnswers.filter((a) => a !== opt)
                    : [...form.correctAnswers, opt],
                });
              }}
              className={`px-3 py-1 rounded ${
                form.correctAnswers.includes(opt)
                  ? "bg-emerald-500"
                  : "bg-slate-600"
              }`}
            >
              {opt || `Option ${i + 1}`}
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="bg-emerald-500 px-4 py-2 rounded"
        >
          Add Question
        </button>
      </div>

      {/* 📋 Question List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q._id}
            className="bg-slate-800 p-4 rounded-lg flex justify-between"
          >
            <div>
              <p className="font-semibold">{q.question}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {q.options.map((opt, i) => {
                  const isCorrect = q.correctAnswers.includes(opt);

                  return (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-sm ${
                        isCorrect
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {opt}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => handleEditClick(q)}
              className="text-blue-400 hover:text-blue-300 mr-3"
            >
              Edit
            </button>

            <button
              onClick={() => {
                setSelectedQuestionId(q._id);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold">Edit Question</h2>

            {/* Question */}
            <input
              type="text"
              value={editForm.question}
              onChange={(e) =>
                setEditForm({ ...editForm, question: e.target.value })
              }
              className="w-full p-2 rounded bg-slate-700"
            />

            {/* Options */}
            {editForm.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const oldValue = editForm.options[i];

                  const newOptions = [...editForm.options];
                  newOptions[i] = newValue;

                  // 🔥 Update correctAnswers accordingly
                  let newCorrectAnswers = editForm.correctAnswers;

                  if (editForm.correctAnswers.includes(oldValue)) {
                    newCorrectAnswers = editForm.correctAnswers.map((ans) =>
                      ans === oldValue ? newValue : ans,
                    );
                  }

                  setEditForm({
                    ...editForm,
                    options: newOptions,
                    correctAnswers: newCorrectAnswers,
                  });
                }}
                className="w-full p-2 rounded bg-slate-700"
              />
            ))}

            {/* Correct Answers */}
            <div className="flex flex-wrap gap-2">
              {editForm.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const exists = editForm.correctAnswers.includes(opt);
                    setEditForm({
                      ...editForm,
                      correctAnswers: exists
                        ? editForm.correctAnswers.filter((a) => a !== opt)
                        : [...editForm.correctAnswers, opt],
                    });
                  }}
                  className={`px-3 py-1 rounded ${
                    editForm.correctAnswers.includes(opt)
                      ? "bg-emerald-500"
                      : "bg-slate-600"
                  }`}
                >
                  {opt || `Option ${i + 1}`}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-slate-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-emerald-500 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;

export default QuestionsTab;
