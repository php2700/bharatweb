import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./app/login";
import OtpVerification from "./app/OtpVerification";
import RoleSelection from "./app/selection";
import WorkCategory from "./app/WorkCategories";

import OurServices from "./app/OurService";
import OurSubCategories from "./app/SubCategories";
import AboutUs from './app/AboutUs';
import WorkerList from "./app/workerlist";
import AddWorkerDetails from './app/AddWorker';
import EditWorkerDetails from './app/EditWorker';
import ServiceProviderHome from "./app/Home-service_provider";
import Profile from "./app/profile";
import Details from "./app/Details";


export default function App() {
  return (
    <Routes>
     <Route path="/" element={<LoginPage />} />
      <Route path="/Home-service_provider" element={<ServiceProviderHome />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/verifyotp" element={<OtpVerification />} />
      <Route path="/selection" element={<RoleSelection />} />
      <Route path="/workcategory" element={<WorkCategory />} />
      
      <Route  path="/ourservice" element={<OurServices/>}/>
      <Route  path="/subcategories" element={<OurSubCategories/>}/>
      <Route path="aboutus" element={<AboutUs/>}/>
      <Route path="workerlist" element={<WorkerList/>}/>
      <Route path="addworker" element={<AddWorkerDetails/>}/>
      <Route path="editworker" element={<EditWorkerDetails/>}/>
      <Route path="Details" element={<Details/>}/>
      
      
    </Routes>
  );
}
