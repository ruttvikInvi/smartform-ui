import React, { type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

interface ProtectedRouteProps {
  element: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
