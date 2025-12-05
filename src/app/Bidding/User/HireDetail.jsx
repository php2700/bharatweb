import Header from "../../../component/Header";
import banner from "../../../assets/banner.png";
import Footer from "../../../component/footer";
// import Profile from "../../../assets/default-image.jpg";
import locationIcon from "../../../assets/directHiring/location-icon.png";
import ratingImgages from "../../../assets/directHiring/rating.png";
import backArrow from "../../../assets/profile/arrow_back.svg"; // <-- added
import aadharImg from "../../../assets/Details/profile-line.svg";
import defaultPic from "../../../assets/default-image.jpg";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HireDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { bidding_offer_id, order_id, hire_status, platFormFee } = location.state || {};

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [providerDetail, setProviderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [documentsUnlocked, setDocumentsUnlocked] = useState(false);
  const [WorkerTab, setWorkerTab] = useState("work");
  const [workIndex, setWorkIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const dispatch = useDispatch();

  // Persistent key so once documents are unlocked for this user/provider,
  // they remain unlocked across refreshes, re-renders, or route-state loss.
  // We intentionally avoid depending on order_id because location.state
  // (where order_id comes from) is cleared on hard refresh.
  const currentUserId = localStorage.getItem("user_id");
  const docUnlockKey =
    currentUserId && id
      ? `bidding_docs_unlocked_${currentUserId}_${id}`
      : null;

  const { profile } = useSelector((state) => state.user);
  // console.log("User Profile from Redux:", profile); // Debugging line
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  if (profile && profile.data) {
    localStorage.setItem("user_id", profile._id);
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };


  const fetchBannerImages = async () => {
    const token = localStorage.getItem("bharat_token");
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
        setBannerImages(response.data.images || []);
        setBannerError(
          response.data.images.length === 0 ? "No banners available" : null
        );
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch banner images";
        setBannerError(errorMessage);
      }
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

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

  useEffect(() => {
    const token = localStorage.getItem("bharat_token");

    fetch(`${BASE_URL}/negotiations/getLatestNegotiation/${order_id}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);
  useEffect(() => {
    const fetchServiceProviderById = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) return;

        const res = await fetch(`${BASE_URL}/user/getServiceProvider/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Service Provider Data:", data); // Debugging line
        if (res.ok) {
          setProviderDetail(data.data);
        } else {
          console.error(data.message || "Failed to fetch provider");
        }
      } catch (err) {
        console.error("Error fetching provider:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceProviderById();
    }
  }, [id]);

  // Auto-slide for work images
  useEffect(() => {
    const workImages = providerDetail?.hiswork || [];
    if (WorkerTab !== "work" || workImages.length === 0) return;

    const interval = setInterval(() => {
      setWorkIndex((prevIndex) => (prevIndex + 1) % workImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, providerDetail?.hiswork?.length]);

  // Auto-slide for customer review images
  useEffect(() => {
    const reviewImages = providerDetail?.customerReview || [];
    if (WorkerTab !== "review" || reviewImages.length === 0) return;

    const interval = setInterval(() => {
      setReviewIndex(
        (prevIndex) => (prevIndex + 1) % reviewImages.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, providerDetail?.customerReview?.length]);

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleDocumentClick = (image) => {
    setSelectedImage(image);
  };

  const handleRouteHire = (providerId, isHiredFlag) => {
    if (!providerId) return;
    navigate(`/profile-details/${providerId}/bidding`, {
      state: {
        bidding_offer_id,
        order_id,
        hire_status,
        isHired: !!isHiredFlag,
        platFormFee,
      },
    });
  };

  // Determine isHired similar to ViewProfileDetails behavior
  // Unlock when:
  // - hire_status === "accepted"
  // - OR explicit isHired flag is passed from navigation state
  // - OR platform fee is already marked as paid
  const isHired =
    location.state?.isHired !== undefined
      ? !!location.state?.isHired
      : hire_status === "accepted" || !!platFormFee;

  // Central helper to unlock documents
  const unlockDocuments = () => {
    setDocumentsUnlocked(true);
  };

  // On initial load, if we ever unlocked documents before for this
  // order/provider, keep them permanently unlocked.
  useEffect(() => {
    if (docUnlockKey && localStorage.getItem(docUnlockKey) === "false") {
      setDocumentsUnlocked(false);
    }
  }, [docUnlockKey]);

  // On initial load (and when isHired changes), auto-unlock documents
  useEffect(() => {
    if (isHired) {
      unlockDocuments();
      if (docUnlockKey) {
        localStorage.setItem(docUnlockKey, "false");
      }
    }
  }, [isHired, docUnlockKey]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!providerDetail) {
    return <div className="text-center py-10">No Provider Found</div>;
  }

  // Destructure fields similar to ViewProfileDetails for reuse in UI
  const {
    full_name = providerDetail.full_name || "N/A",
    unique_id = providerDetail.unique_id || "N/A",
    location: providerLocation = providerDetail.location || {
      address: "Not Available",
    },
    businessAddress = providerDetail.businessAddress || {
      address: "Not Available",
    },
    isShop = providerDetail.isShop || false,
    profilePic = providerDetail.profilePic || null,
    skill = providerDetail.skill || "No Skill Available",
    category = providerDetail.category || { name: providerDetail.category_name || "Not Available" },
    subcategory_names = providerDetail.subcategory_names || [],
    emergencySubcategory_names = providerDetail.emergencySubcategory_names || [],
    documents = providerDetail.documents || [],
    rateAndReviews = providerDetail.rateAndReviews || [],
    verificationStatus = providerDetail.verificationStatus || "pending",
    hiswork = providerDetail.hiswork || [],
    customerReview = providerDetail.customerReview || [],
    businessImage = providerDetail.businessImage || [],
    avgRating = providerDetail.avgRating || (providerDetail.rating?.toString?.() ?? "0.0"),
    totalReviews = providerDetail.totalReviews || providerDetail.totalReview || 0,
  } = providerDetail;

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

  const handleNagotiation = async (offer) => {
    const userId = localStorage.getItem("user_id"); // user id from localStorage
    const token = localStorage.getItem("bharat_token"); // bearer token from localStorage

    if (!offer) {
      toast.error("Please enter offer amount ❗");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/negotiations/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // bearer token
        },
        body: JSON.stringify({
          order_id, // from location.state
          bidding_offer_id, // from location.state
          service_provider: id, // from URL
          user: userId, // from localStorage
          initiator: "user", // fixed
          offer_amount: Number(offer), // from parameter
          message: `Can you do it for ${offer}?`, // dynamic with offer
        }),
      });

      const data = await response.json();
      // console.log("Negotiation API Response:", data);

      if (response.ok) {
        setOffer(" ");
        toast.success(`You sent ₹${offer} Amount For Negotiation`);
      } else {
        alert(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to start negotiation ❌");
    }
  };

  // const handleAcceptNegotiation = async (id, role) => {
  //   const token = localStorage.getItem("bharat_token");
  //   if (!id) {
  //     toast.error("Negotiation ID is missing ❗");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${BASE_URL}/negotiations/accept/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         role: role,
  //       }),
  //     });

  //     const result = await response.json();
  //     console.log("Accept Negotiation API Response:", result);

  //     if (response.ok) {
  //       toast.success("You accepted the negotiation ✅");
  //       // Optionally, refresh negotiation data here
  //     } else {
  //       toast.error(result.message || "Something went wrong ❌");
  //     }
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     toast.error("Failed to accept negotiation ❌");
  //   }
  // };

  const handleAcceptNegotiation = async (
    negotiationId,
    role,
    orderId,
    serviceProviderId
  ) => {
    const token = localStorage.getItem("bharat_token");

    if (!negotiationId || !orderId || !serviceProviderId) {
      toast.error("Required IDs are missing ❗");
      return;
    }

    try {
      // 1️⃣ Accept Negotiation
      const acceptResponse = await fetch(`${BASE_URL}/negotiations/accept/${negotiationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const acceptResult = await acceptResponse.json();
      if (!acceptResponse.ok) {
        toast.error(acceptResult.message || "Failed to accept negotiation ❌");
        return;
      }
      toast.success("Negotiation accepted ✅");
      // Unlock documents as soon as negotiation is accepted
      unlockDocuments();
      if (docUnlockKey) {
        localStorage.setItem(docUnlockKey, "true");
      }

      // 2️⃣ Create Platform Fee Order
      const orderResponse = await fetch(`${BASE_URL}/bidding-order/createPlatformFeeOrder/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const orderResult = await orderResponse.json();
      if (!orderResponse.ok || !orderResult.status) {
        toast.error(orderResult.message || "Failed to create platform fee order ❌");
        return;
      }

      const { razorpay_order_id, total_cost, currency } = orderResult;

      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Failed to load Razorpay SDK ❌");
        return;
      }

      // 4️⃣ Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total_cost * 100,
        currency: currency || "INR",
        name: "TheBharatworks",
        description: "Platform Fee Payment",
        order_id: razorpay_order_id,
        handler: async function (paymentResponse) {
          toast.success("Payment Successful ✅");

          // 5️⃣ Verify Payment
          try {
            const verifyResponse = await fetch(
              `${BASE_URL}/bidding-order/verifyPlatformFeePayment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  serviceProviderId,
                }),
              }
            );

            const verifyResult = await verifyResponse.json();
            if (verifyResponse.ok && verifyResult.status) {
              toast.success("Payment verified successfully ✅");
              console.log("Verify Response:", verifyResult);
              // Unlock documents after successful payment verification
              unlockDocuments();
              if (docUnlockKey) {
                localStorage.setItem(docUnlockKey, "true");
              }
            } else {
              console.log("Verify Response:", verifyResult);
              toast.error(verifyResult.message || "Payment verification failed ❌");
            }
          } catch (err) {
            console.error("Verify API error:", err);
            toast.error("Payment verification failed ❌");
          }
        },
        theme: { color: "#228B22" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error("Payment Failed ❌");
      });
    } catch (error) {
      console.error("Error in negotiation/payment flow:", error);
      toast.error("Something went wrong ❌");
    }
  };



  const handlePayment = async (order_id, serviceProviderId) => {
    const token = localStorage.getItem("bharat_token");

    if (!order_id) {
      toast.error("Order ID is missing ❗");
      return;
    }

    // 1️⃣ Load Razorpay script dynamically
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Failed to load Razorpay SDK ❌");
      return;
    }

    try {
      // 2️⃣ Create order on backend
      const response = await fetch(
        `${BASE_URL}/bidding-order/createPlatformFeeOrder/${order_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok || !result.status) {
        toast.error(result.message || "Something went wrong ❌");
        return;
      }

      const { razorpay_order_id, total_cost, currency } = result;

      // 3️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total_cost * 100,
        currency: currency || "INR",
        name: "TheBharatworks",
        description: "Platform Fee Payment",
        order_id: razorpay_order_id,
        handler: async function (paymentResponse) {
          console.log("Payment Successful:", paymentResponse);
          toast.success("Payment Successful ✅");

          // 4️⃣ Call your verify API
          try {
            const verifyResponse = await fetch(
              `${BASE_URL}/bidding-order/verifyPlatformFeePayment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  serviceProviderId,
                }),
              }
            );

            const verifyResult = await verifyResponse.json();
            if (verifyResponse.ok && verifyResult.status) {
              toast.success("Payment verified successfully ✅");
              console.log("Verify Response:", verifyResult);
              // Unlock documents after successful payment verification
              unlockDocuments();
              // Optionally refresh UI or update state
            } else {
              console.log("Verify Response:", verifyResult);
              toast.error(
                verifyResult.message || "Payment verification failed ❌"
              );
            }
          } catch (err) {
            console.error("Verify API error:", err);
            toast.error("Payment verification failed ❌");
          }
        },
        theme: { color: "#228B22" },
      };

      // 5️⃣ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error("Payment Failed ❌");
      });
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to initiate payment ❌");
    }
  };


  return (
    <>
      <Header />
<div className="container mx-auto  px-4 py-4 fixed top-20 left-8 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#228B22] hover:text-green-800 font-semibold cursor-pointer"
        >
          <img src={backArrow} className="w-6 h-6 mr-2" alt="Back" />
          Back
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="min-h-screen bg-gray-50 mt-35">
        {/* Banner */}
       
       
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
            Bidding Hiring
          </h2>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 
                gap-6 sm:gap-10 md:gap-[80px] items-start">

              {/* Profile Pic */}
              <div className="relative w-full">
                <img
                  src={providerDetail?.profilePic || defaultPic}
                  alt="Service Provider"
                  className="w-full h-[260px] sm:h-[350px] md:h-[450px] 
                 object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultPic;
                  }}
                />
              </div>

              {/* Right Side */}
              <div className="flex flex-col gap-4 mt-4 md:mt-0 px-1 sm:px-0">

                {/* Name + Rating */}
                <div className="flex items-center justify-between w-full flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-bold">
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
                </div>

                {/* ID */}
                <div className="flex items-center gap-2 text-gray-600 font-semibold">
                  <span className="font-semibold text-[#228B22]">Id-</span>
                  <span>{unique_id}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 font-semibold">
                  <img src={locationIcon} alt="Location" className="w-5 h-5" />
                  <span>{providerDetail.location?.address || "Location not available"}</span>
                </div>

                {/* Category */}
                <p className="text-base font-semibold text-gray-700">
                  <span className="font-semibold text-[#228B22]">Category-</span>{" "}
                  {providerDetail.category?.name ||
                    providerDetail.category_name ||
                    "Not Available"}
                </p>

                {/* Subcategories */}
                <p className="text-base font-semibold text-gray-700 -mt-2">
                  <span className="font-semibold text-[#228B22]">Sub-Categories-</span>{" "}
                  {providerDetail.subcategory_names?.length > 0
                    ? providerDetail.subcategory_names.map((name, index) => (
                      <span key={index}>
                        {name.trim()}
                        {index !== providerDetail.subcategory_names.length - 1 ? ", " : ""}
                      </span>
                    ))
                    : "Not Available"}
                </p>

                {/* About Section */}
                <div className="p-3 sm:p-4 shadow-xl rounded-xl 
                    max-w-full sm:max-w-[600px] 
                    h-auto sm:h-[260px]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">About My Skill</h3>
                  </div>
                  <p className="mt-1 text-gray-700 text-base leading-relaxed break-all">
                    {providerDetail.skill || "No skill info available."}
                  </p>
                </div>
              </div>
            </div>


            {/* Tabs - His Work & Customer Review - Exactly same as first code */}
            <div className="container mx-auto px-4 py-6">
              <div
                className="
      flex flex-col sm:flex-row 
      justify-center items-center 
      gap-3 sm:gap-6 
      p-3 sm:p-4 
      mt-4 sm:mt-6
    "
              >
                <button
                  onClick={() => {
                    setWorkerTab("work");
                    setWorkIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md cursor-pointer shadow-md font-semibold 
        ${WorkerTab === "work"
                      ? "bg-[#228B22] text-white"
                      : "bg-green-100 text-[#228B22]"
                    }`}
                  aria-label="View Work"
                >
                  His Work
                </button>

                <button
                  onClick={() => {
                    setWorkerTab("review");
                    setReviewIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md cursor-pointer shadow-md font-semibold 
        ${WorkerTab === "review"
                      ? "bg-[#228B22] text-white"
                      : "bg-green-100 text-[#228B22]"
                    }`}
                  aria-label="View Customer Reviews"
                >
                  Customer Review
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Document Preview Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white p-3 sm:p-4 rounded-lg w-full max-w-[90vw] sm:max-w-3xl relative">

              <button
                onClick={closeModal}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 
                   bg-white text-gray-700 hover:text-gray-900 shadow-lg 
                   w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                   flex items-center justify-center text-xl sm:text-2xl font-bold"
                aria-label="Close image preview"
              >
                ×
              </button>

              <img
                src={selectedImage}
                alt="Document Preview"
                className="w-full h-auto 
                   max-h-[70vh] sm:max-h-[78vh] 
                   max-w-full sm:max-w-[85vw] 
                   object-contain"
                onError={(e) => {
                  e.target.src = defaultPic;
                }}
              />
            </div>
          </div>
        )}


        {/* Work / Customer Review Image Sections */}
        {WorkerTab === "work" && (
          <div className="mt-6 w-full bg-[#D3FFD3] flex flex-col items-center py-10">
            <div className="relative w-[700px] h-[400px]">
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
            {hiswork.length > 0 && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="flex flex-wrap gap-4 justify-center">
                  {hiswork.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 overflow-hidden cursor-pointer"
                      onClick={() => setWorkIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`Work sample ${index + 1}`}
                        className="w-full h-full object-cover rounded-md shadow-md"
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

        {WorkerTab === "review" && (
          <div className="mt-6 w-full bg-[#D3FFD3] flex flex-col items-center py-10">
            <div className="relative w-[700px] h-[400px]">
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
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="flex flex-wrap gap-4 justify-center">
                  {customerReview.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 overflow-hidden cursor-pointer"
                      onClick={() => setReviewIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`Customer review ${index + 1}`}
                        className="w-full h-full object-cover rounded-md shadow-md"
                        onError={(e) => {
                          e.target.src = defaultPic;
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-gray-700 text-base font-semibold">
                  Customer review images
                </p>
              </div>
            )}
          </div>
        )}



        <div className="container max-w-2xl mx-auto my-10 space-y-6">

          {/* Reviews */}

          {/* Documents Section – copied structure from ViewProfileDetails */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold">Documents</h2>
              <span
                className={`${statusClass} text-xs font-semibold px-3 py-1 rounded-full`}
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
                    {/* Document header – always sharp */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                        <img
                          src={aadharImg}
                          alt="Document Icon"
                          className="w-8 h-8"
                        />
                      </div>
                      <p className="text-lg font-semibold text-gray-800">
                        {doc.documentName}
                      </p>
                    </div>
                    {/* Images grid */}
                    {doc.images?.length > 0 ? (
                      <div className="relative">
                        {/* Images – blurred + no interaction when not hired */}
                        <div
                          className={`flex flex-wrap gap-6 ${!documentsUnlocked
                            ? "blur-md pointer-events-none"
                            : ""
                            }`}
                        >
                          {doc.images.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className={`group relative w-32 h-32 overflow-hidden rounded-lg shadow-lg transition-shadow ${documentsUnlocked
                                ? "cursor-pointer hover:shadow-xl"
                                : "cursor-default"
                                }`}
                              onClick={
                                documentsUnlocked
                                  ? () => handleDocumentClick(img)
                                  : undefined
                              }
                            >
                              <img
                                src={img}
                                alt={`${doc.documentName} image ${imgIndex + 1
                                  }`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.src = defaultPic;
                                }}
                              />

                              {/* Hover overlay – only when hired */}
                              {documentsUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity opacity-0 group-hover:opacity-100">
                                  <span className="text-white font-medium text-sm">
                                    Click to view
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Blur overlay + CTA – only when not hired */}
                        {!documentsUnlocked && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                            <div className="text-center bg-white p-5 rounded-2xl shadow-2xl border border-gray-200">
                              <p className="text-xl font-bold text-[#228B22]">
                                Hire to Unlock
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
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
                /* No documents at all – always fully visible */
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-xl font-medium text-gray-600">
                    No Documents Uploaded Yet
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Documents will appear here once the worker uploads them.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rate & Reviews Section – copied from ViewProfileDetails */}
          <div className="bg-white rounded-xl shadow-md p-6">
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
            {(() => {
              const displayedReviews = showAllReviews
                ? rateAndReviews
                : rateAndReviews.slice(0, 2);

              if (displayedReviews.length > 0) {
                return (
                  <>
                    {displayedReviews.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-xl shadow-md p-6 mb-4"
                      >
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star, i) => (
                            <span
                              key={i}
                              className={
                                i < item.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
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
                        <p className="text-gray-600 text-sm mb-2">
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
                    ))}
                  </>
                );
              }

              return (
                <p className="text-gray-500 text-center">
                  No Ratings Available
                </p>
              );
            })()}
            {rateAndReviews.length > 2 && !showAllReviews && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="cursor-pointer text-[#228B22] font-semibold hover:underline"
                >
                  See All Reviews
                </button>
              </div>
            )}
          </div>

          <div>

            {/* Offer/Negotiate Section */}
            {hire_status === "pending" && (
              <div className="flex flex-col items-center p-4 sm:p-6">

                {/* Tabs */}
                <div className="flex flex-col sm:flex-row sm:space-x-4 mb-8 sm:mb-12 bg-[#EDEDED] 
                    rounded-[30px] sm:rounded-[50px] p-3 sm:p-[12px] w-full 
                    sm:w-auto justify-center gap-3">

                  <button
                    onClick={() => setIsOfferActive(true)}
                    className={`px-6 sm:px-16 py-2 rounded-full cursor-pointer font-medium shadow-sm 
          ${isOfferActive
                        ? "bg-[#228B22] text-white border border-green-600"
                        : "border border-green-600 text-green-600"
                      }`}
                  >
                    Offer Price ({data?.offer_amount || 0})
                  </button>

                  <button
                    onClick={() => setIsOfferActive(false)}
                    className={`px-6 sm:px-16 py-2 rounded-full cursor-pointer font-medium shadow-md 
          ${!isOfferActive
                        ? "bg-[#228B22] text-white"
                        : "border border-green-600 text-green-600"
                      }`}
                  >
                    Negotiate
                  </button>
                </div>

                {/* Input Field (Mobile Responsive) */}
                {!isOfferActive && (
                  <input
                    type="number"
                    placeholder="Enter your offer amount"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    className="w-full sm:w-[531px] px-4 py-2 border-2 border-[#dce1dc] 
                   rounded-md text-center text-[#453e3f] placeholder-green-600
                   focus:outline-none focus:ring-2 focus:ring-[#d1d1d1]"
                  />
                )}
              </div>
            )}

            {/* Accept / Send Request */}
            {hire_status === "pending" && (
              <div className="text-center px-4">
                <button
                  className="bg-[#228B22] text-white w-full cursor-pointer px-6 sm:px-10 py-3 
                 rounded-md font-semibold"
                  onClick={() => {
                    if (isOfferActive) {
                      handleAcceptNegotiation(data._id, "user", order_id, id);
                    } else {
                      handleNagotiation(offer);
                    }
                  }}
                >
                  {isOfferActive ? "Accept Request" : "Send Request"}
                </button>
              </div>
            )}

            {hire_status === "accepted" && !platFormFee && (
              <div className="text-center px-4">
                <button
                  className="bg-[#228B22] text-white w-full px-6 sm:px-10 py-3 rounded-md 
                 font-semibold cursor-pointer"
                  onClick={() => {
                    handlePayment(order_id, id);
                  }}
                >
                  Pay Now
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