import React, { useEffect, useState } from "react";
import ConfirmationModal from "../common/ConfirmationModal";
import toast from "react-hot-toast";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // 🔄 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/users`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to fetch users");
        throw new Error(data?.message || "Failed to fetch users");
      }

      setUsers(data?.users || []);
      toast.success(data?.message || "Users fetched successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred while fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🧑‍💼 Update Role
  const handleRoleChange = async (userId, role) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/role`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId, role }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to update role");
        throw new Error(data?.message || "Failed to update role");
      }

      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred while updating the role");
    }
  };

  // 🔢 Update Attempt Count
  const handleAttemptChange = async (userId, attemptCount) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/attempt`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, attemptCount: Number(attemptCount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to update attempt count");
        throw new Error(data?.message || "Failed to update attempt count");
      }

      toast.success("Attempt count updated");
    } catch (err) {
      toast.error(err.message || "An error occurred while updating the attempt count");
      console.error(err);
    }
  };

  // 🔄 Reset Quiz
  const handleResetClick = (userId) => {
    setSelectedUserId(userId);
    setIsResetModalOpen(true);
  };

  const confirmReset = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/reset-quiz`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: selectedUserId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to reset quiz");
        throw new Error(data?.message || "Failed to reset quiz");
      }

      toast.success("Quiz reset successfully");

      setIsResetModalOpen(false);
      setSelectedUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred while resetting the quiz");
    }
  };

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="text-center text-slate-400">No users found</div>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="bg-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* 👤 User Info */}
            <div>
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>

            {/* 🧑‍💼 Role */}
            <div>
              <label className="text-sm text-slate-400 mr-2">Role:</label>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                className="bg-slate-700 p-1 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* 🔢 Attempt Count */}
            <div>
              <label className="text-sm text-slate-400 mr-2">Attempts:</label>
              <input
                type="number"
                defaultValue={user.attemptCount}
                onBlur={(e) => handleAttemptChange(user._id, e.target.value)}
                className="bg-slate-700 p-1 rounded w-20"
              />
            </div>

            {/* 🔄 Reset */}
            <button
              onClick={() => handleResetClick(user._id)}
              className="text-red-400 hover:text-red-300"
            >
              Reset Quiz
            </button>
          </div>
        ))
      )}

      {/* 🔥 Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmReset}
        title="Reset Quiz"
        message="Are you sure you want to reset this user's quiz session?"
        confirmText="Reset"
        variant="danger"
      />
    </div>
  );
};

export default UsersTab;
