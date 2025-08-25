import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/footer";
import Gardening from "../assets/Details/Gardening.png";
import Arrow from "../assets/profile/arrow_back.svg";
import User from "../assets/Details/User.png";
import Edit from "../assets/Details/edit.svg";
import Pencil from "../assets/Details/pencil.svg";
import Location from "../assets/Details/location.svg";
import Call from "../assets/Details/call.svg";
import Chat from "../assets/Details/chat.svg";
import Sample from "../assets/Details/sample.png";
import Sample2 from "../assets/Details/sample2.jpg";

export default function Details() {
  // State for top-level tabs: "user" or "vendor"
  const [activeTab, setActiveTab] = useState("user");
  // State for vendor profile sub-tabs: "work" or "review"
  const [vendorTab, setVendorTab] = useState("work");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Images for "His Work"
  const workImages = [Sample, Sample2];

  // Images for "Customer Review"
  const reviewImages = [Sample2, Sample];

  // Auto-slide images every 2 seconds for vendor sub-tabs
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "vendor") {
        if (vendorTab === "work") {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % workImages.length);
        } else if (vendorTab === "review") {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewImages.length);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTab, vendorTab]);

  return (
    <>
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      {/* Image Section */}
      <div className="flex justify-center my-6 md:mt-[70px]">
        <img
          src={Gardening}
          alt="Details Banner"
          className="w-full max-h-[400px] object-cover"
        />
      </div>

      {/* Profile Toggle Section with Background */}
      <div className="w-full bg-[#D9D9D9] py-6">
        <div className="flex justify-center gap-10 mt-6">
          {/* User Profile Button */}
          <button
            onClick={() => setActiveTab("user")}
            className={`px-6 py-2 rounded-md font-semibold shadow-md transition-colors duration-300 ${
              activeTab === "user"
                ? "bg-[#228B22] text-white"
                : "bg-white text-[#228B22]"
            }`}
            aria-label="View User Profile"
          >
            User Profile
          </button>

          {/* Vendor Profile Button */}
          <button
            onClick={() => setActiveTab("vendor")}
            className={`px-6 py-2 rounded-md font-semibold shadow-md transition-colors duration-300 ${
              activeTab === "vendor"
                ? "bg-[#228B22] text-white"
                : "bg-white text-[#228B22]"
            }`}
            aria-label="View Vendor Profile"
          >
            Vendor Profile
          </button>
        </div>
      </div>

      {/* Tab Content Section */}
      <div className="container mx-auto px-6 py-6">
        {activeTab === "user" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
              {/* Left: Profile Image */}
              <div className="relative">
                <img
                  src={User}
                  alt="User Profile"
                  className="w-full h-[550px] object-cover rounded-2xl shadow-md"
                />
                {/* Edit button on image */}
                <button
                  className="absolute bottom-3 left-3 bg-[#228B22] p-2 rounded-full shadow-md"
                  aria-label="Edit Profile Image"
                >
                  <img src={Edit} alt="Edit icon" className="w-7 h-7" />
                </button>
              </div>

              {/* Right: User Info */}
              <div className="flex flex-col gap-4">
                {/* Name + Edit */}
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Mohan Sharma</h2>
                  <button aria-label="Edit Name">
                    <img
                      src={Pencil}
                      alt="Edit name icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 font-bold">
                  <img
                    src={Location}
                    alt="Location icon"
                    className="w-5 h-5 inline-block"
                  />
                  <span>Indore M.P. INDIA</span>
                </div>

                {/* About My Skill Card */}
                <div className="p-4 shadow-xl mt-[70px] max-w-[600px]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xl">About My Skill</h3>
                    <button aria-label="Edit Skills">
                      <img
                        src={Pencil}
                        alt="Edit skills icon"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting.
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting.
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vendor" && (
          <div className="p-6">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
              {/* Left: Profile Image */}
              <div className="relative">
                <img
                  src={User}
                  alt="Vendor Profile"
                  className="w-full h-[550px] object-cover rounded-2xl shadow-md"
                />
                {/* Edit button */}
                <button
                  className="absolute bottom-3 left-3 bg-[#228B22] p-2 rounded-full shadow-md"
                  aria-label="Edit Vendor Profile Image"
                >
                  <img src={Edit} alt="Edit icon" className="w-6 h-6" />
                </button>
              </div>

              {/* Right: Vendor Info */}
              <div className="flex flex-col gap-4">
                {/* Name + Edit */}
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Mohan Sharma</h2>
                  <button aria-label="Edit Vendor Name">
                    <img
                      src={Pencil}
                      alt="Edit name icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-black font-bold">
                  <img src={Location} alt="Location icon" className="w-5 h-5" />
                  <span>Indore M.P. INDIA</span>
                </div>

                {/* Category */}
                <p className="text-base">
                  <span className="font-bold text-[#228B22]">Category-</span>{" "}
                  Plumber, Carpenter
                </p>
                <p className="text-base -mt-4">
                  <span className="font-bold text-[#228B22]">
                    Sub-Categories-
                  </span>{" "}
                  Plumbing, Carpentry
                </p>

                {/* About My Skill */}
                <div className="p-4 shadow-md bg-white max-w-[600px]">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">About My Skill</h3>
                    <button aria-label="Edit Vendor Skills">
                      <img
                        src={Pencil}
                        alt="Edit skills icon"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting.
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting.
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-4">
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-[#228B22] text-[#228B22] rounded-md shadow-md"
                    aria-label="Send Message"
                  >
                    <img src={Chat} alt="Message icon" className="w-5 h-5" />
                    Message
                  </button>

                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-[#228B22] text-[#228B22] rounded-md shadow-md"
                    aria-label="Make a Call"
                  >
                    <img src={Call} alt="Call icon" className="w-5 h-5" />
                    Call
                  </button>
                </div>
              </div>
            </div>

            {/* Vendor Sub-Tabs */}
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-center gap-6 p-4 mt-6">
                <button
                  onClick={() => {
                    setVendorTab("work");
                    setCurrentIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md shadow-md font-semibold ${
                    vendorTab === "work"
                      ? "bg-[#228B22] text-white"
                      : "bg-green-100 text-[#228B22]"
                  }`}
                  aria-label="View Work"
                >
                  His Work
                </button>
                <button
                  onClick={() => {
                    setVendorTab("review");
                    setCurrentIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md shadow-md font-semibold ${
                    vendorTab === "review"
                      ? "bg-[#228B22] text-white"
                      : "bg-green-100 text-[#228B22]"
                  }`}
                  aria-label="View Customer Reviews"
                >
                  Customer Review
                </button>
              </div>

              {/* Work Carousel */}
              {vendorTab === "work" && (
                <div className="mt-6 w-full bg-[#D3FFD3] flex justify-center items-center py-10">
                  <img
                    src={workImages[currentIndex]}
                    alt={`Work sample ${currentIndex + 1}`}
                    className="w-[700px] rounded-md shadow-md"
                  />
                </div>
              )}

              {/* Review Carousel */}
              {vendorTab === "review" && (
                <div className="mt-6 w-full bg-[#D3FFD3] flex justify-center items-center py-10">
                  <img
                    src={reviewImages[currentIndex]}
                    alt={`Review ${currentIndex + 1}`}
                    className="w-[700px] rounded-md shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
