import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import edit from '../../../assets/bidding/edit.png'
import cancel from '../../../assets/bidding/cancel.png'
import Nowork from '../../../assets/bidding/no_related_work.png'


export default function BidderWorkDetail() {
  const [tab, setTab] = useState("bidder");

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[64rem] space-y-6">
        {/* Work Detail Card */}
        <div className="bg-white rounded-2xl shadow p-4 rounded-[42px] shadow-[0px_4px_4px_0px_#00000040]">
          <h2 className="text-center font-semibold text-gray-700 mb-4">
            Work Detail
          </h2>

          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
            alt="Work"
            className="w-full h-116 object-cover rounded-xl"
          />

          {/* Details */}
      {/* Title + Task Info Row */}
<div className="flex justify-between items-start mt-4">
  {/* Left Side */}
  <div>
    <h3 className="text-[19px] font-[700] text-[#303030]">Chair Work</h3>
    <div className="text-[19px] font-[700] text-[#303030]">Chairman: Uncha Chand</div>
    <span className="px-10 py-2 bg-[#F27773] text-white font-[700] text-xs rounded-full w-fit inline-block mt-1">
      Indore M.P.
    </span>
    <div className="text-[17px] font-[600] text-[#008000] mt-3">₹1,500</div>
    <div className="text-[17px] font-[600] text-[#303030] mt-2">Task Details</div>
  </div>

  {/* Right Side */}
  <div className="flex flex-col items-end gap-1 text-xs text-gray-500">
    <span className="bg-[#261C1B] text-white rounded-full px-7 py-2">
     #asa11212
    </span>
    <span className="mt-5 text-[#261C1B] text-[17px] font-[700]">Posted Date: 12/2/25</span>
    <span className="mt-2 text-[#261C1B] text-[17px] font-[700]">Completion Date: 12/2/26</span>
  </div>
</div>



          {/* Description */}
         <div className="border border-green-300  bg-[#c2ced247] rounded-lg p-4 mt-4 space-y-3">
  <p className="text-gray-600 text-sm leading-relaxed">
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
    It has survived not only five centuries, but also the leap into electronic typesetting,
  </p>
  <p className="text-gray-600 text-sm leading-relaxed">
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
    It has survived not only five centuries, but also the leap into electronic typesetting,
  </p>
  <p className="text-gray-600 text-sm leading-relaxed">
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
    It has survived not only five centuries, but also the leap into electronic typesetting,
  </p>
</div>


          {/* Action Buttons */}
        <div className="flex gap-4 mt-6 justify-center">
  {/* Edit Button */}
  <button className="flex items-center gap-2 border border-green-600 text-green-600 py-2 px-4 lg:px-16 rounded-lg font-medium hover:bg-green-50">
    <img src={edit} alt="edit" className="w-5 h-5" />
    Edit
  </button>

  {/* Cancel Button */}
  <button className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 lg:px-16 rounded-lg font-medium hover:bg-red-700">
    <img src={cancel} alt="cancel" className="w-5 h-5" />
    Cancel Task
  </button>
</div>


        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow p-4 rounded-[42px] shadow-[0px_4px_4px_0px_#00000040]">
          {/* Tabs */}
          <div className="flex justify-center lg:gap-26 gap-2 mb-4 bg-[#D9D9D9] p-[8px]">
            <button
              onClick={() => setTab("bidder")}
              className={`px-4 py-2 lg:px-22 lg:py-3 rounded-full font-medium text-sm ${
                tab === "bidder"
                  ? "bg-[#228B22] text-white border-3"
                  : "bg-gray-100 text-[#228B22]"
              }`}
            >
              Bidder
            </button>
            <button
              onClick={() => setTab("related")}
              className={`px-4 py-2 lg:px-22 lg:py-3 rounded-full font-medium text-sm ${
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
      {/* Search Icon */}
      <Search className="w-5 h-5 text-gray-400" />

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search for services"
        className="flex-1 bg-transparent px-3 outline-none text-sm text-gray-700"
      />

      {/* Filter Icon */}
      <SlidersHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
    </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center text-gray-500 py-10">
            <img
              src={Nowork}
              alt="No worker"
              className="w-100 mb-4"
            />
          
          </div>
        </div>
      </div>
    </div>
    
          <Footer />
        </>
  );
}
