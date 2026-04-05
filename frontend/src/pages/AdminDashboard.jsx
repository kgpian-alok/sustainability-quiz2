import React, { useState } from "react";
import Header from "../components/common/Header";
import QuestionsTab from "../components/admin/QuestionsTab";
import UserManagementView from "../components/admin/UserManagementView";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Header title="Dashboard" />

      <main className="container mx-auto p-6 max-w-5xl">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "questions"
                ? "bg-emerald-500"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Questions
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "users"
                ? "bg-emerald-500"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Users
          </button>
        </div>

        {/* Content */}
        {activeTab === "questions" && <QuestionsTab />}
        {activeTab === "users" && <UserManagementView />}
      </main>
    </div>
  );
};

export default AdminDashboard;
