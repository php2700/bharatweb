import React, { useState, useEffect, useMemo } from "react";
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
import workImage from "../../../assets/directHiring/Work.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import Warning1 from "../../../assets/warning1.png";
import Warning2 from "../../../assets/warning2.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
  const [showOrderReviewModal, setShowOrderReviewModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [disputeInfo, setDisputeInfo] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapAddress, setMapAddress] = useState("");
  const token = localStorage.getItem("bharat_token");

  // Sort state
  const [sortBy, setSortBy] = useState("name-asc");

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && Array.isArray(response.data.images) && response.data.images.length > 0) {
        setBannerImages(response.data.images);
      } else {
        setBannerImages([]);
        setBannerError("No banners available");
      }
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };
  const openMapModal = (address) => {
    setMapAddress(address);
    setIsMapModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);
  const handleGetDirections = (destinationAddress) => {
    if (destinationAddress) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destinationAddress
      )}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      Swal.fire({
        icon: "warning",
        title: "Location Not Found",
        text: "The destination address is not available.",
      });
    }
  };
  const fetchData = async () => {
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [orderResponse, providersResponse] = await Promise.all([
        axios.get(`${BASE_URL}/emergency-order/getEmergencyOrder/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        orderData?.hire_status === "pending"
          ? axios.get(`${BASE_URL}/emergency-order/getAcceptedServiceProviders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          : { data: { providers: [] } },
      ]);

      setAssignedWorker(orderResponse.data.assignedWorker || null);
      setOrderData(orderResponse.data.data);
      setServiceProviders(providersResponse.data.providers || []);
      setIsHired(!!orderResponse.data.data?.service_provider_id);
      setDisputeInfo(orderResponse.data.DisputeInfo || null);
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
    return () => document.body.removeChild(script);
  }, []);

  const handleHire = async (providerId) => {
    setIsSubmitting(true);
    setError("");
    try {
      const assignRes = await axios.post(
        `${BASE_URL}/emergency-order/assignEmergencyOrder/${id}`,
        { service_provider_id: providerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { razorpay_order } = assignRes.data?.data;
      if (!razorpay_order) throw new Error("Razorpay order not received");

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
            const verifyRes = await axios.post(
              `${BASE_URL}/emergency-order/verify-platform-payment`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.status === 200) {
              const orderResponse = await axios.get(
                `${BASE_URL}/emergency-order/getEmergencyOrder/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setOrderData(orderResponse.data.data);
              setAssignedWorker(orderResponse.data.assignedWorker || null);
              setIsHired(true);
              setServiceProviders([]);
            }
          } catch (err) {
            setError("Payment verification failed.");
          }
        },
        prefill: { name: "Rahul", email: "rahul@example.com", contact: "9999999999" },
      };

      if (window.Razorpay) new window.Razorpay(options).open();
      else setError("Razorpay SDK not loaded.");
    } catch (err) {
      setError("Failed to assign provider.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const razorpay_order = { amount: orderData?.platform_fee, id: orderData?.razorOrderIdPlatform };
      if (!razorpay_order) throw new Error("Razorpay order not received");

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
            const verifyRes = await axios.post(
              `${BASE_URL}/emergency-order/verify-platform-payment`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.status === 200) {
              const orderResponse = await axios.get(
                `${BASE_URL}/emergency-order/getEmergencyOrder/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setOrderData(orderResponse.data.data);
              setAssignedWorker(orderResponse.data.assignedWorker || null);
              setIsHired(true);
              setServiceProviders([]);
            }
          } catch (err) {
            setError("Payment verification failed.");
          }
        },
        prefill: { name: "Rahul", email: "rahul@example.com", contact: "9999999999" },
      };

      if (window.Razorpay) new window.Razorpay(options).open();
      else setError("Razorpay SDK not loaded.");
    } catch (err) {
      setError("Failed to process payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRouteHire = (ProviderId, isHired) => {
    navigate(`/profile-details/${ProviderId}/emergency`, {
      state: {
        hire_status: orderData?.hire_status,
        isHired,
        isPlatformFeePaid: orderData?.platform_fee_paid,
        razorPayOrderId: orderData?.razorOrderIdPlatform,
        platform_fee: orderData?.platform_fee,
        orderId: orderData?._id,
      },
    });
  };

  const handleMarkComplete = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/emergency-order/completeOrderUser`,
        { order_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as complete!",
          confirmButtonColor: "#228B22",
        }).then(() => {
          fetchData();
          setShowCompletedModal(true);
        });
      }
    } catch (err) {
      if (err.response?.data?.message?.includes("no payment records")) {
        Swal.fire({ icon: "error", title: "Oops!", text: "No payment records exist.", confirmButtonColor: "#FF0000" });
        return;
      }
      if (err.response?.status === 400) {
        const { pendingPaymentsCount } = err.response.data;
        Swal.fire({
          icon: "error",
          title: `Pending: ${pendingPaymentsCount || 0}`,
          text: "Release pending payments first.",
          confirmButtonColor: "#FF0000",
        }).then(async (res) => {
          if (res.isConfirmed) {
            const confirm = await Swal.fire({
              title: "Release All?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#228B22",
              cancelButtonColor: "#FF0000",
            });
            if (confirm.isConfirmed) {
              await axios.put(`${BASE_URL}/emergency-order/requestAllPaymentReleases/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
              fetchData();
            }
          }
        });
        return;
      }
      Swal.fire({ icon: "error", title: "Failed", text: "Could not complete order.", confirmButtonColor: "#FF0000" });
    }
  };

  const handleConfirmCancel = async () => {
    setShowModal(false);
    try {
      await axios.post(`${BASE_URL}/emergency-order/cancel`, { order_id: id }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      setError("Failed to cancel order.");
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      Swal.fire({ icon: "warning", title: "Enter reason", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      await axios.post(`${BASE_URL}/emergency-order/request-refund`, { orderId: id, reason: refundReason }, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire({ icon: "success", title: "Refund requested!", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
      setShowRefundModal(false);
      setRefundReason("");
      fetchData();
    } catch (error) {
      Swal.fire({ icon: "error", title: error.response?.data?.message || "Failed", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
    }
  };

  const sliderSettings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000, arrows: true };

  // Filtered + Sorted List
  const displayedProviders = useMemo(() => {
    let list = [...serviceProviders];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => (p.full_name || "").toLowerCase().includes(q) || (p.unique_id || "").toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return (a.full_name || "").localeCompare(b.full_name || "");
        case "name-desc": return (b.full_name || "").localeCompare(a.full_name || "");
        case "rating-desc": return (b.rating || 0) - (a.rating || 0);
        case "rating-asc": return (a.rating || 0) - (b.rating || 0);
        case "tasks-desc": return (b.totalTasks || 0) - (a.totalTasks || 0);
      case "tasks-asc": return (a.totalTasks || 0) - (b.totalTasks || 0);
        default: return 0;
      }
    });

    return list;
  }, [serviceProviders, searchQuery, sortBy]);

  const showRefundButton = orderData?.hire_status === "pending" || (orderData?.hire_status === "assigned" && orderData?.service_payment?.payment_history.length === 0);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-[#FF0000]">{error}</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <button className="flex items-center text-[#228B22] hover:text-green-800 font-semibold" onClick={() => navigate(-1)}>
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" /> Back
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {orderData?.image_urls?.length > 0 ? (
            <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={false} className="w-full h-[360px]">
              {orderData.image_urls.map((url, i) => (
                <div key={i}><img src={url} alt="" className="w-full h-[360px] object-cover" /></div>
              ))}
            </Carousel>
          ) : (
            <img src={workImage} alt="No images" className="w-full h-[360px] object-cover mt-5" />
          )}

          <div className="p-6">
            {/* Order Details */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                <p>Title :- {orderData?.title || "Unknown Title"}</p>
                <span>Category :- {orderData?.category_id?.name || "Unknown Category"}</span>
                <div>
                  Sub Category :- {orderData?.sub_category_ids?.map(s => s.name).join(", ") || "N/A"}
                  {/* <div className="text-gray-600 flex items-center px-3 py-1 rounded-full text-sm mt-2 w-fit">
                    <FaMapMarkerAlt size={25} color="#228B22" className="mr-2" />
                    {orderData?.google_address || "Unknown Location"}
                  </div> */}
                  <div
                    onClick={() => openMapModal(orderData?.google_address)}
                    className="text-gray-600 flex items-center px-0 py-1 rounded-full text-sm mt-2 w-fit cursor-pointer"
                  >
                    <FaMapMarkerAlt size={25} color="#228B22" className="mr-2" />
                    {orderData?.google_address || "Unknown Location"}
                  </div>

                </div>
              </div>
              <div className="text-right space-y-2 tracking-tight">
                <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm block text-center">{orderData?.project_id || "#N/A"}</span>
                <span className="text-gray-600 font-semibold block">Posted: {orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : "N/A"}</span>
                <span className="text-gray-600 font-semibold block">
                  Status: <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${orderData?.hire_status === "pending" ? "bg-yellow-500" : ""} ${orderData?.hire_status === "cancelled" || orderData?.hire_status === "cancelledDispute" ? "bg-[#FF0000]" : ""} ${orderData?.hire_status === "completed" || orderData?.hire_status === "assigned" ? "bg-[#228B22]" : ""}`}>
                    {orderData?.hire_status === "cancelledDispute" ? "Cancelled Dispute" : orderData?.hire_status?.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Unknown"}
                  </span>
                </span>
                {orderData?.refundRequest && (
                  <span className="text-gray-600 font-semibold block">
                    Refund: <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${orderData?.refundStatus === "pending" ? "bg-yellow-500" : "bg-blue-500"}`}>
                      {orderData?.refundStatus?.charAt(0).toUpperCase() + orderData?.refundStatus?.slice(1) || "Unknown"}
                    </span>
                  </span>
                )}
              </div>
            </div>

            <span className="text-gray-600 text-sm font-semibold block">
              Deadline: {orderData?.deadline ? new Date(orderData.deadline).toLocaleString() : "N/A"}
            </span>
            {orderData?.platform_fee_paid && (
              <span className="text-gray-600 text-sm font-semibold block mt-1">
                One Time Project fee :- ₹{orderData?.platform_fee || "0"}
              </span>
            )}
            <div className="border border-green-600 rounded-lg p-4 mb-4 bg-gray-50">
              <p className="text-gray-700 tracking-tight">{orderData?.description || "No details available."}</p>
            </div>

            {/* Action Buttons */}
            <div className="text-center mb-6">
              {orderData?.hire_status === "cancelled" ? (
                <span className="px-8 py-2 bg-[#FF0000] text-white rounded-lg text-lg font-semibold">Cancelled by User</span>
              ) : orderData?.hire_status === "completed" ? (
                <div className="flex justify-center gap-4 flex-wrap">
                  <span className="px-8 py-2 bg-[#228B22] text-white rounded-lg text-lg font-semibold">Task Completed</span>
                  {orderData?.isReviewedByUser ? (
                    <span className="px-8 py-2 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold cursor-pointer" onClick={() => setShowOrderReviewModal(true)}>See Review</span>
                  ) : (
                    <span className="px-8 py-2 bg-[#FFD700] text-black rounded-lg text-lg font-semibold cursor-pointer" onClick={() => setShowCompletedModal(true)}>Add Review</span>
                  )}
                  <ReviewModal show={showCompletedModal} onClose={() => setShowCompletedModal(false)} service_provider_id={orderData?.service_provider_id._id} orderId={id} type="emergency" />
                  <OrderReviewModal show={showOrderReviewModal} onClose={() => setShowOrderReviewModal(false)} orderId={id} type="emergency" />
                </div>
              ) : orderData?.hire_status === "cancelledDispute" ? (
                <>
                  <button className="px-8 py-3 bg-[#FF0000] text-white rounded-lg text-lg font-semibold">Cancelled ({disputeInfo?.unique_id || "No Id"})</button>
                  <p className="text-sm text-gray-700 mt-3"><span className="text-red-600 font-semibold">Freezed by Platform</span></p>
                </>
              ) : orderData?.hire_status !== "assigned" ? (
                <button className="px-8 py-3 bg-[#FF0000] text-white rounded-lg text-lg font-semibold hover:bg-red-700" onClick={() => setShowModal(true)}>Cancel Task</button>
              ) : null}

              {showRefundButton && orderData?.platform_fee_paid && (
                <button onClick={() => setShowRefundModal(true)} className="mt-4 ml-4 px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-blue-700">Cancel & Get Refund</button>
              )}
              {orderData?.refundRequest && (
                <button className="mt-4 ml-4 px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-blue-700">
                  {orderData?.refundStatus === "pending" ? "Refund Request Submitted" : "Refunded"}
                </button>
              )}
              {orderData?.hire_status === "assigned" && orderData?.platform_fee_paid && !orderData?.refundRequest && (
                <p className="text-gray-800 text-sm font-medium text-center mt-3">
                  <span className="text-gray-700 font-bold">Note :-</span> <span className="text-red-600 font-semibold">Use "Cancel & Get Refund" to cancel and request refund.</span>
                </p>
              )}
            </div>

            {/* Refund Modal */}
            {showRefundModal && (
              <div className="mt-6 bg-white border border-gray-300 rounded-lg p-6 shadow-md w-full max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Request Refund</h2>
                <textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Enter your refund reason..." className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowRefundModal(false)} className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
                  <button onClick={handleRefundRequest} className="px-5 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-blue-700">Submit</button>
                </div>
              </div>
            )}

            {/* Assigned Worker Section */}
            {(orderData?.hire_status === "assigned" || orderData?.hire_status === "completed" || orderData?.hire_status === "cancelledDispute") && orderData?.platform_fee_paid && (
              <>
                <Accepted serviceProvider={orderData?.service_provider_id} assignedWorker={assignedWorker} paymentHistory={orderData?.service_payment?.payment_history} fullPaymentHistory={orderData?.service_payment} orderId={id} hireStatus={orderData?.hire_status} user_id={orderData?.user_id?._id} />
                {(orderData?.hire_status === "assigned" || orderData?.hire_status === "completed") && (
                  <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                    <div className="relative max-w-2xl mx-auto">
                      <div className="relative z-10 flex justify-center gap-4">
                        <img src={Warning1} alt="Warning" className="w-50 h-50 bg-white border border-[#228B22] rounded-lg p-2" />
                        <img src={Warning2} alt="Warning2" className="w-50 h-50 bg-white border border-[#228B22] rounded-lg p-2" />
                      </div>
                      <div className="bg-[#FBFBBA] border border-yellow-300 rounded-lg shadow-md p-4 -mt-16 pt-20 text-center">
                        <h2 className="text-[#FE2B2B] font-bold -mt-2">Warning Message</h2>
                        <p className="text-gray-700 text-sm md:text-base">Pay securely — no extra charges from the platform. Choose simple and
                          safe transactions.</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      {orderData?.hire_status !== "completed" && (
                        <>
                          <button className="bg-[#228B22] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md" onClick={handleMarkComplete}>Mark as Complete</button>
                          <ReviewModal show={showCompletedModal} onClose={() => { setShowCompletedModal(false); fetchData(); }} service_provider_id={orderData?.service_provider_id._id} orderId={id} type="direct" />
                        </>
                      )}
                      <Link to={`/dispute/${id}/emergency`}>
                        <button className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md">
                          {orderData?.hire_status === "completed" ? "Create Dispute" : "Cancel Task and Create Dispute"}
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

      {/* Service Providers List with Dropdown Filter */}
      {!isHired && orderData?.hire_status !== "cancelled" && !orderData?.platform_fee_paid && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full p-2 pl-10 rounded-lg focus:outline-none bg-[#F5F5F5]"
              value={searchQuery}
              onChange={handleSearch}
            />
            <span className="absolute left-3 top-2.5">
              <img src={Search} alt="Search" className="w-5 h-5 text-gray-400" />
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="relative mb-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 pl-10 pr-8 rounded-lg bg-[#F5F5F5] appearance-none focus:outline-none cursor-pointer text-gray-700"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em",
              }}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="rating-desc">Rating High to Low</option>
              <option value="rating-asc">Rating Low to High</option>
              <option value="tasks-desc">Task count High to Low</option>
  <option value="tasks-asc">Task count Low to High</option>
            </select>
            <span className="absolute left-3 top-2.5 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>

          {/* Provider List */}
          {displayedProviders.length > 0 ? (
            <div className="space-y-4">
              {displayedProviders.map((provider) => (
                <div key={provider._id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
                  <img src={provider.profile_pic || Profile} alt={provider.full_name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-lg font-semibold">
                      {(provider.full_name || "").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Unknown Provider"}
                      <span className="text-sm text-gray-500 ml-2">({provider.unique_id || "#N/A"})</span>
                    </p>
                    {provider.rating !== undefined && (
                      <p className="text-sm text-yellow-600">Rating: {provider.rating.toFixed(1)} / 5.0</p>
                    )}
                    {/* <div className="text-gray-600 flex items-center px-3 py-1 rounded-full text-sm mt-2 w-fit">
                      <FaMapMarkerAlt size={25} color="#228B22" className="mr-2" />
                      {provider?.location?.address || "No Address Provided"}
                    </div> */}
                    <div
                      onClick={() => openMapModal(provider?.location?.address)}
                      className="text-gray-600 flex items-center px-3 py-1 rounded-full text-sm mt-2 w-fit cursor-pointer"
                    >
                      <FaMapMarkerAlt size={25} color="#228B22" className="mr-2" />
                      {provider?.location?.address || "No Address Provided"}
                    </div>
                    <button
                      className="ml-auto px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-50"
                      onClick={() => handleRouteHire(provider._id, false)}
                    >
                      View Profile
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-[#228B22] text-white rounded hover:bg-green-700" onClick={() => handleHire(provider._id)}>
                    Hire
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              {searchQuery ? `No providers found for "${searchQuery}"` : "No service providers available."}
            </div>
          )}
        </div>
      )}

      {/* Pay Button */}
      {!orderData?.platform_fee_paid && orderData?.hire_status === "assigned" && (
        <div className="flex justify-center">
          <button className="px-4 py-2 bg-[#228B22] text-white rounded hover:bg-green-700" onClick={handlePayment}>Pay</button>
        </div>
      )}

      {/* Banner Slider */}
      <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-[#f2e7ca] h-[400px] my-10">
        {bannerLoading ? (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">Loading banners...</p>
        ) : bannerError ? (
          <p className="absolute inset-0 flex items-center justify-center text-red-500">Error: {bannerError}</p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((banner, i) => (
              <div key={i}>
                <img src={banner} alt="" className="w-full h-[400px] object-cover" onError={(e) => { e.target.src = "/src/assets/profile/default.png"; }} />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">No banners available</p>
        )}
      </div>

      <Footer />
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Location on Map</h2>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="text-red-500 font-bold text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="w-full h-96 rounded-lg overflow-hidden border">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                  mapAddress || ""
                )}`}
              ></iframe>
            </div>
            <div className="mt-5 text-center">
              <button
                onClick={() => handleGetDirections(mapAddress)}
                className="px-6 py-2 bg-[#228B22] text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Cancel Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Cancellation</h2>
            <p>Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowModal(false)}>No</button>
              <button className="px-6 py-4 bg-[#FF0000] text-white rounded hover:bg-red-700" onClick={handleConfirmCancel}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
