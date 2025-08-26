import React, { useState, useRef } from "react";
import Header from "../component/Header2";
import Footer from "../component/footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import banner from '../assets/banner.png';
import image from '../assets/login/img.png';
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function OtpVerification() {
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const mobile = localStorage.getItem("mobileNumber");

  // ✅ Verify OTP
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
        localStorage.setItem("token", data.token);
        localStorage.setItem('role',data.role);
        localStorage.setItem('isProfileComplete',data.isProfileComplete);
        toast.success("OTP verified successfully!");
        localStorage.removeItem("mobileNumber");

        setTimeout(() => {
          navigate("/selectrole");
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
        toast.success("OTP resent successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while resending OTP");
    }
  };
const otpv=localStorage.getItem('otp');
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

          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
            <div className="flex flex-col items-center space-y-6">
              <img
                src={logo}
                alt="The Bharat Works"
                className="w-[200px] md:w-[286px] h-auto object-contain mb-24"
              />
                <h1 className="text-[#ff2108] text-[20px]">Otp is : {otpv}</h1>
              <h2 className="text-2xl font-bold text-gray-900 relative top-[18px]">
                Verify OTP
              </h2>
              <p className="text-[#334247] font-sans text-[17px]">
                Code has been sent to{" "}
                <span className="font-semibold">
                  ********{mobile?.slice(-2)}
                </span>
              </p>

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

              <p className="text-[#334247] text-[16px] font-semibold text-center">
                Didn’t get OTP Code ? <br />
                <button
                  type="button"
                  onClick={handleResendOtp} // ✅ API call binded here
                  className="text-green-600 font-semibold hover:underline mt-1"
                >
                  Resend Code
                </button>
              </p>

              <button
                onClick={handleSubmit}
                className="w-full sm:w-[300px] md:w-[330px] lg:w-[390px] bg-[#228B22] hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-[18px]"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
        {/* Foreground image */}
        <img
          src={banner}
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
