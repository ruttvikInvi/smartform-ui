// src/components/Header.tsx
import { Sparkles } from "lucide-react";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Assuming your AuthContext is exported from here
import { Button } from "./ui/button";

const Header: React.FC = () => {
  // Assuming AuthContext provides an 'user' object or 'isLoggedIn' boolean
  const { isAuthenticated, logout } = useAuth(); // Adjust based on your AuthContext structure
  const navigate = useNavigate();

  const isLoggedIn = isAuthenticated; // Or use your specific isLoggedIn state

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-platinum flex gap-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SmartForm AI</h1>
          </Link>
        </div>

        <div className="flex gap-3">
          {isLoggedIn ? (
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <NavLink style={({ isActive }) => (isActive ? { fontWeight: "bold" } : {color: "black"})} to="/dashboard" className="text-blue-500">
                Dashboard
              </NavLink>
              <NavLink style={({ isActive }) => (isActive ? { fontWeight: "bold" } : {color: "black"})} to="/create-form" className="text-blue-500">
                Create Form
              </NavLink>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <>
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/register")}>Get Started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
