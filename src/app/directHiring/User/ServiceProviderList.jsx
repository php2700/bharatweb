import React from "react";
import { Link } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import image from "../../../assets/workcategory/image.png";
import banner from "../../../assets/banner.png"
import ratingImg from "../../../assets/rating/ic_round-star.png";


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
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime",
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
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
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
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
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
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
  },
];

export default function ServiceProviderList  ()  {
  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-green-600 text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
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
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="grid grid-cols-12 items-center bg-white rounded-lg shadow-lg p-4 gap-8"
              >
                <div className="relative col-span-4">
                  <img
                    src={worker.image}
                    alt={worker.name}
                    className="h-full w-full  rounded-lg object-cover"
                  />
                  <span className="absolute bottom-2 left-0 w-full bg-black/80 text-white font-medium text-sm px-4 py-2  text-center">
                    {worker?.status}
                  </span>
                </div>

                <div className="col-span-8 p-4">
                  <div className="flex justify-between ">
                    <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                      {worker.name}
                    </h2>
                    <div className="flex gap-1  items-center">
                      <div>
                        <img className="h-6  w-6" src={ratingImg} />
                      </div>
                      <div> {worker?.rating}</div>
                    </div>
                  </div>
                  <p className="text-sm lg:text-[17px] text-gray-500">
                    &#8377;{worker.amount}
                  </p>
                  <div className="font-semibold text-lg text-gray-800 ">
                    About My Skill
                  </div>
                  <div className="leading-tight">{worker?.skills}</div>
                  <div className="flex justify-between items-center my-4">
                    <div className="text-white bg-red-500 text-sm px-8 rounded-full">
                      {worker?.location}
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
        <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>
      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
};
