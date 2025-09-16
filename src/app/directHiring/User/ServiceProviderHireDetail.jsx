import React, { useState, useEffect } from "react";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import serviceProviderImg from "../../../assets/directHiring/service-provider.png";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import locationIcon from "../../../assets/directHiring/location-icon.png";
import ServiceProviderHisWork from "./ServiceProviderHisWork";
import HireModel from "./HireModel";
import PaymentModel from "./PaymentModel";
import PaymentProceedModel from "./PaymentProceedModel";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ServiceProviderHireDetail() {
  const [isHireModel, setIsHireModel] = useState(false);
  const [isPaymentModelOpen, setIsPaymentModelOpen] = useState(true);
  const [isPaymentProceedModelOpen, setIsPaymentProceedModelOpen] = useState(true);
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

  const closeHireModel = () => {
    setIsHireModel(false);
  };

  const closePaymentModel = () => {
    setIsPaymentModelOpen(false);
  };

  const closePaymentProceedModel = () => {
    setIsPaymentProceedModelOpen(false);
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-green-600 text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        {/* Banner Slider */}
        <div className="w-full mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[412px] mt-5">
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
                    src={banner || "/src/assets/profile/default.png"} // Fallback image
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[412px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/profile/default.png"; // Fallback on image load error
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

        <div className="container max-w-6xl mx-auto my-10">
          <div className="text-xl sm:text-2xl font-bold mb-6">
            Direct Hiring
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <img
                src={serviceProviderImg}
                alt="Service Provider"
                className="rounded-xl shadow-lg"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-lg sm:text-xl font-semibold text-gray-800">
                  Mohan Sharma
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-semibold">(4.5</span>
                    <img
                      className="h-5 w-5 mx-1"
                      src={ratingImg}
                      alt="Rating"
                    />
                    <span className="font-semibold">)</span>
                  </div>
                  <div className="text-[#228B22] underline font-semibold">
                    150 Reviews
                  </div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <img
                  src={locationIcon}
                  alt="Location"
                  className="h-5 mr-2 text-green-500"
                />
                Indore M.P. INDIA
              </div>

              <div className="text-gray-700">
                <p>
                  <span className="font-semibold text-green-600">
                    Category-{" "}
                  </span>
                  Plumber, Carpenter
                </p>
                <p>
                  <span className="font-semibold text-green-600">
                    Sub-Categories-{" "}
                  </span>
                  Plumber, Carpenter
                </p>
              </div>

              <div className="bg-gray-50 shadow-2xl rounded-lg p-4 text-sm text-gray-600">
                <div className="font-semibold text-xl text-gray-800 mb-2">
                  About My Skill
                </div>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting. standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of
                  type and scrambled it to make a type specimen book. It has
                  survived not only five centuries, but also the leap into
                  electronic typesetting.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button className="border border-[#228B22] text-[#228B22] font-medium py-2 px-4 rounded-lg">
                  💬 Message
                </button>
                <button className="border border-[#228B22] text-[#228B22] font-medium py-2 px-8 rounded-lg">
                  📞 Call
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 my-10">
            <button className="py-1 px-10 bg-[#D3FFD3] rounded-lg border text-[#008000] cursor-pointer">
              His Work
            </button>
            <button className="py-1 px-6 rounded-lg border text-[#008000] cursor-pointer">
              Customer Review
            </button>
          </div>
        </div>

        {<ServiceProviderHisWork />}
      </div>
      <Footer />
      {isHireModel && <HireModel open={isHireModel} close={closeHireModel} />}
      {isPaymentModelOpen && (
        <PaymentModel open={isPaymentModelOpen} close={closePaymentModel} />
      )}
      {isPaymentProceedModelOpen && (
        <PaymentProceedModel
          open={isPaymentProceedModelOpen}
          close={closePaymentProceedModel}
        />
      )}
    </>
  );
}