import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import images from "../../assets/workcategory/image.png";
import hire1 from "../../assets/workcategory/hire1.jpg";
import hire2 from "../../assets/workcategory/hire2.jpg";
import hire3 from "../../assets/workcategory/hire3.jpeg";
import banner1 from "../../assets/workcategory/biddingTask.jpg";
import banner2 from "../../assets/workcategory/emergencyTask.png";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import defaultWork from "../../assets/directHiring/Work.png";

export default function WorkCategories() {
  const selectedRoles = useSelector((state) => state.role.selectedRoles);
  const token = localStorage.getItem("bharat_token");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  // const socket = useSelector((state) => state.socket?.socket);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null); // New state for error message
  const [directHiring, setDirectHiring] = useState([]);
  const [directHiringLoading, setDirectHiringLoading] = useState(false);
  const [directHiringError, setDirectHiringError] = useState(null);
  // Fetch categories
  const visibleDirectHiring = directHiring.slice(0, 4);
  // console.log("visibleDirectHiring", visibleDirectHiring);
  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/work-category`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.status) {
        setCategories(data.data || []);
      } else {
        console.error(
          "Failed to fetch categories:",
          data.message || "Unknown error"
        );
      }
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch direct hiring
  const fetchDirectHiring = async () => {
    try {
      setDirectHiringLoading(true);
      const res = await fetch(`${BASE_URL}/direct-order/getOrdersByUser`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.data)) {
          setDirectHiring(
            data.data.map((item) => ({
              id: item._id || "",
              image: item.image_url[0] || defaultWork,
              work: item.title || "Make a chair",
              description:
                item.description ||
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
              amount: item.platform_fee || "₹200",
              location: item.address || "Indore M.P.",
            }))
          );
        } else {
          setDirectHiring([]);
          setDirectHiringError("No direct hiring tasks available");
        }
      } else {
        const errorMessage =
          data.message || `HTTP error ${res.status}: ${res.statusText}`;
        console.error("Failed to fetch direct hiring:", errorMessage);
        setDirectHiringError(errorMessage);
      }
    } catch (err) {
      console.error("Error fetching direct hiring:", err.message);
      setDirectHiringError(err.message);
    } finally {
      setDirectHiringLoading(false);
    }
  };

  // Fetch banner images
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
      // console.log("Banner API response:", data); // 🔍 Debug response

      // ✅ Flexible handling of different API structures
      if (res.ok) {
        if (Array.isArray(data.images) && data.images.length > 0) {
          // Case 1: data.data contains banners
          setBannerImages(data.images);
        } else {
          // Case 3: No banners found
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
    fetchCategories();
    fetchBannerImages();
    fetchDirectHiring();
  }, []);

  const SeeAll = () => {
    navigate("/ourservices");
  };

  const OurSubCategories = (service) => {
    navigate("/subcategories", { state: { service } });
  };

  const viewProfile = () => {
    navigate("/details");
  };

  const WorkerList = () => {
    navigate("/service-provider-list");
  };

  const hireWorker = (workerDetail) => {
    navigate(`/direct-hiring/${workerDetail?._id}`);
  };

  const postWork = () => {
    navigate("/bidding/newtask");
  };

  const handleBidding = () => {
    navigate("/user/work-list/My Bidding");
  };

  const postEmergencyWork = () => {
    navigate("/emergency/userpost");
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
  // console.log("images",bannerImages);
  return (
    <>
      <Header />
      <div className="font-sans text-gray-800 mt-25 md:mt-35">
        {/* Hero Section with Slider */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-2 md:mt-5">
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
                    src={banner || "/src/assets/workcategory/default.png"} // Fallback image
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/workcategory/default.png"; // Fallback on image load error
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

        {/* Categories */}
        <div className="mx-auto px-4 py-10 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center lg:text-left lg:ml-[55px]">
            Work Categories
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 justify-items-center gap-4">
              {categories.slice(0, 15).map((cat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 sm:p-6 rounded-lg w-28 sm:w-32 
             transition transform hover:scale-120 hover:shadow-lg cursor-pointer"
                  onClick={() => OurSubCategories(cat)}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D3E8D3]">
                    <img
                      src={
                        cat.image
                          ? cat.image
                          : "/src/assets/workcategory/default.png"
                      }
                      alt={cat.name}
                      className="w-[27px] filter brightness-0 sepia saturate-100 hue-rotate-100"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(36%) sepia(100%) saturate(500%) hue-rotate(85deg)",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[13px] sm:text-[15px] text-[#191A1D] font-[500] ml-[21px]">
                    {cat.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* See All Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={SeeAll}
              className="w-[200px] sm:w-[222px] h-[46px] bg-[#228B22] text-white rounded-[15px] hover:scale-105 transition-all duration-300"
            >
              See All
            </button>
          </div>
        </div>

        {/* Direct Hiring Section */}
        <div className="w-full bg-[#EDFFF3] py-10">
          <div className="mx-auto px-4 sm:px-10">
            <div className="max-w-[90%] mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black max-md:text-lg">
                  Direct Hiring
                </h2>
                {directHiring.length > 4 && (
                  <button
                    onClick={() => navigate("/user/work-list/My Hire")}
                    className="text-black font-medium text-base cursor-pointer max-md:text-sm hover:text-[#228B22]"
                  >
                    See All
                  </button>
                )}
              </div>

              {directHiringLoading ? (
                <p className="text-gray-500 text-center">
                  Loading direct hiring tasks...
                </p>
              ) : directHiringError ? (
                <p className="text-red-500 text-center">
                  Error: {directHiringError}
                </p>
              ) : directHiring.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {visibleDirectHiring.map((card, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-md p-2"
                    >
                      <div className="relative w-full">
                        <img
                          src={card?.image}
                          alt={capitalizeFirst(card?.work || "Work")}
                          className="w-full h-36 object-cover rounded-2xl"
                        />
                        {/* <div
                          className="absolute bottom-2 right-2 px-4 py-1 rounded-full text-white text-sm"
                          style={{ backgroundColor: "#372E27" }}
                        >
                          Add Feature
                        </div> */}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <h3 className="text-xl font-semibold text-[#228B22] max-md:text-lg">
                          {capitalizeFirst(card.work)}
                        </h3>
                       {/* <p className="text-black font-medium max-md:text-sm">
                          ₹{card.amount}
                        </p> */}
                      </div>
                      <p className="text-gray-600 max-w-[87%] text-xs mt-1">
                        {(() => {
                          const words = card.description?.split(" ") || [];
                          const limitedText = words.slice(0, 20).join(" ");
                          return capitalizeFirst(
                            words.length > 20
                              ? `${limitedText}...`
                              : limitedText
                          );
                        })()}
                      </p>

                      <div
                        className="inline-block px-5 mt-2 rounded-full text-white text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ backgroundColor: "#F27773", width: "100px" }}
                      >
                        {capitalizeFirst(card.location)}
                      </div>
                      <div
                        className="px-1 py-1 mt-2 rounded-lg text-[#228B22] text-base border border-[#228B22] w-[60%] font-semibold text-center mx-auto cursor-pointer hover:bg-[#228B22] hover:text-white transition max-md:text-sm"
                        onClick={() =>
                          navigate(`/my-hire/order-detail/${card.id}`)
                        }
                      >
                        View Details
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  No direct hiring tasks available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mx-auto px-4 sm:px-10 py-10 grid md:grid-cols-2 gap-6 items-stretch lg:pl-0">
          <img src={banner1} alt="Worker"   className="rounded-lg w-full max-h-[320px] md:max-h-[380px] object-cover mx-auto" />
          <div className="flex flex-col justify-center h-full">
            <h2 className="text-[22px] sm:text-[24px] text-[#228B22] font-bold mb-4">
              Post Work with bidder
            </h2>
            <p className="text-[16px] sm:text-[18px] font-bold text-[#838383] leading-relaxed">
             The “Post Work With Bidder” feature helps you connect with a wide network of professionals. Once you submit your project details, qualified bidders review your requirements and submit their offers. You can compare bids, check profiles, verify experience, and communicate directly before selecting the right professional. This ensures you get the best talent at the best price.
            </p>
            <button
              onClick={postWork}
              className="mt-8 sm:mt-20 w-[143px] bg-[#228B22] text-white px-6 py-2 rounded-[33px] shadow-[0px_1px_1px_1px_#7e7e7e] border border-[#aba8a8] hover:bg-[#1a6b1a] hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Post Work
            </button>
          </div>
        </div>

        {/* Emergency Section */}
        <div className="bg-white-50 py-10">
          <div className="mx-auto px-4 sm:px-10 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-[22px] sm:text-[24px] text-[#228B22] font-bold mb-4">
                Emergency Work
              </h2>
              <p className="text-[16px] sm:text-[18px] font-bold text-[#838383] leading-relaxed">
               When you post an Emergency Work request, our platform instantly connects you with nearby qualified service providers who are ready to respond without delay. Whether it’s an urgent repair, last-minute support, or time-sensitive assistance, your request is prioritized so professionals can quickly review the details and reach out with immediate help. Get fast responses, transparent communication, and reliable service exactly when you need it the most.
              </p>
              <button
                onClick={postEmergencyWork}
                className="mt-8 sm:mt-20 w-[143px] bg-[#228B22] text-white px-6 py-2 rounded-[33px] shadow-[0px_1px_1px_1px_#7e7e7e] border border-[#aba8a8] hover:bg-[#1a6b1a] hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Post Work
              </button>
            </div>
            <img src={banner2} alt="Emergency"  className="rounded-lg w-full max-h-[320px] md:max-h-[380px] object-cover mx-auto" /> />
          </div>
        </div>

        {/* Blog Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 sm:p-6">
          {/* Card 1 - Direct Hiring */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-full relative h-[322px] sm:h-[383px]">
            <img
              src={hire1}
              alt="Direct Hiring"
              className="w-full h-[322px] sm:h-[383px] object-cover"
            />
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => {
                  navigate("/user/work-list/My Hire");
                }}
                className="w-[200px] sm:w-[227px] h-[53px] bg-[#228B22] border-2 border-white text-[14px] sm:text-[15px] text-white font-semibold rounded-full hover:bg-[#1a6f1a] hover:scale-105 transition-all duration-300"
              >
                Direct Hiring
              </button>
            </div>
          </div>

          {/* Card 2 - Bidding */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-full relative h-[322px] sm:h-[383px]">
            <img
              src={hire2}
              alt="Bidding"
              className="w-full h-[322px] sm:h-[383px] object-cover"
            />
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
              <button
                onClick={handleBidding}
                className="w-[200px] sm:w-[227px] h-[53px] bg-[#228B22] border-2 border-white text-[14px] sm:text-[15px] text-white font-semibold rounded-full hover:bg-[#1a6f1a] hover:scale-105 transition-all duration-300"
              >
                Bidding
              </button>
            </div>
          </div>

          {/* Card 3 - Emergency */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-full relative h-[322px] sm:h-[383px]">
            <img
              src={hire3}
              alt="Emergency"
              className="w-full h-[322px] sm:h-[383px] object-cover"
            />
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
              <button
                className="w-[200px] sm:w-[227px] h-[53px] bg-[#228B22] border-2 border-white text-[14px] sm:text-[15px] text-white font-semibold rounded-full hover:bg-[#1a6f1a] hover:scale-105 transition-all duration-300"
                onClick={() => navigate("/user/work-list/My Emergency")}
              >
                Emergency
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
