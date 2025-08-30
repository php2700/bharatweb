import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import banner from "../../../assets/profile/banner.png";
import Work from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";

export default function MyHireBidding() {
  const [activeTab, setActiveTab] = useState("Bidding Task");
  const navigate = useNavigate();

  const work = [
    {
      id: 1,
      name: "Make a chair",
      image: Work,
      date: "21/02/25",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      price: "₹1,500",
      location: "Indore M.P.",
      status: null,
      showStatus: false, // Status dikhega
    },
    {
      id: 2,
      name: "Make a table",
      image: Work,
      date: "22/02/25",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      price: "₹2,000",
      location: "Indore M.P.",
      status: "Cancelled", // Status nahi dikhayenge
      showStatus: true,
    },
    {
      id: 3,
      name: "Paint wall",
      image: Work,
      date: "23/02/25",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      price: "₹1,200",
      location: "Indore M.P.",
      status: "Accepted",
      showStatus: true, // Status dikhega
    },
    {
      id: 4,
      name: "Make a shelf",
      image: Work,
      date: "24/02/25",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      price: "₹1,800",
      location: "Indore M.P.",
      status: "Completed",
      showStatus: true, // Status nahi dikhega
    },
    {
      id: 5,
      name: "Make a shelf",
      image: Work,
      date: "24/02/25",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      price: "₹1,800",
      location: "Indore M.P.",
      status: null,
      showStatus: false, // Status nahi dikhega
    },
    {
      id: 6,
      name: "Make a shelf",
      image: Work,
      date: "24/02/25",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      price: "₹1,800",
      location: "Indore M.P.",
      status: "Cancelled", // Status nahi dikhayenge
      showStatus: true, // Status nahi dikhega
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

      {/* Work Section */}
      <div className="container max-w-full mx-auto my-10">
        <div className="text-xl sm:text-2xl max-w-5xl font-bold mx-auto">
          My Work
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-[90px] lg:gap-[227px] bg-gray-100 p-2 mb-6">
          {["Bidding Task", "Hire", "Emergency Tasks"].map((tab) => (
            <button
              key={tab}
              className={`px-6 sm:px-9 py-1 rounded-full font-semibold ${
                activeTab === tab
                  ? "bg-[#228B22] text-white"
                  : "text-[#228B22] border border-[#228b22]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6 px-4">
          <div className="relative w-full max-w-5xl">
            <img
              src={Search}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            />
            <input
              className="rounded-lg pl-10 pr-4 py-2 w-full bg-[#F5F5F5] focus:outline-none"
              type="search"
              placeholder="Search for services"
            />
          </div>
        </div>

        {/* Work Cards */}
        <div className="space-y-6 max-w-5xl justify-center mx-auto px-4">
          {activeTab === "Bidding Task" &&
            work.map((work) => (
              <div
                key={work.id}
                className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Left Image */}
                <div className="relative w-full sm:w-1/3 h-64 sm:h-auto">
                  <img
                    src={work.image}
                    alt={work.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-17 py-3 rounded-full">
                    #ewe2323
                  </span>
                </div>

                {/* Right Content */}
                <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {work.name}
                    </h2>
                    <p className="text-[17px] text-[#008000] mt-2 font-[500]">
                      {work.price}
                    </p>
                    <p className="text-sm text-[#334247] mt-2 font-[400]">
                      Date: {work.date}
                    </p>
                    <p className="text-sm text-[#334247] mt-1 font-[400]">
                      {work.description}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-2">
                    {/* Location */}
                    <span className="bg-[#F27773] text-white py-1 px-7 rounded-full text-center sm:text-left">
                      {work.location}
                    </span>

                    {/* Status & Button */}
                    <div className="flex flex-col items-end gap-2">
                      {/* Status badge optional */}
                      {work.showStatus && work.status && (
                        <span
                          className={`py-1 px-7 rounded-full text-white font-semibold ${
                            work.status === "Cancelled"
                              ? "bg-[#DB5757]"
                              : work.status === "Completed"
                              ? "bg-[#56DB56]"
                              : "bg-[#56DB56]"
                          }`}
                        >
                          {work.status}
                        </span>
                      )}

                      {/* View Profile always */}
                      <button className="text-white py-1 px-7 border border-[#228B22] rounded-lg bg-[#228B22]">
                        View Profile
                      </button>
                    </div>
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

        {/* Banner Image */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
