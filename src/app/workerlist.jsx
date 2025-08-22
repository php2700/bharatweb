// src/pages/WorkerList.jsx
import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { Link } from "react-router-dom";

const workers = [
  {
    id: 1,
    name: "Dipak Sharma",
    location: "Indore MP",
    status: "Verified by Admin",
    image: "/src/assets/workcategory/image.png",
  },
  {
    id: 2,
    name: "Dipak Sharma",
    location: "Indore MP",
    status: "Verified by Admin",
    image: "/src/assets/workcategory/image.png",
  },
  {
    id: 3,
    name: "Dipak Sharma",
    location: "Indore MP",
    status: "Verified by Admin",
    image: "/src/assets/workcategory/image.png",
  },
  {
    id: 4,
    name: "Dipak Sharma",
    location: "Indore MP",
    status: "Verified by Admin",
    image: "/src/assets/workcategory/image.png",
  },
];

export default function WorkerList() {
    console.log('change');
   
  return (
     <>
              <Header />
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gray-50">
      {/* Back Button */}
      <div className="w-full max-w-4xl flex justify-start mb-4">
        <button className="text-green-600 text-sm hover:underline">
          &lt; Back
        </button>
      </div>

      {/* Title + Add Worker */}
      

      {/* Worker Cards */}
      <div className="w-full max-w-[81rem] shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-3 sm:p-4 space-y-4">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 xl:ml-[300px]">
 <h1 className="w-full text-center text-lg sm:text-xl lg:text-[25px] font-[700] text-gray-800">
  Worker List
</h1>

  <button className="bg-[#228B22] text-white px-4 sm:px-6 py-2 rounded-full shadow hover:bg-[#121212] w-[200px] -md:mr-[211px] lg:w-[293px] lg:h-[57px] text-[17px] font-[500]">
    <Link to={'/addworker'}>Add Worker</Link>
  </button>
</div>

        {workers.map((worker) => (
          <div
            key={worker.id}
            className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-md p-4 gap-4"
          >
            {/* Left Section */}
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              {/* Image with Badge */}
              <div className="relative">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="w-36 h-36 sm:w-60 sm:h-45 rounded-lg object-cover"
                />
                <span className="absolute bottom-9 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#6DEA6D] text-[#FFFFFF] font-[500] text-xs px-3 py-1 rounded-full shadow  w-[125px] sm:w-[131px] sm:h-[25px] lg:w-[184px] lg:p-[0px] lg:text-center lg:text-[15px]" >
                  {worker.status}
                </span>
              </div>

              <div className="lg:mb-[123px]">
                <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] font-semibold text-gray-800">
                  {worker.name}
                </h2>
                <p className="text-sm lg:text-[17px] text-gray-500">{worker.location}</p>
              </div>
            </div>

            {/* Right Section (Buttons) */}
            <div className="flex flex-row sm:flex-col md:flex-col lg:flex-col xl:flex-col gap-2">
              <button type="button" className="bg-[#228B22] text-white px-5 py-2 rounded shadow hover:bg-[#121212]">
                <Link to={`/editworker`}>Edit</Link>
              </button>
              <button className="bg-[#228B22] text-white px-5 py-2 rounded shadow hover:bg-[#121212]">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
      <div className="mt-[50px]">
                <Footer />
              </div>
        </>
  );
}
