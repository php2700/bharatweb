import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Profile from "../../../assets/ViewProfile/Worker.png";
import Warning from "../../../assets/ViewProfile/warning.svg";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import CallIcon from "../../../assets/call.png";
import ChatIcon from "../../../assets/chat.png";
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
import { useSelector } from "react-redux";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import defaultWorkImage from "../../../assets/workcategory/image.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import OrderReviewModal from "../../CommonScreens/OrderReviewModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mapRef, setMapRef] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatedWorkersLoading, setRelatedWorkersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [relatedWorkers, setRelatedWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHired, setIsHired] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [offerStatuses, setOfferStatuses] = useState({});
  const acceptedSectionRef = useRef(null);
  const [category_id, setCategory_id] = useState("");
  const [subcategory_ids, setSubcategory_ids] = useState([]);
  const [assignedProviderIds, setAssignedProviderIds] = useState([]); // Changed to store multiple provider IDs
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [markerLocationAddress, setMarkerLocationAddress] = useState(null);
  const [showOrderReviewModal, setShowOrderReviewModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [showChangeProvider, setShowChangeProvider] = useState(false);
  const [expandedAddresses, setExpandedAddresses] = useState({});
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4",
  });

  const [defaultCenter, setDefaultCenter] = useState({
    lat: 28.6139,
    lng: 77.209,
  });
  const user = useSelector((state) => state.user.profile);
  const userId = user?._id;

 useEffect(() => {
  if (Array.isArray(serviceProviders) && serviceProviders.length > 0) {
    // check if all providers have status === "rejected"
    const allRejected = serviceProviders.every(
      (provider) => provider.status === "rejected"
    );
    if (allRejected) {
      setShowChangeProvider(true);
    }
  }
}, [serviceProviders]);
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
  console.log("orderdata", orderData);
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

  // Fetch related workers based on category and subcategory
  const fetchRelatedWorkers = async (category_id, subcategory_ids) => {
    try {
      if (!category_id || !subcategory_ids?.length) {
        console.warn("Category ID or Subcategory ID is missing");
        setRelatedWorkers([]);
        return;
      }

      setRelatedWorkersLoading(true);

      const token = localStorage.getItem("bharat_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/user/getServiceProviders`,
        {
          category_id: category_id,
          subcategory_ids: subcategory_ids,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Related workers response:", response.data);
      const workers = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      // Filter out any workers who are already in serviceProviders or assigned
      const filteredWorkers = workers.filter(
        (worker) =>
          !assignedProviderIds.includes(worker._id) &&
          !serviceProviders.some(
            (provider) => provider.provider_id._id === worker._id
          )
      );
      setRelatedWorkers(filteredWorkers);
    } catch (err) {
      console.error("Error fetching related workers:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to fetch related workers. Please try again.",
        confirmButtonColor: "#FF0000",
      });
    } finally {
      setRelatedWorkersLoading(false);
    }
  };

  // Fetch order data
  const fetchData = async () => {
    const token = localStorage.getItem("bharat_token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const orderResponse = await axios.get(
        `${BASE_URL}/direct-order/getDirectOrderWithWorker/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(
      //   "Order Response:",
      //   orderResponse.data,
      //   "sssss------------------------"
      // );
      setOrderData(orderResponse.data.data.order);
      setAssignedWorker(orderResponse.data.data.assignedWorker || null);
      setServiceProviders(orderResponse.data.data.order.offer_history || []);
      setIsHired(orderResponse.data.data.order.hire_status !== "pending");

      // Initialize offer statuses and assigned provider IDs
      const initialStatuses = {};
      const providerIds = [];
      orderResponse.data.data.order.offer_history?.forEach((provider) => {
        initialStatuses[provider.provider_id._id] =
          provider.status[0] || "sent";
        providerIds.push(provider.provider_id._id);
      });
      setOfferStatuses(initialStatuses);
      setAssignedProviderIds(providerIds);

      // Extract category_id and subcategory_ids
      if (
        orderResponse.data.data.order.offer_history &&
        orderResponse.data.data.order.offer_history.length > 0
      ) {
        setCategory_id(
          orderResponse.data.data.order.offer_history[0].provider_id.category_id
            ._id || null
        );
        setSubcategory_ids(
          orderResponse.data.data.order.offer_history[0].provider_id.subcategory_ids.map(
            (sub) => sub._id
          ) || []
        );
      } else {
        setCategory_id(null);
        setSubcategory_ids([]);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Trigger related workers fetch when category/subcategory changes
  useEffect(() => {
    if (category_id && subcategory_ids.length > 0) {
      fetchRelatedWorkers(category_id, subcategory_ids);
    }
  }, [category_id, subcategory_ids, assignedProviderIds, serviceProviders]);

  // Modified handleHire function
  // const handleHire = async (providerId) => {
  //   try {
  //     const token = localStorage.getItem("bharat_token");
  //     const response = await axios.post(
  //       `${BASE_URL}/direct-order/send-next-offer`,
  //       {
  //         next_provider_id: providerId,
  //         order_id: id,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     // console.log("Hire Response:", response.data);

  //     // Find the hired provider from relatedWorkers
  //     const hiredProvider = relatedWorkers.find(
  //       (worker) => worker._id === providerId
  //     );

  //     if (hiredProvider) {
  //       // Create a new provider object
  //       const newProvider = {
  //         provider_id: {
  //           _id: hiredProvider._id,
  //           full_name: hiredProvider.full_name,
  //           profile_pic: hiredProvider.profile_pic,
  //           location: hiredProvider.location,
  //           category_id: hiredProvider.category_id,
  //           subcategory_ids: hiredProvider.subcategory_ids,
  //         },
  //         status: ["sent"],
  //       };

  //       // Update serviceProviders and assignedProviderIds
  //       setServiceProviders((prev) => [...prev, newProvider]);
  //       setAssignedProviderIds((prev) => [...prev, providerId]);
  //     }

  //     // Update order data and clear related workers
  //     setOrderData((prev) => ({
  //       ...prev,
  //       hire_status: "accepted",
  //     }));
  //     setIsHired(true);
  //     setServiceProviders([]); // Clear service providers after hire
  //     setRelatedWorkers([]); // Clear related workers after hire

  //     // Update offer statuses
  //     setOfferStatuses((prev) => ({
  //       ...prev,
  //       [providerId]: "sent",
  //     }));

  //     // Show success message
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success!",
  //       text: response.data.message || "Provider hired successfully!",
  //       confirmButtonColor: "#228B22",
  //     });
  //     window.location.reload();
  //     // Scroll to accepted section
  //     acceptedSectionRef.current?.scrollIntoView({ behavior: "smooth" });

  //     // Refresh order data
  //     const orderResponse = await axios.get(
  //       `${BASE_URL}/direct-order/getDirectOrderWithWorker/${id}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setOrderData(orderResponse.data.data.order);
  //     setAssignedWorker(orderResponse.data.data.assignedWorker || null);
  //   } catch (err) {
  //     console.error(
  //       "Error hiring provider:",
  //       err.response?.data || err.message
  //     );
  //     const errorMessage =
  //       err.response?.data?.message ||
  //       err.message ||
  //       "Failed to hire provider. Please try again.";
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops!",
  //       text: errorMessage,
  //       confirmButtonColor: "#FF0000",
  //     });
  //   }
  // };

  const handleHire = async (providerId) => {
    // Step 1: Ask for confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to hire another service provider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, hire provider",
      cancelButtonText: "No, cancel",
    });

    // Step 2: If user confirms, proceed with API call
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("bharat_token");
        const response = await axios.post(
          `${BASE_URL}/direct-order/send-next-offer`,
          {
            next_provider_id: providerId,
            order_id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Find the hired provider from relatedWorkers
        const hiredProvider = relatedWorkers.find(
          (worker) => worker._id === providerId
        );

        if (hiredProvider) {
          const newProvider = {
            provider_id: {
              _id: hiredProvider._id,
              full_name: hiredProvider.full_name,
              profile_pic: hiredProvider.profile_pic,
              location: hiredProvider.location,
              category_id: hiredProvider.category_id,
              subcategory_ids: hiredProvider.subcategory_ids,
            },
            status: ["sent"],
          };

          setServiceProviders((prev) => [...prev, newProvider]);
          setAssignedProviderIds((prev) => [...prev, providerId]);
        }

        // Update state
        setOrderData((prev) => ({ ...prev, hire_status: "accepted" }));
        setIsHired(true);
        setServiceProviders([]);
        setRelatedWorkers([]);
        setOfferStatuses((prev) => ({ ...prev, [providerId]: "sent" }));

        // Step 3: Success alert
        await Swal.fire({
          icon: "success",
          title: "Hired Successfully!",
          text: response.data.message || "Service provider has been hired.",
          confirmButtonColor: "#228B22",
        });

        // Refresh page and scroll
        window.location.reload();
        acceptedSectionRef.current?.scrollIntoView({ behavior: "smooth" });

        // Refresh order data
        const orderResponse = await axios.get(
          `${BASE_URL}/direct-order/getDirectOrderWithWorker/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrderData(orderResponse.data.data.order);
        setAssignedWorker(orderResponse.data.data.assignedWorker || null);
      } catch (err) {
        console.error(
          "Error hiring provider:",
          err.response?.data || err.message
        );
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to hire provider. Please try again.";

        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: errorMessage,
          confirmButtonColor: "#FF0000",
        });
      }
    } else {
      // Step 4: User cancelled
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "Hiring action was cancelled.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleRouteHire = (ProviderId, isHired) => {
    navigate(`/profile-details/${ProviderId}/direct`, {
      state: {
        hire_status: orderData?.hire_status,
        isHired,
      },
    });
  };

  const handleCancelOffer = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    // If user confirms
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("bharat_token");
        const response = await axios.post(
          `${BASE_URL}/direct-order/cancelOrderByUser`,
          { order_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Cancelled!",
          text: "Order has been cancelled successfully!",
          confirmButtonColor: "#228B22",
        }).then(() => {
          window.location.reload();
        });
      } catch (err) {
        console.error("Error cancelling offer:", err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to cancel offer. Please try again.",
          confirmButtonColor: "#FF0000",
        });
      }
    } else {
      // Optional: Feedback when user cancels the confirmation
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "Your order was not cancelled.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("bharat_token");

      const response = await axios.post(
        `${BASE_URL}/direct-order/completeOrderUser`,
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

      // ⚠️ Handle 400 error (pending payments)
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
            // ✅ Ask user if they want to release all payments
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
                  `${BASE_URL}/direct-order/requestAllPaymentReleases/${id}`,
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
      } else {
        // 🚫 Other unexpected errors
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
      const token = localStorage.getItem("bharat_token");
      const response = await axios.post(
        `${BASE_URL}/direct-order/cancelOrderByUser`,
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
      console.log("Cancel Response:", response.data);
      setOrderData((prev) => ({
        ...prev,
        hire_status: "cancelled task",
      }));
      setIsHired(true);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Order cancelled successfully!",
        confirmButtonColor: "#228B22",
      }).then(() => {
        navigate("/direct/user/work-list");
      });
    } catch (err) {
      setError("Failed to cancel order. Please try again later.");
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to cancel order. Please try again.",
        confirmButtonColor: "#FF0000",
      });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter service providers based on search query
  const filteredProviders = serviceProviders.filter((provider) =>
    provider.provider_id?.full_name?.toLowerCase().includes(searchQuery)
  );

  const hasPendingProvider = serviceProviders.some(
    (provider) => provider?.status === "pending"
  );
  // Filter related workers based on search query and exclude all assigned/offered providers
  const filteredRelatedWorkers = relatedWorkers.filter(
    (worker) =>
      worker.full_name?.toLowerCase().includes(searchQuery) &&
      !assignedProviderIds.includes(worker._id) &&
      !serviceProviders.some(
        (provider) => provider.provider_id._id === worker._id
      )
  );

  // console.log("serviceProviders", serviceProviders);

  const showRefundButton =
    orderData?.hire_status === "pending" ||
    (orderData?.hire_status === "cancelled" && !orderData?.refundRequest) ||
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
        `${BASE_URL}/direct-order/request-refund`,
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

  const handleChatOpen = (receiverId, senderId) => {
    localStorage.setItem("receiverId", receiverId);
    localStorage.setItem("senderId", senderId);
    navigate("/chats");
  };

  const openMap = (address) => {
    if (!isLoaded) return;
    if (!address) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const coords = { lat: location.lat(), lng: location.lng() };

        setDefaultCenter(coords);
        setMarkerLocationAddress(coords);
        setIsMapOpen(true);
        const bounds = results[0].geometry.viewport;
        if (mapRef) {
          mapRef.fitBounds(bounds);
        }
      } else {
        console.error("Geocode failed: " + status);
      }
    });
  };
  const toggleAddress = (providerId) => {
    setExpandedAddresses((prev) => ({
      ...prev,
      [providerId]: !prev[providerId],
    }));
  };

  const truncateAddress = (address, providerId) => {
    if (!address) return "No Address Provided";
    const maxLength = 50;
    const isExpanded = expandedAddresses[providerId];

    if (address.length <= maxLength || isExpanded) {
      return address;
    }
    return address.substring(0, maxLength) + "...";
  };


  return (
    <>
      <Header />
      <div className="container mx-auto mt-20 px-4 py-4">
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
          {orderData?.image_url?.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              className="w-full h-[360px]"
            >
              {orderData.image_url.map((url, index) => (
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
              src={defaultWorkImage}
              alt="No project images available"
              className="w-full h-[360px] object-cover mt-5"
            />
          )}

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                <span>Title :- {orderData?.title || "Unknown Title"}</span>
                {/* <div>Description :- {orderData?.description || "Unknown Description"}</div> */}
                <div>
                  <div
                    onClick={() => {
                      openMap(orderData?.address);
                    }}
                    className=" text-gray-800 flex items-center px-1 py-1 rounded-full text-sm mt-2 w-fit"
                  >
                    <FaMapMarkerAlt
                      size={25}
                      color="#228B22"
                      className="mr-2"
                    />{" "}
                    {orderData?.address || "Unknown Location"}
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
                      ${
                        orderData?.hire_status === "pending"
                          ? "bg-yellow-500"
                          : ""
                      }
                      ${
                        orderData?.hire_status === "cancelled"
                          ? "bg-red-500"
                          : ""
                      }
                      ${
                        orderData?.hire_status === "completed"
                          ? "bg-[#228B22]"
                          : ""
                      }
                      ${
                        orderData?.hire_status === "cancelledDispute"
                          ? "bg-orange-500"
                          : ""
                      }
                      ${
                        orderData?.hire_status === "accepted"
                          ? "bg-blue-500"
                          : ""
                      }`}
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
                {orderData?.refundRequest && (
                  <span className="text-gray-600 font-semibold block">
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
                  </span>
                )}
                <span className="text-gray-600 font-semibold block">
                  Deadline Date:{" "}
                  {orderData?.deadline
                    ? new Date(orderData.deadline).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="border border-green-600 rounded-lg p-4 mb-4 bg-gray-50">
              <p className="text-gray-700 tracking-tight">
                {orderData?.description}
              </p>
            </div>
            <p className="m-3">
              <span className="text-gray-600 font-semibold block">
                Do you want to visit a shop:{" "}
                <span
                  className={
                    orderData?.isShopVisited ? "text-green-600" : "text-red-600"
                  }
                >
                  {orderData?.isShopVisited ? "Yes" : "No"}
                </span>
              </span>
            </p>
            {/*orderData?.hire_status == "pending" && (
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-2 bg-[#FF0000] text-white rounded hover:bg-red-700 font-semibold"
                  onClick={handleCancelOffer} // remove extra arrow function wrapping
                >
                  Cancel Project
                </button>
              </div>
            )*/}

            {/* Service Providers from Offer History */}
            {(orderData?.hire_status === "pending" ||
              orderData?.hire_status === "cancelled") &&
              filteredProviders.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Offered Service Providers
                  </h2>
                  <div className="space-y-4">
                    {filteredProviders.reverse().map((provider) => (
                      <div
                        key={provider.provider_id._id}
                        className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow"
                      >
                        <img
                          src={provider.provider_id.profile_pic || Profile}
                          alt={`Profile of ${
                            provider.provider_id.full_name || "Provider"
                          }`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-lg font-semibold">
                            {provider.provider_id.full_name ||
                              "Unknown Provider"}
                          </p>
                          {/* <p className="bg-[#F27773] text-white px-3 py-1 rounded-full text-sm mt-2 w-fit">
                            {provider.provider_id?.location?.address ||
                              "No Address Provided"}
                          </p> */}
                          <FaMapMarkerAlt
                            className="text-[#F27773] mt-1 flex-shrink-0"
                            color="#228B22"
                            size={20}
                          />
                          <div className="flex-1">
                            <p className="text-gray-700 text-sm">
                              {truncateAddress(
                                provider.provider_id?.location?.address,
                                provider.provider_id._id
                              )}
                              {provider.provider_id?.location?.address?.length >
                                50 && (
                                <button
                                  onClick={() =>
                                    toggleAddress(provider.provider_id._id)
                                  }
                                  className="text-[#228B22] font-semibold ml-2 hover:underline"
                                >
                                  {expandedAddresses[provider.provider_id._id]
                                    ? "See Less"
                                    : "See More"}
                                </button>
                              )}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              handleRouteHire(provider.provider_id._id, true)
                            }
                            className="text-[#228B22] border-green-600 border px-6 py-2 rounded-md text-base font-semibold mt-4 inline-block"
                          >
                            View Profile
                          </button>
                        </div>
                        <div className="flex flex-col items-center justify-center flex-1">
                          <p className="text-gray-600 font-medium">Contact</p>
                          <div className="flex space-x-2 mt-2">
                            <button
                              className="p-2 bg-gray-200 rounded-full flex items-center justify-center"
                              title="Call"
                              onClick={() => {
                                window.open(`tel:${provider.phone}`, "_self");
                              }}
                            >
                              <img
                                src={CallIcon}
                                alt="Call"
                                className="w-6 h-6"
                              />
                            </button>
                            <button
                              className="p-2 bg-gray-200 rounded-full flex items-center justify-center"
                              title="Chat"
                              onClick={() =>
                                handleChatOpen(
                                  provider?.provider_id?._id,
                                  userId
                                )
                              }
                            >
                              <img
                                src={ChatIcon}
                                alt="Chat"
                                className="w-6 h-6"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {offerStatuses[provider.provider_id._id] ===
                          "pending" ? (
                            <span className="text-[#FF0000] border border-[#FF0000] px-3 py-1 rounded-lg font-semibold">
                              Cancelled
                            </span>
                          ) : (
                            <>
                              {/* Status Button */}
                              {!provider.isRejectedByUser && (
															<>
                                <button
                                  className={`px-4 py-2 rounded font-semibold text-white cursor-not-allowed
            ${provider.status === "pending" ? "bg-yellow-500" : ""}
            ${provider.status === "accepted" ? "bg-green-600" : ""}
            ${provider.status === "rejected" ? "bg-orange-500" : ""}`}
                                  disabled
                                >
																
                                  {Array.isArray(provider.status)
                                    ? provider.status
                                        .map(
                                          (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1)
                                        )
                                        .join(" ")
                                    : provider.status
                                    ? provider.status.charAt(0).toUpperCase() +
                                      provider.status.slice(1)
                                    : ""}
                                </button>
																</>
                              )}

                              {/* If user rejected — show 'Rejected by Me' instead */}
                              {provider.isRejectedByUser && (
                                <button
                                  className="px-4 py-2 rounded font-semibold text-white bg-orange-500 cursor-not-allowed"
                                  disabled
                                >
                                  Rejected by Me
                                </button>
                              )}

                              {/* Change Service Provider Button */}
                              {orderData?.hire_status === "pending" &&
                                provider.status === "pending" && (
                                  <button
                                    className={`px-6 py-2 ${
                                      showChangeProvider ||
                                      provider.isRejectedByUser
                                        ? "bg-green-600"
                                        : "bg-[#FB3523]"
                                    } text-white font-semibold rounded-lg shadow`}
                                    onClick={async () => {
                                      // If already rejected, just open section
                                      if (provider.isRejectedByUser) {
                                        setShowChangeProvider(true);
                                        return;
                                      }

                                      const result = await Swal.fire({
                                        title: "Are you sure?",
                                        text: "Do you really want to change the service provider?",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Yes, change it!",
                                      });

                                      if (result.isConfirmed) {
                                        try {
                                          const token =
                                            localStorage.getItem(
                                              "bharat_token"
                                            );

                                          await axios.post(
                                            `${BASE_URL}/direct-order/userRejectOffer`,
                                            {
                                              order_id: orderData._id,
                                              provider_id:
                                                provider.provider_id._id,
                                            },
                                            {
                                              headers: {
                                                "Content-Type":
                                                  "application/json",
                                                Authorization: `Bearer ${token}`,
                                              },
                                            }
                                          );

                                          Swal.fire({
                                            title: "Offer Rejected!",
                                            text: "You have rejected this offer successfully.",
                                            icon: "success",
                                            timer: 1500,
                                            showConfirmButton: false,
                                          });

                                          // ✅ Automatically open section for new provider hire
                                          setShowChangeProvider(true);
                                          fetchData();
                                        } catch (error) {
                                          Swal.fire({
                                            title: "Error",
                                            text:
                                              error.response?.data?.message ||
                                              "Failed to reject the offer.",
                                            icon: "error",
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    {showChangeProvider ||
                                    provider.isRejectedByUser
                                      ? "Rejected by Me"
                                      : "Change Service Provider"}
                                  </button>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Task Status / Cancel Button */}
            <div className="text-center mb-6">
              {/* Show buttons depending on hire_status */}
              {orderData?.hire_status === "cancelled" ? (
                <span className="px-8 py-2 bg-[#FF0000] text-white rounded-lg text-lg font-semibold">
                  Cancelled Task
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
                </div>
              ) : orderData?.hire_status === "pending" ? (
                <button
                  className="px-8 py-3 bg-[#FF0000] text-white rounded-lg text-lg font-semibold hover:bg-red-700"
                  onClick={handleCancelOffer}
                >
                  Cancel Task
                </button>
              ) : orderData?.hire_status === "cancelledDispute" ? (
                <span className="px-8 py-2 bg-[#FF8C00] text-white rounded-lg text-lg font-semibold">
                  Cancelled (Dispute)
                </span>
              ) : null}
              <ReviewModal
                show={showCompletedModal}
                onClose={() => {
                  setShowCompletedModal(false);
                  fetchData(); // refresh data after closing
                }}
                service_provider_id={orderData?.service_provider_id?._id}
                orderId={id}
                type="direct"
              />
              <OrderReviewModal
                show={showOrderReviewModal}
                onClose={() => setShowOrderReviewModal(false)}
                orderId={id}
                type="direct"
              />

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
                <button className="mt-4 ml-4 px-8 py-3 bg-[#1E90FF] text-white rounded-lg text-lg font-semibold hover:bg-blue-700">
                  {orderData?.refundStatus == "pending"
                    ? "Refund Request Submitted"
                    : "Refunded"}
                </button>
              )}
              {/* ✅ Refund Modal */}
              {showRefundModal && (
                <div className="mt-6 bg-white border border-gray-300 rounded-lg p-6 shadow-md w-full max-w-lg mx-auto">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Request Refund
                  </h2>
                  <p className="flex items-center text-black-600 font-bold mt-2 mb-2">
                    &#9888;{" "}
                    <span className="ml-2">
                      Note: 60% amount will be refundable.
                    </span>
                  </p>
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

            {(orderData?.hire_status === "accepted" ||
              orderData?.hire_status === "completed" ||
              orderData?.hire_status === "cancelledDispute") && (
              <div ref={acceptedSectionRef}>
                <Accepted
                  serviceProvider={orderData?.service_provider_id}
                  user_id={orderData?.user_id._id}
                  assignedWorker={assignedWorker}
                  paymentHistory={orderData?.service_payment?.payment_history}
                  fullPaymentHistory={orderData?.service_payment}
                  orderId={id}
                  hireStatus={orderData?.hire_status}
                />
                {(orderData?.hire_status === "accepted" ||
                  orderData?.hire_status === "completed") && (
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
                      {orderData?.hire_status === "completed" ? (
                        ""
                      ) : (
                        <>
                          <button
                            className="bg-[#228B22] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
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
                          />{" "}
                        </>
                      )}
                      <Link to={`/dispute/${id}/direct`}>
                        <button className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md">
                          Cancel Task and Create Dispute
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showChangeProvider && filteredRelatedWorkers.length == 0 && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-black mb-4 mx-auto text-center">
            Providers are not found!.
          </h2>
        </div>
      )}

      {showChangeProvider &&
        orderData?.hire_status !== "cancelled" &&
        orderData?.hire_status !== "cancelled task" &&
        !isHired &&
        filteredRelatedWorkers.length > 0 && (
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-black mb-4 mx-auto text-center">
              Search other worker with Same categories
            </h2>
            <h2 className="text-lg font-bold text-[#FB3523] mb-4 mx-auto text-center -mt-4">
              (Note: You can hire only one worker on this task.)
            </h2>
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
            <div className="mb-6">
              {relatedWorkersLoading ? (
                <div className="text-center text-gray-600">
                  Loading related workers...
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRelatedWorkers.map((worker) => (
                    <div
                      key={worker._id}
                      className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow"
                    >
                      <img
                        src={worker.profile_pic || Profile}
                        alt={`Profile of ${worker.full_name || "Worker"}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold">
                          {worker.full_name || "Unknown Worker"}
                        </p>
                        {/* <p className="bg-[#F27773] text-white px-3 py-1 rounded-full text-sm mt-2 w-fit">
                          {worker.location?.address || "No Address Provided"}
                        </p> */}

                        <div className="flex items-start gap-2 mt-2">
                          <FaMapMarkerAlt
                            className="text-red-500 mt-1 flex-shrink-0"
                            color="#228B22"
                            size={20}
                          />
                          <div className="flex-1">
                            <p className="text-gray-700 text-sm">
                              {truncateAddress(
                                worker.location?.address,
                                worker._id
                              )}
                              {worker.location?.address &&
                                worker.location.address.length > 50 && (
                                  <button
                                    onClick={() => toggleAddress(worker._id)}
                                    className="text-green-600 font-semibold ml-2 hover:underline text-sm"
                                  >
                                    {expandedAddresses[worker._id]
                                      ? "See Less"
                                      : "See More"}
                                  </button>
                                )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRouteHire(worker._id, false)}
                          className="text-[#228B22] border-green-600 border px-6 py-2 rounded-md text-base font-semibold mt-4 inline-block"
                        >
                          View Profile
                        </button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          className="px-4 py-2 bg-[#228B22] text-white rounded hover:bg-green-700"
                          onClick={() => handleHire(worker._id)}
                        >
                          Hire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      {/* Related Workers Section */}
      {/*orderData?.hire_status !== "cancelled" &&
        orderData?.hire_status !== "cancelled task" &&
        !hasPendingProvider &&
        !isHired &&
        filteredRelatedWorkers.length > 0 && (
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-black mb-4 mx-auto text-center">
              Search other worker with Same categories
            </h2>
            <h2 className="text-lg font-bold text-[#FB3523] mb-4 mx-auto text-center -mt-4">
              (Note: You can hire only one worker on this task.)
            </h2>
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
            <div className="mb-6">
              {relatedWorkersLoading ? (
                <div className="text-center text-gray-600">
                  Loading related workers...
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRelatedWorkers.map((worker) => (
                    <div
                      key={worker._id}
                      className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow"
                    >
                      <img
                        src={worker.profile_pic || Profile}
                        alt={`Profile of ${worker.full_name || "Worker"}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold">
                          {worker.full_name || "Unknown Worker"}
                        </p>
                        <p className="bg-[#F27773] text-white px-3 py-1 rounded-full text-sm mt-2 w-fit">
                          {worker.location?.address || "No Address Provided"}
                        </p>
                        <button
                          onClick={() => handleRouteHire(worker._id, false)}
                          className="text-[#228B22] border-green-600 border px-6 py-2 rounded-md text-base font-semibold mt-4 inline-block"
                        >
                          View Profile
                        </button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          className="px-4 py-2 bg-[#228B22] text-white rounded hover:bg-green-700"
                          onClick={() => handleHire(worker._id)}
                        >
                          Hire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) */}

      {/* Banner Slider */}
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
                  src={banner || "/src/assets/profile/default.png"}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/profile/default.png";
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
            <p>Are you sure you want to cancel this task?</p>
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

      {isMapOpen && isLoaded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-2xl shadow-lg w-[90%] max-w-lg">
            <div className="flex justify-between mb-2">
              <h1 className="text-black text-[20px] font-semibold">
                Selected Address on Map
              </h1>
              <button
                onClick={() => setIsMapOpen(false)}
                className="text-red-500 font-bold"
              >
                X
              </button>
            </div>

            <GoogleMap
              mapContainerStyle={{ height: "350px", width: "100%" }}
              center={defaultCenter}
              zoom={12}
              onLoad={(map) => setMapRef(map)}
            >
              {markerLocationAddress && (
                <Marker position={markerLocationAddress} />
              )}
            </GoogleMap>
          </div>
        </div>
      )}
    </>
  );
}
