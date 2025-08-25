import React from "react";
import { Navigate } from "react-router-dom";

const PrivateotpVerify = ({ children }) => {
  const registermobile = localStorage.getItem("mobileNumber");

  if (!registermobile) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateotpVerify;
