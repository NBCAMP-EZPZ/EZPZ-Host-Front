// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/host/login" />;
}

export default PrivateRoute;
