import React, { useState, useEffect } from "react";
import Profile from "../../../assets/default-image.jpg";
import Call from "../../../assets/ViewProfile/call.svg";
import Message from "../../../assets/ViewProfile/msg.svg";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Accepted({
  serviceProvider,
  assignedWorker,
  paymentHistory,
  fullPaymentHistory,
  orderId,
  hireStatus,
  user_id,
}) {
  if (!serviceProvider && !assignedWorker) {
    return null; // Don't render if no data is available
  }
  if (!fullPaymentHistory) return null;

  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      toast.error("Failed to load Razorpay SDK. Please try again.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Create order by calling backend API
  const createOrder = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      const totalAmount = parseFloat(amount) + parseFloat(amount) * 0.02; // Calculate total (amount + tax)
      const response = await axios.post(
        `${BASE_URL}/emergency-order/create-razorpay-order`,
        { amount: totalAmount }, // Send total amount to Razorpay
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("razor", response);
      // console.log("razor", response.status);
      if (response.status === 200) {
        console.log("razor", response.data.razorOrder);
        return response.data.razorOrder; // Assuming backend returns Razorpay order details
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
      return null;
    }
  };

  // Add payment stage (ONLINE)
  const addPaymentStage = async (paymentId) => {
    try {
      const payload = {
        amount: parseFloat(amount),
        tax: parseFloat(amount) * 0.02,
        payment_id: paymentId,
        description,
        method: "online",
        status: "success",
      };

      const response = await fetch(
        `${BASE_URL}/direct-order/order/payment-stage/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to add payment stage");

      toast.success("✅ Online payment processed successfully!");
      window.location.reload();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding payment stage:", error);
      toast.error("Something went wrong while processing online payment.");
    }
  };

  // Add payment method (COD)
  const addPaymentMethod = async () => {
    try {
      const payload = {
        amount: parseFloat(amount),
        tax: parseFloat(amount) * 0.09,
        description,
        method: "cod",
        status: "success",
        collected_by: serviceProvider?.full_name || "Unknown",
      };

      const response = await fetch(
        `${BASE_URL}/direct-order/order/payment-stage/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json(); // 👈 always parse the response body

      if (!response.ok) {
        throw new Error(data.message || "Failed to add COD payment stage");
      }

      toast.success("✅ COD payment added successfully!");
      window.location.reload();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding COD payment:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  // Handle payment release
  // const handlePay = async (paymentId) => {
  //   try {
  //     const token = localStorage.getItem("bharat_token");
  //     const response = await axios.post(
  //       `${BASE_URL}/direct-order/user/request-release/${orderId}/${paymentId}`,
  //       {},
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success("Payment release requested successfully!");
  //       window.location.reload();
  //     } else {
  //       toast.error("Payment release request failed, please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Payment release error:", error);
  //     toast.error(
  //       error.response?.data?.message ||
  //         "Something went wrong while requesting payment release."
  //     );
  //   }
  // };

  const handlePay = async (paymentId) => {
    // Step 1️⃣: Show confirmation alert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to release this payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Pay Now",
      cancelButtonText: "Cancel",
    });

    // Step 2️⃣: Only continue if user clicks "Yes"
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("bharat_token");

        const response = await axios.post(
          `${BASE_URL}/direct-order/user/request-release/${orderId}/${paymentId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "Payment Released",
            text: "Payment release requested successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
          window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Payment release request failed, please try again.",
          });
        }
      } catch (error) {
        console.error("Payment release error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "Something went wrong while requesting payment release.",
        });
      }
    } else {
      // Optional: user cancelled
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "Payment release was cancelled.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Handle form submission
  const handlePaymentSubmit = async () => {
    if (!description || !amount || parseFloat(amount) <= 0 || !paymentMethod) {
      toast.error("Please fill in all fields with valid values!");
      return;
    }

    if (paymentMethod === "online") {
      // Step 1: Create Razorpay order
      const order = await createOrder();
      if (!order) return;

      if (!razorpayLoaded) {
        toast.error("Razorpay SDK not loaded. Please try again.");
        return;
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "The bharatapp",
        description,
        order_id: order.id,
        handler: async function (response) {
          console.log("✅ Payment success:", response);
          await addPaymentStage(response.razorpay_payment_id);
        },
        theme: { color: "#1eb20eff" },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        console.error("❌ Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
      });

      rzp1.open();
    } else if (paymentMethod === "cod") {
      await addPaymentMethod();
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    setDescription("");
    setAmount("");
    setPaymentMethod("");
    setShowForm(false);
    toast.info("Form cleared!");
  };

  const handleRouteHire = (ProviderId, isHired) => {
    navigate(`/profile-details/${ProviderId}/direct`, {
      state: {
        hire_status: hireStatus,
        isHired,
      },
    });
  };

  const handleChatOpen = (receiverId, senderId) => {
    // Save receiverId in localStorage
    localStorage.setItem("receiverId", receiverId);
    localStorage.setItem("senderId", senderId);
    // Redirect to chat page
    navigate("/chats");
  };
  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <h2 className="text-lg font-semibold mb-4">Hired Worker</h2>

        <p className="font-bold mb-3 text-gray-900">
          Note:&nbsp;
          <span className="text-sm text-red-600 font-semibold">
            Pay securely — no extra charges from the platform. Choose simple and safe transactions.
          </span>
        </p>

      {serviceProvider && (
  <div className="bg-gray-100 border border-[#228B22] p-4 rounded-lg mb-4">

    {/* Outer Wrapper – Mobile = Column / Desktop = Row */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">

      {/* Profile Image */}
      <img
        src={serviceProvider.profile_pic || Profile}
        alt={`Profile of ${serviceProvider.full_name || "Worker"}`}
        className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover mx-auto sm:mx-0"
      />

      {/* Right Side Section */}
      <div className="flex flex-col sm:flex-row sm:items-center w-full gap-3">

        {/* Name + ID (aligned center on mobile) */}
        <p className="text-lg font-semibold text-center sm:text-left">
          {serviceProvider.full_name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") || "Unknown Worker"}
          <span> ({serviceProvider.unique_id})</span>
        </p>

        {/* Icons — Hide if cancelled */}
        {(hireStatus === "cancelled" || hireStatus === "cancelledDispute") ? (
          ""
        ) : (
          <div className="flex items-center space-x-3 justify-center sm:justify-start sm:ml-auto">

            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer">
              <img src={Call} alt="Call" className="w-5 h-5" />
            </div>

            <div
              className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer"
              onClick={() => handleChatOpen(serviceProvider._id, user_id)}
            >
              <img src={Message} alt="Message" className="w-5 h-5" />
            </div>

          </div>
        )}

        {/* View Profile Button */}
        <button
          className="w-full sm:w-auto sm:ml-auto px-6 py-2 border border-[#228B22] 
                     text-[#228B22] bg-white rounded-lg font-semibold 
                     hover:bg-green-50 cursor-pointer text-center"
          onClick={() => handleRouteHire(serviceProvider._id, true)}
        >
          View Profile
        </button>
      </div>
    </div>
  </div>
)}


        {assignedWorker && (
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-2">Assigned Person</h3>

            <div className="border border-[#228B22] bg-[#F5F5F5] p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div className="flex items-center space-x-4">
                  <img
                    src={assignedWorker.image || Profile}
                    alt={`Profile of ${assignedWorker.name || "Worker"}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold">
                      {assignedWorker.name
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ") || "Unknown Worker"}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/view-worker/${assignedWorker._id}`}
                  className="px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-50 w-full sm:w-auto text-center"
                >
                  View Profile
                </Link>

              </div>
            </div>
          </div>
        )}

         {paymentHistory && Array.isArray(paymentHistory) && (
                  <div className="bg-[#F5F5F5] border border-[#228B22] rounded-lg shadow p-4">
        
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-3">
                      <h3 className="text-lg font-semibold">Payment Summary</h3>
        
                      <div className="flex flex-wrap items-center gap-3">
                        {hireStatus == "accepted" && (
                          <button
                            onClick={() => setShowForm(true)}
                            className="bg-[#228B22] text-white px-4 py-2 rounded-md hover:bg-green-700 w-fit"
                          >
                            Create Payment
                          </button>
                        )}
                      </div>
                    </div>
        
                    {/* PAYMENT LIST (TABLE STYLE MOBILE) */}
                    {paymentHistory.map((payment, index) => (
                      <div
                        key={payment._id}
                        className="
                  border border-gray-300 bg-white rounded-lg p-4 mb-4 
                  flex flex-col gap-3 md:grid md:grid-cols-12 md:items-center
                "
                      >
        
                        {/* ⭐ MOBILE TOP TEXT */}
                        <div className="md:hidden">
                          <div className="font-semibold text-base">
                            {index + 1}. {payment.description || "Starting Payment"}
                          </div>
                        </div>
        
                        {/* DESKTOP LEFT */}
                        <div className="hidden md:flex md:col-span-4 gap-3 items-center">
                          {/* <span className="font-semibold">{index + 1}.</span> */}
                          <span className="text-sm md:text-base">
                            {payment.description || "Starting Payment"}
                          </span>
                        </div>
        
                        {/* ⭐ MOBILE MIDDLE — STATUS + INFO + ACTIONS */}
                        <div className="md:hidden flex flex-col gap-2">
        
                          {/* Status */}
                          <div className="font-medium text-sm">
                            {payment.status === "success" &&
                              payment.release_status === "pending" && (
                                <span className="text-[#228B22] font-semibold">Waiting for Approval</span>
                              )}
        
                            {payment.release_status === "release_requested" && (
                              <span className="text-[#228B22] font-semibold">Paid</span>
                            )}
        
                            {payment.release_status === "released" && (
                              <span className="text-[#228B22] font-semibold">Paid</span>
                            )}
        
                            {payment.release_status === "rejected" && (
                              <span className="text-red-600 font-semibold">Admin Rejected</span>
                            )}
                          </div>
        
                          {/* Buttons Row */}
                          <div className="flex items-center gap-3">
        
                            {/* Pay Button */}
                            {payment.status === "success" &&
                              payment.release_status === "pending" &&
                              hireStatus === "accepted" && (
                                <button
                                  onClick={() => handlePay(payment._id)}
                                  className="bg-[#228B22] text-white px-4 py-1 rounded-md text-xs hover:bg-green-700"
                                >
                                  Pay
                                </button>
                              )}
        
                            {/* Info button */}
                            <button
                              onClick={() => {
                                Swal.fire({
                                  title: `<span style="font-size:18px; font-weight:600; color:#228B22;">Payment Details</span>`,
                                  html: `
            <div style="max-width:100%; margin:auto;">
              <table style="width:100%; border-collapse: collapse; font-size:13px;">
                <thead>
                  <tr style="background-color:#228B22; color:white; font-size:14px;">
                    <th style="padding:8px;">Payment ID</th>
                    <th style="padding:8px;">Amount</th>
                    <th style="padding:8px;">Method</th>
                  </tr>
                </thead>
                <tbody>
                  ${paymentHistory
                                      .map(
                                        (p) => `
                      <tr style="background:#f9f9f9;">
                        <td style="padding:8px; border-bottom:1px solid #ddd;">${p.payment_id || "N/A"}</td>
                        <td style="padding:8px; border-bottom:1px solid #ddd;">${p.amount}</td>
                        <td style="padding:8px; border-bottom:1px solid #ddd;">${p.method || "N/A"}</td>
                      </tr>`
                                      )
                                      .join("")}
                </tbody>
              </table>
            </div>
          `,
                                  width: 380, // 🔥 Smaller Container for cleaner UI
                                  padding: "12px",
                                  background: "white",
                                  showConfirmButton: true,
                                  confirmButtonText: "Close",
                                  confirmButtonColor: "#228B22",
                                });
        
                              }}
                              className="bg-indigo-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-indigo-400"
                            >
                              Info
                            </button>
                          </div>
                        </div>
        
                        {/* ⭐ MOBILE BOTTOM — AMOUNT */}
                        <div className="md:hidden font-semibold text-lg">
                          ₹{payment.amount}
                        </div>
        
                        {/* ⭐ DESKTOP MIDDLE */}
                        <div className="hidden md:flex md:col-span-5 items-center gap-3">
        
                          {payment.status === "success" && payment.release_status === "pending" && (
                            <span className="text-[#228B22] font-semibold text-sm">Waiting for Approval</span>
                          )}
        
                          {(payment.release_status === "release_requested" ||
                            payment.release_status === "released") && (
                              <span className="text-[#228B22] font-semibold text-sm">Paid</span>
                            )}
        
                          {payment.release_status === "rejected" && (
                            <span className="text-red-600 font-semibold text-sm">Admin Rejected</span>
                          )}
        
                          {/* Pay Button */}
                          {payment.status === "success" &&
                            payment.release_status === "pending" &&
                            hireStatus === "accepted" && (
                              <button
                                onClick={() => handlePay(payment._id)}
                                className="bg-[#228B22] text-white px-4 py-1 rounded-md text-sm hover:bg-green-700"
                              >
                                Pay
                              </button>
                            )}
        
                          {/* Info button */}
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: "Payment Details",
                                html: `
                          <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                            <thead>
                              <tr style="background-color:#228B22; color:white;">
                                <th style="padding:8px; border:1px solid #ddd;">Payment ID</th>
                                <th style="padding:8px; border:1px solid #ddd;">Amount</th>
                                <th style="padding:8px; border:1px solid #ddd;">Method</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${paymentHistory
                                    .map(
                                      (p) => `
                                  <tr>
                                    <td style="padding:8px; border:1px solid #ddd;">${p.payment_id || "N/A"}</td>
                                    <td style="padding:8px; border:1px solid #ddd;">${p.amount}</td>
                                    <td style="padding:8px; border:1px solid #ddd;">${p.method || "N/A"}</td>
                                  </tr>`
                                    )
                                    .join("")}
                            </tbody>
                          </table>
                        `,
                                width: 600,
                                background: "white",
                              });
                            }}
                            className="bg-indigo-500 text-white px-3 py-1 rounded-md font-medium text-sm hover:bg-indigo-400"
                          >
                            Info
                          </button>
                        </div>
        
                        {/* DESKTOP RIGHT — AMOUNT */}
                        <div className="hidden md:block md:col-span-3 text-right font-semibold text-base">
                          ₹{payment.amount}
                        </div>
        
                      </div>
                    ))}
        
                    {/* ADD PAYMENT FORM — SAME (untouched) */}
                    {showForm && (
                      <>
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4 border-t border-gray-200 pt-4 mt-4">
        
                          {/* <span className="font-semibold">{paymentHistory.length + 1}</span> */}
        
                          <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter payment description"
                            className="w-full md:w-40 border border-[#228B22] bg-[#228B22]/20 px-3 py-2 rounded-md outline-none"
                          />
        
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full md:w-40 border border-[#228B22] bg-[#228B22]/20 px-3 py-2 rounded-md outline-none"
                          />
        
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full md:w-40 border border-[#228B22] bg-[#228B22]/20 px-3 py-2 rounded-md outline-none"
                          >
                            <option value="" disabled>Select payment method</option>
                            <option value="online">Online</option>
                            <option value="cod">Cash on Delivery</option>
                          </select>
                        </div>
        
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                          <button
                            onClick={handlePaymentSubmit}
                            className="bg-[#228B22] text-white px-4 py-1 rounded-md hover:bg-green-700 w-full sm:w-auto"
                          >
                            Submit
                          </button>
                          <button
                            onClick={handleCancel}
                            className="border border-[#228B22] text-[#228B22] px-4 py-1 rounded-md hover:bg-green-50 w-full sm:w-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
        
                  </div>
                )}
      </div>

      <div className="p-4 bg-white shadow-md rounded-lg mt-10">
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead style={{ backgroundColor: "#228B22", color: "white" }}>
            <tr>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Total Amount Paid</td>
              <td className="border p-2">₹{fullPaymentHistory.amount}</td>
            </tr>
            <tr>
              <td className="border p-2">Pending with App</td>
              <td className="border p-2">
                ₹{paymentHistory
                  .filter((p) =>
                    ["pending"].includes(p.release_status)
                  )
                  .reduce((sum, p) => sum + p.amount, 0)}
              </td>
            </tr>
            <tr>
              <td className="border p-2">Paid to Worker</td>
              <td className="border p-2">
                ₹
                {paymentHistory
                  .filter((p) =>
                    ["release_requested", "released"].includes(p.release_status)
                  )
                  .reduce((sum, p) => sum + p.amount, 0)}
              </td>
              {/* <td className="border p-2">₹{fullPaymentHistory.platform_fee}</td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
