import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import image from "../../../assets/workcategory/image.png";
import banner from "../../../assets/profile/banner.png";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import hisWorkImg from "../../../assets/directHiring/his-work.png";
import filterIcon from "../../../assets/directHiring/filter-square.png";

import { Search, SearchIcon } from "lucide-react";
import biiderImg from "../../../assets/directHiring/bidder.png";
import { useState } from "react";
import BidModel from "./BidModel";

export default function Bid() {
  const [isBidModel, setIsBidModel] = useState(true);

  const closeBidModel = () => {
    setIsBidModel(false);
  };

  const workers = [
    {
      id: 1,
      name: "Dipak Sharma",
      location: "Indore MP",
      status: "Add Feature",
      image: image,
      skills: "Lorem, ipsum dolor sit ...",
    },
    {
      id: 2,
      name: "Dipak Sharma",
      location: "Indore MP",
      status: "Add Feature",
      image: image,
      skills: "Lorem, ipsum dolor sit ... ",
    },
    {
      id: 3,
      name: "Dipak Sharma",
      location: "Indore MP",
      status: "Add Feature",
      image: image,
      skills: "Lorem, ipsum dolor sit ... ",
    },
    {
      id: 4,
      name: "Dipak Sharma",
      location: "Indore MP",
      status: "Add Feature",
      image: image,
      skills: "Lorem, ipsum dolor sit ...",
    },
  ];
  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="w-full container max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-[#228B22] text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="container max-w-5xl  mx-auto my-10 p-8  shadow-lg rounded-3xl">
          <div className="text-2xl text-center font-bold mb-4">Work Detail</div>

          <div>
            <img src={hisWorkImg} className="h-80 w-full" />
          </div>
          <div className=" py-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Chair Work</h2>
                <p className="text-lg font-semibold">Chhawani Usha Ganj</p>
                <span className="inline-block bg-red-500 text-white text-lg font-semibold px-3  rounded-full mt-2">
                  Indore M.P.
                </span>
                <p className="font-semibold text-lg my-2 text-[#008000]">
                  ₹1500/-
                </p>
              </div>
              <div className="text-right">
                <p className="bg-black text-white text-md px-4 rounded-full inline-block">
                  #asa1212
                </p>
                <p className="text-md mt-2">
                  <span className="font-semibold">Posted Date: 12/2/25</span>
                </p>
                <p className="text-md">
                  <span className="font-semibold">
                    Completion Date: 12/2/26
                  </span>
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold">Task Details</h3>

            <div className="border border-[#228B22] rounded-lg p-4 text-sm text-gray-700 space-y-3">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s...
              </p>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s...
              </p>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s...
              </p>
            </div>
            <div className="text-xl text-white bg-[#008000] text-center py-1 border rounded-lg w-1/4 mx-auto ">
              Bid
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-white  rounded-4xl shadow-lg py-10">
          <div className="flex justify-center py-3 gap-8 bg-[#D9D9D9] mb-4">
            <button
              className={`px-6 py-2 rounded-full border
               text-[#228B22]
          `}
            >
              Bidders
            </button>
            <button
              className={`px-6 py-2 rounded-full border
               bg-[#228B22] text-white "
          `}
            >
              Related Worker
            </button>
          </div>

          <div className="flex gap-4 p-8">
            <div className="relative w-full mb-6">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search for services"
                className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <img className="h-10" src={filterIcon} />{" "}
            </div>
          </div>

          {/* when data is getting then image will be hidden */}
          {/* <div className="flex flex-col mt-20 items-center justify-center py-10 px-8 text-center text-gray-500">
            <img
              src={biiderImg}
              alt="No Bidders"
              className="w-60 h-auto object-contain"
            />
          </div> */}

          {/* search data when data get */}
          <div className="rounded-xl my-4 space-y-4   px-8">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="grid grid-cols-12 items-center bg-white rounded-lg shadow-2xl p-4 gap-8"
              >
                <div className="relative col-span-12  md:col-span-4">
                  <img
                    src={worker.image}
                    alt={worker.work}
                    className="h-full w-full  rounded-lg object-cover"
                  />
                  {/* <span className="absolute bottom-0 rounded-full left-0 w-full bg-black/80 text-white font-medium text-sm px-4 py-2  text-center">
                    {worker?.status}
                  </span> */}
                </div>

                <div className="md:col-span-8 p-4 col-span-12 space-y-2">
                  <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                    {worker.name}
                  </h2>

                  <div className="leading-tight text-lg">{worker?.skills}</div>
                  <div className="flex">
                    <div className="text-white bg-red-500 text-sm py-1 px-8 rounded-full">
                      {worker?.location}
                    </div>
                  </div>
                  <div>
                    <button className="text-[#228B22] py-1 px-4 border rounded-lg">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* search data close */}
        </div>

        <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>
      <Footer />
      {isBidModel && <BidModel isOpen={isBidModel} onClose={closeBidModel} />}
    </>
  );
}
