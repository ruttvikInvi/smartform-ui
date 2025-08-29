// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

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
        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="container mx-auto p-4 flex-1">
            <Routes>
              {/* Unprotected Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/view/form/:id" element={<ViewForm />} />
              <Route
                path="/view/form/:id/submissions"
                element={<ProtectedRoute element={<ViewFormSubmissions />} />}
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
              />
              <Route
                path="/create-form"
                element={<ProtectedRoute element={<CreateForm />} />}
              />
              <Route
                path="/form/:id"
                element={<ProtectedRoute element={<FormDetail />} />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
 
