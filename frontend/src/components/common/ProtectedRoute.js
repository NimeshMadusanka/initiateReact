import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element, path }) {
  const token = sessionStorage.getItem('accessToken');

  return token ? element : <Navigate to='/permission-denied' />;
}

export default ProtectedRoute;
