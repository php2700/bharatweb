import React, { useState, useRef } from "react";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`OTP Entered: ${otp.join("")}`);
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
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo */}
            <img
              src="/logo.png"
              alt="The Bharat Works"
              className="w-[200px] md:w-[286px] h-auto object-contain mb-24"
            />

            {/* OTP Section */}
            <h2 className="text-2xl font-bold text-gray-900 relative top-[18px]">
              Verify OTP
            </h2>
            <p className="text-[#334247] font-sans text-[17px]">
              Code has been sent to{" "}
              <span className="font-semibold">********54</span>
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
                    ${digit
                      ? "bg-[#228B22] text-white border-[#228B22]"
                      : "bg-gray-200 text-gray-400 border-gray-300 focus:border-[#228B22]"}`}
                  placeholder="-"
                  style={{ width: "75px", height: "56px" }}
                />
              ))}
            </div>

            {/* Resend Code */}
            <p className="text-[#334247] text-[16px] font-semibold text-center">
              Didn’t get OTP Code ? <br />
              <button
                type="button"
                className="text-green-600 font-semibold hover:underline mt-1"
              >
                Resend Code
              </button>
            </p>

            {/* Verify Button */}
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
  );
}
