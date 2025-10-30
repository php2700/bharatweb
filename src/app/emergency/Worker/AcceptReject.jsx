import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Accepted from "./Accepted";
 import workImage from "../../../assets/workcategory/image.png";

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
        const response = await axios.get(`${BASE_URL}/emergency-order/getEmergencyOrder/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
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

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await axios.post(`${BASE_URL}/emergency-order/accept-order/${orderId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Accept response:", response.data);
       navigate("/worker/work-list/Emergency task")
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
      const response = await axios.post(`${BASE_URL}/emergency-order/reject-order/${orderId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Reject response:", response.data);
      navigate("/emergency/worker/work-list")
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

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                <div>Category: {orderData?.category_id?.name || "Unknown Category"}</div>
                <div>
                  Address: {orderData?.detailed_address || "No Address Provided"}
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mt-2">
                    Location: {orderData?.google_address || "Unknown Location"}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm block text-center">
                  {orderData?.project_id || "#N/A"}
                </span>
                <span className="text-gray-600 font-semibold block">
                  Posted: {orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : "N/A"}
                </span>
                <span className="text-gray-600 font-semibold block">
                  Status:{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium
                      ${orderData?.hire_status === "pending" ? "bg-yellow-500" : ""}
                      ${orderData?.hire_status === "cancelled" ? "bg-red-500" : ""}
                      ${orderData?.hire_status === "completed" ? "bg-green-500" : ""}
                      ${orderData?.hire_status === "cancelldispute" ? "bg-orange-500" : ""}
                      ${orderData?.hire_status === "assigned" ? "bg-blue-500" : ""}`}
                  >
                    {orderData?.hire_status
                      ? orderData.hire_status
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")
                      : "Unknown Status"}
                  </span>
                </span>
              </div>
            </div>

            <div className="border border-green-600 rounded-lg p-4 mb-4 bg-gray-50">
              <p className="text-gray-700">
                {orderData?.sub_category_ids?.map((sub) => sub.name).join(", ") || "No details available."}
              </p>
            </div>

            {orderData?.hire_status === "pending" && (
              <div className="flex justify-evenly items-center mb-6">
                <button
                  className="px-8 py-3 bg-green-600 min-w-[250px] text-white rounded-[8px] text-lg font-semibold hover:bg-green-700"
                  onClick={() => handleAcceptOrder(orderData?._id)}
                >
                  Accept
                </button>
                <button
                  className="px-8 py-3 bg-red-600 min-w-[250px] text-white rounded-[8px] text-lg font-semibold hover:bg-red-700"
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
