import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import image from "../../../assets/workcategory/image.png";
import banner from "../../../assets/banner.png";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import hisWorkImg from "../../../assets/directHiring/his-work.png";
import filterIcon from "../../../assets/directHiring/filter-square.png";
import images from "../../../assets/workcategory/image.png";
import warningImg from "../../../assets/directHiring/warning.png";
import callIcon from "../../../assets/directHiring/call.png";
import messageIcon from "../../../assets/directHiring/message.png";

import { SearchIcon } from "lucide-react";
// import FilterWorker from "./FilterWorker";
import Accepted from "../../directHiring/User/Accepted";
// import Accepted from "./Accepted";

export default function BiddingWorkerDetail() {
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
  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-[#228B22] text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="container max-w-5xl  mx-auto my-10 p-8 bg-white shadow-lg rounded-3xl">
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

            <h3 className="text-lg font-semibold">Work Title</h3>

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

            {/* default ui we show */}

          

<<<<<<< HEAD
          {/* Tabs Section */}
          <div className="bg-white rounded-2xl p-4 shadow-[0px_4px_4px_0px_#00000040]">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-6 lg:gap-10 mb-4 bg-[#D9D9D9] p-[8px] rounded-full">
              <button
                onClick={() => setTab("bidder")}
                className={`px-4 py-2 lg:px-17 lg:py-3 rounded-full font-medium text-sm ${
                  tab === "bidder"
                    ? "bg-[#228B22] text-white border-3"
                    : "bg-gray-100 text-[#228B22]"
                }`}
              >
                Bidder
              </button>
              <button
                onClick={() => setTab("related")}
                className={`px-4 py-2 lg:px-17 lg:py-3 rounded-full font-medium text-sm ${
                  tab === "related"
                    ? "bg-[#228B22] text-white border-3"
                    : "bg-gray-100 text-[#228B22]"
                }`}
              >
                Related Worker
              </button>
            </div>

            {/* Search Box */}
            <div className="w-full flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services"
                className="flex-1 bg-transparent px-3 outline-none text-sm text-gray-700"
              />
              <SlidersHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>

            {/* Conditional Rendering */}
            {tab === "bidder" ? (
              // 🚨 Bidder me empty state dikhega
              <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                <img
                  src={Nowork}
                  alt="No worker"
                  className="w-48 sm:w-72 md:w-96 mb-4"
                />
              </div>
            ) : (
              // 🚨 Related Worker me Worker Cards dikhenge
              <div className="mt-6 space-y-4">
                {[1, 2, 3, 4].map((id) => (
                  <div
                    key={id}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-[#F9F9F9] rounded-xl p-4 shadow"
                  >
                    {/* Worker Image */}
                    <img
                      src={images}
                      alt="Worker"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                    />

                    {/* Worker Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-[17px] font-bold text-[#303030]">
                        Dipak Sharma
                      </h3>
                      <p className="text-sm text-gray-500">Lorems learn….</p>
                      <span className="px-4 py-1 bg-[#F27773] text-white font-[600] text-xs rounded-full inline-block mt-1">
                        Indore M.P.
                      </span>
                      <div>
                        <button className="text-green-600 font-medium text-sm mt-1">
                          View Profile
                        </button>
=======
            {/* payment page */}
            <div className="space-y-6">
                    <div className="flex items-center justify-between border bg-gray-100  border-[#228B22] rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={image}
                          alt="Mohan Sharma"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">Mohan Sharma</h4>
                          <p className="text-sm text-gray-600">
                            Project Fees - <span className="font-medium">₹200/-</span>
                          </p>
                          <button className="bg-[#228B22] text-white px-6 py-1 rounded-lg text-sm mt-2">
                            View Profile
                          </button>
                        </div>
                      </div>
            
                      <div className="text-center">
                        <p className="font-medium mb-2">Contact with him</p>
                        <div className="flex gap-3 justify-center">
                          <button className="p-2 bg-gray-200 rounded-full">
                            <img src={callIcon} className="h-5 w-5" />
                          </button>
                          <button className="p-2 bg-gray-200 rounded-full">
                            <img src={messageIcon} className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center ">
                        <p className="mt-2 bg-[#228B22] text-white px-3 py-1 text-md rounded-lg py-1 font-medium">
                          Accepted by worker
                        </p>
>>>>>>> fc4abb5404d8883e75f0051f9c71ac3b22f5a496
                      </div>
                    </div>
            
                    <div className="border  border-[#228B22] bg-gray-100 rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">Payment</h3>
                        <button className="bg-[#228B22] text-white px-4 py-1 rounded-lg text-sm">
                          Create Payment
                        </button>
                      </div>
            
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between bg-white py-3 px-6 items-center pb-2">
                          <span className="font-semibold">1.</span>
                          <span className="font-semibold "> Starting Payment</span>
                          <span className="text-[#228B22] text-md">Paid</span>
                          <span className="font-semibold">₹20,000</span>
                        </div>
            
                        <div className="flex justify-between items-center bg-white py-3 px-6 pb-2">
                          <span className="font-semibold">2</span>
                          <span className="font-semibold "> Starting Payment</span>
                          <button className="bg-[#228B22] border rounded-lg px-4 text-white py-1 text-md">
                            Pay
                          </button>
                          <span className="font-semibold">₹20,000</span>
                        </div>
            
                        <div className="  bg-white py-3 px-6">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">3</span>
                            <input
                              type="text"
                              placeholder="Enter Description"
                              className="flex-1 border border-[#228B22] rounded-lg px-3 py-2 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Enter Amount"
                              className="w-40 border  border-[#228B22] rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex gap-3 justify-center mt-3">
                            <button className="bg-[#228B22] text-white px-4 py-2 rounded-lg text-sm">
                              Submit
                            </button>
                            <button className=" text-[#228B22] border px-4 py-2 rounded-lg text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
            
                    <div className="relative max-w-3xl mx-auto my-25">
                      <img
                        src={warningImg}
                        alt="Warning"
                        className="absolute left-1/2 -translate-x-1/2 -top-[35%]  md:-top-[42%] lg:-top-[45%] w-60 h-auto"
                      />
                      <div className="bg-yellow-100 border border-yellow-300 rounded-lg shadow-md p-6 pt-30 text-center">
                        <h4 className="text-red-600 font-semibold text-lg">
                          Warning Message
                        </h4>
                        <p className="text-lg text-gray-700 mt-2 leading-relaxed">
                          Lorem Ipsum is simply dummy text of the printing and typesetting
                          industry. Lorem Ipsum has been the industry's standard dummy text
                          ever since the 1500s...
                        </p>
                      </div>
                    </div>
            
                    <div className="flex justify-center gap-6">
                      <button className="bg-[#228B22] text-white px-6 py-3 rounded-lg font-medium">
                        Mark as complete
                      </button>
                      <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium">
                        Cancel Task and create dispute
                      </button>
                    </div>
                  </div>
          </div>
        </div>

        {/* filter data getting  */}
        {/* <FilterWorker /> */}

        <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
