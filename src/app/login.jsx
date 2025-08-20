import React, { useState, useRef } from "react";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [mobile, setMobile] = useState("");
  const inputRefs = useRef([]);

  // Handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input automatically
    if (index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Mobile: ${mobile}, OTP: ${otp.join("")}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-[100rem] overflow-hidden">
        
        {/* Left Image - visible only on md+ screens */}
        <div className="md:block md:w-1/2">
          <img
            src="/src/assets/login/img.png"
            alt="Plumber working"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="flex flex-col items-center space-y-6 w-full">
            
            {/* Logo */}
            <img
              src="/logo.png"
              alt="The Bharat Works"
              className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[286px] h-auto object-contain mb-32"
            />

            {/* Heading */}
            <h2 className="font-bold text-gray-900 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] mb-1">
              Enter Your Mobile Number
            </h2>
            <p className="text-gray-500 text-sm sm:text-base text-center px-2">
              Just one step away to start{" "}
              <span className="font-semibold text-gray-700">
                The Bharat Works.
              </span>
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center mt-4 space-y-6"
            >
              {/* Mobile Input Box */}
              <div
                className="flex items-center px-3 w-[280px] sm:w-[320px] md:w-[330px] lg:w-[390px] py-2 rounded-xl border-2 border-[#C6C6C6] bg-white"
              >
                {/* Flag */}
                <img
                  src="/src/assets/login/flag.png"
                  alt="India Flag"
                  className="w-6 h-4 mr-2"
                />

                {/* Country code + arrow */}
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

                {/* Input */}
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full py-2 px-2 text-gray-700 focus:outline-none"
                />
              </div>

              {/* Send OTP Button */}
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
  );
}
