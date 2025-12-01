import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Accepted from "./Accepted";
import workImage from "../../../assets/directHiring/Work.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function WokerAcceptReject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Added state for modal
  const token = localStorage.getItem("bharat_token");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/emergency-order/getEmergencyOrder/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrderData(response.data.data);
        setAssignedWorker(response.data.assignedWorker || null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const location = useLocation();

useEffect(() => {
  if (location.state?.openAcceptedSection) {
    // Yaha aap jo bhi section open karna chahte ho wo karwa do
    console.log("Accepted section open trigger received");
  }
}, [location.state]);


  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/emergency-order/accept-order/${orderId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Accept response:", response.data);
 navigate("/worker/emergency-details/accepted-worker", {
  state: {
    openAcceptedSection: true,
    task: orderData     // <<=== THIS WAS MISSING
  }
});


    } catch (err) {
      console.error("Accept error:", err);
      setError(err.message);
    }
  };

  const handleReject = () => {
    setShowModal(true); // Show modal when reject is clicked
  };

  const handleConfirmReject = async (orderId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/emergency-order/reject-order/${orderId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Reject response:", response.data);
      navigate("/emergency/worker/work-list");
      setShowModal(false); // Close modal after rejection
    } catch (err) {
      console.error("Reject error:", err);
      setError("Failed to reject order.");
      setShowModal(false); // Close modal even if there's an error
    }
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
        <div className="text-red-600">{error}</div>
      </div>
    );
  }
