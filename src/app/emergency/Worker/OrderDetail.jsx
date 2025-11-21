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
import { FaMapMarkerAlt } from "react-icons/fa";
import workImage from "../../../assets/directHiring/Work.png";
import Slider from "react-slick";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


export default function ViewProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
   const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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
    const handleGetDirections = (destinationAddress) => {
    if (destinationAddress) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destinationAddress
      )}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      // आप चाहें तो यहाँ Swal या toast का इस्तेमाल कर सकते हैं
      alert("Destination address not found!");
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
              src={workImage}
              alt="No project images available"
              className="w-full h-[360px] object-cover mt-5"
            />
          )}

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-gray-800 text-lg font-semibold">
                <p>Title :- {orderData?.title || "No Title"}</p>
                <span>
                  Category:-{" "}
                  {orderData?.category_id?.name || "Unknown Category"}
                </span>

                <div>
                  Sub Category :-{" "}
                  {orderData?.sub_category_ids
                    .map((sub) => sub.name)
                    .join(", ") || "No Address Provided"}
                  {/* <div className="text-gray-600 flex justify-center items-center px-0 py-1 rounded-full text-sm mt-2 w-fit">
                    {" "}
                    <span>
                      <FaMapMarkerAlt
                        size={25}
                        color="#228B22"
                        className="mr-2"
                      />
                    </span>
                    {orderData?.google_address || "Unknown Location"}
                  </div> */}
                  <div 
  onClick={() => setIsMapModalOpen(true)}
  className="text-gray-600 flex justify-center items-center px-0 py-1 rounded-full text-sm mt-2 w-fit cursor-pointer"
>
    {" "}
    <span>
      <FaMapMarkerAlt
        size={25}
        color="#228B22"
        className="mr-2"
      />
    </span>
    {orderData?.google_address || "Unknown Location"}
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
      ${orderData?.hire_status === "pending" ? "bg-yellow-500" : ""}
      ${orderData?.hire_status === "cancelled" ? "bg-[#FF0000]" : ""}
      ${orderData?.hire_status === "completed" ? "bg-[#228B22]" : ""}
      ${orderData?.hire_status === "cancelledDispute" ? "bg-red-600" : ""}
      ${orderData?.hire_status === "assigned" ? "bg-[#228B22]" : ""}`}
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

            <div className="border border-green-600 rounded-lg p-4 mb-4 bg-gray-50">
              <p className="text-gray-700 tracking-tight">
                {orderData?.description || "No details available."}
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
                  user_id={orderData?.service_provider_id?._id}
                  assignedWorker={assignedWorker}
                  paymentHistory={orderData?.service_payment?.payment_history}
                  fullPaymentHistory={orderData?.service_payment}
                  orderId={id}
                  hireStatus={orderData?.hire_status}
                />
                <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                  {/* Yellow warning box */}
                  {/*<div className="relative max-w-2xl mx-auto">
                    
                    <div className="relative z-10">
                      <img
                        src={Warning}
                        alt="Warning"
                        className="w-40 h-40 mx-auto bg-white border border-[#228B22] rounded-lg px-2"
                      />
                    </div>

                   
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
                  </div>*/}

                  {/* Cancel button */}
                  {(orderData?.hire_status === "assigned" ||
                    orderData?.hire_status === "pending" ||
                    orderData?.hire_status === "completed") && (
                    <div className="flex space-x-4">
                      {/* Red button (Cancel Task) */}
                      <Link to={`/dispute/${id}/emergency`}>
                        <button className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md">
                          {orderData?.hire_status === "completed"
                            ? "Create Dispute"
                            : "Cancel Task and Create Dispute"}
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
              <h2 className="text-xl font-semibold">Work Location on Map</h2>
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
                  orderData?.google_address || ""
                )}`}
              ></iframe>
            </div>
            <div className="mt-5 text-center">
              <button
                onClick={() => handleGetDirections(orderData?.google_address)}
                className="px-6 py-2 bg-[#228B22] text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
