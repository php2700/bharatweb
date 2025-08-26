import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isProfileComplete = localStorage.getItem("isProfileComplete");

  if (token && isProfileComplete === "true" && role === "service_provider") {
    return <Navigate to="/service_provider" replace />;
  } else if (token && isProfileComplete === "true" && role === "user") {
    return <Navigate to="/user" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
