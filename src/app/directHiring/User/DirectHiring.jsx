import React from "react";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react"
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import image from "../../../assets/workcategory/image.png";
import banner from "../../../assets/banner.png";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import Arrow from "../../../assets/profile/arrow_back.svg";

const workers = [
  {
    id: 1,
    name: "Dipak Sharma",
    location: "Indore MP",
    status: "Add Feature",
    image: image,
    amount: "200",
    rating: 4.5,
    skills:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,"
  },
  {
    id: 2,
    name: "Dipak Sharma",
    location: "Indore MP",
    status: "Add Feature",
    image: image,
    amount: "200",
    rating: 4.5,
    skills:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,"
  },
  {
    id: 3,
    name: "Dipak Sharma",
    location: "Indore MP",
    status: "Add Feature",
    image: image,
    amount: "200",
    rating: 4.5,
     skills:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,"
  },
  {
    id: 4,
    name: "Dipak Sharma",
    location: "Indore MP",
    status: "Add Feature",
    image: image,
    amount: "200",
    rating: 4.5,
    skills:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,"
  },
];

export default function ServiceProviderList() {
  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
                <Link
                  to="/"
                  className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
                >
                  <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
                  Back
                </Link>
              </div>

        {/* Banner */}
        <div className="w-full mx-auto rounded-[30px] overflow-hidden relative bg-[#f2e7ca] h-40 sm:h-60 md:h-80 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full object-cover"
          />
        </div>

        {/* Main container */}
        <div className="container max-w-5xl mx-auto my-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3">
            <div className="text-xl sm:text-2xl font-bold">Direct Hiring</div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
  {/* Search box */}
  <div className="flex items-center bg-[#efefef] rounded-xl px-3 py-3 w-full sm:w-64">
    <Search className="h-5 w-5 text-gray-500" />
    <input
      type="text"
      placeholder="Search for services"
      className="bg-transparent outline-none px-2 w-full text-sm text-gray-700"
    />
  </div>

  {/* Filter button */}
  <button className="p-1 rounded-xl border border-[#334247 ] hover:bg-gray-100">
    <Filter className="h-5 w-5 text-gray-600" />
  </button>
</div>
          </div>

          {/* Worker cards */}
          <div className="w-full rounded-xl p-3 sm:p-4 space-y-6">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="grid grid-cols-1 sm:grid-cols-12 bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Left image */}
                <div className="relative col-span-4">
                  <img
                    src={worker.image}
                    alt={worker.name}
                    className="h-60 sm:h-full w-full object-cover rounded-[20px]"
                  />
                  <span className="absolute bottom-2 left-0 w-full bg-black/70 text-white font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 text-center">
                    {worker?.status}
                  </span>
                </div>

                {/* Right content */}
                <div className="col-span-8 p-4 flex flex-col gap-2">
                  {/* Name + Rating */}
                  <div className="flex flex-col sm:flex-row justify-between gap-2">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                      {worker.name}
                    </h2>
                    <div className="flex items-center gap-1">
                    <img className="h-[26px] w-[26px]" src={ratingImg} alt="rating" />
                      <span className="lg:text-[20px] text-sm sm:text-base font-[700]">
                        {worker?.rating}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <p className="text-[#334247] text-sm sm:text-base font-[500]">
                    &#8377;{worker.amount}.00
                  </p>

                  {/* Skills */}
                  <div>
                    <div className="font-semibold text-base sm:text-lg text-gray-800 mb-1">
                      About My Skill
                    </div>
                    <p className="text-sm sm:text-base leading-snug text-gray-600 line-clamp-3 sm:line-clamp-none">
                      {worker?.skills}
                    </p>
                  </div>

                  {/* Location + Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
                    <div className="text-white bg-[#F27773] text-xs sm:text-sm px-9 py-1 rounded-full">
                      {worker?.location}
                    </div>
                    <div className="flex gap-3">
  {/* View Profile */}
  <button
    className="relative overflow-hidden border border-[#228B22] text-[#228B22] py-1 px-5 rounded-lg text-sm font-semibold 
    transition-all duration-300 ease-out group"
  >
    <span className="relative z-10 group-hover:text-white">View Profile</span>
    <span className="absolute inset-0 bg-[#228B22] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
  </button>

  {/* Hire */}
  <button
    className="relative overflow-hidden bg-[#228B22] text-white py-1 px-8 sm:px-12 rounded-lg text-sm font-semibold
    transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg"
  >
    Hire
  </button>
</div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See All button */}
          <div className="flex justify-center my-8">
            <button className="py-2 px-6 text-white rounded-full w-65 sm:w-65 text-center bg-[#228B22]">
              See All
            </button>
          </div>
        </div>

        {/* Bottom banner */}
        <div className="w-full mx-auto rounded-[30px] overflow-hidden relative bg-[#f2e7ca] h-40 sm:h-60 md:h-80 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-342 object-cover"
          />
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
}
// fdfd