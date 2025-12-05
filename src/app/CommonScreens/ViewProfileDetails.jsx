import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Arrow from "../../assets/profile/arrow_back.svg";
import Location from "../../assets/Details/location.svg";
import Aadhar from "../../assets/Details/profile-line.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import defaultPic from "../../assets/default-image.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProfileDetails() {
  const { serviceProviderId, type } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [WorkerTab, setWorkerTab] = useState("work");
  const [workIndex, setWorkIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const statuslocation = useLocation();
  const {
    hire_status,
    isHired,
    isPlatformFeePaid,
    razorPayOrderId,
    platform_fee,
    orderId,
  } = statuslocation.state || {};
  // console.log("ddddd", statuslocation.state);
  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
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
          Array.isArray(response.data.images) &&
          response.data.images.length > 0
        ) {
          setBannerImages(response.data.images);
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

    const fetchWorkerProfile = async () => {
      if (!serviceProviderId) {
        console.error("No serviceProviderId provided");
        toast.error("Invalid service provider ID");
        setLoading(false);
        navigate("/workerlist");
        return;
      }

      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) {
          console.error("No token found");
          toast.error("Please log in to view worker profile");
          navigate("/login");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/user/getServiceProvider/${serviceProviderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("Worker profile response:", response.data);
        if (response.data?.success) {
          setWorker(response.data.data);
        } else {
          console.error(
            "Failed to fetch worker profile:",
            response.data?.message
          );
          toast.error("Failed to load worker profile.");
        }
      } catch (error) {
        console.error("Error fetching worker profile:", error);
        toast.error("Something went wrong while fetching the profile!");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerProfile();
    fetchBannerImages();
  }, [serviceProviderId, navigate]);

  // Memoize worker data to prevent new references
  const memoizedWorker = useMemo(() => worker, [worker]);

  // Work carousel
  useEffect(() => {
    if (WorkerTab !== "work" || !memoizedWorker?.hiswork?.length) return;

    const interval = setInterval(() => {
      setWorkIndex(
        (prevIndex) => (prevIndex + 1) % memoizedWorker.hiswork.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, memoizedWorker?.hiswork]);

  // Review carousel
  useEffect(() => {
    if (WorkerTab !== "review" || !memoizedWorker?.customerReview?.length)
      return;

    const interval = setInterval(() => {
      setReviewIndex(
        (prevIndex) => (prevIndex + 1) % memoizedWorker.customerReview.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, memoizedWorker?.customerReview]);

  // Business images carousel
  useEffect(() => {
    if (WorkerTab !== "business" || !memoizedWorker?.businessImage?.length)
      return;

    const interval = setInterval(() => {
      setWorkIndex(
        (prevIndex) => (prevIndex + 1) % memoizedWorker.businessImage.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, memoizedWorker?.businessImage]);

  // Handle document image click
  const handleDocumentClick = (image) => {
    setSelectedImage(image);
  };

  const handleDirectHire = (serviceProviderId) => {
    navigate(`/direct-hiring/${serviceProviderId}`);
  };

  const handleHire = async (providerId) => {
    try {
      const assignRes = await axios.post(
        `${BASE_URL}/emergency-order/assignEmergencyOrder/${orderId}`,
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
            // console.log(paymentResponse, "paymentres");
            const verifyRes = await axios.post(
              `${BASE_URL}/emergency-order/verify-platform-payment`,
              {
                service_provider_id: providerId,
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
            if (verifyRes.status === 200) {
              // 1. सफलता का संदेश दिखाएँ
              toast.success("Payment successful! Redirecting to order details...");

              // 2. कुछ देर बाद रीडायरेक्ट करें ताकि यूज़र संदेश देख सके
              setTimeout(() => {
                navigate(`/emergency/order-detail/${orderId}`);
              }, 2000); // 2 सेकंड का इंतज़ार
            } else {
              toast.error("Payment verification failed.");
            }

            console.log("Verify Response:", verifyRes.data);
          } catch (err) {
            console.error("Error verifying payment:", err);
            toast.error("Payment verification failed. Please contact support.");
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
        console.error("Razorpay SDK not loaded. Please refresh the page.");
      }
    } catch (err) {
      console.error("Error during hire:", err);
    }
  };

  const handlePayment = async () => {
    try {
      const razorpay_order = {
        amount: platform_fee,
        id: razorPayOrderId,
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
            if (verifyRes.status === 200) {
              toast.success("Payment successful! Redirecting to order details...");
              setTimeout(() => {
                navigate(`/emergency/order-detail/${orderId}`);
              }, 2000);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            toast.error("Payment verification failed. Please contact support.");
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
        console.error("Razorpay SDK not loaded. Please refresh the page.");
      }
    } catch (err) {
      console.error("Error during hire:", err);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No worker data found.</p>
      </div>
    );
  }

  const {
    full_name = "N/A",
    unique_id = "N/A",
    phone = "N/A",
    location = { address: "Not Available" },
    full_address = [{ address: "Not Available" }],
    businessAddress = { address: "Not Available" },
    isShop = false,
    profilePic = null,
    skill = "No Skill Available",
    category = { name: "Not Available" },
    subcategory_names = [],
    emergencySubcategory_names = [],
    documents = [],
    rateAndReviews = [],
    verificationStatus = "pending",
    hiswork = [],
    customerReview = [],
    businessImage = [],
    avgRating = "0.0",
    totalReviews = 0,
  } = memoizedWorker;

  const verifiedStatus =
    verificationStatus === "verified"
      ? "Verified by Admin"
      : verificationStatus === "rejected"
        ? "Rejected"
        : "Pending";
  const statusClass =
    verificationStatus === "verified"
      ? "bg-green-100 text-green-600"
      : verificationStatus === "rejected"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-600";

  const testimage = profilePic && profilePic !== "Not Available";

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

  // Determine reviews to display
  const displayedReviews = showAllReviews
    ? rateAndReviews
    : rateAndReviews.slice(0, 2);

  return (
    <>
      <Header />
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
        limit={3}
      />
      <div className="container mx-auto mt-20 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
      </div>
      {/* Banner Slider */}

      {/* Banner Slider */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] mt-5 
  h-[220px] sm:h-[400px]">

        {bannerLoading ? (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            Loading banners...
          </p>
        ) : bannerError ? (
          <p className="absolute inset-0 flex items-center justify-center text-red-500">
            {bannerError}
          </p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((banner, i) => (
              <div key={i} className="w-full h-[220px] sm:h-[400px]">
                <img
                  src={banner}
                  alt={`Banner ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = Work)}
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
      <div className="container mx-auto px-6 py-6">
        <h2 className="text-3xl font-bold text-black mb-3 text-left ml-10 mt-10">
          {isShop ? "Business Details" : "Working Person Details"}
        </h2>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[80px] items-start">

            {/* Profile Image */}
            <div className="relative w-full">
              <img
                src={profilePic || defaultPic}
                alt="User Profile"
                className="w-full h-[250px] xs:h-[300px] sm:h-[350px] md:h-[450px] object-cover rounded-2xl shadow-lg"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultPic) {
                    e.currentTarget.src = defaultPic;
                  }
                }}
              />
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-3 sm:gap-4">

              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {full_name
                    ? full_name.charAt(0).toUpperCase() + full_name.slice(1)
                    : ""}
                </h2>

                {verificationStatus === "verified" && (
                  <span className="bg-[#228B22] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-gray-600 font-semibold">
                <span className="font-semibold text-[#228B22]">Id-</span>
                <span>{unique_id}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-gray-600 font-semibold">
                <img src={Location} alt="Location icon" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="break-words max-w-full">
                  {isShop ? businessAddress.address : location.address}
                </span>
              </div>

              <p className="text-sm sm:text-base font-semibold text-gray-700">
                <span className="font-semibold text-[#228B22]">Category-</span> {category.name}
              </p>

              <p className="text-sm sm:text-base font-semibold -mt-2 text-gray-700 break-words">
                <span className="font-semibold text-[#228B22]">Sub-Categories-</span>{" "}
                {Array.isArray(subcategory_names) && subcategory_names.length > 0
                  ? subcategory_names.map((name, index) => (
                    <span key={index}>
                      {name.trim()}
                      {index !== subcategory_names.length - 1 ? ", " : ""}
                    </span>
                  ))
                  : "Not Available"}
              </p>

              {emergencySubcategory_names.length > 0 && (
                <p className="text-sm sm:text-base font-semibold -mt-2 text-gray-700 break-words">
                  <span className="font-semibold text-[#228B22]">Emergency Sub-Categories-</span>{" "}
                  {emergencySubcategory_names.map((name, index) => (
                    <span key={index}>
                      {name.trim()}
                      {index !== emergencySubcategory_names.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}

              <div
                className={`p-3 sm:p-4 shadow-xl w-full max-w-full rounded-xl ${skill === "No Skill Available" ? "min-h-[200px]" : "min-h-[200px]"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base sm:text-lg">About My Skill</h3>
                </div>
                <p className="mt-1 text-gray-700 text-sm sm:text-base leading-relaxed break-words">
                  {skill}
                </p>
              </div>

            </div>
          </div>




          <div className="container mx-auto px-3 sm:px-4 py-6">

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 p-3 sm:p-4 mt-4 sm:mt-6">
              <button
                onClick={() => {
                  setWorkerTab("work");
                  setWorkIndex(0);
                }}
                className={`px-4 sm:px-6 py-2 rounded-md cursor-pointer shadow-md font-semibold ${WorkerTab === "work"
                    ? "bg-[#228B22] text-white"
                    : "bg-green-100 text-[#228B22]"
                  }`}
              >
                His Work
              </button>

              <button
                onClick={() => {
                  setWorkerTab("review");
                  setReviewIndex(0);
                }}
                className={`px-4 sm:px-6 py-2 rounded-md cursor-pointer shadow-md font-semibold ${WorkerTab === "review"
                    ? "bg-[#228B22] text-white"
                    : "bg-green-100 text-[#228B22]"
                  }`}
              >
                Customer Review
              </button>
            </div>

            {/* WORK SECTION */}
            {WorkerTab === "work" && (
              <div className="mt-6 w-full bg-[#D3FFD3] flex flex-col items-center py-6 sm:py-10">

                {/* Main Image (Responsive Width) */}
                <div className="relative w-full max-w-[700px] h-[220px] xs:h-[260px] sm:h-[350px] md:h-[400px] px-3 sm:px-0">
                  {hiswork.length > 0 ? (
                    <img
                      src={hiswork[workIndex]}
                      alt={`Work sample ${workIndex + 1}`}
                      className="w-full h-full object-cover rounded-md shadow-md"
                      onError={(e) => {
                        e.target.src = defaultPic;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                      No work available.
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {hiswork.length > 0 && (
                  <div className="mt-6 flex flex-col items-center gap-3 sm:gap-4">
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-3 sm:gap-4 justify-center px-3">
                      {hiswork.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden cursor-pointer"
                          onClick={() => setWorkIndex(index)}
                        >
                          <img
                            src={img}
                            alt={`Work sample ${index + 1}`}
                            className="w-full h-full object-cover shadow-md"
                            onError={(e) => {
                              e.target.src = defaultPic;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REVIEW SECTION */}
            {WorkerTab === "review" && (
              <div className="mt-6 w-full bg-[#D3FFD3] flex flex-col items-center py-6 sm:py-10">
                <div className="relative w-full max-w-[700px] h-[220px] xs:h-[260px] sm:h-[350px] md:h-[400px] px-3 sm:px-0">
                  {customerReview.length > 0 ? (
                    <img
                      src={customerReview[reviewIndex]}
                      alt={`Customer review ${reviewIndex + 1}`}
                      className="w-full h-full object-cover rounded-md shadow-md"
                      onError={(e) => {
                        e.target.src = defaultPic;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                      No customer reviews available.
                    </div>
                  )}
                </div>

                {customerReview.length > 0 && (
                  <div className="mt-6 flex flex-col items-center gap-3 sm:gap-4">
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-3 sm:gap-4 justify-center px-3">
                      {customerReview.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden cursor-pointer"
                          onClick={() => setReviewIndex(index)}
                        >
                          <img
                            src={img}
                            alt={`Customer review ${index + 1}`}
                            className="w-full h-full object-cover shadow-md"
                            onError={(e) => {
                              e.target.src = defaultPic;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base font-semibold">
                      Customer review images
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* BUSINESS SECTION */}
            {WorkerTab === "business" && isShop && (
              <div className="mt-6 w-full bg-[#D3FFD3] flex flex-col items-center py-6 sm:py-10">

                <div className="relative w-full max-w-[700px] h-[220px] xs:h-[260px] sm:h-[350px] md:h-[400px] px-3 sm:px-0">
                  {businessImage.length > 0 ? (
                    <img
                      src={businessImage[workIndex]}
                      alt={`Business image ${workIndex + 1}`}
                      className="w-full h-full object-cover rounded-md shadow-md"
                      onError={(e) => {
                        e.target.src = defaultPic;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                      No business images available.
                    </div>
                  )}
                </div>

                {businessImage.length > 0 && (
                  <div className="mt-6 flex flex-col items-center gap-3 sm:gap-4">
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-3 sm:gap-4 justify-center px-3">
                      {businessImage.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden cursor-pointer"
                          onClick={() => setWorkIndex(index)}
                        >
                          <img
                            src={img}
                            alt={`Business image ${index + 1}`}
                            className="w-full h-full object-cover shadow-md"
                            onError={(e) => {
                              e.target.src = defaultPic;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base font-semibold">
                      Business images
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>



          <div className="container mx-auto max-w-[750px] px-3 sm:px-6 py-6">

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">

              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                <h2 className="text-xl font-bold">Documents</h2>

                <span
                  className={`${statusClass} text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto`}
                >
                  {verifiedStatus}
                </span>
              </div>

              <div className="mt-4">

                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div
                      key={index}
                      className="mb-8 border-b border-gray-200 pb-8 last:border-b-0 last:mb-0 last:pb-0"
                    >

                      {/* Document Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                          <img
                            src={Aadhar}
                            alt="Document Icon"
                            className="w-7 h-7 sm:w-8 sm:h-8"
                          />
                        </div>

                        <p className="text-base sm:text-lg font-semibold text-gray-800">
                          {doc.documentName}
                        </p>
                      </div>

                      {/* Images Grid */}
                      {doc.images?.length > 0 ? (
                        <div className="relative">

                          {/* All Images (blur if not hired) */}
                          <div
                            className={`grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 ${!isHired ? "blur-md pointer-events-none" : ""
                              }`}
                          >
                            {doc.images.map((img, imgIndex) => (
                              <div
                                key={imgIndex}
                                className={`group relative w-full xs:w-32 xs:h-32 h-36 sm:w-32 sm:h-32 overflow-hidden rounded-lg shadow-lg transition-shadow 
                      ${isHired ? "cursor-pointer hover:shadow-xl" : "cursor-default"}`}
                                onClick={
                                  isHired ? () => handleDocumentClick(img) : undefined
                                }
                              >
                                <img
                                  src={img}
                                  alt={`${doc.documentName} image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => { e.target.src = defaultPic; }}
                                />

                                {/* Hover overlay (only if hired) */}
                                {isHired && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-opacity opacity-0 group-hover:opacity-100">
                                    <span className="text-white font-medium text-xs sm:text-sm">
                                      Click to view
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Locked Overlay (only if not hired) */}
                          {!isHired && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                              <div className="text-center bg-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-gray-200 w-[80%] sm:w-auto">
                                <p className="text-lg sm:text-xl font-bold text-[#228B22]">
                                  Hire to Unlock
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  View clear document images after hiring
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic pl-1">
                          No images uploaded for this document.
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  // No documents at all
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-xl font-medium text-gray-600">No Documents Uploaded Yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Documents will appear here once the worker uploads them.
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>



          {/* Document Preview Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg max-w-3xl">
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="text-gray-600 hover:text-gray-800 font-semibold"
                  >
                    Close
                  </button>
                </div>
                <img
                  src={selectedImage}
                  alt="Document Preview"
                  className="w-full h-auto max-h-[80vh] object-contain"
                  onError={(e) => {
                    e.target.src = defaultPic;
                  }}
                />
              </div>
            </div>
          )}
          {type === "direct" &&
            (hire_status === "pending" || hire_status === "NoStatus") &&
            !isHired && (
              <div className="flex justify-center mt-6">
                <button
                  className="w-1/2 py-4 bg-[#228B22] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                  onClick={() => handleDirectHire(worker._id)}
                >
                  Hire
                </button>
              </div>
            )}
          {type === "emergency" && !isPlatformFeePaid && !isHired && (
            <>
              {hire_status === "pending" && (
                <div className="flex justify-center mt-6">
                  <button
                    className="w-1/2 py-4 bg-[#228B22] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                    onClick={() => handleHire(worker._id)}
                  >
                    Hire
                  </button>
                </div>
              )}

              {hire_status === "assigned" && (
                <div className="flex justify-center mt-6">
                  <button
                    className="w-1/2 py-4 bg-[#1C4ED8] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                    onClick={handlePayment}
                  >
                    Pay
                  </button>
                </div>
              )}
            </>
          )}


          <div className="container mx-auto max-w-[750px] px-6 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Rate & Reviews</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-lead-600">
                  Ratings
                </span>
                <span className="text-2xl font-bold text-[#228B22]">
                  {avgRating}
                </span>
                <span className="text-sm text-gray-600">
                  ({totalReviews} reviews)
                </span>
              </div>
            </div>
            {displayedReviews.length > 0 ? (
              displayedReviews.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md p-6 mb-4"
                >
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star, i) => (
                      <span
                        key={i}
                        className={
                          i < item.rating ? "text-yellow-400" : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={item.user.profilePic || defaultPic}
                      alt="Reviewer"
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.target.src = defaultPic;
                      }}
                    />
                    <h3 className="font-semibold">{item.user.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 break-words whitespace-normal overflow-hidden">
                    {item.review}
                  </p>

                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(item.createdAt).toLocaleDateString()} •{" "}
                    {item.order_type}
                  </p>
                  {item.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Review image ${i + 1}`}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => {
                            e.target.src = defaultPic;
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No Ratings Available</p>
            )}
            {rateAndReviews.length > 2 && !showAllReviews && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="text-[#228B22] font-semibold hover:underline"
                >
                  See All Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}