import React from "react";
import { Routes, Route } from "react-router-dom";
import NotificationToast from "./component/NotificationToast";

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
import FilterWorker from "./app/directHiring/User/FilterWorker";
import Account from "./app/CommonScreens/Account";
// Protected Screens
import ServiceProviderHome from "./app/CommonScreens/Home-service_provider";
import Profile from "./app/CommonScreens/profile";
import OtpVerification from "./app/CommonScreens/OtpVerification";
import Notifications from "./app/CommonScreens/Notification";

// Informational Pages
import CustomerReview from "./app/CommonScreens/Customer-review";
import Hiswork from "./app/CommonScreens/His-work";
import TermCondition from "./app/CommonScreens/Term-condition";
import HelpFaqs from "./app/CommonScreens/Help-faqs";
import PrivacyPolicy from "./app/CommonScreens/Privacy-policy";
import CustomerCare from "./app/CommonScreens/Customer-care";
import BankDetails from "./app/CommonScreens/BankDetails";
import ReviewModal from "./app/CommonScreens/ReviewModal";
import EditProfile from "./app/CommonScreens/EditProfile";

// Direct Hiring
import Dispute from "./app/CommonScreens/dispute";
import WorkerDetail from "./app/directHiring/User/WorkerDetail";

// Route Protection Components
import PrivateRoute from "./component/RouteProtected/PrivateRoute";
import PrivateOtpVerify from "./component/RouteProtected/PrivateOtp";
import ServiceProviderList from "./app/directHiring/User/ServiceProviderList";
import ServiceProviderHireDetail from "./app/directHiring/User/ServiceProviderHireDetail";
import DirectHiring from "./app/directHiring/User/DirectHiring";
import PaymentConfirmation from "./app/directHiring/User/PaymentConfirmation";
import Biddercheck from "./app/Bidding/User/checknow";

import MyHire from "./app/directHiring/User/MyHire";

//Bidding
import RecentPost from "./app/Bidding/Worker/RecentPost";

//Bidding User
import BiddingNewTask from "./app/Bidding/User/NewTask";
import BiddingWorkerDetail from "./app/Bidding/User/WorkDetail";
import MyHireBidding from "./app/Bidding/User/MyHire";
import HireDetail from "./app/Bidding/User/HireDetail";
import BiddingDispute from "./app/CommonScreens/dispute";
import BiddinggetWorkDetail from "./app/Bidding/User/getworkdetails";
import BiddingEditTask from "./app/Bidding/User/EditTask";

import ChooseWorker from "./app/emergency/Worker/ChooseWorker";
import Tasklist from "./app/Bidding/Worker/Tasklist";
import Bid from "./app/Bidding/Worker/Bid";
import EditBid from "./app/Bidding/Worker/EditBid";
import EmergencyTasks from "./app/emergency/Worker/EmergencyTasks";

//Emergency
import WorkerWorklist from "./app/emergency/Worker/Worklist";
import UserWorklist from "./app/emergency/User/Worklist";
import Post from "./app/emergency/User/Post";
import EmergencyOrderDetails from "./app/emergency/User/OrderDetail";
import EmergencyWorkerAcceptReject from "./app/emergency/Worker/AcceptReject";
import EmergencyProviderOrderDetails from "./app/emergency/Worker/OrderDetail";
import AssignWorker from "./app/CommonScreens/AssignWorker";
import ViewWorker from "./app/CommonScreens/ViewWorker";
import ViewProfileDetails from "./app/CommonScreens/ViewProfileDetails";
import ViewUserProfileDetails from "./app/CommonScreens/ViewUserProfileDetails";

//Direct Hiring
import DirectProviderordetail from "./app/directHiring/Worker/OrderDetail";

//Directing
import MyHireOrderDetails from "./app/directHiring/User/OrderDetail";
import Chat from "./app/CommonScreens/Chat";

