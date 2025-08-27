import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Gardening from "../../../assets/profile/profile image.png";
import Work from "../../../assets/directHiring/Work.png";

export default function MyWork() {
    const work = [
      {
        id: 1,
        name: "Chair work ",
        location: "Indore MP",
        status: "Add Feature",
        image: Work,
        amount: "200",
        skills:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime",
      },
      {
        id: 2,
        name: "Chair work ",
        location: "Indore MP",
        status: "Add Feature",
        image: Work,
        amount: "200",
        skills:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
      },
      {
        id: 3,
        name: "Chair work ",
        location: "Indore MP",
        status: "Add Feature",
        image: Work,
        amount: "200",
        skills:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
      },
      {
        id: 4,
        name: "Chair work ",
        location: "Indore MP",
        status: "Add Feature",
        image: Work,
        amount: "200",
        skills:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
      },
    ];
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
      {/* Gardening Image Section */}
      <div className="w-full mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={Gardening}
          alt="Gardening illustration"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
        />
      </div>

      <div className="container max-w-5xl mx-auto my-10">
                <div className="flex justify-between items-center p-3">
                  <div className="text-2xl font-bold">Direct Hiring</div>
                  <div>
                    <input className="border rounded-lg p-2" type="search" placeholder="Search for services" />
                  </div>
                </div>
                <div className="w-full rounded-xl p-3 sm:p-4 space-y-4">
                  {work.map((work) => (
                    <div
                      key={work.id}
                      className="grid grid-cols-12 items-center bg-white rounded-lg shadow-lg p-4 gap-8"
                    >
                      <div className="relative col-span-4">
                        <img
                          src={work.image}
                          alt={work.name}
                          className="h-full w-full  rounded-lg object-cover"
                        />
                        <span className="absolute bottom-2 left-0 w-full bg-black/80 text-white font-medium text-sm px-4 py-2  text-center">
                          {work?.status}
                        </span>
                      </div>
      
                      <div className="col-span-8 p-4">
                        <div className="flex justify-between ">
                          <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                            {work.name}
                          </h2>
                        </div>
                        <p className="text-sm lg:text-[17px] text-gray-500">
                          &#8377;{work.amount}
                        </p>
                        <div className="font-semibold text-lg text-gray-800 ">
                          About My Skill
                        </div>
                        <div className="leading-tight">{work?.skills}</div>
                        <div className="flex justify-between items-center my-4">
                          <div className="text-white bg-red-500 text-sm px-8 rounded-full">
                            {work?.location}
                          </div>
                          <div className="flex gap-4">
                            <button className="text-[#228B22] py-1 px-4 border rounded-lg">
                              View Profile
                            </button>
                            <button className="text-white bg-[#228B22] py-1 px-10 rounded-lg ">
                              Hire
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center my-8">
                  <div className="py-2 px-2 text-white rounded-full w-1/2 text-center bg-[#228B22]">
                    See All
                  </div>
                </div>
              </div>

      <Footer />
    </>
  );
}
