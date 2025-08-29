import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem("bharat_token");
  const role = localStorage.getItem("role"); // "service_provider" | "user" | null
  const isProfileComplete = localStorage.getItem("isProfileComplete"); // "true" / "false"
  const location = useLocation();

  // 1. Token nahi hai toh login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Role null hai → selectrole
  if (!role || role === "null") {
    if (location.pathname === "/select-role") {
      return <>{Component}</>;
    }
    return <Navigate to="/select-role" replace />;
  }

  // 3. Profile incomplete aur role set hai → profile page
  if (isProfileComplete === "false") {
    if (location.pathname === "/profile") {
      return <>{Component}</>;
    }
    return <Navigate to="/profile" replace />;
  }

  // 4. Role ke hisaab se redirect
  if (token && role === "service_provider" &&isProfileComplete === "true") {
    if (location.pathname === "/homeservice") {
      return <>{Component}</>;
    }
    return <Navigate to="/homeservice" replace />;
  }

  if (token && role === "user" && isProfileComplete === "true") {
    if (location.pathname === "/homeuser") {
      return <>{Component}</>;
    }
    return <Navigate to="/homeuser" replace />;
  }

  // Agar sab sahi hai toh component render karo
  return <>{Component}</>;
};

export default PrivateRoute;
