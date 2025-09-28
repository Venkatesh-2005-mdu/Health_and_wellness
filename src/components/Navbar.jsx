import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Brand / Logo */}
        <Link
          to="/dashboard"
          className="text-xl font-bold text-blue-600 hover:text-blue-700"
        >
          Health Companion
        </Link>

        {/* Links */}
        <div className="space-x-4">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="ml-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
