import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Search from "../../../assets/search-normal.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import defaultBanner from "../../../assets/profile/banner.png";
import defaultWorkImage from "../../../assets/directHiring/Work.png";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { FaMapMarkerAlt } from "react-icons/fa";

export default function EmergencyTasks() {
  const [activeTab, setActiveTab] = useState("Emergency Tasks");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("bharat_token");

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
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

      console.log("Banner API response:", response.data); // Debug response

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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredTasks = tasks.filter((task) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      (task.name?.toLowerCase().includes(q) || false) ||
      (task.skills?.toLowerCase().includes(q) || false) ||
      (task.location?.toLowerCase().includes(q) || false) ||
      (task.project_id?.toString().toLowerCase().includes(q) || false)
    );
  });

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/emergency-order/filtered-emergency-orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json(); // Parse JSON response

        if (!response.ok) {
          // Handle non-200 responses
          throw new Error(
            data.message || `API request failed with status ${response.status}`
          );
        }

        // console.log("Fetched tasks:", data);
        const transformedData = data.data.map((item) => ({
          id: item._id,
          project_id: item.project_id,
          name: item.category_id.name,
          image: item.image_urls[0] || defaultWorkImage,
          date: new Date(item.createdAt).toLocaleDateString("en-GB"),
          completiondate: new Date(item.deadline).toLocaleDateString("en-GB"),
          price: item.platform_fee
            ? `₹${item.platform_fee.toLocaleString()}`
            : "₹0",
          skills: item.sub_category_ids.map((sub) => sub.name).join(", "),
          location: item.google_address || "Unknown Location",
        }));

        setTasks(transformedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        setError(
          error.message || "Failed to load tasks. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

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
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      {/* Top Banner Slider */}
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
                  src={banner || defaultBanner} // Fallback image
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = defaultBanner; // Fallback on image load error
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

      {/* Work Section */}
      <div className="container max-w-full mx-auto my-10">
        <div className="text-xl sm:text-2xl max-w-5xl font-bold mx-auto">
          Emergency Work
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-5xl">
            <img
              src={Search}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            />
            <input
              className="rounded-lg pl-10 pr-4 py-2 w-full bg-[#F5F5F5] focus:outline-none"
              type="search"
              placeholder="Search by Project Id, service, skills, or location..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center text-gray-600">Loading tasks...</div>
        )}
        {error && <div className="text-center text-red-600">{error}</div>}

        {/* Task List */}
        {!loading && !error && (
          <div className="space-y-6 max-w-5xl justify-center mx-auto">
            {activeTab === "Emergency Tasks" && (
              <>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      {/* Left Image Section */}
                      <div className="relative w-1/3">
                        <img
                          src={task.image}
                          alt={task.name}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-1 rounded-full">
                          {task.project_id}
                        </span>
                      </div>

                      {/* Right Content Section */}
                      <div className="w-2/3 p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {task.name}
                          </h2>
                          <p className="text-sm text-[#334247] font-semibold">
                            Posted Date: {task.date}
                          </p>
                        </div>
                        <p className="text-sm text-[#334247] mt-2">{task.skills}</p>
                        <div className="mt-3">
                          <p className="text-green-600 font-bold">{task.price}</p>
                          <p className="text-sm text-[#334247] mt-1 font-semibold">
                            Completion Date: {task.completiondate}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center space-x-2">
                            <FaMapMarkerAlt size={22} color="#228B22" />
                            <span className="text-gray-700">{task.location}</span>
                          </div>

                          <button
                            className="text-[#228B22] py-1 px-6 border border-[#228B22] rounded-lg hover:bg-[#228B22] hover:text-white transition"
                            onClick={() => navigate(`/emergency/worker/${task.id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500 font-medium">
                    No matching emergency work found.
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* See All */}
        <div className="flex justify-center my-8">
          <button className="py-2 px-8 text-white rounded-full bg-[#228B22]">
            See All
          </button>
        </div>

        {/* Bottom Banner Slider */}
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
