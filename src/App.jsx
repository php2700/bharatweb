import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Screens
import Home from "./app/CommonScreens/Home";
import LoginPage from "./app/CommonScreens/login";
import RoleSelection from "./app/CommonScreens/SelectRole";
import WorkCategory from "./app/CommonScreens/WorkCategories";
import OurServices from "./app/CommonScreens/OurService";
import OurSubCategories from "./app/CommonScreens/SubCategories";
import AboutUs from "./app/CommonScreens/AboutUs";
import WorkerList from "./app/CommonScreens/workerlist";
import AddWorkerDetails from "./app/CommonScreens/AddWorker";
import EditWorkerDetails from "./app/CommonScreens/EditWorker";
import Subscription from "./app/CommonScreens/Subscription";
import Referral from "./app/CommonScreens/Referral";
import SendMoney from "./app/CommonScreens/SendMoney";
import ProcessingPayment from "./app/CommonScreens/ProcessingPayment";
import Details from "./app/CommonScreens/Details";

// Protected Screens
import ServiceProviderHome from "./app/CommonScreens/Home-service_provider";
import Profile from "./app/CommonScreens/profile";
import OtpVerification from "./app/CommonScreens/OtpVerification";

// Informational Pages
import CustomerReview from "./app/CommonScreens/Customer-review";
import Hiswork from "./app/CommonScreens/His-work";
import TermCondtion from "./app/CommonScreens/Term-condition";
import HelpFaqs from "./app/CommonScreens/Help-faqs";
import PrivacyPolicy from "./app/CommonScreens/Privacy-policy";
import CustomerCare from "./app/CommonScreens/Customer-care";
import BankDetails from "./app/CommonScreens/BankDetails";

// Direct Hiring

// Route Protection Components
import PrivateRoute from "./component/RouteProtected/PrivateRoute";
import PrivateotpVerify from "./component/RouteProtected/PrivateOtp";
import ServiceProviderList from "./app/directHiring/User/ServiceProviderList";
import ServiceProviderHireDetail from "./app/directHiring/User/ServiceProviderHireDetail";
import DirectHiring from "./app/directHiring/User/DirectHiring";
import PaymentConfirmation from "./app/directHiring/User/PaymentConfirmation";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login/signup" element={<LoginPage />} />
      <Route path="/ourservices" element={<OurServices />} />
      <Route path="/subcategories" element={<OurSubCategories />} />
      <Route path="/aboutus" element={<AboutUs />} />
      
      {/* Worker-Related Routes Routes */}
      <Route path="/workerlist" element={<WorkerList />} />
      <Route path="/addworker" element={<AddWorkerDetails />} />
      <Route path="/editworker" element={<EditWorkerDetails />} />
      
      {/* Service Provider Routes */}
      <Route path="/home-service-provider" element={<ServiceProviderHome />} />
      <Route path="/workcategory" element={<WorkCategory />} />
      
      {/* Financial Routes */}
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/referral" element={<Referral />} />
      <Route path="/sendmoney" element={<SendMoney />} />
      <Route path="/processingpayment" element={<ProcessingPayment />} />
      <Route path="/bank-details" element={<BankDetails />} />
      
      {/* Informational Routes */}
      <Route path="/customer-review" element={<CustomerReview />} />
      <Route path="/his-work" element={<Hiswork />} />
      <Route path="/term-condition" element={<TermCondtion />} />
      <Route path="/help-faq" element={<HelpFaqs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/customer-care" element={<CustomerCare />} />
      
      {/* Direct Hiring Route */}
      <Route path="/service-provider-list" element={<ServiceProviderList />} />
      <Route path='/service-provider-hire-detail' element={<ServiceProviderHireDetail/>} />
      <Route path='/direct-hiring' element={<DirectHiring />} />
      <Route path='/payment-confirmation' element={<PaymentConfirmation/>} />
       
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
      
      {/* Details Route */}
      <Route path="/details" element={<Details />} />
    </Routes>
  );
}