// src/components/Header.tsx
import React, { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Assuming your AuthContext is exported from here
import { Button } from "./ui/button";

const Header: React.FC = () => {
  // Assuming AuthContext provides an 'user' object or 'isLoggedIn' boolean
  const { isAuthenticated, logout } = useAuth(); // Adjust based on your AuthContext structure
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = isAuthenticated; // Or use your specific isLoggedIn state

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-platinum flex gap-2 items-center">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">SmartForm AI</h1>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-3 items-center">
          {isLoggedIn ? (
            <div className="flex gap-4 items-center">
              <NavLink
                style={({ isActive }) => (isActive ? { fontWeight: "bold" } : { color: "black" })}
                to="/dashboard"
                className="text-blue-500"
              >
                Dashboard
              </NavLink>
              <NavLink
                style={({ isActive }) => (isActive ? { fontWeight: "bold" } : { color: "black" })}
                to="/create-form"
                className="text-blue-500"
              >
                Create Form
              </NavLink>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <>
              <Button variant="secondary" onClick={() => navigate("/login")}>Sign In</Button>
              <Button onClick={() => navigate("/register")}>Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen((s) => !s)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
            className="p-2 rounded-md text-white hover:bg-gray-100"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden absolute right-4 top-full mt-2 w-56 bg-white/95 shadow-lg rounded-md border">
            <div className="flex flex-col p-2">
              {isLoggedIn ? (
                <>
                  <NavLink
                    onClick={() => setMobileOpen(false)}
                    style={({ isActive }) => (isActive ? { fontWeight: "bold" } : { color: "black" })}
                    to="/dashboard"
                    className="px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    onClick={() => setMobileOpen(false)}
                    style={({ isActive }) => (isActive ? { fontWeight: "bold" } : { color: "black" })}
                    to="/create-form"
                    className="px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Create Form
                  </NavLink>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="text-left px-3 py-2 rounded hover:bg-gray-50 text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/login");
                    }}
                    className="text-left px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/register");
                    }}
                    className="text-left px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
