import React, { useState, useEffect } from "react";
import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import image from "../../../assets/workcategory/image.png";
import HireCard from "./HireCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyHire() {
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

  const tasks = [
    {
      id: "#new2323",
      image: image,
      title: "Chair work",
      description: "Lorem Ipsum is...",
      date: "21/02/25",
      status: "Pending",
      address: "Indore M.p",
    },
    {
      id: "#new2323",
      image: image,
      title: "Chair work",
      description: "Lorem Ipsum is...",
      date: "21/02/25",
      status: "Review",
      address: "Indore M.p",
    },
    {
      id: "#new2323",
      image: image,
      title: "Chair work",
      description: "Lorem Ipsum is...",
      date: "21/02/25",
      status: "Completed",
      address: "Indore M.p",
    },
    {
      id: "#new2323",
      image: image,
      title: "Chair work",
      description: "Lorem Ipsum is...",
      date: "21/02/25",
      status: "Cancelled",
      address: "Indore M.p",
    },
  ];

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
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-[#228B22] text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="max-w-4xl shadow-2xl py-10 mx-auto my-10 space-y-4">
          <div className="text-2xl font-semibold text-center">My Hire</div>
          <div className="flex justify-evenly gap-2 mb-6 border border-white bg-gray-200">
            <button className="px-6 py-2 rounded-full border border-[#228B22] text-[#228B22]">
              Bidding Tasks
            </button>
            <button className="px-6 py-2 rounded-full bg-[#228B22] text-white">
              Direct Hiring
            </button>
            <button className="px-6 py-2 rounded-full border border-[#228B22] text-[#228B22]">
              Emergency Tasks
            </button>
          </div>
          <div className="px-2 md:px-10 lg:px-20">
            {tasks.map((task, index) => (
              <HireCard key={index} task={task} />
            ))}
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