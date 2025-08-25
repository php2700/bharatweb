import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/footer";
import Hiring from "../assets/Home-SP/hiring1.png";
import Bidding from "../assets/Home-SP/bidding.png";
import Emergency from "../assets/Home-SP/emergency.png";
import Promise from "../assets/Home-SP/promise.png";
import Paper from "../assets/Home-SP/paper.svg";
import Vector from "../assets/Home-SP/Vector.svg";
import Banner from "../assets/Home-SP/banner.jpg";

export default function ServiceProviderHome() {
  const [isEmergencyOn, setIsEmergencyOn] = useState(false);
  const [directHiring, setDirectHiring] = useState([
    {
      image: Hiring,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Hiring,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Hiring,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Hiring,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
  ]);

  const [bidding, setBidding] = useState([
    {
      image: Bidding,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Bidding,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Bidding,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Bidding,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
  ]);

  const [emergency, setEmergency] = useState([
    {
      image: Emergency,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Emergency,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Emergency,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
    {
      image: Emergency,
      work: "Make a chair",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      amount: "₹200",
      location: "Indore M.P.",
    },
  ]);

  const handleToggle = () => {
    setIsEmergencyOn(!isEmergencyOn);
  };

  return (
    <>
      <Header />

      {/* First Full Width Image */}
      <div className="w-full">
        <img
          src={Banner}
          alt="Banner"
          className="w-full h-[400px] object-cover mt-[60px] max-md:h-[200px]"
        />
      </div>

      {/* Second Image with Button */}
      <div className="w-[90%] mx-auto relative mt-8">
        <img
          src={Promise}
          alt="Second Banner"
          className="w-full rounded-2xl object-cover h-[150px] border border-[#228B22] max-md:h-[120px]"
        />

        {/* Desktop Layout: Circle + Text on left, Button on right */}
        <div className="hidden max-md:!hidden md:flex items-center absolute top-1/2 -translate-y-1/2 left-[100px] gap-[100px]">
          <div className="flex items-center gap-[100px]">
            {/* White Circular Div */}
            <div className="w-[100px] h-[100px] bg-white rounded-full shadow flex items-center justify-center">
              <img src={Paper} alt="Icon" className="w-12 h-12" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-black">Pro Plan</h2>
              <p className="text-xl text-gray-600 mt-1">Expiry on: 15 Aug 2025</p>
              <span className="text-lg font-bold text-gray-800 mt-1">Subscription</span>
            </div>
          </div>
        </div>
        <div className="hidden max-md:!hidden md:block absolute right-[100px] top-1/2 -translate-y-1/2">
          <button className="bg-[#228B22] hover:bg-green-800 text-white px-6 py-2 rounded-xl shadow">
            Upgrade Now
          </button>
        </div>

        {/* Mobile Layout: Button on right, Circle + Text to its right */}
        <div className="md:hidden flex flex-row-reverse items-center absolute top-1/2 -translate-y-1/2 right-4 gap-3">
          {/* Upgrade Now Button */}
          <button className="bg-[#228B22] hover:bg-green-800 text-white px-4 py-1 rounded-xl shadow">
            Upgrade Now
          </button>

          {/* Circle + Text Section */}
          <div className="flex items-center gap-3">
            <div className="w-[70px] h-[70px] bg-white rounded-full shadow flex items-center justify-center">
              <img src={Paper} alt="Icon" className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-black">Pro Plan</h2>
              <p className="text-sm text-gray-600 mt-1">Expiry on: 15 Aug 2025</p>
              <span className="text-sm font-bold text-gray-800 mt-1">Subscription</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Toggle Section */}
      <div className="md:w-[70%] w-[90%] mx-auto mt-8 flex items-center justify-between p-4 rounded-lg border border-white shadow-lg bg-[#CEFFDE]">
        <div className="flex items-center gap-2">
          <img src={Vector} alt="Warning Icon" className="w-6 h-6" />
          <span className="text-black font-medium text-lg max-md:text-sm">
            Are you ready for Emergency task?
          </span>
        </div>
        <div className="toggle-wrapper">
          <button
            onClick={handleToggle}
            className={`toggle-button w-[40px] h-[25px] flex items-center rounded-full p-1 transition-colors duration-300 ${
              isEmergencyOn ? "bg-[#228B22] justify-end" : "bg-[#DF1414] justify-start"
            }`}
            style={{ width: "40px", height: "25px", minWidth: "40px", minHeight: "25px" }}
            aria-label={isEmergencyOn ? "Disable emergency task" : "Enable emergency task"}
            aria-checked={isEmergencyOn}
          >
            <div className="w-[15px] h-[15px] bg-white rounded-full shadow-md"></div>
          </button>
        </div>
      </div>

      {/* Recent Direct Hiring Section */}
      <div className="w-full bg-[#EDFFF3] py-12 mt-10">
        <div className="max-w-[90%] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black max-md:text-lg">Recent Direct Hiring</h2>
            <Link to="/direct-hiring" className="text-black font-medium text-base cursor-pointer max-md:text-sm">
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {directHiring.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-2">
                <div className="relative w-full">
                  <img
                    src={card.image}
                    alt={card.work}
                    className="w-full h-36 object-cover rounded-2xl"
                  />
                  <div
                    className="absolute bottom-2 right-2 px-4 py-1 rounded-full text-white text-sm"
                    style={{ backgroundColor: "#372E27" }}
                  >
                    Add Feature
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <h3 className="text-xl font-semibold text-[#228B22] max-md:text-lg">{card.work}</h3>
                  <p className="text-black font-medium max-md:text-sm">{card.amount}</p>
                </div>
                <p className="text-gray-600 max-w-[87%] text-xs mt-1">{card.description}</p>
                <div
                  className="inline-block px-5 mt-2 rounded-full text-white text-sm"
                  style={{ backgroundColor: "#F27773" }}
                >
                  {card.location}
                </div>
                <div className="px-1 py-1 mt-2 rounded-lg text-[#228B22] text-base border border-[#228B22] w-[60%] font-semibold text-center mx-auto cursor-pointer hover:bg-[#228B22] hover:text-white transition max-md:text-sm">
                  View Details
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bidding */}
        <div className="max-w-[90%] mx-auto mt-[100px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black max-md:text-lg">Bidding</h2>
            <Link to="/bidding" className="text-black font-medium text-base cursor-pointer max-md:text-sm">
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bidding.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-2">
                <div className="relative w-full">
                  <img
                    src={card.image}
                    alt={card.work}
                    className="w-full h-36 object-cover rounded-2xl"
                  />
                  <div
                    className="absolute bottom-2 right-2 px-4 py-1 rounded-full text-white text-sm"
                    style={{ backgroundColor: "#372E27" }}
                  >
                    Add Feature
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <h3 className="text-xl font-semibold text-[#228B22] max-md:text-lg">{card.work}</h3>
                  <p className="text-black font-medium max-md:text-sm">{card.amount}</p>
                </div>
                <p className="text-gray-600 max-w-[87%] text-xs mt-1">{card.description}</p>
                <div
                  className="inline-block px-5 mt-2 rounded-full text-white text-sm"
                  style={{ backgroundColor: "#F27773" }}
                >
                  {card.location}
                </div>
                <div className="px-1 py-1 mt-2 rounded-lg text-[#228B22] text-base border border-[#228B22] w-[60%] font-semibold text-center mx-auto cursor-pointer hover:bg-[#228B22] hover:text-white transition max-md:text-sm">
                  View Details
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency */}
        {isEmergencyOn && (
          <div className="max-w-[90%] mx-auto mt-[100px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black max-md:text-lg">Emergency</h2>
              <Link to="/emergency" className="text-black font-medium text-base cursor-pointer max-md:text-sm">
                See All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {emergency.map((card, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-2">
                  <div className="relative w-full">
                    <img
                      src={card.image}
                      alt={card.work}
                      className="w-full h-36 object-cover rounded-2xl"
                    />
                    <div
                      className="absolute bottom-2 right-2 px-4 py-1 rounded-full text-white text-sm"
                      style={{ backgroundColor: "#372E27" }}
                    >
                      Add Feature
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <h3 className="text-xl font-semibold text-[#228B22] max-md:text-lg">{card.work}</h3>
                    <p className="text-black font-medium max-md:text-sm">{card.amount}</p>
                  </div>
                  <p className="text-gray-600 max-w-[87%] text-xs mt-1">{card.description}</p>
                  <div
                    className="inline-block px-5 mt-2 rounded-full text-white text-sm"
                    style={{ backgroundColor: "#F27773" }}
                  >
                    {card.location}
                  </div>
                  <div className="px-1 py-1 mt-2 rounded-lg text-[#228B22] text-base border border-[#228B22] w-[60%] font-semibold text-center mx-auto cursor-pointer hover:bg-[#228B22] hover:text-white transition max-md:text-sm">
                    View Details
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}