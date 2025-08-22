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
      <main className="flex-grow container mx-auto px-4 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mt-[50px]">
          <h2 className="text-center text-lg font-bold mb-6">
            Complete Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block text-center">
                What's your Name?
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center"
              />
            </div>

            {/* Age */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block text-center">
                Your Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="Enter Your Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block text-center">
                Gender
              </label>
              <input
                type="text"
                name="gender"
                placeholder="Enter Gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block text-center">
                Location (GPS)
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block text-center">
                Full Address (Landmark)
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter Full Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center"
              />
            </div>

            {/* Referral Code */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block text-center">
                Referral code (Optional)
              </label>
              <input
                type="text"
                name="referral"
                placeholder="Enter Referral Code"
                value={formData.referral}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600 placeholder:text-center"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#228B22] hover:bg-green-800 text-white py-2 rounded-md font-medium shadow"
            >
              Submit
            </button>
          </form>
        </div>
        
      </main>

      <Footer />
    </div>
  );
}
