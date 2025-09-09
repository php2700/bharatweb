import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Profile from "../../../assets/ViewProfile/Worker.png";
import banner from "../../../assets/profile/banner.png";
import Warning from "../../../assets/ViewProfile/warning.svg";
import ratingImg from "../../../assets/rating/ic_round-star.png";
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

  // Fetch related workers based on category and subcategory
  const fetchRelatedWorkers = async (category_id, subcategory_ids) => {
    try {
      if (!category_id || !subcategory_ids?.length) {
        console.warn("Category ID or Subcategory ID is missing");
        setRelatedWorkers([]);
        return;
      }

      console.log("Fetching related workers with categoryId:", category_id, "subcategoryIds:", subcategory_ids);
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
      console.log("Related workers response:", response.data);
      const workers = Array.isArray(response.data.data) ? response.data.data : [];
      setRelatedWorkers(workers);
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
        const orderResponse = await axios.get(
          `${BASE_URL}/direct-order/getDirectOrderWithWorker/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Order Response:", orderResponse.data);
        setOrderData(orderResponse.data.data.order);
        setAssignedWorker(orderResponse.data.data.assignedWorker || null);
        setServiceProviders(orderResponse.data.data.order.offer_history || []);
        setIsHired(orderResponse.data.data.order.hire_status !== "pending");

        // Initialize offer statuses
        const initialStatuses = {};
        orderResponse.data.data.order.offer_history?.forEach((provider) => {
          initialStatuses[provider.provider_id._id] = "sent";
        });
        setOfferStatuses(initialStatuses);

        // Save category and subcategory IDs in state
        setCategory_id(orderResponse.data.data.order.category_id || null);
        setSubcategory_ids(orderResponse.data.data.order.subcategory_ids || []);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Trigger related workers fetch when category/subcategory changes
  useEffect(() => {
    if (category_id && subcategory_ids.length > 0) {
      fetchRelatedWorkers(category_id, subcategory_ids);
    }
  }, [category_id, subcategory_ids]);

  const handleHire = async (providerId) => {
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
      console.log("Hire Response:", response.data);

      setOrderData((prev) => ({
        ...prev,
        hire_status: "assigned",
      }));
      setIsHired(true);
      setServiceProviders([]);
      setRelatedWorkers([]); // Clear related workers after hiring

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Provider hired successfully!",
        confirmButtonColor: "#228B22",
      });

      acceptedSectionRef.current?.scrollIntoView({ behavior: "smooth" });

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
      setError("Failed to hire provider. Please try again later.");
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to hire provider. Please try again.",
        confirmButtonColor: "#FF0000",
      });
    }
  };

  const handleCancelOffer = async (providerId) => {
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
      console.log("Cancel Offer Response:", response.data);

      setOfferStatuses((prev) => ({
        ...prev,
        [providerId]: "pending",
      }));

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Offer cancelled successfully!",
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

  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      const response = await axios.post(
        `${BASE_URL}/direct-order/completeOrderUser`,
        { order_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order marked as complete successfully!",
          confirmButtonColor: "#228B22",
        }).then(() => {
          setShowCompletedModal(true);
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to mark order as complete. Please try again.",
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

  // Filter related workers based on search query
  const filteredRelatedWorkers = relatedWorkers.filter((worker) =>
    worker.full_name?.toLowerCase().includes(searchQuery)
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
          {orderData?.image_url?.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={false}
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
              src="https://via.placeholder.com/800x400"
              alt="No project images available"
              className="w-full h-[360px] object-cover mt-5"
            />
          )}

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                <span>Category :- {orderData?.title || "Unknown Title"}</span>
                <div>
                  Detailed Address :- {orderData?.address || "No Address Provided"}
                  <div className="bg-[#F27773] text-white px-3 py-1 rounded-full text-sm mt-2 w-fit">
                    {orderData?.user_id?.location?.address || "Unknown Location"}
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
                      ${orderData?.hire_status === "cancelled task" ? "bg-[#FF0000]" : ""}
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
                {orderData?.description}
              </p>
            </div>

            {/* Hired Worker Details */}
            {assignedWorker && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Hired Worker
                </h2>
                <div className="grid grid-cols-12 items-center gap-8">
                  <div className="relative col-span-4">
                    <img
                      src={assignedWorker.profile_pic || Profile}
                      alt={assignedWorker.full_name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <span className="absolute bottom-2 left-0 w-full bg-black/80 text-white font-medium text-sm px-4 py-2 text-center">
                      {assignedWorker?.status || "Available"}
                    </span>
                  </div>
                  <div className="col-span-8">
                    <div className="flex justify-between">
                      <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                        {assignedWorker.full_name}
                      </h2>
                      <div className="flex gap-1 items-center">
                        <img className="h-6 w-6" src={ratingImg} />
                        <div>{assignedWorker?.averageRating || "N/A"}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-lg text-gray-800">
                      About My Skill
                    </div>
                    <div className="leading-tight">{assignedWorker?.skill}</div>
                    <div className="flex justify-between items-center my-4">
                      <div className="text-white bg-[#f27773] text-sm px-8 rounded-full">
                        {assignedWorker?.location?.address || "Unknown"}
                      </div>
                      <div className="flex gap-4">
                        <Link
                          to={`/service_provider/${assignedWorker._id}`}
                          className="text-[#228B22] py-1 px-4 border rounded-lg"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Providers from Offer History */}
            {orderData?.hire_status !== "cancelled" &&
              orderData?.hire_status !== "cancelled task" &&
              !isHired && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Offered Service Providers
                  </h2>
                  {filteredProviders.length > 0 ? (
                    <div className="space-y-4">
                      {filteredProviders.map((provider) => (
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
                            <p className="bg-[#F27773] text-white px-3 py-1 rounded-full text-sm mt-2 w-fit">
                              {provider.provider_id?.location?.address ||
                                "No Address Provided"}
                            </p>
                            <Link
                              to={`/service_provider/${provider.provider_id._id}`}
                              className="text-[#228B22] border-green-600 border px-6 py-2 rounded-md text-base font-semibold mt-4 inline-block"
                            >
                              View Profile
                            </Link>
                          </div>
                          <div className="flex flex-col gap-2">
                            {offerStatuses[provider.provider_id._id] ===
                            "pending" ? (
                              <span className="text-[#FF0000] border border-[#FF0000] px-3 py-1 rounded-lg font-semibold">
                                Cancelled
                              </span>
                            ) : (
                              <>
                                <button
                                  className="px-4 py-2 bg-[#228B22] text-white rounded opacity-50 cursor-not-allowed font-semibold"
                                  disabled
                                >
                                  Offer Sent
                                </button>
                                <button
                                  className="px-4 py-2 bg-[#FF0000] text-white rounded hover:bg-red-700 font-semibold"
                                  onClick={() =>
                                    handleCancelOffer(provider.provider_id._id)
                                  }
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
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

            {/* Task Status / Cancel Button */}
            <div className="text-center mb-6">
              {["assigned", "completed", "cancelled", "cancelled task"].includes(
                orderData?.hire_status
              ) ? (
                orderData?.hire_status === "cancelled" ||
                orderData?.hire_status === "cancelled task" ? (
                  <span className="px-8 py-2 bg-[#FF0000] text-white rounded-lg text-lg font-semibold">
                    Cancelled Task
                  </span>
                ) : orderData?.hire_status === "completed" ? (
                  <span className="px-8 py-2 bg-[#228B22] text-white rounded-lg text-lg font-semibold cursor-pointer">
                    Task Completed
                  </span>
                ) : orderData?.hire_status === "assigned" ? (
                  <button
                    className="px-8 py-3 bg-[#FF0000] text-white rounded-lg text-lg font-semibold hover:bg-red-700"
                    onClick={() => setShowModal(true)}
                  >
                    Cancel Task
                  </button>
                ) : null
              ) : null}
            </div>

            {(orderData?.hire_status === "assigned" ||
              orderData?.hire_status === "completed") && (
              <div ref={acceptedSectionRef}>
                <Accepted
                  serviceProvider={orderData?.service_provider_id}
                  assignedWorker={assignedWorker}
                  paymentHistory={orderData?.service_payment?.payment_history}
                  orderId={id}
                  hireStatus={orderData?.hire_status}
                />

                {orderData?.hire_status === "assigned" && (
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
                      <button
                        className="bg-[#228B22] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
                        onClick={handleMarkComplete}
                      >
                        Mark as Complete
                      </button>
                      <ReviewModal
                        show={showCompletedModal}
                        onClose={() => setShowCompletedModal(false)}
                        service_provider_id={orderData?.service_provider_id?._id}
                        orderId={id}
                        type="direct"
                      />
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

      {/* Related Workers Section */}
      {orderData?.hire_status !== "cancelled" &&
        orderData?.hire_status !== "cancelled task" &&
        !isHired && (
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
              ) : filteredRelatedWorkers.length > 0 ? (
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
                        <Link
                          to={`/service_provider/${worker._id}`}
                          className="text-[#228B22] border-green-600 border px-6 py-2 rounded-md text-base font-semibold mt-4 inline-block"
                        >
                          View Profile
                        </Link>
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
              ) : (
                <div className="text-center text-gray-600">
                  No related workers found.
                </div>
              )}
            </div>
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