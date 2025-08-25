import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./app/Login";
import OtpVerification from "./app/OtpVerification";
import RoleSelection from "./app/SelectRole";
import WorkCategory from "./app/WorkCategories";

import OurServices from "./app/OurService";
import OurSubCategories from "./app/SubCategories";
import AboutUs from './app/AboutUs';
import WorkerList from "./app/workerlist";
import AddWorkerDetails from './app/AddWorker';
import EditWorkerDetails from './app/EditWorker';
import ServiceProviderHome from "./app/Home-service_provider";
import Profile from "./app/profile";
import PrivateRoute from "./component/RouteProtected/PrivateRoute";
import PrivateotpVerify from "./component/RouteProtected/PrivateOtp";


export default function App() {
  return (
    <Routes>
      {/* //public route */}
     <Route path="/" element={<LoginPage />} />
      <Route path="/Home-service_provider" element={<ServiceProviderHome />} />
     
      
      <Route path="/selectrole" element={<RoleSelection />} />
      <Route path="/workcategory" element={<WorkCategory />} />
      
      <Route  path="/ourservice" element={<OurServices/>}/>
      <Route  path="/subcategories" element={<OurSubCategories/>}/>
      <Route path="aboutus" element={<AboutUs/>}/>
      <Route path="/workerlist" element={<WorkerList/>}/>
      <Route path="/addworker" element={<AddWorkerDetails/>}/>
      <Route path="/editworker" element={<EditWorkerDetails/>}/>
      
      {/* //protected Route */}
<Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="/verifyotp" element={
        <PrivateotpVerify>
           <OtpVerification />
        </PrivateotpVerify>
       
        } />
      <Route path="/selectrole" element={
       <PrivateRoute>
           <RoleSelection />
        </PrivateRoute>
        } />
    </Routes>
  );
}
