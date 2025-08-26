import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Gardening from "../../assets/Details/Gardening.png";
import Arrow from "../../assets/profile/arrow_back.svg";
import User from "../../assets/Details/User.png";
import Edit from "../../assets/Details/edit.svg";
import Pencil from "../../assets/Details/pencil.svg";
import Location from "../../assets/Details/location.svg";
import Call from "../../assets/Details/call.svg";
import Chat from "../../assets/Details/chat.svg";
import Sample from "../../assets/Details/sample.png";
import Sample2 from "../../assets/Details/sample2.jpg";
import Vector from "../../assets/Home-SP/Vector.svg";
import Aadhar from "../../assets/Details/profile-line.svg";

export default function Details() {
  const [activeTab, setActiveTab] = useState("user");
  const [vendorTab, setVendorTab] = useState("work");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEmergencyOn, setIsEmergencyOn] = useState(false);

  const workImages = [Sample, Sample2];
  const reviewImages = [Sample2, Sample];

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

  const handleToggle = () => {
    setIsEmergencyOn(!isEmergencyOn);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      <div className="flex justify-center my-6 md:mt-[70px]">
        <img
          src={Gardening}
          alt="Details Banner"
          className="w-full max-h-[400px] object-cover"
        />
      </div>

      <div className="w-full bg-[#D9D9D9] py-6">
        <div className="flex justify-center gap-10 mt-6">
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

      <div className="container mx-auto px-6 py-6">
        {activeTab === "user" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
              <div className="relative">
                <img
                  src={User}
                  alt="User Profile"
                  className="w-full h-[550px] object-cover rounded-2xl shadow-md"
                />
                <button
                  className="absolute bottom-3 left-3 bg-[#228B22] p-2 rounded-full shadow-md"
                  aria-label="Edit Profile Image"
                >
                  <img src={Edit} alt="Edit icon" className="w-7 h-7" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Mohan Sharma</h2>
                  <button aria-label="Edit Name">
                    <img src={Pencil} alt="Edit name icon" className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <img src={Location} alt="Location icon" className="w-5 h-5" />
                  <span>Indore M.P. INDIA</span>
                </div>
                <div className="p-4 shadow-xl mt-[70px] max-w-[600px]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xl">About My Skill</h3>
                    <button aria-label="Edit Skills">
                      <img src={Pencil} alt="Edit skills icon" className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vendor" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
              <div className="relative">
                <img
                  src={User}
                  alt="Vendor Profile"
                  className="w-full h-[550px] object-cover rounded-2xl shadow-md"
                />
                <button
                  className="absolute bottom-3 left-3 bg-[#228B22] p-2 rounded-full shadow-md"
                  aria-label="Edit Vendor Profile Image"
                >
                  <img src={Edit} alt="Edit icon" className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Mohan Sharma</h2>
                  <button aria-label="Edit Vendor Name">
                    <img src={Pencil} alt="Edit name icon" className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <img src={Location} alt="Location icon" className="w-5 h-5" />
                  <span>Indore M.P. INDIA</span>
                </div>
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
                <div className="p-4 shadow-md bg-white max-w-[600px]">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">About My Skill</h3>
                    <button aria-label="Edit Vendor Skills">
                      <img src={Pencil} alt="Edit skills icon" className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                    <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                  </p>
                </div>
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

              {vendorTab === "work" && (
                <div className="mt-6 w-full bg-[#D3FFD3] flex justify-center items-center py-10">
                  <div className="relative">
                    <img
                      src={workImages[currentIndex]}
                      alt={`Work sample ${currentIndex + 1}`}
                      className="w-[700px] rounded-md shadow-md"
                    />
                    <div className="absolute top-2 right-2 w-12 h-12 bg-[#228B22] rounded-full flex items-center justify-center shadow-md">
                      <img src={Edit} alt="icon" className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              )}

              {vendorTab === "review" && (
                <div className="mt-6 w-full bg-[#D3FFD3] flex justify-center items-center py-10">
                  <div className="relative">
                    <img
                      src={reviewImages[currentIndex]}
                      alt={`Review ${currentIndex + 1}`}
                      className="w-[700px] rounded-md shadow-md"
                    />
                    <div className="absolute top-2 right-2 w-12 h-12 bg-[#228B22] rounded-full flex items-center justify-center shadow-md">
                      <img src={Edit} alt="icon" className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="md:w-[700px] w-[90%] mx-auto mt-8 flex items-center justify-between p-4 rounded-lg border border-white shadow-lg ">
              <div className="flex items-center gap-2">
                <img src={Vector} alt="Warning Icon" className="w-6 h-6" />
                <span className="text-black font-medium text-lg max-md:text-sm">
                  Emergency task
                </span>
              </div>
              <div className="toggle-wrapper">
                <button
                  onClick={handleToggle}
                  className={`toggle-button w-[40px] h-[25px] flex items-center rounded-full p-1 transition-colors duration-300 ${
                    isEmergencyOn
                      ? "bg-[#228B22] justify-end"
                      : "bg-[#DF1414] justify-start"
                  }`}
                  style={{
                    width: "40px",
                    height: "25px",
                    minWidth: "40px",
                    minHeight: "25px",
                  }}
                  aria-label={
                    isEmergencyOn
                      ? "Disable emergency task"
                      : "Enable emergency task"
                  }
                  aria-checked={isEmergencyOn}
                >
                  <div className="w-[15px] h-[15px] bg-white rounded-full shadow-md"></div>
                </button>
              </div>
            </div>

            {/* Document Section */}
            <div className="container mx-auto max-w-[750px] px-6 py-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold">Document</h2>
                  <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Verified by Admin
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                      <img
                        src={Aadhar}
                        alt="Document Icon"
                        className="w-9 h-9"
                      />
                    </div>
                    <p className="font-medium">Aadhar card</p>
                  </div>
                  <img
                    src={Sample2}
                    alt="Document Preview"
                    className="w-40 h-24 object-cover rounded-md shadow"
                  />
                </div>
              </div>
            </div>

            {/* Rate & Reviews Section */}
            <div className="container mx-auto max-w-[750px] px-6 py-6">
              <h2 className="text-xl font-bold mb-4">Rate & Reviews</h2>

              {/* Review Card */}
              {[1, 2].map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 mb-4">
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star, i) => (
                      <span key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Content */}
                  <h3 className="font-semibold">Made a computer table</h3>
                  <p className="text-gray-600 text-sm">
                    It is a long established fact that a reader will be distracted by the readable
                  </p>
                  <p className="text-xs text-gray-400 mt-2">14 Apr, 2023</p>

                  {/* Reviewer Images */}
                  <div className="flex mt-3">
                    {[1, 2, 3, 4].map((img) => (
                      <img
                        key={img}
                        src={User}
                        alt="Reviewer"
                        className="w-8 h-8 rounded-full border -ml-2 first:ml-0"
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* See All Review Button */}
              <div className="text-center mt-4">
                <button className="text-[#228B22] font-semibold hover:underline">
                  See All Review
                </button>
              </div>
            </div>

            {/* Add Workers Button */}
            <div className="container mx-auto max-w-[550px] px-6 py-6">
              <button className="w-full bg-[#228B22] text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700">
                Add workers
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}