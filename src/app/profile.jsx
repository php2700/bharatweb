import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header2 from "../component/Header2";
import Footer from "../component/Footer";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    address: "",
    referral: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header2 />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src="/profile/arrow_back.svg" className="w-6 h-6 mr-2" />
          Back
        </Link>
      </div>

      {/* Main Form */}
      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] xl:pb-[80px] lg:pb-[80px]">
          {/* Title */}
         <main className="flex-grow container mx-auto px-4 flex justify-center items-center">
        <div className="p-6 w-full max-w-md ">
          <h2 className="text-center text-[24px] font-[700] text-[#000000] mb-6">
            Complete Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-[18px] font-[700] text-[#191A1D] mb-1 block text-center">
                What's your Name?
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px]  outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center p-[15px]"
              />
            </div>

            {/* Age */}
            <div>
              <label className="text-[18px] font-[700] text-[#191A1D] mb-1 block text-center">
                Your Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="Enter Your Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px]  outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center p-[15px]"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-[18px] font-[700] text-[#191A1D] mb-1 block text-center">
                Gender
              </label>
              <input
                type="text"
                name="gender"
                placeholder="Enter Gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px]  outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center p-[15px]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-[18px] font-[700] text-[#191A1D] mb-1 block text-center">
                Location (GPS)
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px]  outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center p-[15px]"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="text-[18px] font-[700] text-[#191A1D] mb-1 block text-center">
                Full Address (Landmark)
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter Full Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px]  outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center p-[15px]"
              />
            </div>

            {/* Referral Code */}
            <div>
              <label className="text-[18px] font-[700] text-[#191A1D]0 mb-1 block text-center">
                Referral code (Optional)
              </label>
              <input
                type="text"
                name="referral"
                placeholder="Enter Referral Code"
                value={formData.referral}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px]  outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center p-[15px]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-40 bg-[#228B22] hover:bg-green-800 text-white py-2 rounded-[15px] font-medium shadow"
            >
              Submit
            </button>
          </form>
        </div>
        
      </main>
          {/* //yahan */}
        </div>
      </div>
<div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
        <img
          src="src/assets/banner.png"
          alt="Gardening"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
        />
      </div>
      <div className="mt-[50px]">
              <Footer />
            </div>
    </div>
  );
}
