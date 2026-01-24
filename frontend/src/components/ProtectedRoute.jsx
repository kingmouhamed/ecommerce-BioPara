import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useUser();

  if (loading) {
    // Optional: show a loading spinner while checking auth status
    return <div>Loading...</div>;
  }

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Logged in but not an admin, redirect to home or a 'not authorized' page
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
