// Accepted.jsx
import React, { useState } from "react";
import Profile from "../../../assets/ViewProfile/Worker.png";
import Call from "../../../assets/ViewProfile/call.svg";
import Message from "../../../assets/ViewProfile/msg.svg";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Accepted({
  serviceProvider,
  assignedWorker,
  paymentHistory,
  orderId,
  hireStatus,
}) {
  if (!serviceProvider && !assignedWorker) {
    return null; // Don't render if no data is available
  }
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false); // toggle form

  const handlePay = async (paymentId) => {
  try {
    const token = localStorage.getItem("bharat_token");

    const response = await axios.post(
      `${BASE_URL}/emergency-order/user/request-release/${orderId}/${paymentId}`,
      {}, // empty body (if API doesn’t need one)
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      alert("Payment successful!");
      // refresh payments if needed
    } else {
      alert("Payment failed, please try again.");
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert(error.response?.data?.message || "Something went wrong while processing payment.");
  }
};



  const handlePaymentSubmit = async () => {
    if (!description || !amount) {
      alert("Please enter both description and amount!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/emergency-order/addPaymentStage/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
          },
          body: JSON.stringify({
            description,
            amount,
          }),
        }
      );
      console.log("Payment Response:", response);

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      await response.json();

      // reset form
      setDescription("");
      setAmount("");
      setShowForm(false);

      alert("Payment created successfully!");
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Something went wrong while creating payment.");
    }
  };

  const handleCancel = () => {
    setDescription("");
    setAmount("");
    setShowForm(false); // hide form on cancel
    alert("Form cleared!");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-lg font-semibold mb-4">Order Details</h2>

      {/* Service Provider Details */}
      {serviceProvider && (
        <div className="bg-gray-100 border border-[#228B22] p-4 rounded-lg mb-4">
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <img
              src={serviceProvider.profile_pic || Profile}
              alt={`Profile of ${serviceProvider.full_name || "Worker"}`}
              className="w-16 h-16 rounded-full object-cover"
            />

            {/* Name */}
            <div className="flex items-center w-full">
              {/* Worker name */}
              <p className="text-lg font-semibold">
                {serviceProvider.full_name || "Unknown Worker"}
              </p>

              {/* Call & Message icons (hide if completed) */}
              {hireStatus !== "completed" && (
                <div className="flex items-center space-x-3 ml-6">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer">
                    <img src={Call} alt="Call" className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer">
                    <img src={Message} alt="Message" className="w-5 h-5" />
                  </div>
                </div>
              )}

              {/* View Profile button — pushed to right corner */}
              <button className="ml-auto px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-50">
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assigned Worker Details */}
      {assignedWorker && (
        <div className="mb-4">
          {/* Heading outside the gray box */}
          <h3 className="text-base font-semibold mb-2">Assigned Person</h3>

          {/* Gray container only for worker details */}
          <div className="border border-[#228B22] bg-[#F5F5F5] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              {/* Worker Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={assignedWorker.image || Profile}
                  alt={`Profile of ${assignedWorker.name || "Worker"}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">
                    {assignedWorker.name || "Unknown Worker"}
                  </p>
                </div>
              </div>

              {/* View Profile Button aligned right */}
              <button className="px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-50">
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      {paymentHistory && Array.isArray(paymentHistory) && (
        <div className="bg-[#F5F5F5] border border-[#228B22] rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Payment Summary</h3>
            {hireStatus !== "completed" && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#228B22] text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Create Payment
              </button>
            )}
          </div>

          {/* Payment List */}
          {paymentHistory.map((payment, index) => (
            <div
              key={payment._id}
              className="flex items-center justify-between bg-white border-4 border-[#F5F5F5] py-3 first:border-t-0 w-full"
            >
              {/* Index & Description */}
              <div className="flex items-center space-x-5">
                <span className="font-semibold">{index + 1}.</span>
                <span>{payment.description || "Starting Payment"}</span>
              </div>

              {/* Status */}
              <div className="mx-2">
                {(payment.status === "success"  && payment.release_status==="pending") && (
                  <button
                    onClick={() => handlePay(payment._id)}
                    className="bg-[#228B22] text-white px-4 py-1 rounded-md hover:bg-green-700"
                  >
                    Pay
                  </button>
                )}

                {payment.release_status === "release_requested" && (
                  <span className="text-yellow-600 font-semibold">
                    Requested
                  </span>
                )}

                {payment.release_status === "released" && (
                  <span className="text-[#228B22] font-semibold">Paid</span>
                )}

                {payment.release_status === "refunded" && (
                  <span className="text-blue-600 font-semibold">Refunded</span>
                )}
              </div>

              {/* Amount */}
              <div className="font-semibold">₹{payment.amount}</div>
            </div>
          ))}

          {/* Add Payment Form (only show when Create Payment is clicked) */}
          {showForm && (
            <>
              <div className="flex items-center space-x-4 border-t border-gray-200 pt-4 mt-4">
                <span className="font-semibold">
                  {paymentHistory.length + 1}
                </span>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  className="flex-1 border border-[#228B22] bg-[#228B22]/20 px-3 py-2 placeholder:text-black rounded-md outline-none focus:ring-2 focus:ring-[#228B22]"
                />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Amount"
                  className="w-40 border border-[#228B22] bg-[#228B22]/20 px-3 py-2 placeholder:text-black rounded-md outline-none focus:ring-2 focus:ring-[#228B22]"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handlePaymentSubmit}
                  className="bg-[#228B22] text-white px-4 py-1 rounded-md hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  onClick={handleCancel}
                  className="border border-[#228B22] text-[#228B22] px-4 py-1 rounded-md hover:bg-green-50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
