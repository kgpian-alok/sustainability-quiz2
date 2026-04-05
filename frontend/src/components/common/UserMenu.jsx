import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Users, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

// This component expects the parent (Header) to pass the function
// to change the main dashboard view state.
const UserMenu = ({ setActiveView }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // Role check and action visibility
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout(); // Assumes a logout function exists in AuthContext
    navigate("/"); // Redirect to home page after logging out
  };

  const handleManageUsersClick = () => {
    setIsOpen(false);
    // This function changes the state in DashboardPage.jsx to show the component
    setActiveView("user_management");
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
        aria-expanded={isOpen}
        aria-controls="user-dropdown-menu"
      >
        <User size={20} className="text-sky-400" />
        <span className="hidden sm:inline font-medium text-white">
          {user?.fullName || user?.username}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div
          id="user-dropdown-menu"
          className="absolute right-0 mt-2 w-60 bg-slate-700 rounded-lg shadow-lg py-2 border border-slate-600 animate-fade-in"
        >
          <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-600 mb-1">
            Logged in as:{" "}
            <span className="font-semibold capitalize text-white">
              {user?.role}
            </span>
          </div>

          {/* 1. Manage User Roles (Admin Only) */}
          {isAdmin && (
            <button
              onClick={handleManageUsersClick}
              className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-slate-600 w-full text-left transition"
            >
              <Users size={18} className="text-pink-400" />
              <span>Manage User Roles</span>
            </button>
          )}

          {/* 2. Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-slate-600 w-full text-left transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
