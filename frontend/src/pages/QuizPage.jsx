import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import QuestionCard from "../components/quiz/QuestionCard";
import ScreenLoader from "../components/common/ScreenLoader";
import toast from "react-hot-toast";

const QuizPage = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/quiz/get-quiz`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to load quiz");
          navigate("/dashboard");
          return;
        }
        setQuestions(data?.questions || []);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "An error occurred");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

  const handleOptionChange = (qIndex, optionIndex) => {
    setAnswers((prev) => {
      const prevSelected = prev[qIndex] || [];

      if (prevSelected.includes(optionIndex)) {
        return {
          ...prev,
          [qIndex]: prevSelected.filter((i) => i !== optionIndex),
        };
      } else {
        return {
          ...prev,
          [qIndex]: [...prevSelected, optionIndex],
        };
      }
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }
    try {
      // 🔥 Convert your answers format → backend format
      const formattedAnswers = Object.keys(answers).map((qIndex) => {
        const q = questions[qIndex];

        return {
          questionId: q._id,
          selectedAnswers: answers[qIndex].map(
            (i) => q.options[i], // convert index → actual value
          ),
        };
      });

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/quiz/submit-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Submission failed");
        return;
      }

      setScore(data.score);
      toast.success("Quiz submitted successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "An error occurred");
      console.error("Submit error:", err);
    }
  };

  if (loading) {
    return <ScreenLoader loaderFor="Quiz" />;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-10 z-100">{error}</div>;
  }

  if (score !== null) {
    return (
      <div className="bg-slate-900 text-white min-h-screen">
        <Header title="Dashboard" />

        <main className="container mx-auto p-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">Quiz Completed 🎉</h2>

          <p className="text-xl text-emerald-400">
            Score: {score} / {questions.length}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-emerald-500 px-6 py-2 rounded-lg hover:bg-emerald-600"
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Header title="Dashboard" />
      <main className="container mx-auto p-6 mt-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Sustainability Quiz
        </h1>

        {questions.length === 0 ? (
          <>
            <div className="text-center text-slate-400 text-lg mt-10">
              <p>No questions available. Please try again later.</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-lg transition"
              >
                Retry
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-6">
              {questions.map((q, index) => (
                <QuestionCard
                  key={q._id}
                  question={q}
                  qIndex={index}
                  selectedAnswers={answers[index] || []}
                  onOptionChange={handleOptionChange}
                />
              ))}
            </div>

            {/* ===== SUBMIT BUTTON ===== */}
            <div className="text-center mt-10">
              <button
                onClick={handleSubmit}
                className="bg-emerald-500 hover:bg-emerald-600 px-10 py-3 rounded-lg font-semibold transition"
              >
                Submit Quiz
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
