import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Profile from "../../../assets/ViewProfile/Worker.png";
import banner from "../../../assets/profile/banner.png";
import Warning from "../../../assets/ViewProfile/warning.svg"; // Added Warning image import
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Search from "../../../assets/search-normal.svg";
import Accepted from "./Accepted";
import ReviewModal from "../../CommonScreens/ReviewModal";
import Swal from "sweetalert2";


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
   
  useEffect(() => {
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

    fetchData();
  }, [id, orderData?.hire_status]);

  const handleHire = async (providerId) => {
    try {
      const response = await axios.post(
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
      console.log("Hire Response:", response.data);
      setIsHired(true);
      setServiceProviders([]);
      // Refresh order data after hiring
      const orderResponse = await axios.get(
        `${BASE_URL}/emergency-order/getEmergencyOrder/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("bharat_token")}`,
          },
        }
      );
      setOrderData(orderResponse.data.data);
      setAssignedWorker(orderResponse.data.assignedWorker || null);
    } catch (err) {
      setError("Failed to hire provider. Please try again later.");
      console.error("Error:", err);
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

    if (response.status === 200) {
      // Show SweetAlert first
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Order marked as complete successfully!',
        confirmButtonColor: '#228B22',
      }).then(() => {
        // Open the ReviewModal after user clicks "OK"
        setShowCompletedModal(true);
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: 'Failed to mark order as complete. Please try again.',
      confirmButtonColor: '#FF0000',
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
      navigate("/emergency/user/work-list");
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
              src="https://via.placeholder.com/800x400"
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
                  Detailed Address :-{" "}
                  {orderData?.detailed_address || "No Address Provided"}
                  <div className="bg-[#F27773] text-white px-3 py-1 rounded-full text-sm mt-2 w-fit">
                    {" "}
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
      ${orderData?.hire_status === "cancelldispute" ? "bg-[#FF0000]" : ""}
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
              </div>
            </div>

            <div className="border border-green-600 rounded-lg p-4 mb-4 bg-gray-50">
              <p className="text-gray-700 tracking-tight">
                {orderData?.sub_category_ids
                  ?.map((sub) => sub.name)
                  .join(", ") || "No details available."}
              </p>
            </div>

            <div className="text-center mb-6">
              {orderData?.hire_status === "cancelled" ? (
                <span className="px-8 py-2 bg-[#FF0000] text-white rounded-lg text-lg font-semibold">
                  Cancelled by User
                </span>
              ) : orderData?.hire_status === "completed" ? (
                <span
  className="px-8 py-2 bg-[#228B22] text-white rounded-lg text-lg font-semibold cursor-pointer"
>
  Task Completed
</span>

              ) : orderData?.hire_status !== "assigned" ? (
                <button
                  className="px-8 py-3 bg-[#FF0000] text-white rounded-lg text-lg font-semibold hover:bg-red-700"
                  onClick={() => setShowModal(true)}
                >
                  Cancel Task
                </button>
              ) : null}
            </div>

            {/* Render Accepted component when hire_status is assigned */}
            {(orderData?.hire_status === "assigned" || orderData?.hire_status === "completed") && (
  <>
    <Accepted
      serviceProvider={orderData?.service_provider_id}
      assignedWorker={assignedWorker}
      paymentHistory={orderData?.service_payment?.payment_history}
      orderId={id}
      hireStatus={orderData?.hire_status}
    />

    {/* Show buttons only if still assigned, not completed */}
    {orderData?.hire_status === "assigned" && (
      <div className="flex flex-col items-center justify-center space-y-6 mt-6">
        {/* Yellow warning box */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative z-10">
            <img
              src={Warning}
              alt="Warning"
              className="w-40 h-40 mx-auto bg-white border border-[#228B22] rounded-lg px-2"
            />
          </div>
          <div className="bg-[#FBFBBA] border border-yellow-300 rounded-lg shadow-md p-4 -mt-20 pt-24 text-center">
            <h2 className="text-[#FE2B2B] font-bold -mt-2">Warning Message</h2>
            <p className="text-gray-700 text-sm md:text-base">
              Lorem Ipsum is simply dummy text...
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4">
          <>
  <button
  className="bg-[#228B22] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md" onClick={handleMarkComplete}>Mark as Complete</button>

  <ReviewModal
  show={showCompletedModal}
  onClose={() => setShowCompletedModal(false)}
  service_provider_id={orderData?.service_provider_id._id}
  orderId={id}
  type="emergency"
/>

</>
          <Link to={`/dispute/${id}/emergency`}>
  <button
    className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
  >
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

      {!isHired && orderData?.hire_status !== "cancelled" && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search providers by name..."
              className="w-full p-2 pl-10  rounded-lg focus:outline-none bg-[#F5F5F5]"
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
              {filteredProviders.map((provider) => (
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
                      to={`/service_provider/${provider._id}`}
                      className="text-[#228B22] border-green-600 border px-6 py-2 rounded-md text-base font-semibold mt-4 inline-block"
                    >
                      View Profile
                    </Link>
                  </div>
                  <button
                    className="px-4 py-2 bg-[#228B22] text-white rounded hover:bg-green-700"
                    onClick={() => handleHire(provider._id)}
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

      <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-[#f2e7ca] h-[400px] my-10">
        <img
          src={banner}
          alt="Decorative gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
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
