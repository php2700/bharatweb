import React from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Profile from "../../../assets/ViewProfile/Worker.png";

export default function ViewProfile() {
  const location = useLocation();
  const work = location.state?.work || {
    id: 1,
    name: "Chair work",
    image: null,
    date: "21/02/25",
    skills: "No details available.",
    location: "Indore M.P.",
  };

  return (
    <>
      <Header />
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/my-work"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      {/* Work Detail Section */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 ml-10">Work Detail</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src={work.image}
            alt={work.name}
            className="w-[90%] h-90 mx-auto object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2 text-[#303030] text-lg font-semibold ml-10">
                <span>{work.name}</span>
                <div>
                  Chhawani Usha Ganj
                  <div className="bg-[#F27773] max-w-[120px] text-white px-5 py-1 rounded-full text-sm">
                    {work.location}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2 tracking-tight mr-1 min-w-[170px]">
                <span className="bg-[#303030] text-white px-4 py-1 rounded-full text-sm block text-center mr-5">
                  #{work.id}asa11212
                </span>
                <span className="text-gray-600 font-semibold mr-5">
                  Posted Date: {work.date}
                </span>
              </div>
            </div>
            <div className="ml-10">
            <h1 className="text-lg font-bold mb-2 ">Work Title</h1>
            <div className="border-2 border-[#008000] rounded-lg px-3 py-2 mb-4 ">
              <p className="text-gray-700 tracking-tight max-w-80% ">{work.skills}</p>
            </div>
            </div>
          </div>
        

        {/* Profile Section */}
        <div className="mt-6 border-2 border-[#008000] shadow-md rounded-lg p-3 mx-auto flex items-center justify-between ml-10">
          <div className="flex items-center space-x-4">
            <img
              src={Profile}
              alt="Profile"
              className="w-[141px] h-[141px] rounded-full"
            />
            <div>
              <h3 className="font-semibold text-xl text-[#191A1D]">Mohan Sharma</h3>
              <p className="text-gray-600 text-base font-semibold">Project Fees: 200/-</p>
            </div>
          </div>
          <div className="space-x-2">
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
              Accept
            </button>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
              Cancel
            </button>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
}