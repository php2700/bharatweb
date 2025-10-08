import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OurSubCategories() {
  const navigate = useNavigate();
  const location = useLocation();
  const { service } = location.state || {};
  const token = localStorage.getItem("bharat_token");
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  // Toggle selection for multiple choices
  const toggleSelect = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
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

    const fetchSubCategories = async () => {
      if (!service) return;
      try {
        const res = await fetch(`${BASE_URL}/subcategories/${service._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.status) {
          setSubcategories(data.data || []);
        } else {
          console.error("Failed to fetch subcategories:", data.message);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
    fetchBannerImages();
  }, [service, token]);

  if (!service) {
    return (
      <>
        <Header />
        <p className="text-center mt-20 text-red-500">No service selected!</p>
        <Footer />
      </>
    );
  }

  const handleHire = () => {
    const selectedSubIds = selectedIndexes.map((i) => subcategories[i]._id);

    if (selectedSubIds.length === 0) {
      alert("Please select at least one subcategory!");
      return;
    }

    navigate("/service-provider-list", {
      state: {
        category_id: service._id,
        subcategory_ids: selectedSubIds,
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
      <div className="py-10 px-4 mt-20 sm:px-10 md:px-20">
        <h2 className="text-[37px] font-bold text-center mb-2">
          {service.name} Sub-Categories
        </h2>
        <p className="text-[20px] font-[500] text-center text-[#000000] mb-10">
          Multiple choices
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading subcategories...</p>
        ) : subcategories.length === 0 ? (
          <p className="text-center text-gray-500">No subcategories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-[60px]">
            {subcategories.map((sub, index) => {
              const isSelected = selectedIndexes.includes(index);

              return (
                <div
                  key={sub._id}
                  onClick={() => toggleSelect(index)}
                  className={`cursor-pointer bg-white rounded-[30px] p-6 shadow-[0px_5px_29px_0px_#64646F26]
                    ${isSelected ? "border-2 border-[#000000]" : ""}`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-15 h-15 flex items-center justify-center rounded-full bg-[#D3E8D3]">
                      <img
                        src={
                          sub.image
                            ? sub.image
                            : "/src/assets/workcategory/default.png"
                        }
                        alt={sub.name}
                        className="w-[39px] h-[39px]"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(36%) sepia(100%) saturate(500%) hue-rotate(85deg)",
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="text-[23px] font-[500] text-center mb-2 text-[#000000]">
                    {sub.name}
                  </h3>
                  <p className="text-[#777777] text-[17px] text-center">
                    {sub.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-10 mb-6">
        <button
          onClick={handleHire}
          className="bg-[#228B22] text-white px-10 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-green-700 transition"
        >
          Hire
        </button>
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

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}