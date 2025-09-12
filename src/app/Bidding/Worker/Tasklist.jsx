import React, { useState } from "react";
import {useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import banner from "../../../assets/profile/banner.png";
import Work from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";

export default function Tasklist() {
  const [activeTab, setActiveTab] = useState("Bidding");
  const navigate = useNavigate();
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const Bidding = [
    {
      id: 1,
      name: "Chair work",
      image: Work,
      date: "21/02/25",
      skills:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting",
      location: "Indore M.P.",
    },
    {
      id: 2,
      name: "Chair work",
      image: Work,
      date: "21/02/25",
      skills:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting",
      location: "Indore M.P.",
    },
    {
      id: 3,
      name: "Chair work",
      image: Work,
      date: "21/02/25",
      skills:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting",
      location: "Indore M.P.",
    },
    {
      id: 4,
      name: "Chair work",
      image: Work,
      date: "21/02/25",
      skills:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting",
      location: "Indore M.P.",
    },
  ];

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

      {/* Top Banner */}
      <div className="w-full mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={banner}
          alt="Gardening illustration"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
        />
      </div>

      {/* Work Section */}
      <div className="container max-w-full mx-auto my-10">
        <div className="text-xl sm:text-2xl max-w-5xl font-bold mx-auto">
          My Work
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-[200px] bg-gray-100 p-2 mb-6">
          <button
            className={`px-9 py-1 rounded-full font-semibold ${
              activeTab === "My Bidding"
                ? "bg-[#228B22] text-white"
                : "text-[#228B22] border border-[#228b22]"
            }`}
            onClick={() => setActiveTab("My Bidding")}
          >
            My Bidding
          </button>
          <button
            className={`px-9 py-1 rounded-full font-semibold ${
              activeTab === "My Hire"
                ? "bg-[#228B22] text-white"
                : "text-[#228B22] border border-[#228b22]"
            }`}
            onClick={() => setActiveTab("My Hire")}
          >
            My Hire
          </button>
          <button
            className={`px-9 py-1 rounded-full font-semibold ${
              activeTab === "Emergency Tasks"
                ? "bg-[#228B22] text-white"
                : "text-[#228B22] border border-[#228b22]"
            }`}
            onClick={() => setActiveTab("Emergency Tasks")}
          >
            Emergency Tasks
          </button>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-5xl">
            {/* Search Icon/Image */}
            <img
              src={Search}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            />

            {/* Input Field */}
            <input
              className=" rounded-lg pl-10 pr-4 py-2 w-5xl bg-[#F5F5F5] focus:outline-none"
              type="search"
              placeholder="Search for services"
            />
          </div>
        </div>

        <div className="space-y-6 max-w-5xl justify-center mx-auto">
          {activeTab === "My Bidding" &&
            Bidding.map((Bidding) => (
              <div
                key={Bidding.id}
                className="flex bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Left Image */}
                <div className="relative w-1/3">
                  <img
                    src={Bidding.image}
                    alt={Bidding.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-1 rounded-full">
                    #{Bidding.id}2024
                  </span>
                </div>

                {/* Right Content */}
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {Bidding.name}
                    </h2>
                    <p className="text-sm text-[#334247] mt-1">
                      {Bidding.skills}
                    </p>
                    <p className="text-sm text-[#334247] mt-4 font-semibold">
                      Posted Date: {Bidding.date}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="flex justify-between items-center w-full">
                    {/* Location */}
                    <span className="bg-[#F27773] text-white py-0 px-7 rounded-full">
                      {Bidding.location}
                    </span>

                    {/* View Profile Button */}
                    <button
                      className="text-[#228B22] py-1 px-7 border border-[#228B22] rounded-lg"
                      onClick={() =>
                        navigate("/view-profile", { state: { Bidding } })
                      }
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* See All */}
        <div className="flex justify-center my-8">
          <button className="py-2 px-8 text-white rounded-full bg-[#228B22]">
            See All
          </button>
        </div>
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
                  <img
                    src={banner}
                    alt="Gardening illustration"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
      </div>

      <Footer />
    </>
  );
}
