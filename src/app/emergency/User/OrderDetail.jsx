import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Profile from "../../../assets/ViewProfile/Worker.png";
import Warning from "../../../assets/ViewProfile/warning.svg";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Search from "../../../assets/search-normal.svg";
import Accepted from "./Accepted";
import ReviewModal from "../../CommonScreens/ReviewModal";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OrderReviewModal from "../../CommonScreens/OrderReviewModal";
import workImage from "../../../assets/workcategory/image.png";
import { FaMapMarkerAlt } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHired, setIsHired] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [assignData, setAssignData] = useState();
  const [showOrderReviewModal, setShowOrderReviewModal] = useState(false);
	const [showRefundModal, setShowRefundModal] = useState(false);
	const [refundReason, setRefundReason] = useState("");
  const token = localStorage.getItem("bharat_token");

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${BASE_URL}/banner/getAllBannerImages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        if (
          Array.isArray(response?.data?.images) &&
          response.data.images?.length > 0
        ) {
          setBannerImages(response.data?.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch banner images";
        console.error("Failed to fetch banner images:", errorMessage);
        setBannerError(errorMessage);
      }
    } catch (err) {
      console.error("Error fetching banner images:", err.message);
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("bharat_token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [orderResponse, providersResponse] = await Promise.all([
        axios.get(`${BASE_URL}/emergency-order/getEmergencyOrder/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        orderData?.hire_status === "pending"
          ? axios.get(
              `${BASE_URL}/emergency-order/getAcceptedServiceProviders/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          : { data: { providers: [] } }, // Skip provider fetch if not pending
      ]);
      console.log("Order Response:", orderResponse.data);
      console.log("Providers Response:", providersResponse.data);
      setAssignedWorker(orderResponse.data.assignedWorker || null);
      setOrderData(orderResponse.data.data);
      setServiceProviders(providersResponse.data.providers || []);
      setIsHired(!!orderResponse.data.data?.service_provider_id);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, orderData?.hire_status]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  console.log(orderData, "gggggggg");

  // const handleHire = async (providerId) => {
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/emergency-order/assignEmergencyOrder/${id}`,
  //       {
  //         service_provider_id: providerId,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
  //         },
  //       }
  //     );
  //     console.log("Hire Response:", response.data);
  //     setIsHired(true);
  //     setServiceProviders([]);
  //     // Refresh order data after hiring
  //     const orderResponse = await axios.get(
  //       `${BASE_URL}/emergency-order/getEmergencyOrder/${id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
  //         },
  //       }
  //     );
  //     setOrderData(orderResponse.data.data);
  //     setAssignedWorker(orderResponse.data.assignedWorker || null);
  //   } catch (err) {
  //     setError("Failed to hire provider. Please try again later.");
  //     console.error("Error:", err);
  //   }
  // };

  const handleHire = async (providerId) => {
    setIsSubmitting(true);
    setError("");

    try {
      const assignRes = await axios.post(
        `${BASE_URL}/emergency-order/assignEmergencyOrder/${id}`,
        {
          service_provider_id: providerId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
          },
        }
      );

      console.log("Assign Response:", assignRes.data);
      const { razorpay_order } = assignRes.data?.data;
      if (!razorpay_order) {
        throw new Error("Razorpay order not received from backend");
      }
      // 2️⃣ Configure Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpay_order.amount,
        currency: "INR",
        name: "Bharat App",
        description: "Emergency Hiring Payment",
        order_id: razorpay_order.id,
        theme: { color: "#228B22" },

        handler: async function (paymentResponse) {
          try {
            console.log(paymentResponse, "paymentres");
            const verifyRes = await axios.post(
              `${BASE_URL}/emergency-order/verify-platform-payment`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "bharat_token"
                  )}`,
                },
              }
            );

            console.log("Verify Response:", verifyRes.data);

            if (verifyRes.status === 200) {
              // 4️⃣ Payment verified successfully → refresh order data
              const orderResponse = await axios.get(
                `${BASE_URL}/emergency-order/getEmergencyOrder/${id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                      "bharat_token"
                    )}`,
                  },
                }
              );

              setOrderData(orderResponse.data.data);
              setAssignedWorker(orderResponse.data.assignedWorker || null);
              setIsHired(true);
              setServiceProviders([]);

              // navigate(`/my-hire/order-detail/${verifyRes.data?.order?._id}`);
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            setError("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "Rahul",
          email: "rahul@example.com",
          contact: "9999999999",
        },
      };

      // 5️⃣ Open Razorpay payment window
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError("Razorpay SDK not loaded. Please refresh the page.");
      }
    } catch (err) {
      console.error("Error during hire:", err);
      setError("Failed to assign provider. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const razorpay_order = {
        amount: orderData?.platform_fee,
        id: orderData?.razorOrderIdPlatform,
      };
      if (!razorpay_order) {
        throw new Error("Razorpay order not received from backend");
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpay_order.amount,
        currency: "INR",
        name: "Bharat App",
        description: "Emergency Hiring Payment",
        order_id: razorpay_order.id,
        theme: { color: "#228B22" },

        handler: async function (paymentResponse) {
          try {
            console.log(paymentResponse, "paymentres");
            const verifyRes = await axios.post(
              `${BASE_URL}/emergency-order/verify-platform-payment`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "bharat_token"
                  )}`,
                },
              }
            );

            console.log("Verify Response:", verifyRes.data);

            if (verifyRes.status === 200) {
              const orderResponse = await axios.get(
                `${BASE_URL}/emergency-order/getEmergencyOrder/${id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                      "bharat_token"
                    )}`,
                  },
                }
              );

              setOrderData(orderResponse.data.data);
              setAssignedWorker(orderResponse.data.assignedWorker || null);
              setIsHired(true);
              setServiceProviders([]);

              // navigate(`/my-hire/order-detail/${verifyRes.data?.order?._id}`);
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            setError("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "Rahul",
          email: "rahul@example.com",
          contact: "9999999999",
        },
      };

      // 5️⃣ Open Razorpay payment window
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError("Razorpay SDK not loaded. Please refresh the page.");
      }
    } catch (err) {
      console.error("Error during hire:", err);
      setError("Failed to assign provider. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("bharat_token");

      const response = await axios.post(
        `${BASE_URL}/emergency-order/completeOrderUser`,
        { order_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Success case
      if (response.status === 200 && response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as complete successfully!",
          confirmButtonColor: "#228B22",
        }).then(() => fetchData()).then(() => {
          setShowCompletedModal(true);
        });
      }
    } catch (err) {
      console.error(err);

      // ❌ Case 1: No payment records exist
      if (
        err.response?.data?.message ===
        "Cannot complete the order because no payment records exist for this order."
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Cannot complete the order because no payment records exist for this order.",
          confirmButtonColor: "#FF0000",
        });
        return;
      }

      // ⚠️ Case 2: Pending payments exist (400 error)
      if (err.response && err.response.status === 400) {
        const { pendingPaymentsCount, message } = err.response.data;

        Swal.fire({
          icon: "error",
          title: `Pending Payments: ${pendingPaymentsCount || 0}`,
          text: message || "You still have pending payments to release.",
          confirmButtonText: "OK",
          confirmButtonColor: "#FF0000",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // ✅ Ask to release all payments
            const confirmRelease = await Swal.fire({
              title: "Release All Payments?",
              text: "Do you want to release all pending payments now?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#228B22",
              cancelButtonColor: "#FF0000",
              confirmButtonText: "Yes, release all",
            });

            if (confirmRelease.isConfirmed) {
              try {
                const releaseResponse = await axios.put(
                  `${BASE_URL}/emergency-order/requestAllPaymentReleases/${id}`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                if (
                  releaseResponse.status === 200 &&
                  releaseResponse.data.status
                ) {
                  Swal.fire({
                    icon: "success",
                    title: "Payments Released!",
                    text: "All pending payments have been successfully released.",
                    confirmButtonColor: "#228B22",
                  }).then(() => fetchData());
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text:
                      releaseResponse.data.message ||
                      "Failed to release payments.",
                    confirmButtonColor: "#FF0000",
                  });
                }
              } catch (releaseErr) {
                console.error(releaseErr);
                Swal.fire({
                  icon: "error",
                  title: "Error!",
                  text: "Something went wrong while releasing payments.",
                  confirmButtonColor: "#FF0000",
                });
              }
            }
          }
        });

        return;
      }

      // 🚫 Case 3: Generic failure
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to mark order as complete. Please try again.",
        confirmButtonColor: "#FF0000",
      });
    }
  };

  const handleConfirmCancel = async () => {
    setShowModal(false);
    try {
      const token = localStorage.getItem("bharat_token");
      await axios.post(
        `${BASE_URL}/emergency-order/cancel`,
        {
          order_id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
    } catch (err) {
      setError("Failed to cancel order. Please try again later.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredProviders = serviceProviders.filter((provider) =>
    provider.full_name?.toLowerCase().includes(searchQuery)
  );

	const showRefundButton =
    orderData?.hire_status === "pending" ||
    (orderData?.hire_status === "accepted" &&
      orderData?.service_payment?.payment_history === 0);

		  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Please enter a reason for refund.",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      const response = await axios.post(
        `${BASE_URL}/emergency-order/request-refund`,
        { orderId: id, reason: refundReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
   console.log("ssds", response)
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Refund request submitted successfully!",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowRefundModal(false);
        setRefundReason("");
        fetchData(); // refresh data after refund
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Refund request failed!",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };	

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-[#FF0000]">{error}</div>
      </div>
    );
  }

  // console.log(orderData, "gggggggggggggg***", filteredProviders);
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <button
          className="flex items-center text-[#228B22] hover:text-green-800 font-semibold"
          onClick={() => navigate(-1)}
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back to work list" />
          Back
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {orderData?.image_urls?.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={false}
              className="w-full h-[360px]"
            >
              {orderData.image_urls.map((url, index) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-[360px] object-cover"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <img
              src={workImage}
              alt="No project images available"
              className="w-full h-[360px] object-cover mt-5"
            />
          )}

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                <span>
                  Category :-{" "}
                  {orderData?.category_id?.name || "Unknown Category"}
                </span>

                <div>
                  Sub Category :-{" "}
                  {orderData?.sub_category_ids
                    .map((sub) => sub.name)
                    .join(", ") || "No Address Provided"}
                  <div className="text-gray-600 flex justify-center items-center px-3 py-1 rounded-full text-sm mt-2 w-fit">
                    {" "}
                    <span>
                      <FaMapMarkerAlt
                        size={25}
                        color="#228B22"
                        className="mr-2"
                      />
                    </span>
                    {orderData?.google_address || "Unknown Location"}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2 tracking-tight">
                <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm block text-center">
                  {orderData?.project_id || "#N/A"}
                </span>
                <span className="text-gray-600 font-semibold block">
                  Posted Date:{" "}
                  {orderData?.createdAt
                    ? new Date(orderData.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <span className="text-gray-600 font-semibold block">
                  Status:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium
      ${orderData?.hire_status === "pending" ? "bg-yellow-500" : ""}
      ${orderData?.hire_status === "cancelled" ? "bg-[#FF0000]" : ""}
      ${orderData?.hire_status === "completed" ? "bg-[#228B22]" : ""}
      ${orderData?.hire_status === "cancelledDispute" ? "bg-[#FF0000]" : ""}
      ${orderData?.hire_status === "assigned" ? "bg-blue-500" : ""}`}
                  >
                    {orderData?.hire_status
                      ? orderData.hire_status
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : "Unknown Status"}
                  </span>
                </span>
								{orderData?.refundRequest && <span className="text-gray-600 font-semibold block">
                 Refund Status:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium
                      ${
                        orderData?.refundStatus === "pending"
                          ? "bg-yellow-500"
                          : ""
                      }
                      ${
                        orderData?.refundStatus === "processed"
                          ? "bg-blue-500"
                          : ""
                      }`}
                  >
                    {orderData?.refundStatus
                      ? orderData.refundStatus
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : "Unknown Status"}
                  </span>
                </span>}
              </div>
            </div>

            <div className="border border-green-600 rounded-lg p-4 mb-4 bg-gray-50">
              <p className="text-gray-700 tracking-tight">
                {orderData?.sub_category_ids
                  ?.map((sub) => sub.name)
                  .join(", ") || "No details available."}
              </p>
            </div>

            {console.log(orderData, "hhhhhhhhhhhhhhhh")}
            <div className="text-center mb-6">
              {orderData?.hire_status === "cancelled" ? (
                <span className="px-8 py-2 bg-[#FF0000] text-white rounded-lg text-lg font-semibold">
                  Cancelled by User
                </span>
              ) : orderData?.hire_status === "completed" ? (
                <div className="flex justify-center gap-4 flex-wrap">
                  {/* ✅ Task Completed */}
                  <span className="px-8 py-2 bg-[#228B22] text-white rounded-lg text-lg font-semibold">
                    Task Completed
                  </span>

                  {/* ✅ Review Buttons */}
                  {orderData?.isReviewedByUser ? (
                    <span
                      className="px-8 py-2 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold cursor-pointer"
                      onClick={() => setShowOrderReviewModal(true)}
                    >
                      See Review
                    </span>
                  ) : (
                    <span
                      className="px-8 py-2 bg-[#FFD700] text-black rounded-lg text-lg font-semibold cursor-pointer"
                      onClick={() => setShowCompletedModal(true)}
                    >
                      Add Review
                    </span>
                  )}
                  <ReviewModal
                    show={showCompletedModal}
                    onClose={() => setShowCompletedModal(false)}
                    service_provider_id={orderData?.service_provider_id._id}
                    orderId={id}
                    type="emergency"
                  />
                  <OrderReviewModal
                    show={showOrderReviewModal}
                    onClose={() => setShowOrderReviewModal(false)}
                    orderId={id}
                    type="emergency"
                  />
                </div>
              ) : orderData?.hire_status == "cancelledDispute" ? (
                <button className="px-8 py-3 bg-[#FF0000] text-white rounded-lg text-lg font-semibold">
                  Cancelled Dispute
                </button>
              ) : orderData?.hire_status !== "assigned" ? (
                <button
                  className="px-8 py-3 bg-[#FF0000] text-white rounded-lg text-lg font-semibold hover:bg-red-700"
                  onClick={() => setShowModal(true)}
                >
                  Cancel Task
                </button>
              ) : null}

             {/* ✅ Show Refund Button */}
              {showRefundButton && (
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="mt-4 ml-4 px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-blue-700"
                >
                  Get Refund
                </button>
              )}
							{orderData?.refundRequest && (
                <button
                  className="mt-4 ml-4 px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-blue-700"
                >
                  {orderData?.refundStatus == "pending" ? "Refund Request Submitted" : "Refunded"}
                </button>
              )}
              {/* ✅ Refund Modal */}
              {showRefundModal && (
                <div className="mt-6 bg-white border border-gray-300 rounded-lg p-6 shadow-md w-full max-w-lg mx-auto">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Request Refund
                  </h2>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Enter your refund reason..."
                    className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowRefundModal(false)}
                      className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRefundRequest}
                      className="px-5 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>

            {(orderData?.hire_status === "assigned" ||
              orderData?.hire_status === "completed" ||
              orderData?.hire_status === "cancelledDispute") &&
              orderData.platform_fee_paid && (
                <>
                  <Accepted
                    serviceProvider={orderData?.service_provider_id}
                    assignedWorker={assignedWorker}
                    paymentHistory={orderData?.service_payment?.payment_history}
                    fullPaymentHistory={orderData?.service_payment}
                    orderId={id}
                    hireStatus={orderData?.hire_status}
                    user_id={orderData?.user_id?._id}
                  />

                  {orderData?.hire_status === "assigned" && (
                    <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                      <div className="relative max-w-2xl mx-auto">
                        <div className="relative z-10">
                          <img
                            src={Warning}
                            alt="Warning"
                            className="w-40 h-40 mx-auto bg-white border border-[#228B22] rounded-lg px-2"
                          />
                        </div>
                        <div className="bg-[#FBFBBA] border border-yellow-300 rounded-lg shadow-md p-4 -mt-20 pt-24 text-center">
                          <h2 className="text-[#FE2B2B] font-bold -mt-2">
                            Warning Message
                          </h2>
                          <p className="text-gray-700 text-sm md:text-base">
                            Lorem Ipsum is simply dummy text...
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          className="bg-[#228B22] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
                          onClick={handleMarkComplete}
                        >
                          Mark as Complete
                        </button>
                        <ReviewModal
                          show={showCompletedModal}
                          onClose={() => setShowCompletedModal(false)}
                          service_provider_id={
                            orderData?.service_provider_id._id
                          }
                          orderId={id}
                          type="emergency"
                        />
                        <Link to={`/dispute/${id}/emergency`}>
                          <button className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md">
                            Cancel Task and Create Dispute
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      </div>

      {!isHired &&
        orderData?.hire_status !== "cancelled" &&
        !orderData?.platform_fee_paid && (
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search providers by name..."
                className="w-full p-2 pl-10 rounded-lg focus:outline-none bg-[#F5F5F5]"
                value={searchQuery}
                onChange={handleSearch}
              />
              <span className="absolute left-3 top-2.5">
                <img
                  src={Search}
                  alt="Search"
                  className="w-5 h-5 text-gray-400"
                />
              </span>
            </div>

            {filteredProviders.length > 0 ? (
              <div className="space-y-4">
                {filteredProviders?.map((provider) => (
                  <div
                    key={provider._id}
                    className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow"
                  >
                    <img
                      src={provider.profile_pic || Profile}
                      alt={`Profile of ${provider.full_name || "Provider"}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {provider.full_name || "Unknown Provider"}
                      </p>
                      <p className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm mt-2 w-fit">
                        {provider?.location?.address || "No Address Provided"}
                      </p>
                      <Link
                        to={`/profile-details/${provider._id}/emergency`}
                        className="text-[#228B22] border-green-600 border px-6 py-2 rounded-md text-base font-semibold mt-4 inline-block"
                      >
                        View Profile
                      </Link>
                    </div>
                    <button
                      className="px-4 py-2 bg-[#228B22] text-white rounded hover:bg-green-700"
                      onClick={() => handleHire(provider?._id)}
                    >
                      Hire
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600">
                No service providers found.
              </div>
            )}
          </div>
        )}

      {!orderData?.platform_fee_paid &&
        orderData?.hire_status === "assigned" && (
          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-[#228B22] text-white rounded hover:bg-green-700"
              onClick={handlePayment}
            >
              Pay
            </button>
          </div>
        )}

      {/* Bottom Banner Slider */}
      <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-[#f2e7ca] h-[400px] my-10">
        {bannerLoading ? (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            Loading banners...
          </p>
        ) : bannerError ? (
          <p className="absolute inset-0 flex items-center justify-center text-red-500">
            Error: {bannerError}
          </p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((banner, index) => (
              <div key={index}>
                <img
                  src={banner || "/src/assets/profile/default.png"} // Fallback image
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/profile/default.png"; // Fallback on image load error
                  }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            No banners available
          </p>
        )}
      </div>

      <Footer />
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 id="modal-title" className="text-lg font-bold mb-4">
              Confirm Cancellation
            </h2>
            <p>Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
              <button
                className="px-6 py-4 bg-[#FF0000] text-white rounded hover:bg-red-700"
                onClick={handleConfirmCancel}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
