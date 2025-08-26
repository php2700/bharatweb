import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Arrow from "../../assets/profile/arrow_back.svg";
import CheckIcon from "../../assets/Subscription/tick.svg";
import Gardening from "../../assets/profile/profile image.png";


export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "3m",
      price: "₹999",
      perMonth: "(₹333/month)",
      duration: "3 Months",
      gradient: "from-[#47BFB2] to-[#008274]",
    },
    {
      id: "6m",
      price: "₹2,499",
      perMonth: "(₹416/month)",
      duration: "6 Months",
      gradient: "from-[#EDDF3F] to-[#BEAF09]",
    },
    {
      id: "1y",
      price: "₹4,499",
      perMonth: "(₹374/month)",
      duration: "1 Year",
      gradient: "from-[#ED7282] to-[#C1041C]",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      {/* Premium Section */}
      <div className="text-center mt-6">
        <h2 className="text-xl font-bold">Get Premium Access</h2>
        <p className="text-gray-600 mt-1">Premium Plans</p>
      </div>

      {/* Plans */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`bg-gradient-to-b ${
              plan.gradient
            } text-white p-6 rounded-xl shadow-lg w-64 h-64 text-center cursor-pointer transition-all duration-300
              ${
                selectedPlan === plan.id
                  ? "ring-7 ring-[#075F66] scale-105"
                  : "hover:scale-105"
              }`}
          >
            <p className="text-4xl font-bold">{plan.price}</p>
            <p className="text-3xl font-semibold mt-3">{plan.perMonth}</p>
            <div className="mt-[70px] text-3xl font-semibold">
              {plan.duration}
            </div>
          </div>
        ))}
      </div>

      {/* Premium Features */}
      <div className="bg-white border border-gray-500 rounded-lg shadow-md w-full md:w-[500px] mx-auto mt-10 p-6">
        <h3 className="text-lg font-semibold mb-4">Premium Features</h3>
        <ul className="space-y-3 text-left">
          <li className="flex items-center gap-2 text-gray-700">
            <img src={CheckIcon} alt="check" className="w-5 h-5" /> Priority
            customer support
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <img src={CheckIcon} alt="check" className="w-5 h-5" /> Unlimited
            task postings
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <img src={CheckIcon} alt="check" className="w-5 h-5" /> No service
            fees
          </li>
          <li className="flex items-center gap-2 text-gray-700">
            <img src={CheckIcon} alt="check" className="w-5 h-5" /> Access to
            premium features and exclusive offers
          </li>
        </ul>
      </div>

      {/* Purchase Button */}
      <div className="text-center mt-6 mb-10">
        <button
          className="bg-[#228B22] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 disabled:opacity-50"
          disabled={!selectedPlan}
        >
          {selectedPlan ? "Purchase Plan" : "Select a Plan"}
        </button>
        <p className="mt-3 text-gray-500 text-sm cursor-pointer">Not Now</p>
      </div>
      <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={Gardening}
          alt="Gardening illustration"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
        />
      </div>
      <div className="mt-10">
      <Footer />
      </div>
    </>
  );
}
