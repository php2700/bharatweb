import { useState } from "react";
import Subscription from "./Subscription";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import BankDetails from "./BankDetails";
import Referral from "./Referral";
import banner from "../../assets/banner.png";

export default function Account() {
  const [activeTab, setActiveTab] = useState("membership");

  return (
    <>
          <Header />
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-[75rem] mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Account Manage</h1>

        {/* Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap border-b border-gray-300 mb-4 sm:mb-6 gap-x-6 sm:gap-x-79 gap-y-2">
          <button
            onClick={() => setActiveTab("membership")}
            className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
              activeTab === "membership"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Membership
          </button>
          <button
            onClick={() => setActiveTab("bank")}
            className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
              activeTab === "bank"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Bank Detail
          </button>
          <button
            onClick={() => setActiveTab("referral")}
            className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
              activeTab === "referral"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Referral
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "membership" && (
            <Subscription />
          )}

          {activeTab === "bank" && (
            <BankDetails />
          )}

          {activeTab === "referral" && (
            <Referral />
          )}
        </div>
      </div>
      <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
              <img
                src={banner}
                alt="Gardening"
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
              />
            </div>
    </div>
     
          
          <Footer />
        </>
  );
}
