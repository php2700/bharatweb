import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Gardening from "../../../assets/profile/profile image.png";
import Warning from "../../../assets/ViewProfile/warning.svg"; // Added Warning image import
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Accepted from "./Accepted";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, orderData?.hire_status]);

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
      <div className="container mt-20 mx-auto px-4 py-4">
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
      ${orderData?.hire_status === "cancelledDispute" ? "bg-red-600" : ""}
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
              ) : null}
            </div>

            {/* Render Accepted component when hire_status is assigned */}
            {(orderData?.hire_status === "assigned" ||
              orderData?.hire_status === "completed" ||
              orderData?.hire_status === "cancelledDispute") && (
              <>
                <Accepted
                  serviceProvider={orderData?.user_id}
                  user={orderData?.service_provider_id?._id}
                  assignedWorker={assignedWorker}
                  paymentHistory={orderData?.service_payment?.payment_history}
                  orderId={orderData?._id}
                />
                <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                  {/* Yellow warning box */}
                  <div className="relative max-w-2xl mx-auto">
                    {/* Image */}
                    <div className="relative z-10">
                      <img
                        src={Warning}
                        alt="Warning"
                        className="w-40 h-40 mx-auto bg-white border border-[#228B22] rounded-lg px-2"
                      />
                    </div>

                    {/* Yellow background + paragraph */}
                    <div className="bg-[#FBFBBA] border border-yellow-300 rounded-lg shadow-md p-4 -mt-20 pt-24 text-center mb-">
                      <h2 className="text-[#FE2B2B] font-bold -mt-2">
                        Warning Message
                      </h2>
                      <p className="text-gray-700 text-sm md:text-base">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting.
                      </p>
                    </div>
                  </div>

                  {/* Cancel button */}
                  {(orderData?.hire_status === "assigned" ||
                    orderData?.hire_status === "pending") && (
                    <div className="flex space-x-4">
                      {/* Red button (Cancel Task) */}
                      	<Link to={`/dispute/${id}/emergency`}>
												<button
													className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
												>
													Cancel Task and Create Dispute
												</button>
											</Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-[#f2e7ca] h-[400px] my-10">
        <img
          src={Gardening}
          alt="Decorative gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <Footer />
    </>
  );
}
