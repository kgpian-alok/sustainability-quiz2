import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose, initialView, setView }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Replace the old login handler with this one ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      // --- Make the API call to your backend login endpoint ---
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Important: include cookies in the request
        }
      );

      const data = await response.json();

      // --- Handle backend errors (e.g., invalid credentials) ---
      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      // --- Handle Success ---
      toast.success("Login successful");
      onClose();

      // --- Redirect to the correct dashboard based on the user's role ---
      const userRole = data.user.role;
      if (userRole === "user" || userRole === "admin" || userRole === "ccm") {
        window.location.href = "/dashboard";
      } else {
        toast.error("Unknown user role. Redirecting to home.");
        console.error("Unknown user role:", userRole);
        window.location.href = "/"; // Fallback to home page
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // --- Make the API call to your backend ---
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, username, email, password }),
        credentials: "include", // Important for handling httpOnly cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Sign Up successful");

      onClose();
      const userRole = data.user.role;
      if (userRole === "user" || userRole === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/"; // Fallback
      }
    } catch (err) {
      toast.error(err.message || "Sign Up failed");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to clear form state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setFullName("");
      setUsername("");
    }
  }, [isOpen]);

  // Effect to handle scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Effect to handle the Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md relative transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Login View */}
        {initialView === "login" && (
          <div>
            <h2 className="text-3xl font-bold text-white text-center">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-center mb-4">
              Sign in to continue to <br />
              Sustainability Quiz and track your progress
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 bg-slate-700 text-white rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 bg-slate-700 text-white rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 outline-none transition"
                  required
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">
                  {error}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    alert(`This will be implemented later on`);
                  }}
                  className="text-sm text-sky-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 !mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Logging In..." : "Login"}
              </button>
            </form>

            <p className="text-center text-slate-400 mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => setView("signup")}
                className="text-sky-400 hover:underline font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        )}

        {/* Sign Up View */}
        {initialView === "signup" && (
          <div>
            <h2 className="text-3xl font-bold text-white text-center">
              Create Account
            </h2>
            <p className="text-slate-400 text-center mb-4">
              Join us and start your sustainability journey today!
            </p>

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-3 bg-slate-700 text-white rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 outline-none transition"
                  required
                />
              </div>
              {/* --- Username Input Field --- */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your Username"
                  className="w-full p-3 bg-slate-700 text-white rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 bg-slate-700 text-white rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Must be at least 8 characters"
                  className="w-full p-3 bg-slate-700 text-white rounded-md border border-slate-600 focus:ring-2 focus:ring-sky-500 outline-none transition"
                  required
                  minLength={8}
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 !mt-4 disabled:bg-slate-600 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-slate-400 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setView("login")}
                className="text-sky-400 hover:underline font-semibold"
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
