import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, Users, User } from "lucide-react"; // Added User and Users icons
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal"; // Assuming path

const Header = ({ title }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if the current user is an admin
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try {
      // API call to clear the httpOnly cookie
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Server logout failed:", error);
      toast.error("An error occurred while logging out.");
    } finally {
      setIsLogoutModalOpen(false);
      setUser(null); // Clear context state
      navigate("/"); // Redirect to public page
    }
  };

  const handleAdminPanelUI = () => {
    setIsDropdownOpen(false);
    navigate("/dashboard/admin");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className="bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold text-white cursor-pointer bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
          >
            {user?.role
              ? user?.role.charAt(0).toUpperCase() + user?.role.slice(1)
              : "User"}{" "}
            {title}
          </h1>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown on click
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-700 transition-colors"
            >
              <User size={20} className="text-sky-400" />
              <span className="font-semibold text-white">
                {user?.fullName || user?.username || "User"}
              </span>
              <ChevronDown
                size={20}
                className={`text-slate-400 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* The Dropdown Menu */}
            <div
              className={`absolute top-full right-0 mt-2 w-56 bg-slate-700 rounded-md shadow-lg overflow-hidden transition-all duration-300 z-30 ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <ul>
                {/* --- 1. Admin Panel --- */}
                {isAdmin && (
                  <li>
                    <button
                      onClick={handleAdminPanelUI}
                      className="w-full text-left flex items-center space-x-3 px-4 py-2 text-pink-400 hover:bg-slate-600 transition-colors"
                    >
                      <Users size={18} />
                      <span>Admin Panel</span>
                    </button>
                  </li>
                )}

                {isAdmin && <hr className="border-slate-600" />}

                {/* --- 2. Logout Button --- */}
                <li>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="w-full text-left flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmText="Logout"
        variant="danger"
      />
    </>
  );
};

export default Header;
