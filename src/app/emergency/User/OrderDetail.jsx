import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Profile from "../../../assets/default-image.jpg";
import Warning from "../../../assets/ViewProfile/warning.svg";
import noWorkImage from "../../../assets/bidding/no_related_work.png";
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
import backArrow from "../../../assets/profile/arrow_back.svg";
import OrderReviewModal from "../../CommonScreens/OrderReviewModal";
import workImage from "../../../assets/directHiring/Work.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import Warning1 from "../../../assets/warning1.png";
import Warning3 from "../../../assets/warning3.png";

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
  const [openImage, setOpenImage] = useState(null);

  // Sort state
  const [sortBy, setSortBy] = useState("name-asc");

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        `${BASE_URL}/banner/getAllBannerImages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data?.success &&
        Array.isArray(response.data.images) &&
        response.data.images.length > 0
      ) {
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
          ? axios.get(
            `${BASE_URL}/emergency-order/getAcceptedServiceProviders/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
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
                service_provider_id: providerId,
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
        prefill: {
          name: "Rahul",
          email: "rahul@example.com",
          contact: "9999999999",
        },
      };

      if (window.Razorpay) new window.Razorpay(options).open();
      else setError("Razorpay SDK not loaded.");
    } catch (err) {
      setError("Failed to assign provider.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- Yeh naya function add karein ---
  const handleHireConfirmation = (providerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to hire this service provider?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#228B22",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Hire",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleHire(providerId);
      }
    });
  };
  // ------------------------------------

  const handlePayment = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const razorpay_order = {
        amount: orderData?.platform_fee,
        id: orderData?.razorOrderIdPlatform,
      };
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
        prefill: {
          name: "Rahul",
          email: "rahul@example.com",
          contact: "9999999999",
        },
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

  // const handleMarkComplete = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/emergency-order/completeOrderUser`,
  //       { order_id: id },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.status === 200 && response.data.status) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success!",
  //         text: "Order marked as complete!",
  //         confirmButtonColor: "#228B22",
  //       }).then(() => {
  //         fetchData();
  //         setShowCompletedModal(true);
  //       });
  //     }
  //   } catch (err) {
  //     if (err.response?.data?.message?.includes("no payment records")) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops!",
  //         text: "No payment records exist.",
  //         confirmButtonColor: "#FF0000",
  //       });
  //       return;
  //     }
  //     if (err.response?.status === 400) {
  //       const { pendingPaymentsCount } = err.response.data;
  //       Swal.fire({
  //         icon: "error",
  //         title: `Pending: ${pendingPaymentsCount || 0}`,
  //         text: "Release pending payments first.",
  //         confirmButtonColor: "#FF0000",
  //       }).then(async (res) => {
  //         if (res.isConfirmed) {
  //           const confirm = await Swal.fire({
  //             title: "Release All?",
  //             icon: "question",
  //             showCancelButton: true,
  //             confirmButtonColor: "#228B22",
  //             cancelButtonColor: "#FF0000",
  //           });
  //           if (confirm.isConfirmed) {
  //             await axios.put(
  //               `${BASE_URL}/emergency-order/requestAllPaymentReleases/${id}`,
  //               {},
  //               { headers: { Authorization: `Bearer ${token}` } }
  //             );
  //             fetchData();
  //           }
  //         }
  //       });
  //       return;
  //     }
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed",
  //       text: "Could not complete order.",
  //       confirmButtonColor: "#FF0000",
  //     });
  //   }
  // };


  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("bharat_token");

      const response = await axios.post(
        `${BASE_URL}/emergency-order/completeOrderUser`,
        { order_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Success: order completed
      if (response.status === 200 && response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as complete successfully!",
          confirmButtonColor: "#228B22",
        })
          .then(() => fetchData())
          .then(() => {
            setTimeout(() => {
              setShowCompletedModal(true);
            }, 150);
          });
      }
    } catch (err) {
      console.error(err);

      // ⚠️ If payment is pending (status 400)
      if (err.response && err.response.status === 400) {
        const { pendingPaymentsCount, message } = err.response.data;

        Swal.fire({
          icon: "error",
          title: `Pending Payments: ${pendingPaymentsCount}`,
          text: message,
          confirmButtonText: "OK",
          confirmButtonColor: "#FF0000",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // 🟢 Ask user if they want to release all payments
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
                const token = localStorage.getItem("bharat_token");
                const releaseResponse = await axios.put(
                  `${BASE_URL}/emergency-order/requestAllPaymentReleases/${id}`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                if (
                  releaseResponse.status === 200 &&
                  releaseResponse.data.status
                ) {
                  // 🎉 Payments released successfully
                  Swal.fire({
                    icon: "success",
                    title: "Payments Released!",
                    text: "All pending payments have been successfully released.",
                    confirmButtonColor: "#228B22",
                  }).then(async () => {
                    // ⭐ NEW STEP ADDED HERE ⭐
                    const askToComplete = await Swal.fire({
                      title: "Complete Order?",
                      text: "All payments are released. Do you want to complete the order now?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Yes, Complete Order",
                      cancelButtonText: "No",
                      confirmButtonColor: "#228B22",
                      cancelButtonColor: "#FF0000",
                    });

                    if (askToComplete.isConfirmed) {
                      handleMarkComplete(); // 🔁 Call again to complete order
                    }
                  });
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
      } else {
        // 🚫 Other errors
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to mark order as complete. Please try again.",
          confirmButtonColor: "#FF0000",
        });
      }
    }
  };



  const handleConfirmCancel = async () => {
    setShowModal(false);
    try {
      await axios.post(
        `${BASE_URL}/emergency-order/cancel`,
        { order_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      setError("Failed to cancel order.");
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Enter reason",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/emergency-order/request-refund`,
        { orderId: id, reason: refundReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Refund requested!",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      setShowRefundModal(false);
      setRefundReason("");
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Failed",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

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

  // Filtered + Sorted List
  const displayedProviders = useMemo(() => {
    let list = [...serviceProviders];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.full_name || "").toLowerCase().includes(q) ||
          (p.unique_id || "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.full_name || "").localeCompare(b.full_name || "");
        case "name-desc":
          return (b.full_name || "").localeCompare(a.full_name || "");
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-asc":
          return (a.rating || 0) - (b.rating || 0);
        case "tasks-desc":
          return (b.totalTasks || 0) - (a.totalTasks || 0);
        case "tasks-asc":
          return (a.totalTasks || 0) - (b.totalTasks || 0);
        default:
          return 0;
      }
    });

    return list;
  }, [serviceProviders, searchQuery, sortBy]);

  const showRefundButton =
    orderData?.hire_status === "pending" ||
    (orderData?.hire_status === "assigned" &&
      orderData?.service_payment?.payment_history.length === 0);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-[#FF0000]">
        {error}
      </div>
    );
  const handleOpenImage = (url) => {
    const full = getFullSizeImage(url);
    console.log("Opening image:", full); // debug: ensure URL is correct
    setOpenImage(full);
  };
  const getFullSizeImage = (thumbnailUrl) => {
    if (!thumbnailUrl) return thumbnailUrl;

    // Case 1: Firebase Storage (99% of apps in India)
    if (thumbnailUrl.includes("firebasestorage.googleapis.com")) {
      // Removes =s400-c, =s600-c, =s800-c etc. → gives original full size
      return thumbnailUrl.replace(/=s\d+-c.*/i, "");
    }

    // Case 2: Cloudinary
    if (thumbnailUrl.includes("res.cloudinary.com")) {
      return thumbnailUrl.replace(
        /\/upload\/.*/,
        "/upload/q_auto:good,f_auto,w_2000,h_2000,c_limit/"
      );
    }

    // Case 3: Any other CDN – force high quality
    const separator = thumbnailUrl.includes("?") ? "&" : "?";
    return `${thumbnailUrl}${separator}original=true`;
  };
  return (
    <>
      <Header />
      <div className="container mx-auto mt-20 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#228B22] hover:text-green-800 font-semibold cursor-pointer"
        >
          <img src={backArrow} className="w-6 h-6 mr-2" alt="Back" />
          Back
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-2xl text-center font-bold mb-4">Work Detail</div>

        {/* TOP IMAGE / CAROUSEL styled like getworkdetails.jsx */}
        {orderData?.image_urls?.length > 0 ? (
          <Carousel
            showArrows
            showThumbs={false}
            infiniteLoop
            emulateTouch
            swipeable
            interval={3000}
            showStatus={false}
            autoPlay={false}
            // use correct plural name and optional chaining
            onClickItem={(index) => handleOpenImage(orderData?.image_urls?.[index])}
            className="w-full 
               h-[180px]        /* mobile */
               sm:h-[250px] 
               md:h-[360px]"   /* desktop unchanged */
          >
            {orderData.image_urls.map((url, i) => (
              <div
                key={i}

                className="cursor-pointer pointer-events-auto"

              >
                <img
                  src={url}
                  alt={`Project image ${i + 1}`}
                  className="
            w-full 
            h-[180px]        /* mobile size updated */
            sm:h-[250px] 
            md:h-[360px]     /* desktop same */
            object-cover 
            rounded-lg
          "
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <img
            src={workImage}
            alt="No images"
            className="
      w-full 
      h-[180px]        /* mobile */
      sm:h-[250px] 
      md:h-[360px]     /* desktop same */
      object-cover 
      mt-5
      rounded-lg
    "
          />
        )}

        {openImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setOpenImage(null)}
          >
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={openImage}
                alt="Preview"
                className="
        max-w-[90vw] 
        max-h-[90vh] 
        rounded-xl 
        shadow-2xl
        "
              />

              <button
                onClick={() => setOpenImage(null)}
                className="
        absolute -top-4 -right-4 
        h-10 w-10 
        flex items-center justify-center 
        bg-white 
        text-black 
        rounded-full 
          shadow-lg 
          text-2xl
        "
              >
                ×
              </button>
            </div>
          </div>
        )}
        <div className="py-6 space-y-4">
          {/* Order Details */}
          <div className="flex justify-between items-start">
            <div className="w-full md:w-auto space-y-1 text-gray-800">
              <p className="text-lg font-semibold">
                Title :-{" "}
                {orderData?.title
                  ? orderData.title.charAt(0).toUpperCase() +
                  orderData.title.slice(1)
                  : "Unknown Title"}
              </p>
              <p className="text-sm text-green-600 font-semibold">
                Category :- {orderData?.category_id?.name || "Unknown Category"}
              </p>
              <div className="text-[13px]">
                <span className="font-semibold text-base text-[#228B22]">
                  Sub-Categories-
                </span>{" "}
                {orderData?.sub_category_ids?.map((s) => s.name).join(", ") ||
                  "N/A"}
                <div
                  onClick={() => openMapModal(orderData?.google_address)}
                  className="text-gray-600 flex items-center px-0 py-1 rounded-full text-sm mt-2 w-fit cursor-pointer"
                >
                  <FaMapMarkerAlt
                    size={20}
                    color="#228B22"
                    className="mr-2"
                  />
                  {orderData?.google_address || "Unknown Location"}
                </div>
              </div>
            </div>

            {/* Desktop side: project id, posted, status, refund */}
            <div className="text-left sm:text-right sm:ml-auto mt-4 sm:mt-0 hidden sm:block space-y-2 tracking-tight">
              <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm inline-block text-center">
                {orderData?.project_id || "#N/A"}
              </span>
              <span className="text-gray-600 font-semibold block">
                Posted:{" "}
                {orderData?.createdAt
                  ? (() => {
                    const date = new Date(orderData.createdAt);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                  })()
                  : "N/A"}
              </span>

              <span className="text-gray-600 font-semibold block">
                Status:{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${orderData?.hire_status === "pending"
                      ? "bg-yellow-500"
                      : ""
                    } ${orderData?.hire_status === "cancelled" ||
                      orderData?.hire_status === "cancelledDispute"
                      ? "bg-[#FF0000]"
                      : ""
                    } ${orderData?.hire_status === "completed" ||
                      orderData?.hire_status === "assigned"
                      ? "bg-[#228B22]"
                      : ""
                    }`}
                >
                  {orderData?.hire_status === "cancelledDispute"
                    ? "Cancelled Dispute"
                    : orderData?.hire_status
                      ?.split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ") || "Unknown"}
                </span>
              </span>
              {orderData?.refundRequest && (
                <span className="text-gray-600 font-semibold block">
                  Refund:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${orderData?.refundStatus === "pending"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                      }`}
                  >
                    {orderData?.refundStatus?.charAt(0).toUpperCase() +
                      orderData?.refundStatus?.slice(1) || "Unknown"}
                  </span>
                </span>
              )}
            </div>
          </div>
          {/* Mobile mirror of right side */}
          <div className="block sm:hidden mt-4 text-left">
            <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm inline-block text-center">
              {orderData?.project_id || "#N/A"}
            </span>
            <span className="text-gray-600 font-semibold block mt-2">
              Posted:{" "}
              {orderData?.createdAt
                ? (() => {
                  const date = new Date(orderData.createdAt);
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();
                  return `${day}/${month}/${year}`;
                })()
                : "N/A"}
            </span>
            <span className="text-gray-600 font-semibold block mt-1">
              Status:{" "}
              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${orderData?.hire_status === "pending"
                    ? "bg-yellow-500"
                    : ""
                  } ${orderData?.hire_status === "cancelled" ||
                    orderData?.hire_status === "cancelledDispute"
                    ? "bg-[#FF0000]"
                    : ""
                  } ${orderData?.hire_status === "completed" ||
                    orderData?.hire_status === "assigned"
                    ? "bg-[#228B22]"
                    : ""
                  }`}
              >
                {orderData?.hire_status === "cancelledDispute"
                  ? "Cancelled Dispute"
                  : orderData?.hire_status
                    ?.split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ") || "Unknown"}
              </span>
            </span>
            {orderData?.refundRequest && (
              <span className="text-gray-600 font-semibold block mt-1">
                Refund:{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${orderData?.refundStatus === "pending"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                    }`}
                >
                  {orderData?.refundStatus?.charAt(0).toUpperCase() +
                    orderData?.refundStatus?.slice(1) || "Unknown"}
                </span>
              </span>
            )}
          </div>

          {/* Deadline & platform fee */}
          <span className="text-gray-600 text-sm font-semibold block mt-2">
            Deadline:{" "}
            {orderData?.deadline
              ? (() => {
                const date = new Date(orderData.deadline);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                let hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, "0");
                const ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12 || 12;
                hours = String(hours).padStart(2, "0");

                return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
              })()
              : "N/A"}
          </span>

          {orderData?.platform_fee_paid && (
            <span className="text-gray-600 text-sm font-semibold block mt-1">
              One Time Project fee :- ₹{orderData?.platform_fee || "0"}
            </span>
          )}

          {/* Description block styled like bidding */}
          <div className="border border-green-600 rounded-lg p-4 sm:p-5 md:p-6 bg-gray-50 mb-4 w-full">
            <p className="text-gray-700 tracking-tight text-sm sm:text-base leading-relaxed break-words">
              {orderData?.description || "No details available."}
            </p>
          </div>

          {/* Action Buttons (match bidding layout) */}
          <div className="text-center mb-6">
            {orderData?.hire_status === "cancelled" ? (
              <span className="px-8 py-2 bg-[#FF0000] text-white rounded-lg text-lg font-semibold">
                Cancelled by User
              </span>
            ) : orderData?.hire_status === "completed" ? (
              <div className="flex justify-center gap-4 flex-wrap">
                <span className="px-8 py-2 bg-[#228B22] text-white rounded-lg text-lg font-semibold">
                  Task Completed
                </span>
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
            ) : orderData?.hire_status === "cancelledDispute" && disputeInfo ? (
              <>
                <Link to={`/disputes/emergency/${disputeInfo._id}`}>
                  <span
                    className="
    px-4 sm:px-6 
    py-1.5 
    bg-[#FF0000] 
    text-white 
    rounded-md 
    text-sm sm:text-base 
    font-semibold 
    cursor-pointer 
    hover:bg-red-700 
    whitespace-nowrap 
    leading-tight 
    block 
    w-fit 
    mx-auto          /* Center horizontally */
  "
                  >
                    Cancelledssss (disputeId_ {disputeInfo.unique_id || "N/A"})
                  </span>

                </Link>
                <p className="text-sm text-gray-700 mt-3">
                  <span className="text-red-600 font-semibold">
                    Freezed by Platform
                  </span>
                </p>
              </>
            ) : orderData?.hire_status !== "assigned" ? (
              <button
                className="px-8 py-3 bg-[#FF0000] text-white rounded-lg text-lg font-semibold hover:bg-red-700"
                onClick={() => setShowModal(true)}
              >
                Cancel Task
              </button>
            ) : null}

            {showRefundButton && orderData?.platform_fee_paid && (
              <button
                onClick={() => setShowRefundModal(true)}
                className="mt-4 ml-4 px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-blue-700"
              >
                Cancel & Get Refund
              </button>
            )}
            {orderData?.refundRequest && (
              <button className="mt-4 ml-4 px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-blue-700">
                {orderData?.refundStatus === "pending"
                  ? "Refund Request Submitted"
                  : "Refunded"}
              </button>
            )}
            {orderData?.hire_status === "assigned" &&
              orderData?.platform_fee_paid &&
              !orderData?.refundRequest && (
                <p className="text-gray-800 text-sm font-medium text-center mt-3">
                  <span className="text-gray-700 font-bold">Note :-</span>{" "}
                  <span className="text-red-600 font-semibold">
                    Use "Cancel & Get Refund" to cancel and request refund.
                  </span>
                </p>
              )}
          </div>

          {/* Refund Modal */}
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

          {(orderData?.refundStatus === "processed" ||
            orderData?.refundStatus === "rejected") && (
              <p
                className={`mt-2 text-sm font-medium ${orderData?.refundStatus === "processed"
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Admin Remark: {orderData?.refundReasonDetails || "No Remark"}
              </p>
            )}

          {orderData?.service_provider_id &&
            orderData?.hire_status == "cancelled" && (
              <div className="bg-gray-100 border border-[#228B22] p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={orderData?.service_provider_id?.profile_pic || Profile}
                    alt={`Profile of ${orderData?.service_provider_id?.full_name || "Worker"
                      }`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex items-center w-full">
                    <p className="text-lg font-semibold">
                      {orderData?.service_provider_id?.full_name
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ") || "Unknown Worker"}
                      <span>
                        {" "}
                        ({orderData?.service_provider_id?.unique_id})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Assigned Worker Section */}
          {(orderData?.hire_status === "assigned" ||
            orderData?.hire_status === "completed" ||
            orderData?.hire_status === "cancelledDispute") &&
            orderData?.platform_fee_paid && (
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
                {(orderData?.hire_status === "assigned" ||
                  orderData?.hire_status === "completed") && (
                    <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                      <div className="relative max-w-2xl mx-auto">
                        {/* Top Images - responsive sizes and wrap on small screens */}
                                                <div className="relative z-10 flex justify-center gap-4 flex-wrap">
                                                  <img
                                                    src={Warning1}
                                                    alt="Warning"
                                                    className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white border border-[#228B22] rounded-lg p-2 object-contain"
                                                  />
                                                  <img
                                                    src={Warning3}
                                                    alt="Warning2"
                                                    className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white border border-[#228B22] rounded-lg p-2 object-contain"
                                                  />
                                                </div>
                        
                                                {/* Yellow Box - spacing & text size responsive */}
                                                <div className="bg-[#FBFBBA] border border-yellow-300 rounded-lg shadow-md p-4 sm:p-6 -mt-12 sm:-mt-16 pt-20 sm:pt-20 text-center w-full">
                                                  <h2 className="text-[#FE2B2B] font-bold -mt-2 text-base sm:text-lg">
                                                    Warning Message
                                                  </h2>
                                                  <p className="text-gray-700 text-sm sm:text-base">
                                                    Pay securely — no extra charges from the platform. Choose simple and safe transactions.
                                                  </p>
                                                </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0 w-full max-w-2xl px-2">
                        {orderData?.hire_status !== "completed" && (
                          <>
                            <button
    className="bg-[#228B22] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md w-full sm:w-auto"
    onClick={handleMarkComplete}
  >
    Mark as Complete
  </button>
                            <ReviewModal
                              show={showCompletedModal}
                              onClose={() => {
                                setShowCompletedModal(false);
                                fetchData();
                              }}
                              service_provider_id={
                                orderData?.service_provider_id._id
                              }
                              orderId={id}
                              type="direct"
                            />
                          </>
                        )}
                        <Link to={`/dispute/${id}/emergency`}>
                          <button className="bg-[#EE2121] hover:bg-red-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold shadow-md w-full sm:w-auto text-sm sm:text-base">
                            {orderData?.hire_status === "completed"
                              ? "Create Dispute"
                              : "Cancel Task and Create Dispute"}
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
              </>
            )}
        </div>
      </div>

      {/* Service Providers List with Dropdown Filter (below main card) */}
      {!isHired &&
        orderData?.hire_status !== "cancelled" &&
        !orderData?.platform_fee_paid && (
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
                <img
                  src={Search}
                  alt="Search"
                  className="w-5 h-5 text-gray-400"
                />
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
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>

            {/* Provider List */}
            {displayedProviders.length > 0 ? (
              <div className="space-y-4">
                {displayedProviders.map((provider) => (
                  <div
                    key={provider._id}
                    className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow"
                  >
                    <img
                      src={provider.profile_pic || Profile}
                      alt={provider.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-semibold">
                        {(provider.full_name || "")
                          .split(" ")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ") || "Unknown Provider"}
                        <span className="text-sm text-gray-500 ml-2">
                          ({provider.unique_id || "#N/A"})
                        </span>
                      </p>
                      {typeof provider.rating === "number" ? (
                        <p className="text-sm text-yellow-600">
                          Rating: {provider.rating.toFixed(1)} / 5.0
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No rating available
                        </p>
                      )}
                      {/* <div className="text-gray-600 flex items-center px-3 py-1 rounded-full text-sm mt-2 w-fit">
                      <FaMapMarkerAlt size={25} color="#228B22" className="mr-2" />
                      {provider?.location?.address || "No Address Provided"}
                    </div> */}
                      <div
                        onClick={() =>
                          openMapModal(provider?.location?.address)
                        }
                        className="text-gray-600 flex items-center px-3 py-1 rounded-full text-sm mt-2 w-fit cursor-pointer"
                      >
                        <FaMapMarkerAlt
                          size={25}
                          color="#228B22"
                          className="mr-2"
                        />
                        {provider?.location?.address || "No Address Provided"}
                      </div>
                      <button
                        className="ml-auto px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-50"
                        onClick={() => handleRouteHire(provider._id, false)}
                      >
                        View Profile
                      </button>
                    </div>
                    <button
                      className="px-4 py-2 bg-[#228B22] text-white rounded hover:bg-green-700"
                      // onClick={() => handleHire(provider._id)}
                      onClick={() => handleHireConfirmation(provider._id)}
                    >
                      Hire
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-8">
                {searchQuery ? (
                  <>
                    <p>No providers found for "{searchQuery}"</p>
                    <img
                      src={noWorkImage}
                      alt="No providers"
                      className="mx-auto mt-4 w-74 opacity-80"
                    />
                  </>
                ) : (
                  <>
                    <p>No service providers available.</p>
                    <img
                      src={noWorkImage}
                      alt="No service providers"
                      className="mx-auto mt-4 w-74 opacity-80"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}

      {/* Pay Button */}
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

      {/* Banner Slider */}
      <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden my-10 h-48 sm:h-64 lg:h-[400px] bg-[#f2e7ca]">
        {bannerLoading ? (
          <p className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base">Loading banners...</p>
        ) : bannerError ? (
          <p className="flex items-center justify-center h-full text-red-500 text-sm sm:text-base">Error: {bannerError}</p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((banner, i) => (
              <div key={i}>
                <img
                  src={banner}
                  alt=""
                  className="w-full h-48 sm:h-64 lg:h-[400px] object-cover"
                  onError={(e) => { e.target.src = "/src/assets/profile/default.png"; }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base">No banners available</p>
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
              {/* <button
                onClick={() => handleGetDirections(mapAddress)}
                className="px-6 py-2 bg-[#228B22] text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Get Directions
              </button> */}
            </div>
          </div>
        </div>
      )}
      {/* Cancel Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Cancellation</h2>
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
