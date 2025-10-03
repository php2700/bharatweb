import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Work from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Worklist() {
  const { task } = useParams(); // e.g., "My%20Bidding"
  const [activeTab, setActiveTab] = useState(task); // Default tab
  const [taskData, setTaskData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
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

  // Set activeTab based on route parameter and fetch banners
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
    if (task) {
      const decodedTask = decodeURIComponent(task);
      const validTabs = ["My Bidding", "My Hire", "Emergency Tasks"];
      if (validTabs.includes(decodedTask)) {
        setActiveTab(decodedTask);
      } else {
        setActiveTab("Emergency Tasks");
        navigate("/user/work-list/Emergency%20Tasks");
      }
    }
  }, [task, navigate]);

  // Fetch tasks based on activeTab
  useEffect(() => {
    if (!activeTab || !token) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        let endpoint;
        switch (activeTab) {
          case "My Bidding":
            endpoint = `${BASE_URL}/bidding-order/apiGetAllBiddingOrders`;
            break;
          case "My Hire":
            endpoint = `${BASE_URL}/direct-order/getOrdersByUser`;
            break;
          case "Emergency Tasks":
            endpoint = `${BASE_URL}/emergency-order/getAllEmergencyOrdersByRole`;
            break;
          default:
            throw new Error("Invalid tab selected");
        }

        const response = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Map API response to the expected structure
        const mappedTasks = response.data.data.map((task) => ({
          id: task._id,
          project_id: task.project_id || "N/A",
          image: task.image_urls?.[0] || task.image || Work, // Fallback to Work image
          name: task.category_id?.name || task.title || "Unnamed Task",
          date: task.createdAt
            ? new Date(task.createdAt).toLocaleDateString()
            : "Unknown Date",
          skills:
            task.sub_category_ids?.map((sub) => sub.name).join(", ") ||
            task.skills?.join(", ") ||
            task.description ||
            "No skills listed",
          price: task.service_payment?.amount
            ? `₹${task.service_payment.amount}`
            : task.price
            ? `₹${task.price}`
            : "Price TBD",
          completiondate: task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "No deadline",
          status: task.hire_status || "N/A",
          location:
            task.google_address ||
            task.location ||
            task.address ||
            "Unknown Location",
        }));

        setTaskData(mappedTasks);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch ${activeTab} data. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeTab, token]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter tasks based on search query
  const filteredTasks = taskData.filter(
    (task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle tab click and update URL
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const formattedTab = encodeURIComponent(tab); // e.g., "My Bidding" to "My%20Bidding"
    navigate(`/user/work-list/${formattedTab}`);
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
      <div className="container mx-auto px-4 py-4 mt-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
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

      {/* Work Section */}
      <div className="container max-w-full mx-auto my-10">
        <div className="text-xl sm:text-2xl max-w-5xl text-center mb-5 font-bold mx-auto">
          My Hiring
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-[200px] bg-gray-100 p-2 mb-6">
          {["My Bidding", "My Hire", "Emergency Tasks"].map((tab) => (
            <button
              key={tab}
              className={`px-9 py-1 rounded-full font-semibold ${
                activeTab === tab
                  ? "bg-[#228B22] text-white"
                  : "text-[#228B22] border border-[#228b22]"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
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
              placeholder="Search for services"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Dynamic Task List */}
        <div className="space-y-6 max-w-5xl justify-center mx-auto">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center">No {activeTab} available.</div>
          ) : (
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
                  <p className="text-green-600 font-bold mt-3">{task.price}</p>
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-[#334247] mt-1 font-semibold">
                      Completion Date: {task.completiondate}
                    </p>
                    <p
                      className={`text-sm font-semibold px-2 py-1 rounded 
    ${
      task.status === "pending"
        ? "bg-yellow-200 text-yellow-800"
        : task.status === "cancelled"
        ? "bg-red-200 text-red-800"
        : task.status === "completed"
        ? "bg-green-200 text-green-800"
        : task.status === "cancelledDispute"
        ? "bg-orange-200 text-orange-800"
        : task.status === "accepted"
        ? "bg-blue-200 text-blue-800"
        : ""
    }`}
                    >
                      Project Status:{" "}
                      {task.status
                        .replace(/([A-Z])/g, " $1") // split camelCase (CancelledDispute → Cancelled Dispute)
                        .trim()
                        .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
                      {/* Capitalize each word */}
                    </p>
                  </div>
                  <div className="mt-3"></div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="bg-[#F27773] text-white py-1 px-6 rounded-full">
                      {task.location}
                    </span>
                    <button
                      className="text-[#228B22] py-1 px-7 border border-[#228B22] rounded-lg"
                      onClick={() =>
                        navigate(
                          `/${
                            activeTab === "Emergency Tasks"
                              ? "emergency"
                              : activeTab.toLowerCase().replace(" ", "-")
                          }/order-detail/${task.id}`
                        )
                      }
                    >
                      View Details
                    </button>
										{/**<button
                      className="text-[#228B22] py-1 px-7 border border-[#228B22] rounded-lg"
                      onClick={() => {
                        const tabRoutes = {
                          "My Bidding": "bidding/worker",
                          "My Hire": "hire/worker",
                          "Emergency Tasks": "emergency/worker",
                        };

                        const route = tabRoutes[activeTab];
                        navigate(`/${route}/order-detail/${task.id}`);
                      }}
                    >
                      View Details
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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
