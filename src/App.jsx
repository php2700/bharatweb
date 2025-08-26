import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./app/CommonScreens/login";
import OtpVerification from "./app/CommonScreens/OtpVerification";
import RoleSelection from "./app/CommonScreens/SelectRole";
import WorkCategory from "./app/CommonScreens/WorkCategories";
import OurServices from "./app/CommonScreens/OurService"; // Fixed casing to match component usage
import OurSubCategories from "./app/CommonScreens/SubCategories";
import AboutUs from "./app/CommonScreens/AboutUs";
import WorkerList from "./app/CommonScreens/workerlist";
import AddWorkerDetails from "./app/CommonScreens/AddWorker";
import EditWorkerDetails from "./app/CommonScreens/EditWorker";
import ServiceProviderHome from "./app/CommonScreens/Home-service_provider";
import Profile from "./app/CommonScreens/profile";
import PrivateRoute from "./component/RouteProtected/PrivateRoute";
import PrivateotpVerify from "./component/RouteProtected/PrivateOtp";
import Details from "./app/CommonScreens/Details";
import Subscription from "./app/CommonScreens/Subscription";
import Referral from "./app/CommonScreens/Referral";
import SendMoney from "./app/CommonScreens/SendMoney";
import ProcessingPayment from "./app/CommonScreens/ProcessingPayment";
import Home from "./app/CommonScreens/Home";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home/>} />
      <Route path="/login/signup" element={<LoginPage />} />
      <Route path="/Home-service_provider" element={<ServiceProviderHome />} />
      <Route path="/selectrole" element={<RoleSelection />} />
      <Route path="/workcategory" element={<WorkCategory />} />
      <Route path="/Subscription" element={<Subscription />} />
      <Route path="/Referral" element={<Referral />} />
      <Route path="/OurService" element={<OurServices />} />
      <Route path="/subcategories" element={<OurSubCategories />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/workerlist" element={<WorkerList />} />
      <Route path="/addworker" element={<AddWorkerDetails />} />
      <Route path="/editworker" element={<EditWorkerDetails />} />
      <Route path="/Details" element={<Details />} />
      <Route path="/SendMoney" element={<SendMoney />} />
      <Route path="/ProcessingPayment" element={<ProcessingPayment />} />


      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/verifyotp"
        element={
          <PrivateotpVerify>
            <OtpVerification />
          </PrivateotpVerify>
        }
      />
      <Route
        path="/selectrole"
        element={
          <PrivateRoute>
            <RoleSelection />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}