export default function App() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration.scope);
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed:", err);
      });
  }
  return (
    <>
      <NotificationToast />

      <Routes>
        {/* \-------------------------------------------------------------------------------------------------------/
             \         ╔════════════════════════════════ Public Routes Start ═══════════════════════════╗          /
              \-------------------------------------------------------------------------------------------------- /  */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/ourservices" element={<OurServices />} />
        <Route path="/subcategories" element={<OurSubCategories />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/notifications" element={<Notifications />} />
        {/* Worker-Related Routes */}
        <Route path="/workerlist" element={<WorkerList />} />
        <Route path="/add-worker" element={<AddWorkerDetails />} />
        <Route path="/editworker/:id" element={<EditWorkerDetails />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/filter-worker" element={<FilterWorker />} />
        <Route
          path="/profile-details/:serviceProviderId/:type"
          element={<ViewProfileDetails />}
        />
        <Route
          path="/profile-user-details/:userId"
          element={<ViewUserProfileDetails />}
        />
        <Route path="/chats" element={<Chat />} />

        {/* Service Provider Routes */}
        <Route
          path="/homeservice"
          element={<PrivateRoute element={<ServiceProviderHome />} />}
        />
        {/* <Route path="/review" element={<Review />} /> */}
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
        <Route
          path="/service-provider-list"
          element={<ServiceProviderList />}
        />
        <Route
          path="/service-provider-hire-detail"
          element={<ServiceProviderHireDetail />}
        />
        <Route path="/direct-hiring/:id" element={<DirectHiring />} />
        <Route path="/dispute/:orderId/:type" element={<Dispute />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/worker-detail" element={<WorkerDetail />} />
        <Route path="/my-hire" element={<MyHire />} />
        <Route path="/directhiring/workdetail" element={<WorkerDetail />} />
        {/* Bidding Worker */}
        <Route path="/bidding/task-list" element={<Tasklist />} />
        <Route path="/bidding/recent-post" element={<RecentPost />} />
        <Route path="/bidding/bid/:id" element={<Bid />} />
        <Route path="/bidding/edit-bid" element={<EditBid />} />
        <Route path="/details" element={<Details />} />
        {/* Bidding Route Of user */}
        <Route path="/bidding/newtask" element={<BiddingNewTask />} />
        <Route path="/bidding/edittask/:id" element={<BiddingEditTask />} />
        <Route path="/bidding/myhire" element={<MyHireBidding />} />
        <Route
          path="/bidding/getworkdetail/:id"
          element={<BiddinggetWorkDetail />}
        />

        <Route path="/bidding/hiredetail/:id" element={<HireDetail />} />
        <Route path="/bidding/workdetail" element={<BiddingWorkerDetail />} />
        <Route path="/bidding/dispute" element={<BiddingDispute />} />
        <Route path="/bidding/edittask/:id" element={<BiddingEditTask />} />
        <Route path="/bidding/checknow" element={<Biddercheck />} />
        <Route path="/account" element={<Account />} />

        <Route
          path="/review"
          element={<PrivateRoute element={<ReviewModal />} />}
        />
        {/* \------------------------------------------------------------------------------------------------------------------------------/
             \                  ╔════════════════════════════════ Public Routes End ═══════════════════════════╗                          /
              \--------------------------------------------------------------------------------------------------------------------------/    */}
        {/*  \-----------------------------------------------------------------------------------------------------------------------------/
              \                 ╔════════════════════════════════ Protected Routes Start ═══════════════════════════╗                      /
               \--------------------------------------------------------------------------------------------------------------------------/    */}
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
        <Route
          path="/verify-otp"
          element={
            <PrivateOtpVerify>
              <OtpVerification />
            </PrivateOtpVerify>
          }
        />
        <Route
          path="/select-role"
          element={<PrivateRoute element={<RoleSelection />} />}
        />
        <Route
          path="/homeuser"
          element={<PrivateRoute element={<WorkCategory />} />}
        />
        {/* \---------------------------------------------------------------------------------------------------------------------------------/
             \                ╔════════════════════════════════ Protected Routes End ═══════════════════════════╗                            /
              \-----------------------------------------------------------------------------------------------------------------------------/ */}
        {/* common page for user's worker list */}
        <Route path="/user/work-list/:task" element={<UserWorklist />} />
        <Route path="/worker/work-list/:task" element={<WorkerWorklist />} />
        {/* // Emergency Routes- User */}
        <Route path="/emergency/userpost" element={<Post />} />
        <Route
          path="/emergency/order-detail/:id"
          element={<EmergencyOrderDetails />}
        />
        {/* // Emergency Routes- Worker */}
        <Route
          path="/emergency/worker/work-list"
          element={<WorkerWorklist />}
        />
        <Route
          path="/emergency/worker/:id"
          element={<EmergencyWorkerAcceptReject />}
        />
        <Route
          path="/emergency/worker/order-detail/:id"
          element={<EmergencyProviderOrderDetails />}
        />
        <Route path="/emergency/choose-worker" element={<ChooseWorker />} />
        <Route path="/emergency/tasks" element={<EmergencyTasks />} />
        <Route path="/assign-work/:orderId/:type" element={<AssignWorker />} />
        <Route path="/view-worker/:id" element={<ViewWorker />} />
        {/**Direct hiring  Routing */}
        {/**User */}

        <Route
          path="/my-hire/order-detail/:id"
          element={<MyHireOrderDetails />}
        />
        {/**Provider */}

        <Route
          path="/hire/worker/order-detail/:id"
          element={<DirectProviderordetail />}
        />
      </Routes>
    </>
  );
}
