import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Profile from "../../../assets/ViewProfile/Worker.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const cardData = [
  {
    id: 1,
    name: "Dipak Sharma",
    location: "Indore, MP",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 2,
    name: "Dipak Sharma",
    location: "Mumbai, MH",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 3,
    name: "Dipak Sharma",
    location: "Delhi NCR",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 4,
    name: "Dipak Sharma",
    location: "Indore, MP",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 5,
    name: "Dipak Sharma",
    location: "Mumbai, MH",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 6,
    name: "Dipak Sharma",
    location: "Delhi NCR",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 7,
    name: "Dipak Sharma",
    location: "Delhi NCR",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
];

export default function AssignWork() {
  const navigate = useNavigate();
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

  const handleAddWorker = (worker) => {
    navigate("/view-profile", {
      state: {
        work: {
          id: 1,
          name: "Chair work",
          image: null,
          date: "21/02/25",
          skills: "No details available.",
          location: "Indore M.P.",
        },
        profile: worker, // Pass the worker as the profile
        assignedWorker: worker, // Explicitly set assignedWorker
      },
    });
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

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/view-profile"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back to work list" />
          Back
        </Link>
      </div>

      {/* Full Page Container */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Cards Section */}
        <div className="bg-white w-full max-w-6xl shadow-2xl rounded-lg p-8">
          <h1 className="text-3xl font-bold ml-40">Worker List</h1>
          <div className="flex flex-col items-center space-y-6 mt-3">
            {cardData.map((card) => (
              <div
                key={card.id}
                className="bg-white shadow-lg rounded-xl p-5 flex items-center space-x-6 w-full max-w-3xl"
              >
                {/* Profile Image */}
                <div className="relative inline-block">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-52 h-52 object-cover rounded-lg"
                  />

                  {/* Verified Badge */}
                  {card.verified && (
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#6DEA6D] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md whitespace-nowrap">
                      Verified by Admin
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {card.name}
                  </h2>
                  <p className="text-gray-600">{card.location}</p>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleAddWorker(card)}
                  className="bg-[#228B22] text-white px-5 py-2 rounded-lg hover:bg-green-700"
                >
                  {card.buttonText}
                </button>
              </div>
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

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}