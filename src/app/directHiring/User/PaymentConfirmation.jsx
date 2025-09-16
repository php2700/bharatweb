import React, { useState, useEffect } from "react";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import paymentImg from "../../../assets/directHiring/payment.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PaymentConfirmation() {
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
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-green-600 text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="max-w-2xl mx-auto py-10 mt-6 rounded-lg shadow-xl bg-white">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-6">Payment Confirmation</h2>

            <img src={paymentImg} alt="Payment" className="h-48 mx-auto mb-6" />

            <div className="space-y-3 px-8 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>01/24/2026</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>10:15 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>0 RS</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Platform fees:</span>
                <span>200 INR</span>
              </div>
            </div>

            <hr className="my-6 dotted" />

            <div className="flex justify-between text-lg font-semibold mb-6 max-w-md mx-auto px-8">
              <span>Total</span>
              <span>200/-</span>
            </div>
            <hr className="my-6 text-[#228B22]" />

            <div className="flex gap-4 justify-center mt-6 w-full">
              <button className="px-4 py-2 bg-[#228B22] w-1/4 text-white rounded-md hover:bg-green-700 transition">
                Pay
              </button>
              <button className="px-4 py-2 border border-[#228B22] w-1/4 text-green-600 rounded-md hover:bg-green-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Banner Slider */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
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
                    className="w-full h-[400px] object-cover"
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
      </div>
      <Footer />
    </>
  );
}