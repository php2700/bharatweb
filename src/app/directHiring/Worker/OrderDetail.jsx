import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Profile from "../../../assets/default-image.jpg";
import Warning from "../../../assets/ViewProfile/warning.svg";
import CallIcon from "../../../assets/call.png";
import ChatIcon from "../../../assets/chat.png";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Accepted from "./Accepted";
import ReviewModal from "../../CommonScreens/ReviewModal";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import callIcon from "../../../assets/directHiring/call.png";
import messageIcon from "../../../assets/directHiring/message.png";
import defaultWorkImage from "../../../assets/directHiring/his-work.png";
import { FaMapMarkerAlt } from "react-icons/fa";

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
  const [offerStatus, setOfferStatus] = useState("pending");
  const acceptedSectionRef = useRef(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [isHired, setIsHired] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [openImage, setOpenImage] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const user = useSelector((state) => state.user.profile);
  const userId = user?._id;
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

  const handleChatOpen = (receiverId, senderId) => {
    localStorage.setItem("receiverId", receiverId);
    localStorage.setItem("senderId", senderId);
    navigate("/chats");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

  const fetchData = async (showLoading = true) => {
    const token = localStorage.getItem("bharat_token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      if (showLoading) setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);

    try {
      const orderResponse = await axios.get(
        `${BASE_URL}/direct-order/getDirectOrderWithWorker/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const order = orderResponse.data.data.order;
      setOrderData(order);
      setAssignedWorker(orderResponse.data.data.assignedWorker || null);
      setServiceProviders(order.offer_history || []);

      const matchedOffer = Array.isArray(order.offer_history)
        ? order.offer_history.find((provider) =>
            provider.provider_id?._id
              ? provider.provider_id._id === userId
              : provider.provider_id === userId
          )
        : null;

      setOfferStatus(matchedOffer?.status || "pending");
      setIsHired(order.hire_status !== "pending");
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error in fetchData:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, userId]);

  const handleCancelOffer = async () => {
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
      setOfferStatus("pending");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Order has been cancelled successfully!",
        confirmButtonColor: "#228B22",
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

  const handleAcceptOffer = async (e) => {
    e.preventDefault();
    setIsAccepting(true);
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.post(
        `${BASE_URL}/direct-order/accept-offer`,
        { order_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("acceptOffer response:", response);

      if (response.status === 200) {
        setOfferStatus("accepted");
        setOrderData((prev) => ({
          ...prev,
          hire_status: "accepted",
        }));
        setIsHired(true);
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Offer accepted successfully!",
          confirmButtonColor: "#228B22",
          showConfirmButton: false,
          timer: 2000, // Auto-close after 2 seconds
        });
        await fetchData(false);
      }
    } catch (err) {
      console.error("Error accepting offer:", err);
      const errorMessage =
        err?.response?.data?.message || "Something went wrong.";
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        text: errorMessage,
        confirmButtonColor: "#FF0000",
        showConfirmButton: false,
        timer: 2000, // Auto-close after 2 seconds
      }).then(() => {
        fetchData(false);
      });
    } finally {
      setIsAccepting(false);
    }
  };


  const capitalize = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  const handleRejectOffer = async () => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to reject this offer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    });

    // If user cancels, stop execution
    if (!confirmResult.isConfirmed) return;
    setIsRejecting(true);
    try {
      const token = localStorage.getItem("bharat_token");
      const response = await axios.post(
        `${BASE_URL}/direct-order/reject-offer`,
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

      if (response) {
        setOfferStatus("rejected");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Offer rejected successfully!",
          confirmButtonColor: "#228B22",
        });
      }
    } catch (err) {
      console.error("Error rejecting offer:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to reject offer. Please try again.",
        confirmButtonColor: "#FF0000",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleAssignWork = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      const response = await axios.post(
        `${BASE_URL}/direct-order/assignWork`,
        {
          order_id: id,
          provider_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOfferStatus("assigned");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Work assigned successfully!",
          confirmButtonColor: "#228B22",
        });
      }
    } catch (err) {
      console.error("Error assigning work:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to assign work. Please try again.",
        confirmButtonColor: "#FF0000",
      });
    }
  };

  if (loading || isAccepting) {
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const images = Array.isArray(orderData?.image_url) ? orderData.image_url : [];
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4 mt-20">
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
          {images.length > 0 ? (
            // give the carousel a fixed height wrapper so images show reliably
            <div className="w-full" style={{ maxWidth: "100%", height: 360 }}>
              <Carousel
                showArrows={true}
                showThumbs={false}
                infiniteLoop={true}
                autoPlay={true}
                interval={3000}
                emulateTouch={true}
                showStatus={false}
                onClickItem={(index) => setOpenImage(images[index])}
                 // 🔥 FIX
              >
                {images.map((url, index) => (
                   <div key={index} className="h-[360px] cursor-pointer">
                  <div key={index} className="h-[360px]">
                    <img
                      src={url}
                      className="h-[360px] w-full object-cover"
                      alt={`Project image ${index + 1}`}
                    />
                  </div>
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
             <div onClick={() => setOpenImage(defaultWorkImage)} className="cursor-pointer">
            <img
              src={defaultWorkImage}
              alt="No project images available"
              className="w-full h-[360px] object-cover mt-5"
            />
            </div>
          )}

          {openImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              onClick={() => setOpenImage(null)}
            >
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img
                  src={openImage}
                  alt="Preview"
                  className="max-w-[98vw] max-h-[95vh] rounded-xl shadow-2xl"
                />

                <button
                  onClick={() => setOpenImage(null)}
                  className="absolute -top-4 -right-4 h-10 w-10 flex items-center justify-center bg-white text-black rounded-full shadow-lg text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                         <span>
  Title :- {capitalize(orderData?.title || "Unknown Title")}
</span>
                {/* <div>Description :- {orderData?.description || "Unknown description"}</div> */}
                <div>
                  {/* <div className=" text-gray-800 flex items-center px-0 py-1 rounded-full text-sm mt-2 w-fit">
                    <FaMapMarkerAlt
                      size={25}
                      color="#228B22"
                      className="mr-2"
                    />{" "}
                    {orderData?.user_id?.location?.address ||
                      "Unknown Location"}
                  </div> */}
                  <div
                    onClick={() => setIsMapModalOpen(true)}
                    className="text-gray-800 flex items-center px-0 py-1 rounded-full text-sm mt-2 w-fit cursor-pointer relative right-[5px]"
                  >
                    <FaMapMarkerAlt
                      size={25}
                      color="#228B22"
                      className="mr-2"
                    />{" "}
                    {orderData?.user_id?.location?.address || "Unknown Location"}
                  </div>
                  <span className="text-gray-600 text-sm font-semibold block">
                    Deadline Date&Time:{" "}
                    {orderData?.deadline
                      ? new Date(orderData.deadline).toLocaleString()
                      : "N/A"}
                  </span>
                
                  
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
                          ? "bg-[#FF0000]"
                          : ""
                      }
                      ${
                        orderData?.hire_status === "cancelled task"
                          ? "bg-[#FF0000]"
                          : ""
                      }
                      ${
                        orderData?.hire_status === "completed"
                          ? "bg-[#228B22]"
                          : ""
                      }
                      ${
                        orderData?.hire_status === "cancelledDispute"
                          ? "bg-[#FF0000]"
                          : ""
                      }
                      ${
                        orderData?.hire_status === "accepted"
                          ? "bg-[#228B22]"
                          : ""
                      }`}
                  >
                    {orderData?.hire_status === "cancelledDispute"
                      ? `Cancelled ${" "} Dispute`
                      : orderData.hire_status
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ") || "Unknown Status"}
                  </span>
                </span>
              </div>
            </div>
            <div className="border border-green-600 rounded-lg p-2 mb-4 bg-gray-50">
              <p className="text-gray-700 tracking-tight">
                {orderData?.description}
              </p>
            </div>
            {orderData?.hire_status === "cancelledDispute" && (
              <p className="text-sm text-gray-700 mt-3 flex items-center">
                Note:{" "}
                <span className="text-red-600 font-semibold ml-1">
                  Freezed by Platform
                </span>
              </p>
            )}
            {orderData?.hire_status === "pending" ||
            orderData?.hire_status === "cancelled" ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-black mb-4">
                  User Details
                </h2>

                {orderData?.user_id ? (
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-md">
                    <div className="flex items-center space-x-4">
                      <img
                        src={orderData.user_id.profile_pic || Profile}
                        alt={orderData.user_id.full_name || "User"}
                        className="w-16 h-16 rounded-full object-cover bg-yellow-200"
                      />
                      <div>
                        <p className="text-lg font-semibold">
                          {orderData?.user_id?.full_name
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ") || "Unknown User"}
                        </p>
                        {/* <button
                          className="mt-2 px-4 py-2 bg-[#228B22] text-white rounded-lg hover:bg-green-700"
                          onClick={() =>
                            navigate(
                              `/profile-user-details/${orderData.user_id._id}`
                            )
                          }
                        >
                          View Profile
                        </button> */}
                      </div>
                    </div>

                    {orderData?.hire_status === "cancelled" ||
                    orderData?.hire_status === "cancelledDispute" ? (
                      " "
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-600 font-medium mb-2">
                          Contact
                        </p>
                        <div className="flex space-x-2 justify-center mt-1">
                          <button
                            className="p-2 bg-gray-200 rounded-full flex items-center justify-center"
                            title="Call"
                            onClick={() =>
                              window.open(
                                `tel:${orderData.user_id.phone}`,
                                "_self"
                              )
                            }
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
                              handleChatOpen(orderData.user_id._id, userId)
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
                    )}

                    {orderData?.hire_status === "cancelled" ? (
                      <div className="px-3 py-1 rounded-full text-white text-sm font-medium bg-red-500">
                        Project is Cancelled by User
                      </div>
                    ) : offerStatus === "accepted" ? (
                      <>
                        <span className="px-4 py-2 bg-[#228B22] text-white rounded-lg text-sm font-medium">
                          Accepted
                        </span>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#228B22] text-white rounded-lg hover:bg-green-700"
                          onClick={handleAssignWork}
                        >
                          Assign Work
                        </button>
                      </>
                    ) : offerStatus === "rejected" ? (
                      <span className="px-4 py-2 bg-[#FF0000] text-white rounded-lg text-sm font-medium">
                        Rejected
                      </span>
                    ) : offerStatus === "assigned" ? (
                      <span className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                        Work Assigned
                      </span>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#228B22] text-white rounded-lg hover:bg-green-700"
                          onClick={handleAcceptOffer}
                          disabled={isAccepting}
                        >
                          {isAccepting ? "Accepting..." : "Accept"}
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#FF0000] text-white rounded-lg hover:bg-red-700"
                          onClick={handleRejectOffer}
                          disabled={isRejecting}
                        >
                          {isRejecting ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    No user found.
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
            {orderData?.hire_status === "completed" && (
              <div className="flex justify-center">
                <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md cursor-not-allowed">
                  Task Completed
                </button>
              </div>
            )}

            {(orderData?.hire_status === "accepted" ||
              orderData?.hire_status === "completed" ||
              orderData?.hire_status === "cancelledDispute") && (
              <div ref={acceptedSectionRef}>
                <Accepted
                  serviceProvider={orderData?.user_id}
                  user_id={orderData?.service_provider_id?._id}
                  assignedWorker={assignedWorker}
                  paymentHistory={orderData?.service_payment?.payment_history}
                  fullPaymentHistory={orderData?.service_payment}
                  orderId={id}
                  hireStatus={orderData?.hire_status}
                />

                {(orderData?.hire_status === "accepted" ||
                  orderData?.hire_status === "completed") && (
                  <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                    {/*<div className="relative max-w-2xl mx-auto">
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
                    </div>*/}

                    <div className="flex space-x-4">
                      <Link to={`/dispute/${id}/direct`}>
                        <button className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md">
                          {orderData?.hire_status === "completed"
                            ? "Create Dispute"
                            : "Cancel Task and Create Dispute"}
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
       {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Location on Map</h2>
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
                  orderData?.user_id?.location?.address || ""
                )}`}
              ></iframe>
            </div>
            <div className="mt-5 text-center">
              {/* <button
                onClick={() => handleGetDirections(orderData?.user_id?.location?.address)}
                className="px-6 py-2 bg-[#228B22] text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Get Directions
              </button> */}
            </div>
          </div>
        </div>
      )}
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
    </>
  );
}
