import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./app/login";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
    </Routes>
  );
}
