import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OurServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const token = localStorage.getItem("bharat_token");

  // Navigate to subcategories with the full service object
  const handleServicecategoryClick = (service) => {
    if (!token) {
      return navigate("/login");
    }
    setTimeout(() => {
      navigate("/subcategories", { state: { service } });
    }, 150); // 150ms delay
  };

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Banner API response:", data); 

      if (res.ok) {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setBannerImages(data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage =
          data.message || `HTTP error ${res.status}: ${res.statusText}`;
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

    const fetchServices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/work-category`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.status) {
          setServices(data.data || []);
        } else {
          console.error("Failed to fetch services:", data.message);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
    fetchBannerImages();
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
      <div className="py-10 px-4 sm:px-10 md:px-20 mt-20">
        <h2 className="text-[37px] font-bold text-center mb-2">Our Services</h2>
        <p className="text-[20px] font-[500] text-center text-[#000000] mb-10">
          Categories
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-[60px]">
          {services.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No services found.
              <br />
              Login to get all the services.
            </p>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                onClick={() => handleServicecategoryClick(service)}
                className="bg-white rounded-[30px] p-6 
                           shadow-[0px_5px_29px_0px_#64646F26] 
                           hover:shadow-[0px_10px_50px_0px_#64646F50] 
                           hover:scale-105 
                           transition-transform duration-300 ease-in-out
                           cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-15 h-15 flex items-center justify-center rounded-full bg-[#D3E8D3]">
                    <img
                      src={
                        service.image
                          ? service.image
                          : "/src/assets/workcategory/default.png"
                      }
                      alt={service.name}
                      className="w-[39px] h-[39px]"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(36%) sepia(100%) saturate(500%) hue-rotate(85deg)",
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-[23px] font-[500] text-center mb-2 text-[#000000]">
                  {service.name}
                </h3>
              </div>
            ))
          )}
        </div>
      </div>

     {/* Top banner */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] mt-5 
  h-[220px] sm:h-[400px]">

        {bannerLoading ? (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            Loading banners...
          </p>
        ) : bannerError ? (
          <p className="absolute inset-0 flex items-center justify-center text-red-500">
            {bannerError}
          </p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((banner, i) => (
              <div key={i} className="w-full h-[220px] sm:h-[400px]">
                <img
                  src={banner}
                  alt={`Banner ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = Work)}
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
