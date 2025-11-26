import React, { useState, useEffect } from "react";
import Profile from "../../../assets/ViewProfile/Worker.png";
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
  orderId,
  hireStatus,
  fullPaymentHistory,
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
      const totalAmount = parseFloat(amount) + parseFloat(amount) * 0.09; // Calculate total (amount + tax)
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
      console.log("razor", response);
      console.log("razor", response.status);
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
        tax: parseFloat(amount) * 0.09,
        payment_id: paymentId,
        description,
        method: "online",
        status: "success",
      };

      const response = await fetch(
        `${BASE_URL}/bidding-order/addPaymentStage/${orderId}`,
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
        `${BASE_URL}/bidding-order/addPaymentStage/${orderId}`,
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
  //       `${BASE_URL}/bidding-order/user/request-release/${orderId}/${paymentId}`,
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
  // 			window.location.reload();
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
          `${BASE_URL}/bidding-order/user/request-release/${orderId}/${paymentId}`,
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
        {/* Add ToastContainer to render toasts */}
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

        {/* Service Provider Details */}
        {serviceProvider && (
          <div className="bg-gray-100 border border-[#228B22] p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={serviceProvider.profile_pic || Profile}
                alt={`Profile of ${serviceProvider.full_name || "Worker"}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex items-center w-full">
                <p className="text-lg font-semibold">
                  {serviceProvider.full_name || "Unknown Worker"}
                </p>

                <div className="flex ml-auto items-center space-x-3 ml-6">
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

                <button
                  className="ml-auto px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/profile-details/${serviceProvider._id}/bidding`)
                  }
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Worker Details */}
        {assignedWorker && (
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-2">Assigned Person</h3>
            <div className="border border-[#228B22] bg-[#F5F5F5] p-4 rounded-lg">
              <div className="flex items-center justify-between">
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
                <Link
                  to={`/view-worker/${assignedWorker._id}`}
                  className="px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-50"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        {paymentHistory && Array.isArray(paymentHistory) && (
  <div className="bg-[#F5F5F5] border border-[#228B22] rounded-lg shadow p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Payment Summary</h3>

      <div className="flex items-center gap-3">
        {/* Create Payment Button */}
        {hireStatus == "accepted" && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#228B22] text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Create Payment
          </button>
        )}

        {/* NEW – View Payment Details Button */}
        
      </div>
    </div>

    {/* Existing Payment List Logic - untouched */}
    {paymentHistory.map((payment, index) => (
      <div
        key={payment._id}
        className="grid grid-cols-12 items-center bg-white border-b border-gray-200 py-4 px-3"
      >
        <div className="col-span-5 flex items-center gap-4">
          <span className="font-semibold">{index + 1}.</span>
          <span>{payment.description || "Starting Payment"}</span>
        </div>

        <div className="col-span-4 text-center">
          {payment.status === "success" &&
            payment.release_status === "pending" && (
              <>
                <span className="text-[#228B22] me-2 font-semibold">
                  Waiting for Approval
                </span>

                {hireStatus === "accepted" && (
                  <button
                    onClick={() => handlePay(payment._id)}
                    className="bg-[#228B22] text-white px-4 py-1 rounded-md hover:bg-green-700"
                  >
                    Pay
                  </button>
                )}
              </>
            )}
            <button
          onClick={() => {
            Swal.fire({
              title: "Payment Details",
              html: `
                <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                  <thead>
                    <tr style="background-color:#228B22; color:white;">
                      <th style="padding:8px; border:1px solid #ddd; text-align:left;">Payment ID</th>
                      <th style="padding:8px; border:1px solid #ddd; text-align:left;">Amount</th>
                      <th style="padding:8px; border:1px solid #ddd; text-align:left;">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${paymentHistory
                      .map(
                        (p) => `
                          <tr>
                            <td style="padding:8px; border:1px solid #ddd;">${p.payment_id || "N/A"}</td>
                            <td style="padding:8px; border:1px solid #ddd;">${p.amount}</td>
                            <td style="padding:8px; border:1px solid #ddd; text-transform:capitalize;">
                              ${p.method || "N/A"}
                            </td>
                          </tr>
                        `
                      )
                      .join("")}
                  </tbody>
                </table>
              `,
              confirmButtonText: "Close",
              width: 600,
              backdrop: `rgba(0,0,0,0.4) blur(6px)`,
              background: "white",
            });
          }}
          className="bg-indigo-500 text-white px-3 py-1 rounded-md font-medium 
            hover:bg-indigo-400 border border-indigo-600 
            ml-[-16px] cursor-pointer inline-flex items-center"

        >
          info
        </button>
          {payment.release_status === "release_requested" && (
            <span className="text-[#228B22] font-semibold px-6 py-2">Paid</span>
          )}
          
          {payment.release_status === "released" && (
            <span className="text-[#228B22] font-semibold px-6 py-2">Paid</span>
          )}

          {payment.release_status === "rejected" && (
            <span className="text-red-600 font-semibold">Admin Rejected</span>
          )}
        </div>

        <div className="col-span-3 text-right font-semibold pr-3">
          ₹{payment.amount}
        </div>
      </div>
    ))}

    {/* Form logic untouched */}
    {showForm && (
      <>
        {/* .... your add payment form code .... */}
      </>
    )}
  </div>
)}

      </div>
    </>
  );
}
