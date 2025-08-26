import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "service_provider" | "user" | null
  const isProfileComplete = localStorage.getItem("isProfileComplete"); // "true" / "false"
  const location = useLocation();

  // 1. Token nahi hai toh login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Token hai lekin profile incomplete ya role null
  if (isProfileComplete === "false" && (!role || role === "null")) {
    if (location.pathname === "/selectrole") {
      return <>{Component}</>; // ✅ component render karo
    }
    return <Navigate to="/selectrole" replace />;
  }

  if (isProfileComplete === "false") {
    if (location.pathname === "/profile") {
      return <>{Component}</>;
    }
    return <Navigate to="/profile" replace />;
  }

  // 3. Role ke hisaab se redirect
  if (role === "service_provider") {
    if (location.pathname === "/homeservice") {
      return <>{Component}</>;
    }
    return <Navigate to="/homeservice" replace />;
  }

  if (role === "user") {
    if (location.pathname === "/homeuser") {
      return <>{Component}</>;
    }
    return <Navigate to="/homeuser" replace />;
  }

  // Agar sab sahi hai toh component render karo
  return <>{Component}</>;
};

export default PrivateRoute;
