import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import FeatureCard from "../components/common/FeatureCard";
import { Brain, Trophy } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Header title="Dashboard" />

      <main className="container mx-auto p-6 mt-4 max-w-4xl space-y-6">
        <h2 className="text-3xl font-bold mb-6">Choose an Option</h2>

        <FeatureCard
          title="Take Sustainability Quiz"
          description="Attempt quiz with multiple correct answers and test your knowledge."
          icon={
            <Brain
              size={48}
              className="text-green-400 transition-transform duration-300 group-hover:scale-110"
            />
          }
          onClick={() => navigate("/quiz")}
        />

        {user.role === "admin" && (
          <FeatureCard
            title="Leaderboard"
            description="View top performers and analyze user scores."
            icon={
              <Trophy
                size={48}
                className="text-yellow-400 transition-transform duration-300 group-hover:scale-110"
              />
            }
            onClick={() => navigate("/leaderboard")}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
