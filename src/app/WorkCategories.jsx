import { Weight } from "lucide-react";
import {useSelector } from "react-redux";
import React from "react";

export default function WorkCategories() {
   const selectedRoles = useSelector((state) => state.role.selectedRoles);
   
  
  console.log(selectedRoles);
  
  return (
    <div className="font-sans text-gray-800">

      {/* Hero Section */}
      <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] bg-gray-200">
        <img
          src="/src/assets/workcategory/banner.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Categories */}
      <div className="mx-auto px-4 py-10 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center lg:text-left lg:ml-[55px]">Work Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 justify-items-center gap-4">
          {[
            { img: "bandwala.png", title: "Bandwala" },
            { img: "plumber.png", title: "Plumber" },
            { img: "carpenter.png", title: "Carpenter" },
            { img: "brush.png", title: "Painter" },
            { img: "electrician.png", title: "Electrician" },
            { img: "bandwala.png", title: "Bandwala" },
            { img: "plumber.png", title: "Plumber" },
            { img: "carpenter.png", title: "Carpenter" },
            { img: "brush.png", title: "Painter" },
            { img: "electrician.png", title: "Electrician" },
            { img: "bandwala.png", title: "Bandwala" },
            { img: "plumber.png", title: "Plumber" },
            { img: "carpenter.png", title: "Carpenter" },
            { img: "brush.png", title: "Painter" },
            { img: "plumber.png", title: "Plumber" },
            { img: "carpenter.png", title: "Carpenter" },
            { img: "brush.png", title: "Painter" },
            { img: "electrician.png", title: "Electrician" },
          ].map((cat, index) => (
            <div key={index} className="flex flex-col items-center p-4 sm:p-6 rounded-lg w-28 sm:w-32">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D3E8D3]">
                <img src={`/src/assets/workcategory/${cat.img}`} alt="" className="w-[27px]" />
              </div>
              <p className="mt-2 text-[13px] sm:text-[15px] text-[#191A1D] font-normal">{cat.title}</p>
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="flex justify-center mt-8">
          <button className="w-[200px] sm:w-[222px] h-[46px] bg-[#228B22] text-white rounded-[15px] hover:scale-105 transition-all duration-300">
            See All
          </button>
        </div>
      </div>

      {/* Direct Hiring Section */}
      <div className="w-full bg-[#EDFFF3] py-10">
        <div className="mx-auto px-4 sm:px-10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="font-bold text-[19px] sm:text-[22px] text-[#303030]">Direct Hiring</h2>
            <button className="font-bold text-[19px] sm:text-[22px] text-[#303030] mt-2 sm:mt-0">See All</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-[42px] shadow p-4 relative">
                <div className="relative">
                  <img
                    src="/src/assets/workcategory/image.png"
                    alt="Profile"
                    className="w-full h-48 sm:h-50 object-cover rounded-2xl"
                  />
                  <button
                    className="absolute bottom-3 right-3 w-[140px] sm:w-[160px] h-[32px] bg-[#372E27] text-white text-[14px] sm:text-[16px] rounded-full 
                               transition-all duration-300 ease-in-out 
                               hover:bg-[#4a3e34] hover:shadow-lg hover:scale-105"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[18px] sm:text-[24px] text-[#191A1D] font-semibold">Dipak Sharma</h3>
                    <div className="flex items-center text-yellow-500 text-[14px] sm:text-[15px] font-semibold">
                      <span className="text-[20px] sm:text-[25px]">★</span>
                      <span className="ml-1 text-[16px] sm:text-[21px] text-black font-bold">4.5</span>
                    </div>
                  </div>

                  <p className="text-[12px] sm:text-sm text-white mt-2 px-3 py-1 bg-[#F27773] rounded-full inline-block w-[140px] sm:w-[160px] text-center float-right">
                    Indore M.P.
                  </p>

                  <p className="text-gray-700 font-semibold mt-2 text-sm sm:text-base">₹200.00</p>
                </div>

                <div className="flex gap-2 mt-4 sm:mt-6">
                  <button className="flex-1 border border-[#228B22] py-2 rounded font-semibold text-[#228B22] hover:bg-[#228B22] hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300">
                    View Profile
                  </button>
                  <button className="flex-1 bg-[#228B22] text-white py-2 rounded font-semibold text-center hover:bg-[#1a6b1a] hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Hire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mx-auto px-4 sm:px-10 py-10 grid md:grid-cols-2 gap-6 items-center lg:pl-0">
        <img src="/src/assets/workcategory/banner1.png" alt="Worker" className="rounded-lg w-full" />
        <div>
          <h2 className="text-[22px] sm:text-[24px] text-[#228B22] font-bold mb-4">Post Work with bidder</h2>
          <p className="text-[16px] sm:text-[18px] font-bold text-[#838383] leading-relaxed">
 Lorem Ipsum is simply dummy text of the printing and <br />typesetting industry.  Lorem Ipsum has been the industry's <br />standard dummy text ever since the 1500s, when an <br /> unknown printer took a galley of type and scrambled it to  <br />make a type specimen book. It has survived not only five <br /> centuries, but also the leap into electronic typesetting, <br /> remaining essentially unchanged. <br /> It was popularised in the 1960s with the release of Letraset sheets <br />containing Lorem Ipsum passages, and more recently with desktop publishing  <br />software like Aldus PageMaker including versions of Lorem Ipsum.          </p>
          <button
            className="mt-8 sm:mt-20 w-[143px] bg-[#228B22] text-white px-6 py-2 rounded-[33px] shadow-[0px_1px_1px_1px_#7e7e7e] border border-[#aba8a8] hover:bg-[#1a6b1a] hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Post Work
          </button>
        </div>
      </div>

      {/* Emergency Section */}
      <div className="bg-white-50 py-10">
        <div className="mx-auto px-4 sm:px-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-[22px] sm:text-[24px] text-[#228B22] font-bold mb-4">Post Work with bidder</h2>
            <p className="text-[16px] sm:text-[18px] font-bold text-[#838383] leading-relaxed">
               Lorem Ipsum is simply dummy text of the printing and <br />typesetting industry.  Lorem Ipsum has been the industry's <br />standard dummy text ever since the 1500s, when an <br /> unknown printer took a galley of type and scrambled it to  <br />make a type specimen book. It has survived not only five <br /> centuries, but also the leap into electronic typesetting, <br /> remaining essentially unchanged. <br /> It was popularised in the 1960s with the release of Letraset sheets <br />containing Lorem Ipsum passages, and more recently with desktop publishing  <br />software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
            <button
              className="mt-8 sm:mt-20 w-[143px] bg-[#228B22] text-white px-6 py-2 rounded-[33px] shadow-[0px_1px_1px_1px_#7e7e7e] border border-[#aba8a8] hover:bg-[#1a6b1a] hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Post Work
            </button>
          </div>
          <img src="/src/assets/workcategory/banner1.png" alt="Emergency" className="rounded-lg w-full" />
        </div>
      </div>

      {/* Blog Section */}
      <div className="font-sans">
        <div className="bg-gray-200 text-[#228B22] h-[48px] pt-[11px] pl-[16px] sm:pl-[112px] text-[19px] sm:text-[20px] font-semibold">
          My Hire
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 sm:p-6">
          {[1,2,3].map((card) => (
            <div key={card} className="bg-white rounded-lg shadow-md overflow-hidden w-full relative h-[322px] sm:h-[383px]">
              <img
                src={`/src/assets/workcategory/hire${card}.png`}
                alt="Direct Hiring"
                className="w-full h-[322px] sm:h-[383px] object-cover"
              />
              <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
                <button className="w-[200px] sm:w-[227px] h-[53px] bg-[#228B22] border-2 border-white text-[14px] sm:text-[15px] text-white font-semibold rounded-full hover:bg-[#1a6f1a] hover:scale-105 transition-all duration-300">
                  {card === 1 ? "Direct Hiring" : card === 2 ? "Bidding" : "Emergency"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
