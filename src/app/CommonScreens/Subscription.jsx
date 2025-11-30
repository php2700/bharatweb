import React, { useState } from "react";
import { useEffect } from "react";
import CheckIcon from "../../assets/Subscription/tick.svg";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [subscriptionError, setSubscriptionError] = useState("");
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const color = [
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

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.get(`${BASE_URL}/subscription/user/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      console.log("Subscription API response:", data);

      if (data.status) {
        if (Array.isArray(data?.data) && data.data?.length > 0) {
          setPlans(data.data);
        } else {
          setPlans([]);
          setSubscriptionError("No subscription plans available");
        }
      } else {
        const errorMessage =
          data.message || `HTTP error ${res.status}: ${res.statusText}`;
        console.error("Failed to fetch subscription plans:", errorMessage);
        setSubscriptionError(errorMessage);
      }
    } catch (err) {
      console.error("Error fetching subscription plans:", err.message);
      setSubscriptionError(err.message);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const buyPlan = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) throw new Error("No authentication token found");

      const selectedPlanData = plans.find((plan) => plan._id === selectedPlan);

      if (!selectedPlanData) throw new Error("Please select a valid plan");

      console.log("gggggggggg", selectedPlanData);
      const res = await axios.post(
        `${BASE_URL}/emergency-order/create-razorpay-order`,
        {
          amount: selectedPlanData?.price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      console.log(data?.razorOrder, "ggggggg");
      if (!data?.razorOrder) throw new Error("Failed to create Razorpay order");

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorOrder?.amount,
        currency: "INR",
        name: "Bharat Subscription Plan",
        order_id: data.razorOrder?.id,

        handler: async function (response) {
          try {
            await axios.post(
              `${BASE_URL}/subscription/user/buy`,
              {
                planId: selectedPlanData._id,
                transactionId: response.razorpay_payment_id,
                endDate: "2025-11-23",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            toast.success("plan purchased successfully", {
              position: "top-right",
            });
          } catch (error) {
            console.error("Payment verification failed:", error);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#228B22",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error.message);
      // alert("Payment failed. Please try again.");
    }
  };

  if (subscriptionLoading)
    return <p className="text-center mt-10">Loading plans...</p>;
  if (subscriptionError)
    return (
      <p className="text-center mt-10 text-red-500">{subscriptionError}</p>
    );

  const selectedPlanData = plans.find((plan) => plan._id === selectedPlan);

  return (
    <>
      {/* Premium Section */}
      <div className="text-center mt-6">
        <h2 className="text-xl font-bold">Get Premium Access</h2>
        <p className="text-gray-600 mt-1">Premium Plans</p>
      </div>

      {/* Plans */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
        {plans.map((plan, index) => (
          <div
            key={plan._id}
            onClick={() => setSelectedPlan(plan._id)}
            className={`bg-gradient-to-b ${
              color[index]?.gradient
            } text-white p-6 rounded-xl shadow-lg w-64 h-64 text-center cursor-pointer transition-all duration-300
              ${
                selectedPlan === plan._id
                  ? "ring-7 ring-[#075F66] scale-105"
                  : "hover:scale-105"
              }`}
          >
            <p className="text-4xl font-bold">₹{plan.price}</p>
            <div className="mt-[70px] text-3xl font-semibold">
              {plan.durationInDays} Days
            </div>
            <p className="text-3xl font-semibold mt-3">{plan.name}</p>
          </div>
        ))}
      </div>

      {/* Premium Features */}
      {selectedPlanData && (
        <div className="bg-white border border-gray-500 rounded-lg shadow-md w-full md:w-[500px] mx-auto mt-10 p-6">
          <h3 className="text-lg font-semibold mb-4">Premium Features</h3>
          <ul className="space-y-3 text-left">
            <>
              {/* <li className="flex items-center gap-2 text-gray-700">
                <img src={CheckIcon} alt="check" className="w-5 h-5" />{" "}
                noCommissionTasksPerMonth :
                {selectedPlanData.noCommissionTasksPerMonth}
              </li> */}
              <li className="flex items-center gap-2 text-gray-700">
                <img src={CheckIcon} alt="check" className="w-5 h-5" /> Total
                Task Hires Limit : {selectedPlanData?.totalTaskHiresLimit}
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <img src={CheckIcon} alt="check" className="w-5 h-5" />{" "}
                Emergency Task Limit : {selectedPlanData?.emergencyTaskLimit}
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <img src={CheckIcon} alt="check" className="w-5 h-5" />{" "}
                Commission Inside Limit :{" "}
                {selectedPlanData?.commissionInsideLimit}
              </li>
            </>
          </ul>
        </div>
      )}
      {/* Purchase Button */}
      <div className="text-center mt-6 mb-10">
        <button
          className="bg-[#228B22] text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 disabled:opacity-50"
          disabled={!selectedPlan}
          onClick={buyPlan}
        >
          {selectedPlan ? "Purchase Plan" : "Select a Plan"}
        </button>
        
      </div>
    </>
  );
}
