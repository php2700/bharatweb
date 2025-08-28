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
import TermCondition from "./app/CommonScreens/Term-condition";
import HelpFaqs from "./app/CommonScreens/Help-faqs";
import PrivacyPolicy from "./app/CommonScreens/Privacy-policy";
import CustomerCare from "./app/CommonScreens/Customer-care";
import BankDetails from "./app/CommonScreens/BankDetails";

// Direct Hiring
import Dispute from "./app/directHiring/User/Dispute";
import MyWork from "./app/directHiring/Worker/MyWork";
import ViewProfile from "./app/directHiring/Worker/ViewProfile";

// Route Protection Components
import PrivateRoute from "./component/RouteProtected/PrivateRoute";
import PrivateOtpVerify from "./component/RouteProtected/PrivateOtp";
import ServiceProviderList from "./app/directHiring/User/ServiceProviderList";
import ServiceProviderHireDetail from "./app/directHiring/User/ServiceProviderHireDetail";
import DirectHiring from "./app/directHiring/User/DirectHiring";
import PaymentConfirmation from "./app/directHiring/User/PaymentConfirmation";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ourservices" element={<OurServices />} />
      <Route path="/subcategories" element={<OurSubCategories />} />
      <Route path="/aboutus" element={<AboutUs />} />

      {/* Worker-Related Routes */}
      <Route path="/workerlist" element={<WorkerList />} />
      <Route path="/add-worker" element={<AddWorkerDetails />} />
      <Route path="/editworker/:id" element={<EditWorkerDetails />} />

      {/* Service Provider Routes */}
      <Route path="/homeservice" element={<PrivateRoute element={<ServiceProviderHome />} />} />
      <Route path="/work-category" element={<WorkCategory />} />
{/* comment */}
      {/* Financial Routes */}
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/referral" element={<Referral />} />
      <Route path="/send-money" element={<SendMoney />} />
      <Route path="/processing-payment" element={<ProcessingPayment />} />
      <Route path="/bank-details" element={<BankDetails />} />

      {/* Informational Routes */}
      <Route path="/customer-reviews" element={<CustomerReview />} />
      <Route path="/his-work" element={<Hiswork />} />
      <Route path="/term-condition" element={<TermCondition />} />
      <Route path="/help-faq" element={<HelpFaqs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/customer-care" element={<CustomerCare />} />
      
      {/* Direct Hiring Route */}
      <Route path="/service-provider-list" element={<ServiceProviderList />} />
      <Route path='/service-provider-hire-detail' element={<ServiceProviderHireDetail/>} />
      <Route path='/direct-hiring' element={<DirectHiring />} />
      <Route path='/dispute' element={<Dispute />} />
      <Route path='/payment-confirmation' element={<PaymentConfirmation/>} />
      <Route path="/mywork" element={<MyWork />}  />
      <Route path="/view-profile" element={<ViewProfile />}  />

       
      {/* Protected Routes */}
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route
        path="/verify-otp"
        element={
          <PrivateOtpVerify>
            <OtpVerification />
          </PrivateOtpVerify>
        }
      />
      <Route path="/select-role" element={<PrivateRoute element={<RoleSelection />} />} />
      <Route path="/homeuser" element={<PrivateRoute element={<WorkCategory />} />} />

      {/* Details Route */}
      <Route path="/details" element={<Details />} />
    </Routes>
  );
}