import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  Loader,
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw,
} from "lucide-react";

const SUPER_ADMIN_ID = "69cee3cb818158fd0bf5138b";

const UserManagementView = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [pendingRoles, setPendingRoles] = useState({});
  const [pendingAttempts, setPendingAttempts] = useState({});

  const allowedRoles = ["user", "admin"];

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/users`,
        { credentials: "include" },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUsers(data?.users || []);
      setPendingRoles({});
      setPendingAttempts({});
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FILTER =================
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();

    return (
      user.fullname?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term)
    );
  });

  // ================= ROLE =================
  const handleRoleChange = (userId, newRole) => {
    const original = users.find((u) => u._id === userId)?.role;

    if (newRole === original) {
      const { [userId]: _, ...rest } = pendingRoles;
      setPendingRoles(rest);
    } else {
      setPendingRoles((prev) => ({
        ...prev,
        [userId]: newRole,
      }));
    }
  };

  // ================= ATTEMPTS =================
  const handleAttemptChange = (userId, newAttempt) => {
    const original = users.find((u) => u._id === userId)?.attemptCount;

    if (Number(newAttempt) === original) {
      const { [userId]: _, ...rest } = pendingAttempts;
      setPendingAttempts(rest);
    } else {
      setPendingAttempts((prev) => ({
        ...prev,
        [userId]: Number(newAttempt),
      }));
    }
  };

  // ================= SAVE =================
  const handleSaveAllChanges = async () => {
    if (!hasPendingChanges) return;

    setIsSaving(true);
    toast.loading("Saving changes...");

    try {
      const requests = [
        ...Object.entries(pendingRoles).map(([userId, role]) =>
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId, role }),
          }),
        ),
        ...Object.entries(pendingAttempts).map(([userId, attemptCount]) =>
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/attempt`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId, attemptCount }),
          }),
        ),
      ];

      await Promise.all(requests);

      toast.dismiss();
      toast.success("Changes saved successfully");
      fetchUsers();
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // ================= HELPERS =================
  const getDisplayRole = (id, role) => pendingRoles[id] ?? role;
  const getDisplayAttempt = (id, attempt) =>
    pendingAttempts[id] ?? attempt ?? 0;

  const hasPendingChanges =
    Object.keys(pendingRoles).length > 0 ||
    Object.keys(pendingAttempts).length > 0;

  // ================= UI =================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20 bg-slate-800 rounded-xl">
        <Loader className="animate-spin text-pink-500" size={32} />
        <p className="ml-4 text-lg">Loading Users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center p-20 bg-red-500/10 rounded-lg">
        <AlertTriangle className="text-red-400" size={32} />
        <p className="mt-4 text-lg text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-x-auto p-4">
      <h3 className="text-2xl font-bold mb-4 text-white">
        All Registered Users ({users.length})
      </h3>

      {/* 🔍 SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        />
      </div>

      {/* SAVE BAR */}
      <div
        className={`p-4 rounded-lg flex justify-between items-center mb-4 ${
          hasPendingChanges ? "bg-yellow-800/50" : "bg-slate-700"
        }`}
      >
        <p className="font-semibold">
          {hasPendingChanges ? "Changes pending save" : "No unsaved changes"}
        </p>

        <div className="flex space-x-3">
          {hasPendingChanges && (
            <button
              onClick={() => {
                setPendingRoles({});
                setPendingAttempts({});
              }}
              className="px-3 py-2 bg-slate-600 rounded-md"
            >
              <RotateCcw size={16} />
            </button>
          )}

          <button
            onClick={handleSaveAllChanges}
            disabled={!hasPendingChanges || isSaving}
            className="px-4 py-2 bg-green-600 rounded-md"
          >
            {isSaving ? <Loader size={16} /> : <Save size={16} />}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-3">User</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Attempts</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-6">
                No users found
              </td>
            </tr>
          )}

          {filteredUsers.map((user) => {
            const displayRole = getDisplayRole(user._id, user.role);
            const attempt = getDisplayAttempt(user._id, user.attemptCount);
            const isPending = user.role !== displayRole || user.attemptCount !== attempt;

            return (
              <tr
                key={user._id}
                className={`border-b border-slate-700 last:border-b-0 ${
                  isPending
                    ? "bg-yellow-900/40 hover:bg-yellow-900/60"
                    : "hover:bg-slate-700/30"
                } transition-colors`}
              >
                <td className="p-3">
                  <div className="font-medium text-white flex items-center">
                    {user._id === currentUser._id && (
                      <CheckCircle
                        size={14}
                        className="text-emerald-500 mr-2"
                      />
                    )}
                    {user.fullName}
                  </div>
                  <div className="text-sm text-slate-400">@{user.username}</div>
                </td>
                <td className="p-3">{user.email}</td>

                {/* ROLE */}
                <td
                  className={`p-3 font-semibold ${
                    isPending ? "text-yellow-300" : "text-white"
                  }`}
                >
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-white">
                      {displayRole.toUpperCase()}
                    </span>

                    {user._id === SUPER_ADMIN_ID && (
                      <span className="text-pink-400 text-xs mt-1">
                        (Owner)
                      </span>
                    )}
                  </div>
                </td>

                {/* ATTEMPT */}
                <td className="p-3">
                  <input
                    type="number"
                    value={attempt}
                    onChange={(e) =>
                      handleAttemptChange(user._id, e.target.value)
                    }
                    className="w-20 bg-slate-700 p-2 rounded"
                  />
                </td>

                {/* ACTION */}
                <td className="p-3">
                  <select
                    value={displayRole}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={
                      user._id === currentUser._id ||
                      user._id === SUPER_ADMIN_ID
                    }
                    className="bg-slate-700 p-2 rounded"
                  >
                    {allowedRoles.map((r) => (
                      <option key={r} value={r}>
                        {r.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementView;
