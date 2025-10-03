import React, { useState, useEffect } from "react";
import Subscription from "./Subscription";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import BankDetails from "./BankDetails";
import Referral from "./Referral";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Account() {
  const [activeTab, setActiveTab] = useState("membership");
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Banner API response:", data); // Debug response

      if (res.ok) {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setBannerImages(data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = data.message || `HTTP error ${res.status}: ${res.statusText}`;
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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 mt-20">
        <div className="max-w-[75rem] mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Account Manage
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap border-b justify-center border-gray-300 mb-4 sm:mb-6 gap-x-6 sm:gap-x-60 gap-y-2">
            <button
              onClick={() => setActiveTab("membership")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
                activeTab === "membership"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Membership
            </button>
            <button
              onClick={() => setActiveTab("bank")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
                activeTab === "bank"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Bank Detail
            </button>
            <button
              onClick={() => setActiveTab("referral")}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
                activeTab === "referral"
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Referral
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "membership" && <Subscription />}
            {activeTab === "bank" && <BankDetails />}
            {activeTab === "referral" && <Referral />}
          </div>
        </div>

        {/* Banner Slider */}
        <div className="w-full max-w-[75rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
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
                    src={banner || "/src/assets/default.png"} // Fallback image
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/default.png"; // Fallback on image load error
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
      </div>

      <Footer />
    </>
  );
}