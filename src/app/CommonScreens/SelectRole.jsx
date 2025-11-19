import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRole } from "../../redux/roleSlice";
import { CheckCircle } from "lucide-react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { fetchUserProfile } from "../../redux/userSlice";
import business from "../../assets/selection/business.png";
import customer from "../../assets/selection/customer.png";
import { Link, useNavigate } from "react-router-dom";
import Arrow from "../../assets/profile/arrow_back.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RoleSelection() {
  const dispatch = useDispatch();
  const selectedRole = useSelector((state) => state.role.selectedRole);
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
      // console.log("Banner API response:", data); // Debug response

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
    dispatch(fetchUserProfile());
    fetchBannerImages();
  }, [dispatch]);

  const roleMap = {
    service_provider: "Business",
    user: "Customer",
  };

  const handleContinue = () => {
    if (selectedRole) {
      localStorage.setItem("role", selectedRole); // save in localStorage
      navigate("/profile"); // redirect to profile page
    }
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
      <div className="container mx-auto px-4 py-4  mt-20">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" />
          Back
        </Link>
      </div>
      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] xl:pb-[147px] lg:pb-[147px]">
          <h2 className="text-[22px] font-bold text-gray-800">
            Select Your Role
          </h2>
          <p className="text-[16px] text-gray-500  hidden md:block font-medium mt-1">
            Please choose whether you are a Worker or a <br /> Customer to
            proceed
          </p>
          <p className="text-[16px] text-gray-500 font-medium mt-1 md:hidden text-center">
            Please choose whether you are a Worker or a Customer to proceed
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 mt-6">
            <div
              onClick={() => dispatch(selectRole("user"))}
              className={`flex flex-col items-center cursor-pointer transition-transform ${
                selectedRole === "user" ? "scale-105" : ""
              }`}
            >
              <div className="relative">
                <div
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-4 bg-white shadow-[0px_2px_1px_1px_#bab1b1] ${
                    selectedRole === "user"
                      ? "border-green-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={business}
                    alt="Customer"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-[82px]"
                  />
                </div>
                {selectedRole === "user" && (
                  <CheckCircle
                    size={20}
                    className="absolute bottom-1 right-7 rounded-full p-[3px] bg-[#228B22] stroke-white"
                  />
                )}
              </div>
              <p className="mt-2 font-medium text-lg sm:text-xl drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]">
                Customer
              </p>
            </div>
            <div
              onClick={() => dispatch(selectRole("service_provider"))}
              className={`flex flex-col items-center cursor-pointer transition-transform ${
                selectedRole === "service_provider" ? "scale-105" : ""
              }`}
            >
              <div className="relative">
                <div
                  className={`w-24 h-24 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-4 bg-white shadow-[0px_2px_1px_1px_#bab1b1] ${
                    selectedRole === "service_provider"
                      ? "border-green-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={customer}
                    alt="Business"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-[82px]"
                  />
                </div>
                {selectedRole === "service_provider" && (
                  <CheckCircle
                    size={20}
                    className="absolute bottom-1 right-7 rounded-full p-[3px] bg-[#228B22] stroke-white"
                  />
                )}
              </div>
              <p className="mt-2 font-medium text-lg sm:text-xl text-black drop-shadow-[2px_4px_6px_rgba(0,0,0,0.3)]">
                Business
              </p>
            </div>
          </div>
          <p className="mt-6 text-[17px] text-gray-500 font-medium">
            Looking For Hiring
          </p>
          <button
            onClick={handleContinue}
            className={`mt-[67px] w-full sm:w-80 py-3 rounded-[15px] font-semibold transition 
              bg-[#228B22] text-white ${
                !selectedRole ? "cursor-not-allowed" : "hover:bg-green-700"
              }`}
            disabled={!selectedRole}
          >
            {selectedRole
              ? `Continue as ${roleMap[selectedRole]}`
              : "Select Any One"}
          </button>
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
      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
