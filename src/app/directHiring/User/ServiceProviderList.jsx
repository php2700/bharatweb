import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import Default from "../../../assets/default-image.jpg";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ServiceProviderList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category_id, subcategory_ids } = location.state || {};
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
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

      const response = await axios.get(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Banner API response:", response.data); // Debug response

      if (response.data?.success) {
        if (Array.isArray(response.data.images) && response.data.images.length > 0) {
          setBannerImages(response.data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = response.data?.message || "Failed to fetch banner images";
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

  useEffect(() => {
    const fetchWorkers = async () => {
      if (!category_id || !subcategory_ids) {
        console.error("Missing category or subcategory ID");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("bharat_token");
        const response = await axios.post(
          `${BASE_URL}/user/getServiceProviders`,
          {
            category_id,
            subcategory_ids,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data?.status) {
          setWorkers(response.data.data || []);
        } else {
          console.error("Failed to fetch workers:", response.data?.message);
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [category_id, subcategory_ids]);

  const handleHire = (serviceProviderId) => {
    navigate(`/direct-hiring/${serviceProviderId}`);
  };

  // Function to truncate text based on word limit
  const truncateText = (text, wordLimit = 25) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length > wordLimit) {
      const truncated = words.slice(0, wordLimit).join(" ");
      return truncated + "...";
    }
    return text;
  };

  // Function to capitalize the first letter of each word
  const capitalizeWords = (text) => {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Filter workers based on search query
  const filteredWorkers = workers.filter((worker) => {
    const fullName = worker.full_name ? worker.full_name.toLowerCase() : "";
    const skill = worker.skill ? worker.skill.toLowerCase() : "";
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || skill.includes(query);
  })
  .sort((a, b) => {
    if (sortOrder === "asc") {
      return a.full_name.localeCompare(b.full_name);
    } else {
      return b.full_name.localeCompare(a.full_name);
    }
  });




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
      <div className="min-h-screen p-4 mt-20 sm:p-6 bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <button
            className="flex items-center text-green-600 hover:text-green-800 font-semibold"
            onClick={() => navigate(-1)}
          >
            <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
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

        <div className="container max-w-5xl mx-auto my-10">
          <div className="flex justify-between items-center p-3">
  <div className="text-2xl font-bold">Direct Hiring</div>
  <div className="flex items-center gap-3">
    <input
      className="border rounded-lg p-2 w-64"
      type="search"
      placeholder="Search by name"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />

    {/* Filter Button */}
    <button
      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200"
    >
      {sortOrder === "asc" ? "▲ Asc" : "▼ Desc"}
    </button>
  </div>
</div>


          {loading ? (
            <p className="text-center text-gray-500">Loading workers...</p>
          ) : filteredWorkers.length === 0 ? (
            <p className="text-center text-gray-500">No workers found.</p>
          ) : (
            <div className="w-full rounded-xl p-3 sm:p-4 space-y-4">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id || worker._id}
                  className="grid grid-cols-12 items-center bg-white rounded-lg shadow-lg p-4 gap-8"
                >
                  <div className="relative col-span-4 h-[200px] w-[200px] ml-4">
                    <img
                      src={worker.profile_pic || Default}
                      alt={worker.full_name}
                      className="h-[200px] w-[200px] rounded-lg object-cover mx-auto"
                    />
                  </div>

                  <div className="col-span-8 p-4">
                    <div className="flex justify-between">
                      <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                        {capitalizeWords(worker.full_name)}
                      </h2>
                      <div className="flex gap-1 items-center">
                        <img className="h-6 w-6" src={ratingImg} />
                        <div>{worker?.averageRating || "N/A"}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-lg text-gray-800">
                      About My Skill
                    </div>
                    <div className="leading-tight break-words whitespace-normal max-w-full truncate-skill">
                      {truncateText(capitalizeWords(worker?.skill))}
                    </div>

                    <div className="flex justify-between items-center my-4">
                      <div className="text-white bg-[#f27773] text-sm px-8 rounded-full max-w-[50%] truncate">
                        {capitalizeWords(worker?.location.address) || "Unknown"}
                      </div>
                      <div className="flex gap-4">
                        <Link to={`/profile-details/${worker._id}/direct`}>
                          <button className="text-[#228B22] py-1 px-4 border rounded-lg">
                            View Profile
                          </button>
                        </Link>
                        <button
                          onClick={() => handleHire(worker._id)}
                          className="text-white bg-[#228B22] py-1 px-10 rounded-lg"
                        >
                          Hire
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <div className="mt-[50px]">
        <Footer />
      </div>

      <style jsx>{`
        .truncate-skill {
          display: -webkit-box;
          -webkit-line-clamp: 3; /* Limit to 3 lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
}
