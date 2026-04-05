import React, { useState } from "react";
import { Trophy, Brain, ShieldCheck } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/auth/AuthModal";

function HomePage() {
  const { user, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("login");

  if (isLoading) {
    return <div className="bg-slate-900 min-h-screen"></div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const openModal = (view) => {
    setModalView(view);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* ===== HEADER ===== */}
      <header className="p-4 border-b border-slate-700 fixed w-full bg-slate-900/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            🌿 Sustainability Quiz
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => openModal("login")}
              className="px-4 py-2 text-slate-300 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => openModal("signup")}
              className="bg-emerald-500 px-4 py-2 rounded-md font-semibold hover:bg-emerald-600"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <main className="container mx-auto text-center px-4 pt-28 pb-10">
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Test Your
          <br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Sustainability Knowledge
          </span>
        </h2>

        <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto">
          Participate in interactive quizzes with multiple correct answers,
          track your performance, and compete on the leaderboard while learning
          how to build a sustainable future.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => openModal("signup")}
            className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Start Quiz
          </button>

          <button
            onClick={() => openModal("login")}
            className="border border-slate-600 px-8 py-3 rounded-lg hover:bg-slate-800"
          >
            Already have account?
          </button>
        </div>
      </main>

      {/* ===== WHY SECTION ===== */}
      <section className="py-5 text-center px-4">
        <h2 className="text-3xl font-bold mb-6">
          Why Sustainability Matters 🌱
        </h2>

        <p className="text-slate-400 max-w-3xl mx-auto">
          Small actions lead to big environmental impact. By improving your
          awareness through quizzes, you contribute to building a smarter,
          greener, and more sustainable world.
        </p>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Challenge Yourself?
        </h2>

        <button
          onClick={() => openModal("signup")}
          className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-lg font-semibold"
        >
          Join Now
        </button>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-slate-800/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Features
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-center">
            {/* Quiz */}
            <div className="flex flex-col items-center">
              <div className="bg-green-500/10 p-4 rounded-full">
                <Brain className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mt-4">Smart Quiz System</h3>
              <p className="text-slate-400 mt-2">
                Answer multiple-correct questions designed to test real-world
                sustainability knowledge.
              </p>
            </div>

            {/* Leaderboard */}
            <div className="flex flex-col items-center">
              <div className="bg-yellow-500/10 p-4 rounded-full">
                <Trophy className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mt-4">
                Leaderboard Ranking
              </h3>
              <p className="text-slate-400 mt-2">
                Compete with others and climb the leaderboard based on your quiz
                performance.
              </p>
            </div>

            {/* Admin */}
            <div className="flex flex-col items-center">
              <div className="bg-blue-500/10 p-4 rounded-full">
                <ShieldCheck className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mt-4">Admin Controls</h3>
              <p className="text-slate-400 mt-2">
                Admins can view all submissions, manage quizzes, and extend user
                attempt limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AUTH MODAL ===== */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialView={modalView}
        setView={setModalView}
      />

      {/* ===== FOOTER ===== */}
      <footer className="text-center py-6 text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} Sustainability Quiz — Learn. Compete.
        Improve 🌍
      </footer>
    </div>
  );
}

export default HomePage;
