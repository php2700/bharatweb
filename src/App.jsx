import React from "react";
import { Routes, Route } from "react-router-dom";
import OtpVerification from "./app/OtpVerification";
import RoleSelection from "./app/selection";
import WorkCategory from "./app/WorkCategories";
import LoginPage from './app/login'
import OurServices from "./app/OurService";
import OurSubCategories from "./app/SubCategories";
import AboutUs from "./app/AboutUs";
import WorkerList from "./app/workerlist";
import AddWorkerDetails from "./app/AddWorker";
import EditWorkerDetails from "./app/EditWorker";
import ServiceProviderHome from "./app/Home-service_provider";
import Profile from "./app/profile";
import Details from "./app/Details";
import { CustomerReview } from "./app/Customer-review";
import { Hiswork } from "./app/His-work";
import { TermCondtion } from "./app/Term-condition";
import { HelpFaqs } from "./app/Help-faqs";
import { PrivacyPolicy } from "./app/Privacy-policy";
import { CustomerCare } from "./app/Customer-care";
import { BankDetails } from "./app/BankDetails";
import { DirectHiring } from "./app/directHiring/DirectHiring";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Home-service_provider" element={<ServiceProviderHome />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/verifyotp" element={<OtpVerification />} />
      <Route path="/selection" element={<RoleSelection />} />
      <Route path="/workcategory" element={<WorkCategory />} />

      <Route path="/ourservice" element={<OurServices />} />
      <Route path="/subcategories" element={<OurSubCategories />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/workerlist" element={<WorkerList />} />
      <Route path="/addworker" element={<AddWorkerDetails />} />
      <Route path="/editworker" element={<EditWorkerDetails />} />
      <Route path="/Details" element={<Details />} />
      <Route path="/customer-review" element={<CustomerReview />} />
      <Route path="/his-work" element={<Hiswork />} />
      <Route path="/term-condition" element={<TermCondtion />} />
      <Route path="/help-faq" element={<HelpFaqs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/customer-care" element={<CustomerCare/>} />
      <Route path="/bank-details" element={<BankDetails/>} />

      {/* direct hiring */}
      <Route path="/direct-hiring" element={<DirectHiring/>} />
    </Routes>
  );
}