if (!orderData) {
  return <div className="p-6 text-center">Loading data...</div>;
}

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <button
          className="flex items-center text-green-600 hover:text-green-800 font-semibold"
          onClick={() => navigate(-1)}
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
          Back
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {orderData?.image_urls?.length > 0 ? (
            <Carousel
              showArrows
              showThumbs={false}
              infiniteLoop
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
              alt="No images available"
              className="w-full h-[360px] object-cover"
            />
          )}

          {/* <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                <div>
                  Title: {orderData?.title || "Unknown title"}
                </div>
                <div>
                  Description: {orderData?.description || "No Description Provided"}
                </div>
                <div>
                  Category: {orderData?.category_id?.name || "Unknown Category"}
                </div>
                <div>
                  <div className="flex items-start gap-2 text-gray-700 mt-2 cursor-pointer">
                    <FaMapMarkerAlt
                      size={16}
                      color="#228B22"
                      className="mt-1"
                    />
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm break-words cursor-pointer">
                      {orderData?.google_address || "Unknown Location"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm block text-center">
                  {orderData?.project_id || "#N/A"}
                </span>
                <span className="text-gray-600 font-semibold block">
                  Posted:{" "}
                  {orderData?.createdAt
                    ? new Date(orderData.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <span className="text-gray-600 font-semibold block">
                  Status:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium
                      ${orderData?.hire_status === "pending"
                        ? "bg-yellow-500"
                        : ""
                      }
                      ${orderData?.hire_status === "cancelled"
                        ? "bg-red-500"
                        : ""
                      }
                      ${orderData?.hire_status === "completed"
                        ? "bg-green-500"
                        : ""
                      }
                      ${orderData?.hire_status === "cancelldispute"
                        ? "bg-orange-500"
                        : ""
                      }
                      ${orderData?.hire_status === "assigned"
                        ? "bg-green-500"
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
              </div>
            </div>

            <div className="border border-green-600 rounded-lg p-4 mb-4 bg-gray-50">
              <p className="text-gray-700">
                {orderData?.sub_category_ids
                  ?.map((sub) => sub.name)
                  .join(", ") || "No details available."}
              </p>
            </div>

            {orderData?.hire_status === "pending" && (
              <div className="flex justify-evenly items-center mb-6">
                <button
                  className="px-8 py-3 bg-green-600 min-w-[250px] text-white rounded-[8px] text-lg font-semibold hover:bg-green-700 cursor-pointer"
                  onClick={() => handleAcceptOrder(orderData?._id)}
                >
                  Accept
                </button>
                <button
                  className="px-8 py-3 bg-red-600 min-w-[250px] text-white rounded-[8px] text-lg font-semibold hover:bg-red-700 cursor-pointer"
                  onClick={handleReject}
                >
                  Reject
                </button>
              </div>
            )}

            {orderData?.hire_status === "assigned" && (
              <Accepted
                serviceProvider={orderData?.service_provider_id}
                assignedWorker={assignedWorker}
                paymentHistory={orderData?.service_payment?.payment_history}
              />
            )}
          </div> */}
          <div className="p-6">
            {/* 1. Title aur Right Side Info (ID, Date, Status) */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-2">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                {orderData?.title || "Untitled Task"}
              </h1>

              <div className="text-right space-y-1 w-full md:w-auto flex flex-col items-end">
                <span className="bg-black text-white px-4 py-1 rounded-full text-sm block w-fit">
                  {orderData?.project_id || "#N/A"}
                </span>
                <span className="text-gray-600 font-semibold text-sm">
                  Posted Date:{" "}
                  {orderData?.createdAt
                    ? new Date(orderData.createdAt).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
                <span className="text-gray-600 font-semibold text-sm">
                  Status:{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-white text-xs font-medium ml-1
                      ${orderData?.hire_status === "pending" ? "bg-yellow-500" : ""}
                      ${orderData?.hire_status === "cancelled" ? "bg-red-500" : ""}
                      ${orderData?.hire_status === "completed" ? "bg-green-500" : ""}
                      ${orderData?.hire_status === "cancelldispute" ? "bg-orange-500" : ""}
                      ${orderData?.hire_status === "assigned" ? "bg-green-500" : ""}`}
                  >
                    {orderData?.hire_status
                      ? orderData?.hire_status.charAt(0).toUpperCase() + orderData?.hire_status.slice(1)
                      : "Unknown"}
                  </span>
                </span>
              </div>
            </div>

            {/* 2. Address Location */}
            <div className="flex items-start gap-2 text-gray-700 mb-4">
              <FaMapMarkerAlt size={18} color="#228B22" className="mt-1 shrink-0" />
              <span className="text-sm md:text-base">
                {orderData?.google_address || "Unknown Location"}
              </span>
            </div>

            {/* 3. Cost aur Date */}
            <div className="mb-4">
              <p className="text-green-600 font-bold text-lg">
                Cost :- ₹{orderData?.platform_fee ? orderData.platform_fee : "0"}/-
              </p>
              <p className="text-black font-medium text-sm mt-1">
                Completion Date:{" "}
                {orderData?.deadline
                  ? new Date(orderData.deadline).toLocaleString("en-GB")
                  : "N/A"}
              </p>
            </div>

            {/* 4. Category aur SubCategory (Text format) */}
            <div className="mb-6 space-y-1 text-black font-semibold text-sm md:text-base">
              <p>
                Category:{" "}
                <span className="font-normal text-gray-800">
                  {orderData?.category_id?.name || "N/A"}
                </span>
              </p>
              <p>
                SubCategory:{" "}
                <span className="font-normal text-gray-800">
                  {orderData?.sub_category_ids?.map((sub) => sub.name).join(", ") || "N/A"}
                </span>
              </p>
            </div>

            {/* 5. Task Details (Description in Green Box) */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Task Details</h3>
              <div className="border border-green-600 rounded-lg p-4 bg-white min-h-[80px]">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {orderData?.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* 6. Action Buttons (Accept/Reject) */}
            {orderData?.hire_status === "pending" && (
              <div className="flex justify-evenly items-center mb-6 gap-4 flex-wrap">
                <button
                  className="px-8 py-3 bg-green-600 flex-1 min-w-[150px] max-w-[250px] text-white rounded-[8px] text-lg font-semibold hover:bg-green-700 transition cursor-pointer"
                  onClick={() => handleAcceptOrder(orderData?._id)}
                >
                  Accept
                </button>
                <button
                  className="px-8 py-3 bg-red-600 flex-1 min-w-[150px] max-w-[250px] text-white rounded-[8px] text-lg font-semibold hover:bg-red-700 transition cursor-pointer"
                  onClick={handleReject}
                >
                  Reject
                </button>
              </div>
            )}

            {/* 7. Assigned Status Component */}
            {orderData?.hire_status === "assigned" && (
              <Accepted
                serviceProvider={orderData?.service_provider_id}
                assignedWorker={assignedWorker}
                paymentHistory={orderData?.service_payment?.payment_history}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 id="modal-title" className="text-lg font-bold mb-4">
              Confirm Rejection
            </h2>
            <p>Are you sure you want to reject this order?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleConfirmReject(orderData?._id)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}