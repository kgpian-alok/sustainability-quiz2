import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import ScreenLoader from "../components/common/ScreenLoader";
import { Trophy } from "lucide-react";

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Dummy Data (for now)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/leaderboard`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setUsers(data?.leaderboard || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <ScreenLoader loaderFor="Leaderboard" />
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* HEADER */}
      <Header title="Dashboard" />

      {/* CONTAINER */}
      <main className="container mx-auto p-6 mt-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3">
          <Trophy
            size={48}
            className="text-yellow-400 transition-transform duration-300 group-hover:scale-110"
          />
          <span>Leaderboard</span>
        </h1>

        <div className="bg-slate-800 rounded-2xl p-6 shadow">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-3 text-slate-400 border-b border-slate-700 pb-3 mb-4">
            <span>Rank</span>
            <span>Name</span>
            <span className="text-right">Score</span>
          </div>

          {/* USERS */}
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user._id}
                className={`grid grid-cols-3 items-center p-3 rounded-lg ${
                  index === 0
                    ? "bg-yellow-500/10"
                    : index === 1
                      ? "bg-gray-400/10"
                      : index === 2
                        ? "bg-orange-500/10"
                        : "bg-slate-700/30"
                }`}
              >
                {/* Rank */}
                <span className="font-bold">
                  {index === 0
                    ? "🥇"
                    : index === 1
                      ? "🥈"
                      : index === 2
                        ? "🥉"
                        : `#${index + 1}`}
                </span>

                {/* Name */}
                <span>{user.fullName}</span>

                {/* Score */}
                <span className="text-right font-semibold text-emerald-400">
                  {user.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
