import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./app/login";
import OtpVerification from "./app/otp_verification";
import RoleSelection from "./app/selection";
import WorkCategory from "./app/work_category";
import Footer from "./component/footer";
import OurServices from "./app/OurService";


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verification" element={<OtpVerification />} />
      <Route path="/selection" element={<RoleSelection />} />
      <Route path="/workcategory" element={<WorkCategory />} />
      <Route path="/footer" element={<Footer />} />
      <Route  path="/ourservice" element={<OurServices/>}/>
      
    </Routes>
  );
}
