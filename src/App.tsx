// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authContext"; // Make sure this path is correct

// Components
import Header from "./components/Header"; // Import the Header component

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import FormDetail from "./pages/FormDetail";
import ViewForm from "./pages/ViewForm";
import ViewFormSubmissions from "./pages/ViewFormSubmissions";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header /> {/* Add the Header component here */}
        <main className="container mx-auto p-4"> {/* Optional: Add padding for content below header */}
          <Routes>
            {/* Unprotected Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/view/form/:id" element={<ViewForm />} />
            <Route path="/view/form/:id/submissions" element={<ProtectedRoute element={<ViewFormSubmissions />} />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute element={<Dashboard />} />
              }
            />
            <Route
              path="/create-form"
              element={
                <ProtectedRoute element={<CreateForm />} />
              }
            />
            <Route
              path="/form/:id"
              element={
                <ProtectedRoute element={<FormDetail />} />
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;