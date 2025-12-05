import { useEffect, useState } from "react";
import { data, Link, useNavigate, useParams } from "react-router-dom";
import { SlidersHorizontal, Search, MapPin } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
// import workImage from "../../../assets/workcategory/image.png";
import workImage from "../../../assets/default-image.jpg";
import bannerPlaceholder from "../../../assets/workcategory/image.png";
import noWorkImage from "../../../assets/bidding/no_related_work.png";
import callIcon from "../../../assets/bidding/call.png";
import msgIcon from "../../../assets/bidding/msg.png";
import editIcon from "../../../assets/bidding/edit.png";
import cancelIcon from "../../../assets/bidding/cancel.png";
import backArrow from "../../../assets/profile/arrow_back.svg";
import warningIcon from "../../../assets/ViewProfile/warning.svg";
import ReviewModal from "../../CommonScreens/ReviewModal";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Accepted from "./Accepted";
import OrderReviewModal from "../../CommonScreens/OrderReviewModal";
import Warning1 from "../../../assets/warning1.png";
import Warning3 from "../../../assets/warning3.png";

export default function BiddinggetWorkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCancelled, setIsCancelled] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [providers, setProviders] = useState([]);
  const [tab, setTab] = useState("bidder");
  const [orderDetail, setOrderDetail] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showOrderReviewModal, setShowOrderReviewModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [disputeInfo, setDisputeInfo] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [openImage, setOpenImage] = useState(null);
  const [localInvited, setLocalInvited] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");


  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.setItem("order_id", id);
    fetchBannerImages();
    fetchOrder();
    fetchOffers();
  }, [id]);
  const applySort = (data) => {
    if (!sortType) return data;

    let sorted = [...data];

    switch (sortType) {
      case "name-asc":
        sorted.sort((a, b) =>
          (a.full_name || a.provider_id?.full_name).localeCompare(
            b.full_name || b.provider_id?.full_name
          )
        );
        break;

      case "name-desc":
        sorted.sort((a, b) =>
          (b.full_name || b.provider_id?.full_name).localeCompare(
            a.full_name || a.provider_id?.full_name
          )
        );
        break;

      case "amount-low":
        sorted.sort((a, b) => (a.bid_amount || 0) - (b.bid_amount || 0));
        break;

      case "amount-high":
        sorted.sort((a, b) => (b.bid_amount || 0) - (a.bid_amount || 0));
        break;

      case "duration-low":
        sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;

      case "duration-high":
        sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;

      default:
        return data;
    }

    return sorted;
  };

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

  const fetchBannerImages = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
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

      if (response.data?.success && Array.isArray(response.data.images)) {
        setBannerImages(response.data.images);
      } else {
        setBannerError("No banners available");
      }
    } catch (err) {
      setBannerError(err.message || "Failed to fetch banner images");
    } finally {
      setBannerLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      const response = await axios.get(
        `${BASE_URL}/bidding-order/getBiddingOffers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setOffers(response.data.data || []);
      } else {
        throw new Error(response.data?.message || "Failed to fetch offers");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `${BASE_URL}/bidding-order/getBiddingOrderById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Order Response:", response);
      if (response.status === 200) {
        console.log("Data received from API:", response);

        setAssignedWorker(response.data.assignedWorker || null);
        const order = response.data.data;
        setOrderDetail(order);
        setDisputeInfo(response.data.DisputeInfo || null);
        setCategoryId(order?.category_id?._id || null);
        setSubCategoryIds(
          Array.isArray(order?.sub_category_ids)
            ? order.sub_category_ids.map((sub) => sub._id)
            : []
        );
      } else {
        throw new Error(response.data?.message || "Failed to fetch order");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceProviders = async () => {
    if (!categoryId || subCategoryIds.length === 0) return;

    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${BASE_URL}/user/getServiceProviders`,
        {
          category_id: categoryId,
          subcategory_ids: subCategoryIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Providers Response:", response);
      if (response.status === 200) {
        setProviders(response.data.data || []);
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch service providers"
        );
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };
  const handleGetDirections = (destinationAddress) => {
    if (destinationAddress) {

      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destinationAddress
      )}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      toast.warn("Destination address not found!");
    }
  };

  useEffect(() => {
    fetchServiceProviders();
  }, [categoryId, subCategoryIds]);

  useEffect(() => {
    console.log("Providers updated:", providers);
  }, [providers]);

  const InviteSendWorker = async (workerId) => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${BASE_URL}/bidding-order/inviteServiceProviders`,
        {
          order_id: id,
          provider_ids: [workerId],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Invitation sent successfully");
      } else {
        throw new Error(response.data?.message || "Failed to send invitation");
      }
    } catch (err) {
      toast.error(err.message || "Network error, please try again.");
    }
  };
  const handleInviteClick = async (workerId) => {
    // UI instantly update
    setLocalInvited((prev) => [...prev, workerId]);

    try {
      await InviteSendWorker(workerId); // <-- Tumhara API function

    } catch (err) {
      // API fail ho to local state revert
      setLocalInvited((prev) => prev.filter((x) => x !== workerId));
    }
  };


  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("bharat_token");

      const response = await axios.post(
        `${BASE_URL}/bidding-order/completeOrderUser`,
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
        })
          .then(() => fetchOrder())
          .then(() => {
            setShowCompletedModal(true);
          });
        return;
      }

      // ❌ If API returns non-200 but no throw (edge case)
      throw new Error(
        response.data?.message || "Failed to mark order as complete"
      );
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

      // ⚠️ Case 2: Pending payments exist (400 Bad Request)
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
            // Ask confirmation for releasing all payments
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
                  `${BASE_URL}/bidding-order/requestAllPaymentReleases/${id}`,
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
                  }).then(() => fetchOrder());
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

      // 🚫 Case 3: Generic error
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: err.message || "Failed to mark order as complete.",
        confirmButtonColor: "#FF0000",
      });
    }
  };

  const handleAcceptBid = async (serviceProviderId) => {
    const token = localStorage.getItem("bharat_token");
    if (!token) {
      toast.error("No token found ❗");
      return;
    }

    try {
      // 1️⃣ Accept Bid
      const acceptResponse = await axios.post(
        `${BASE_URL}/bidding-order/acceptBiddingOrder`,
        { service_provider_id: serviceProviderId, order_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (acceptResponse.status !== 200) {
        throw new Error(
          acceptResponse.data?.message || "Failed to accept bid ❌"
        );
      }

      // 2️⃣ Create Platform Fee Order
      const orderResponse = await fetch(
        `${BASE_URL}/bidding-order/createPlatformFeeOrder/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderResult = await orderResponse.json();
      if (!orderResponse.ok || !orderResult.status) {
        toast.error(
          orderResult.message || "Failed to create platform fee order ❌"
        );
        return;
      }

      const { razorpay_order_id, total_cost, currency } = orderResult;

      // 3️⃣ Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay SDK ❌");
        return;
      }

      // 4️⃣ Razorpay Checkout Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total_cost * 100,
        currency: currency || "INR",
        name: "TheBharatworks",
        description: "Platform Fee Payment",
        order_id: razorpay_order_id,
        handler: async (paymentResponse) => {
          toast.success("Payment Successful ✅");

          try {
            // 5️⃣ Verify Payment
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
            console.log("Verify Response123:", verifyResult);
            if (verifyResponse.ok && verifyResult.status) {
              toast.success("Payment verified successfully ✅");
              await fetchOrder(); // refresh order after verification
            } else {
              // toast.info(
              //   verifyResult.message || "Payment verification failed ❌"
              // );
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
      console.error("Error in bid acceptance flow:", error);
      toast.error(error.message || "Something went wrong ❌");
    }
  };
  const confirmAccept = (providerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to accept this bid?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#228B22",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Accept",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAcceptBid(providerId); // <-- your original function runs here
      }
    });
  };


  const handleView = (serviceProviderId, biddingOfferId, orderId) => {
    navigate(`/bidding/hiredetail/${serviceProviderId}`, {
      state: {
        bidding_offer_id: biddingOfferId,
        order_id: orderId,
        hire_status: orderDetail?.hire_status || null,
        platFormFee: orderDetail?.platform_fee_paid,
      },
    });
  };

  const cancelTask = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("bharat_token");
          const response = await axios.put(
            `${BASE_URL}/bidding-order/cancelBiddingOrder/${id}`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response) {
            setIsCancelled(true);
            Swal.fire("Cancelled!", "Task has been cancelled.", "success");
          } else {
            throw new Error(response.data?.message || "Failed to cancel task");
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            error.message || "Something went wrong while cancelling.",
            "error"
          );
        }
      }
    });
  };

  const handlePayment = async (serviceProviderId) => {
    const token = localStorage.getItem("bharat_token");
    const order_id = id;
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
            console.log("Verify Responsedsds:", verifyResult);
            if (verifyResponse.ok && verifyResult.status) {
              toast.success("Payment verified successfully ✅");
              console.log("Verify Response123:", verifyResult);
              // Optionally refresh UI or update state
            } else {
              toast.info(
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

  const showRefundButton =
    orderDetail?.hire_status === "pending" ||
    (orderDetail?.hire_status === "accepted" &&
      orderDetail?.service_payment?.payment_history.length === 1);

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
        `${BASE_URL}/bidding-order/request-refund`,
        { orderId: id, reason: refundReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("ssds", response);
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
        fetchOrder(); // refresh data after refund
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

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      : "N/A";

  const getStatusStyles = (status) => {
    const statusStyles = {
      pending: "bg-yellow-500",
      cancelled: "bg-[#FF0000]",
      completed: "bg-[#228B22]",
      cancelledDispute: "bg-[#FF8C00]",
      accepted: "bg-blue-500",
    };
    return statusStyles[status] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
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

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-2xl text-center font-bold mb-4">Work Detail</div>
        {orderDetail?.image_url?.length > 0 ? (
          <Carousel
            showArrows
            showThumbs={false}
            infiniteLoop
            emulateTouch
            swipeable
            interval={3000}
            showStatus={false}
            autoPlay
            onClickItem={(index) => handleOpenImage(orderDetail.image_url[index])}
            className="w-full 
               h-[180px]        /* mobile */
               sm:h-[250px] 
               md:h-[360px]"   /* desktop unchanged */
          >
            {orderDetail.image_url.map((url, index) => (
              <div key={index} className="cursor-pointer pointer-events-auto">
                <img
                  src={url}
                  alt={`Project image ${index + 1}`}
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
            alt="No project images available"
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


        {/* Fullscreen modal */}
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
          <div className="flex justify-between items-start">
            <div className="w-full md:w-auto">
              <h2 className="text-lg font-semibold break-words">
                {orderDetail?.title
                  ? orderDetail.title.charAt(0).toUpperCase() + orderDetail.title.slice(1)
                  : "N/A"}
              </h2>
              <span
                onClick={() => setShowMap(true)}
                className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm font-semibold py-1 rounded-full mt-2"
              >
                <FaMapMarkerAlt size={18} color="#228B22" />
                <span className="truncate">
                  {orderDetail?.address || "N/A"}
                </span>
              </span>
              <span className="text-gray-600 text-sm font-semibold block">
                One Time Project fee :- ₹{orderDetail?.platform_fee || "0"}
              </span>

              {/* {showMap && (
                  <div className="mt-4 w-full h-96 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                        orderDetail?.address || ""
                      )}`}
                    ></iframe>
                  </div>
                )} */}
              {showMap && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Location on Map
                      </h2>
                      <button
                        onClick={() => setShowMap(false)}
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
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                          orderDetail?.address || ""
                        )}`}
                      ></iframe>
                    </div>
                    <div className="mt-4 text-center">
                      {/* <button
          onClick={() => handleGetDirections(orderDetail?.address)}
          className="px-6 py-2 bg-[#228B22] text-white font-semibold rounded-lg hover:bg-green-700"
        >
          Get Directions
        </button> */}
                    </div>
                  </div>
                </div>

              )}
            </div>

            {/* DESKTOP VIEW (same as before) */}
            <div className="text-left sm:text-right sm:ml-auto mt-4 sm:mt-0 hidden sm:block">
              <p className="bg-black text-white text-md px-4 rounded-full inline-block sm:ml-auto">
                {orderDetail?.project_id || "N/A"}
              </p>

              <p className="text-md mt-2 sm:ml-auto">
                <span className="font-semibold">
                  Posted Date: {formatDate(orderDetail?.createdAt)}
                </span>
              </p>

              {/* Status */}
              <span className="text-gray-600 font-semibold block mt-1 sm:ml-auto">
                Status:{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusStyles(
                    orderDetail?.hire_status
                  )}`}
                >
                  {orderDetail?.hire_status
                    ? orderDetail.hire_status
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")
                    : "Unknown"}
                </span>
              </span>

              {/* Refund Status */}
              {orderDetail?.refundRequest && (
                <span className="text-gray-600 mt-2 font-semibold block">
                  Refund Status:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium
          ${orderDetail?.refundStatus === "pending" ? "bg-yellow-500" : ""}
          ${orderDetail?.refundStatus === "processed" ? "bg-blue-500" : ""}`}
                  >
                    {orderDetail?.refundStatus
                      ? orderDetail.refundStatus
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                      : "Unknown Status"}
                  </span>
                </span>
              )}
            </div>
          </div>


          {/* MOBILE VIEW (new div — left aligned) */}
          <div className="block sm:hidden mt-4 text-left">
            <p className="bg-black text-white text-md px-4 rounded-full inline-block">
              {orderDetail?.project_id || "N/A"}
            </p>

            <p className="text-md mt-2">
              <span className="font-semibold">
                Posted Date: {formatDate(orderDetail?.createdAt)}
              </span>
            </p>

            <span className="text-gray-600 font-semibold block mt-1">
              Status:{" "}
              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusStyles(
                  orderDetail?.hire_status
                )}`}
              >
                {orderDetail?.hire_status
                  ? orderDetail.hire_status
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                  : "Unknown"}
              </span>
            </span>

            {orderDetail?.refundRequest && (
              <span className="text-gray-600 mt-2 font-semibold block">
                Refund Status:{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium
          ${orderDetail?.refundStatus === "pending" ? "bg-yellow-500" : ""}
          ${orderDetail?.refundStatus === "processed" ? "bg-blue-500" : ""}`}
                >
                  {orderDetail?.refundStatus
                    ? orderDetail.refundStatus
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")
                    : "Unknown Status"}
                </span>
              </span>
            )}
          </div>



          <p className="text-sm">
            <span className="font-semibold">
              Completion Date:{" "}
              {orderDetail?.deadline
                ? new Date(orderDetail.deadline).toLocaleString()
                : "N/A"}
            </span>
          </p>
          <p className=" text-lg font-semibold text-gray-700">
            <span className="font-semibold text-[#228B22]">Category-</span>{" "} {orderDetail?.category_id?.name}
          </p>

          <p className="font-semibold text-sm">
            <span className="font-semibold text-[#228B22]">Sub-Categories-</span>{" "}
            {orderDetail?.sub_category_ids?.map((sub) => sub.name).join(", ")}
          </p>
          <h3 className="text-sm font-semibold">Task Details</h3>
          {/* <div className="border border-[#228B22] rounded-lg p-4 text-sm text-gray-700 space-y-3">
              <p>{orderDetail?.description || "No description available"}</p>
            </div> */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="border border-green-600 rounded-lg p-4 sm:p-5 md:p-6 bg-gray-50 mb-4 w-full">
              <p className="text-gray-700 tracking-tight text-sm sm:text-base leading-relaxed break-words">
                {orderDetail?.description || "No details available."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-6">
              {orderDetail?.hire_status === "cancelled" || isCancelled ? (
                // 🔴 Cancelled Message
                <div className="flex items-center justify-center gap-2 bg-[#FF0000] text-white px-6 py-3 rounded-lg font-medium">
                  <img src={cancelIcon} alt="Cancelled" className="w-5 h-5" />
                  Cancelled Task By User
                </div>
              ) : orderDetail?.hire_status === "pending" ||
                (orderDetail?.hire_status === "accepted" &&
                  !orderDetail?.platform_fee_paid) ? (
                // 🟢 Edit + Cancel Buttons (only if not cancelled)
                <div className="flex justify-center gap-6">
                  {/* <Link
                      to={`/bidding/edittask/${id}`}
                      className="flex items-center gap-2 text-[#228B22] px-6 py-3 rounded-lg font-medium border-2 border-[#228B22]"
                    >
                      <img src={editIcon} alt="Edit" className="w-5 h-5" />
                      Edit
                    </Link> */}
                  <button
                    onClick={cancelTask}
                    className="flex items-center gap-2 bg-[#FF0000] text-white px-6 py-3 rounded-lg font-medium cursor-pointer"
                  >
                    <img src={cancelIcon} alt="Cancel" className="w-5 h-5" />
                    Cancel Task
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          {/* ✅ Show Refund Button */}
          <div className="flex flex-col items-center mt-4 w-full max-w-xs mx-auto space-y-3">
            {showRefundButton && orderDetail?.platform_fee_paid && (
              <button
                onClick={() => setShowRefundModal(true)}
                className="cursor-pointer w-full px-6 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-blue-700"
              >
                Get Refund
              </button>
            )}

            {orderDetail?.refundRequest && (
              <button
                disabled
                className="cursor-pointer w-full px-4 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold opacity-75 cursor-not-allowed"
              >
                {orderDetail?.refundStatus == "pending"
                  ? "Refund Request Submitted"
                  : "Refunded"}
              </button>
            )}

            {/* Inline refund form (appears below buttons) */}
            {showRefundModal && (
              <div className="mt-4 bg-white border border-gray-300 rounded-lg p-4 shadow-md w-full">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
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
                    className="cursor-pointer px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefundRequest}
                    className="cursor-pointer px-4 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Task Status / Cancel Button */}
          <div className="text-center mb-6">
            {/* Show buttons depending on hire_status */}
            {orderDetail?.hire_status === "completed" ? (
              <div className="flex justify-center gap-4 flex-wrap">
                {/* ✅ Task Completed */}
                <span className="px-8 py-2 bg-[#228B22] text-white rounded-lg text-lg font-semibold">
                  Task Completed
                </span>

                {/* ✅ Review Buttons */}
                {orderDetail?.isReviewedByUser ? (
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
              </div>
            ) : // ) : orderDetail?.hire_status === "cancelledDispute" ? (
              //   <span className="px-8 py-2 bg-[#FF8C00] text-white rounded-lg text-lg font-semibold">
              //     Cancelled (Dispute)
              //   </span>
              // ) : null}
              orderDetail?.hire_status === "cancelledDispute" && disputeInfo ? (
                <Link to={`/disputes/bidding/${disputeInfo._id}`}>
                  <span
                    className="
    px-8 py-2 bg-[#FF8C00] text-white rounded-lg text-lg font-semibold 
    cursor-pointer hover:bg-orange-600 cursor-pointer 

    flex sm:inline-flex items-center gap-1   /* Mobile = flex (single line), Desktop = inline-flex */
    whitespace-nowrap                        /* Line break avoid */
  "
                  >
                    Cancelled (
                    <span className="ml-1">{disputeInfo.unique_id || "N/A"}</span>
                    )
                  </span>

                </Link>
              ) : null}
            <ReviewModal
              show={showCompletedModal}
              onClose={() => {
                setShowCompletedModal(false);
                fetchOrder();
              }}
              service_provider_id={
                orderDetail?.service_provider_id?._id || null
              }
              orderId={id}
              type="bidding"
            />
            <OrderReviewModal
              show={showOrderReviewModal}
              onClose={() => setShowOrderReviewModal(false)}
              orderId={id}
              type="bidding"
            />
          </div>
        </div>

        {(orderDetail?.hire_status === "pending" ||
          (orderDetail?.hire_status === "accepted" &&
            !orderDetail?.platform_fee_paid)) && (
            <div className="flex justify-center items-center w-full">
              <div className="bg-white rounded-[42px] shadow-[0px_4px_4px_0px_#00000040] p-4 max-w-3xl w-full">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-6 lg:gap-10 mb-4 bg-[#D9D9D9] p-[8px] rounded-full">
                  <button
                    onClick={() => setTab("bidder")}
                    className={`px-4 py-2 lg:px-17 lg:py-3 rounded-full cursor-pointer font-medium text-sm ${tab === "bidder"
                      ? "bg-[#228B22] text-white border-3"
                      : "bg-gray-100 text-[#228B22]"
                      }`}
                  >
                    Bidder
                  </button>
                  <button
                    onClick={() => setTab("related")}
                    className={`px-4 py-2 lg:px-17 lg:py-3 cursor-pointer rounded-full font-medium text-sm ${tab === "related"
                      ? "bg-[#228B22] text-white border-3"
                      : "bg-gray-100 text-[#228B22]"
                      }`}
                  >
                    Related Worker
                  </button>
                </div>
                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  {/* Search Box */}
                  <div className="w-full sm:w-[60%] flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for services"
                      className="flex-1 bg-transparent px-3 outline-none text-sm text-gray-700"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value.toLowerCase())}
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <div className="w-full sm:w-[35%]">
                    <select
                      className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-sm font-medium shadow-sm
                 hover:bg-gray-200 transition-all cursor-pointer"
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value)}
                    >
                      <option value="">Filter</option>

                      <option value="name-asc">Name A → Z</option>
                      <option value="name-desc">Name Z → A</option>

                      {String(tab).toLowerCase().includes("bid") && (
                        <>
                          <option value="amount-low">Amount Low → High</option>
                          <option value="amount-high">Amount High → Low</option>
                          <option value="duration-low">Duration Low → High</option>
                          <option value="duration-high">Duration High → Low</option>
                        </>
                      )}
                    </select>
                  </div>

                </div>

                {tab === "related" ? (
                  <div className="flex flex-col items-center w-full mt-4">
                    {Array.isArray(providers) && providers.length > 0 ? (
                      applySort(
                        providers.filter(
                          (provider) =>
                            provider.full_name?.toLowerCase().includes(searchText) &&
                            !offers.some((offer) => offer.provider_id?._id === provider._id)
                        )
                      )

                        .map((provider) => (
                          <div
                            key={provider._id}
                            className="flex flex-col sm:flex-row items-center sm:items-start 
              gap-4 bg-[#F9F9F9] rounded-xl p-4 shadow-md w-full sm:w-[738px] mb-5"
                          >
                            <img
                              src={provider.profile_pic || workImage}
                              alt={provider.full_name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                            />

                            {/* LEFT INFO */}
                            <div className="flex-1 text-left w-full">
                              <h3 className="text-[17px] font-bold text-[#303030]">
                                {provider.full_name || "Unknown"}
                              </h3>

                              {/* Rating */}
                              {provider.averageRating !== undefined ? (
                                <p className="text-sm font-medium flex items-center gap-1">
                                  <span className="text-yellow-600">
                                    Rating: {parseFloat(provider.averageRating).toFixed(1)} / 5.0
                                  </span>

                                  {provider.totalReview > 0 ? (
                                    <span className="text-gray-500 text-xs">
                                      ({provider.totalReview} reviews)
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">
                                      (No reviews yet)
                                    </span>
                                  )}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-500">No rating yet</p>
                              )}

                              <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                {provider.skill || "No skill listed"}
                              </p>

                              <div className="flex items-center gap-1 text-gray-700 font-semibold text-xs mt-1">
                                <MapPin className="text-green-600 w-4 h-4" />
                                {provider.location?.address || "Unknown location"}
                              </div>

                              <button
                                onClick={() => handleView(provider._id, null, id)}
                                className="cursor-pointer text-green-600 font-medium text-sm mt-2 w-full sm:w-auto"
                              >
                                View Profile
                              </button>
                            </div>

                            {/* RIGHT SIDE BUTTON */}
                            <div className="flex flex-col items-center sm:items-end w-full sm:w-auto mt-3 sm:mt-0">
                              <button
                                onClick={() => handleInviteClick(provider._id)}
                                disabled={
                                  localInvited.includes(provider._id) ||
                                  orderDetail?.invited_providers?.includes(provider._id)
                                }
                                className={`cursor-pointer px-4 sm:px-6 py-2 rounded-lg font-medium text-white w-full sm:w-auto
                  ${localInvited.includes(provider._id) ||
                                    orderDetail?.invited_providers?.includes(provider._id)
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#228B22] hover:bg-green-700"
                                  }`}
                              >
                                {localInvited.includes(provider._id) ||
                                  orderDetail?.invited_providers?.includes(provider._id)
                                  ? "Invite Sent"
                                  : "Invite"}
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                        <img
                          src={noWorkImage}
                          alt="No worker"
                          className="w-48 sm:w-72 md:w-96 mb-4"
                        />
                        <p>No related workers found</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 space-y-5 w-full">
                    {Array.isArray(offers) && offers.length > 0 ? (
                      applySort(
                        offers.filter((offer) =>
                          offer.provider_id?.full_name?.toLowerCase().includes(searchText)
                        )
                      )

                        .map((offer) => (
                          <div
                            key={offer._id}
                            className="flex flex-col sm:flex-row items-center sm:items-start 
              gap-4 bg-[#F9F9F9] rounded-xl p-4 shadow-md w-full mb-5"
                          >
                            <img
                              src={offer.provider_id?.profile_pic || workImage}
                              alt={offer.provider_id?.full_name || "Worker"}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                            />

                            <div className="flex-1 text-left w-full">
                              <h3 className="text-[17px] font-bold text-[#303030]">
                                {offer.provider_id?.full_name || "Unknown"}
                              </h3>

                              {/* Rating */}
                              {offer.averageRating !== undefined ? (
                                <p className="text-sm font-medium flex items-center gap-1">
                                  <span className="text-yellow-600">
                                    Rating: {parseFloat(offer.averageRating).toFixed(1)} / 5.0
                                  </span>

                                  {offer.totalReview > 0 ? (
                                    <span className="text-gray-500 text-xs">
                                      ({offer.totalReview} reviews)
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">
                                      (No reviews yet)
                                    </span>
                                  )}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-500">No rating yet</p>
                              )}

                              {offer.duration && (
                                <span className="inline-block mt-2 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                                  Duration: {offer.duration}{" "}
                                  {offer.duration == 1 ? "day" : "days"}
                                </span>
                              )}

                              <p className="text-sm text-gray-500 mt-2 break-words sm:break-normal">
                                {offer.message || "No message provided"}
                              </p>

                              <span className="flex items-center gap-2 text-gray-600 font-semibold text-sm mt-1">
                                <FaMapMarkerAlt size={16} color="#228B22" />
                                {offer.provider_id?.location?.address || "Unknown location"}
                              </span>

                              <button
                                onClick={() =>
                                  handleView(
                                    offer.provider_id?._id,
                                    offer._id,
                                    offer.order_id
                                  )
                                }
                                className="cursor-pointer text-green-600 font-medium text-base border border-green-600 
                    px-5 py-1 rounded-lg mt-4 w-full sm:w-auto"
                              >
                                View Profile
                              </button>
                            </div>

                            {/* RIGHT SIDE PRICE + BUTTON */}
                            <div className="flex flex-col items-center sm:items-end w-full sm:w-auto mt-3 sm:mt-0">
                              <span className="text-lg font-semibold text-gray-800 mb-2">
                                ₹{offer.bid_amount || "N/A"}
                              </span>

                              {orderDetail?.hire_status === "pending" && (
                                <button
                                  onClick={() => handleAcceptBid(offer.provider_id?._id)}
                                  className="cursor-pointer bg-[#228B22] text-white px-4 sm:px-6 py-2 rounded-lg 
                      font-medium hover:bg-green-700 w-full sm:w-auto"
                                >
                                  Hire
                                </button>
                              )}

                              {orderDetail?.hire_status === "accepted" &&
                                !orderDetail?.platform_fee_paid && (
                                  <button
                                    onClick={() =>
                                      handlePayment(offer.provider_id?._id)
                                    }
                                    className="cursor-pointer bg-[#228B22] text-white px-4 sm:px-6 py-2 rounded-lg 
                        font-medium hover:bg-green-700 w-full sm:w-auto mt-2"
                                  >
                                    Pay & Hire
                                  </button>
                                )}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                        <img
                          src={noWorkImage}
                          alt="No bids"
                          className="w-48 sm:w-72 md:w-96 mb-4"
                        />
                        <p>No bids available</p>
                      </div>
                    )}
                  </div>
                )}


              </div>
            </div>
          )}

        {(orderDetail?.hire_status === "accepted" ||
          orderDetail?.hire_status === "cancelled" ||
          orderDetail?.hire_status === "completed" ||
          orderDetail?.hire_status === "cancelledDispute") &&
          orderDetail?.platform_fee_paid && (
            <Accepted
              serviceProvider={orderDetail?.service_provider_id}
              user_id={orderDetail?.user_id._id}
              assignedWorker={assignedWorker}
              paymentHistory={orderDetail?.service_payment?.payment_history}
              fullPaymentHistory={orderDetail?.service_payment}
              orderId={id}
              hireStatus={orderDetail?.hire_status}
            />
          )}

        {orderDetail?.hire_status === "accepted" &&
          orderDetail?.platform_fee_paid && (
            <div className="flex flex-col items-center justify-center space-y-6 mt-6 w-full px-4">
              <div className="relative max-w-2xl mx-auto w-full">

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

              {/* Buttons - stack on mobile, inline on tablet+; buttons full-width on mobile */}
              <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0 w-full max-w-2xl px-2">
                <button
                  className="cursor-pointer bg-[#228B22] hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold shadow-md w-full sm:w-auto text-sm sm:text-base"
                  onClick={handleMarkComplete}
                >
                  Mark as Complete
                </button>



                {/* ReviewModal kept as-is (no logic changed) */}


                <Link to={`/dispute/${id}/bidding`} className="w-full sm:w-auto">
                  <button className="cursor-pointer bg-[#EE2121] hover:bg-red-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold shadow-md w-full sm:w-auto text-sm sm:text-base">
                    Cancel Task and Create Dispute
                  </button>
                </Link>
              </div>
            </div>
          )}

        {orderDetail?.hire_status === "completed" && (
          <div className="flex justify-center mt-4 px-4">
            <Link to={`/dispute/${id}/bidding`} className="w-full max-w-xs">
              <button className="cursor-pointer bg-[#EE2121] hover:bg-red-600 text-white w-full px-6 py-3 rounded-lg font-semibold shadow-md text-sm sm:text-base">
                Create Dispute
              </button>
            </Link>
          </div>
        )}

      </div>
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


      <Footer />
    </>
  );
}
