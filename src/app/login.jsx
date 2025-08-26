import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header2";
import Footer from "../component/footer";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import banner from '../assets/banner.png';
import image from '../assets/login/img.png';
import flag from '../assets/login/flag.png';
import logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (err) {
    console.error("Permission error:", err);
    return false;
  }
};

export default function LoginPage() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
 
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mobile, setMobile] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile || mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      toast.error("Please allow notifications to proceed");
      return;
    }

    try {
      const fcmToken = await getToken(messaging, {
        vapidKey:
          "BB4krNzHVO1aWqrQAHGbz-5Y4LRP97M0YJHKahBZM_tte_CFxz2OEY4SZI-ao9KuwS_JRKnN2XtRXtBYzYgtQ6c",
      });

      if (!fcmToken) {
        toast.error("Failed to get device token");
        return;
      }

      const res = await fetch(
        `${BASE_URL}/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: mobile, firebase_token: fcmToken }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("mobileNumber", mobile);
        localStorage.setItem("otp", data.temp_otp);
        
        toast.success("OTP sent successfully!");
        setTimeout(() => {
        navigate("/verifyotp");
    }, 2000);
        } 
        else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex items-center justify-center bg-white mt-[50px]">
        <div className="flex flex-col md:flex-row w-full max-w-[100rem] overflow-hidden">
          <div className="md:block md:w-1/2">
            <img
              src={image}
              alt="Plumber working"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="flex flex-col items-center space-y-6 w-full">
              <img
                src={logo}
                alt="The Bharat Works"
                className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[286px] h-auto object-contain mb-32"
              />

              <h2 className="font-bold text-gray-900 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] mb-1">
                Enter Your Mobile Number
              </h2>
              <p className="text-gray-500 text-sm sm:text-base text-center px-2">
                Just one step away to start{" "}
                <span className="font-semibold text-gray-700">
                  The Bharat Works.
                </span>
              </p>

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center mt-4 space-y-6"
              >
                <div className="flex items-center px-3 w-[280px] sm:w-[320px] md:w-[330px] lg:w-[390px] py-2 rounded-xl border-2 border-[#C6C6C6] bg-white">
                  <img
                    src={flag}
                    alt="India Flag"
                    className="w-6 h-4 mr-2"
                  />
                  <div className="flex items-center text-gray-700 mr-2">
                    <span className="text-sm font-semibold">+91</span>
                    <svg
                      className="w-4 h-4 ml-1 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full py-2 px-2 text-gray-700 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-[280px] sm:w-[320px] md:w-[330px] lg:w-[390px] bg-[#228B22] hover:bg-green-700 text-white font-semibold py-3 rounded-2xl text-[16px] sm:text-[18px] md:text-[19px]"
                >
                  Send OTP
                </button>
              </form>
            </div>
          </div>
        </div>
        
      </div>
       <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
      {/* Foreground image */}
      <img
        src={banner} // apna image path yahan lagao
        alt="Gardening"
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
      />
    </div>


      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
