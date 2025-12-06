import React, { useState, useEffect, useRef } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import banner from "../../assets/profile/banner.png";
import image from "../../assets/login/img.png";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function OtpVerification() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerError, setBannerError] = useState(null);

  const mobile = localStorage.getItem("mobileNumber");
  const token = localStorage.getItem("bharat_token");
  const fetchBannerImages = async () => {
    try {
      setBannerLoading(true);
      // Note: Usually public banners don't need a token, but included as per your request
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: headers,
      });
      const data = await res.json();

      if (res.ok && Array.isArray(data.images)) {
        setBannerImages(data.images);
      } else {
        setBannerImages([]);
      }
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };
  useEffect(() => {
    fetchBannerImages();
  }, []);

  // ✅ Slider Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Arrows hidden for cleaner look on OTP page
  };

  // ✅ Verify OTP (form submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/user/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mobile,
          entered_otp: enteredOtp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("bharat_token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("isProfileComplete", data.isProfileComplete);
        toast.success("OTP verified successfully!");

        localStorage.removeItem("mobileNumber");

        // setTimeout(() => {
        //   navigate("/select-role");
        // }, 2000);

        setTimeout(() => {
          if (data.role === "both") {
            navigate("/homeservice");
          } else if (data.role === "service_provider") {
            navigate("/homeservice");
          } else if (data.role === "user") {
            navigate("/homeuser");
          } else {
            navigate("/select-role"); // fallback
          }
        }, 2000);
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Resend OTP
  const handleResendOtp = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("otp", data.temp_otp);
        toast.success("OTP resend successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while resending OTP");
    }
  };

  const otpv = localStorage.getItem("otp");

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
     <div className="pt-4 flex items-center justify-center bg-white mt-[50px] md:min-h-screen">
        <div className="flex flex-col md:flex-row w-full max-w-[100rem] overflow-hidden">
          {/* Left Image */}
          <div className="w-full md:w-1/2 md:flex md:justify-center">
            <img
              src={image}
              alt="Plumber working"
              className="w-full h-full  object-cover object-center 
                     md:object-contain 
         [border-top-right-radius:80px] 
         sm:[border-top-right-radius:100px]
         [border-bottom-right-radius:80px] 
                   sm:[border-bottom-right-radius:100px]"
            />
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
        
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center space-y-6"
            >
              <img
                src={logo}
                alt="The Bharat Works"
                className="w-[200px] md:w-[286px] h-auto object-contain "
              />
              <h1 className="text-[#ff2108] text-[20px]">Otp is : {otpv}</h1>
              <h2 className="text-2xl font-bold text-gray-900 relative top-[10px]">
                Verify OTP
              </h2>
              <p className="text-[#334247] font-sans text-[17px]">
                Code has been sent to{" "}
                <span className="font-semibold">
                  ********{mobile?.slice(-2)}
                </span>
              </p>

              {/* OTP Inputs */}
              <div className="flex space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      const newOtp = [...otp];
                      newOtp[index] = value;
                      setOtp(newOtp);

                      if (value && index < otp.length - 1) {
                        inputRefs.current[index + 1].focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        inputRefs.current[index - 1].focus();
                      }
                    }}
                    className={`text-center border-2 rounded-[16px] text-xl font-semibold focus:outline-none 
                      caret-[#228B22] transition-colors duration-200
                      ${
                        digit
                          ? "bg-[#228B22] text-white border-[#228B22]"
                          : "bg-gray-200 text-gray-400 border-gray-300 focus:border-[#228B22]"
                      }`}
                    placeholder="-"
                    style={{ width: "75px", height: "56px" }}
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <p className="text-[#334247] text-[16px] font-semibold text-center">
                Didn’t get OTP Code? <br />
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-green-600 font-semibold hover:underline mt-1"
                >
                  Resend Code
                </button>
              </p>

              {/* Verify Button (submit type) */}
              <button
                type="submit"
                className="w-full sm:w-[300px] md:w-[330px] lg:w-[390px] bg-[#228B22] hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-[18px]"
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Banner */}
      {/* <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={banner}
          alt="Gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
      </div> */}
      {/* <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5 shadow-lg">
        {bannerLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Loading banners...</p>
          </div>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((imgUrl, index) => (
              <div key={index} className="h-[400px] outline-none">
                <img
                  src={imgUrl}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/Home-SP/default.png"; // Fallback if image fails
                  }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          // Fallback if no banners are returned
          <div className="flex items-center justify-center h-full bg-gray-200">
             <p className="text-gray-500">No banners available</p>
          </div>
        )}
      </div> */}
      <div
        className="w-full  max-w-[95%] mx-auto rounded-[50px] overflow-hidden shadow-2xl relative bg-[#f2e7ca] mt-5 
                        h-[220px] sm:h-[400px]"
      >
        <Slider {...sliderSettings}>
          {bannerImages.length > 0 ? (
            bannerImages.map((banner, index) => (
              <div key={index} className="w-full h-[220px] sm:h-[400px]">
                <img
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/Home-SP/default.png";
                  }}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-[220px] sm:h-[400px] bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600 font-medium">No banners available</p>
            </div>
          )}
        </Slider>
      </div>

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
