// worker/RejectedWorkDetails.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import defaultWorkImage from "../../../assets/directHiring/his-work.png";
// import callIcon from "../../../assets/directHiring/call.png";
// import messageIcon from "../../../assets/directHiring/message.png";
import Profile from "../../../assets/ViewProfile/Worker.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function RejectedWorkDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const task = state?.task;
  console.log(task);
  console.log(task.offer_history);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [openImage, setOpenImage] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        const { data } = await axios.get(
          `${BASE_URL}/banner/getAllBannerImages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data?.success) setBannerImages(data.images || []);
      } catch (err) {
        console.error("Banner fetch error:", err);
      } finally {
        setBannerLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (!task) {
    return (
      <div className="text-center py-20 text-red-600 text-2xl font-bold">
        No task details found.
      </div>
    );
  }

  const images = Array.isArray(task.images)
    ? task.images
    : [task.image || defaultWorkImage];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const handleGetDirections = () => {
    if (task.location) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          task.location
        )}`,
        "_blank"
      );
    }
  };

  const handleChatOpen = (receiverId) => {
    localStorage.setItem("receiverId", receiverId);
    localStorage.setItem(
      "senderId",
      JSON.parse(localStorage.getItem("user"))?._id
    );
    navigate("/chats");
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-4 mt-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#228B22] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} alt="Back" className="w-6 h-6 mr-2" />
          Back
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {images.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={3000}
              showStatus={false}
              onClickItem={(i) => setOpenImage(images[i])}
            >
              {images.map((url, i) => (
                <div key={i} className="h-96">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-96 object-cover cursor-pointer"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <img
              src={defaultWorkImage}
              alt="No image"
              className="w-full h-96 object-cover"
            />
          )}

          {openImage && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
              onClick={() => setOpenImage(null)}
            >
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img
                  src={openImage}
                  alt="Full"
                  className="max-w-[90vw] max-h-[90vh] rounded-xl"
                />
                <button
                  onClick={() => setOpenImage(null)}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black rounded-full text-3xl font-bold shadow-lg"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
              <div className="space-y-4">
                <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                  {task.title}
                </h1>
                <div
                  onClick={() => setIsMapModalOpen(true)}
                  className="flex items-center text-gray-700 cursor-pointer hover:text-green-700"
                >
                  <FaMapMarkerAlt size={28} color="#228B22" className="mr-3" />
                  <span className="text-lg">{task.location}</span>
                </div>
                <div className="text-gray-600">
                  <p className="text-lg">
                    <strong>Deadline:</strong>{" "}
                    {task.deadline
                      ? new Date(
                          task.deadline.split("/").reverse().join("-")
                        ).toLocaleDateString("en-GB")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-3">
                <span className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm block text-center">
                  {task.project_id || "#N/A"}
                </span>

                <span className="text-gray-600 font-semibold block">
                  Posted Date:{" "}
                  {task.createdAt
                    ? new Date(
                        task.createdAt.split("/").reverse().join("-")
                      ).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
               <div className="flex items-center gap-2">
  <span className="text-gray-700 font-semibold">Order_Status:</span>

  <div
    className={`px-4 py-1 rounded-full text-sm text-white flex items-center gap-2
      ${
        task?.hire_status === "pending"
          ? "bg-yellow-500"
          : task?.hire_status === "cancelled"
          ? "bg-red-500"
          : task?.hire_status === "completed"
          ? "bg-[#228B22]"
          : task?.hire_status === "cancelledDispute"
          ? "bg-[#FF0000]"
          : task?.hire_status === "accepted"
          ? "bg-[#228B22]"
          : "bg-gray-500"
      }
    `}
  >
    <p className="text-white text-sm">
      {task?.hire_status
        ? task.hire_status.charAt(0).toUpperCase() + task.hire_status.slice(1)
        : ""}
    </p>
  </div>


                </div>
              </div>
            </div>

            <div className="border-2 border-green-600 rounded-xl p-4 bg-green-50 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-black mb-4">
                User Details
              </h2>
              <div className="bg-white rounded-2xl shadow-2xl h-[150px]   overflow-hidden">
                <div className="p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center space-x-6">
                    <img
                      src={
                        task.user_profile || task.user?.profile_pic || Profile
                      }
                      alt="Customer"
                      className="w-24 h-24 rounded-full object-cover border-4 border-red-100 shadow-xl"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {task.user_name || "Unknown User"}
                      </h3>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-full text-white text-sm font-medium bg-red-500">
                    {task?.offer_history && task.offer_history.length > 0
                      ? task.offer_history[0].isRejectedByUser
                        ? "Rejected by me"
                        : "Rejected by user"
                      : "No offer history"}
                  </div>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden h-[400px] my-16 bg-[#f2e7ca]">
        {bannerLoading ? (
          <div className="flex items-center justify-center h-full text-gray-600">
            Loading banners...
          </div>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-full h-[400px] object-cover"
              />
            ))}
          </Slider>
        ) : (
          <img
            src={defaultWorkImage}
            alt="Default"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Work Location</h2>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="text-red-600 text-3xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="w-full h-96 rounded-lg overflow-hidden border-4 border-green-600">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                  task.location
                )}`}
              />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleGetDirections}
                className="px-8 py-3 bg-[#228B22] text-white font-bold rounded-xl hover:bg-green-700 text-lg"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
