import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import edit from "../../../assets/bidding/edit.png";
import cancel from "../../../assets/bidding/cancel.png";
import images from "../../../assets/bidding/images.png";
import Nowork from "../../../assets/bidding/no_related_work.png";
import call from "../../../assets/bidding/call.png";
import msg from "../../../assets/bidding/msg.png";

export default function Biddercheck() {
  const [tab, setTab] = useState("bidder");
  const [isCancelled, setIsCancelled] = useState(false); // ✅ new state

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

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[64rem] space-y-6">
          {/* Work Detail Card */}
          <div className="bg-white p-4 rounded-[42px] shadow-[0px_4px_4px_0px_#00000040]">
            <h2 className="text-center font-semibold text-gray-700 mb-4 text-[18px]">
              Work Detail
            </h2>

            {/* Image */}
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
              alt="Work"
              className="w-full h-60 sm:h-80 md:h-96 object-cover rounded-xl"
            />

            {/* Details */}
            <div className="flex flex-col md:flex-row justify-between items-start mt-4 gap-4">
              {/* Left Side */}
              <div>
                <h3 className="text-[19px] font-[700] text-[#303030]">
                  Chair Work
                </h3>
                <div className="text-[19px] font-[700] text-[#303030]">
                  Chhawani  Usha Ganj
                </div>
                <span className="px-6 py-2 bg-[#F27773] text-white font-[700] text-xs rounded-full w-fit inline-block mt-1">
                  Indore M.P.
                </span>
                <div className="text-[17px] font-[600] text-[#008000] mt-3">
                  ₹1,500
                </div>
                <div className="text-[17px] font-[600] text-[#303030] mt-2">
                  Task Details
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-start md:items-end gap-1 text-xs text-gray-500">
                <span className="bg-[#261C1B] text-white rounded-full px-5 sm:px-7 py-2 text-sm sm:text-base">
                  #asa11212
                </span>
                <span className="mt-5 text-[#261C1B] text-[15px] sm:text-[17px] font-[700]">
                  Posted Date: 12/2/25
                </span>
                <span className="mt-2 text-[#261C1B] text-[15px] sm:text-[17px] font-[700]">
                  Completion Date: 12/2/26
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border border-green-300 bg-[#c2ced247] rounded-lg p-4 mt-4 space-y-3">
              <p className="text-gray-600 text-sm leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
              {/* Show Edit only if not cancelled */}
              {!isCancelled && (
                <button className="flex items-center justify-center gap-2 border border-green-600 text-green-600 py-2 px-6 sm:px-10 lg:px-16 rounded-lg font-medium hover:bg-green-50 w-full sm:w-auto">
                  <img src={edit} alt="edit" className="w-5 h-5" />
                  Edit
                </button>
              )}

              {/* Cancel Button */}
              <button
                onClick={() => setIsCancelled(true)} // ✅ update state
                className={`flex items-center justify-center gap-2 py-2 px-6 sm:px-10 lg:px-16 rounded-lg font-medium w-full sm:w-auto ${
                  isCancelled
                    ? "bg-[#FF0000] text-white"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                disabled={isCancelled} // ✅ prevent re-click
              >
                <img src={cancel} alt="cancel" className="w-5 h-5" />
                {isCancelled ? "Cancelled Task By User" : "Cancel Task"}
              </button>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white  p-4 rounded-[42px] shadow-[0px_4px_4px_0px_#00000040]">
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
                      </div>
                    </div>

                    {/* Status + Invite */}
                    <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-7 w-full sm:w-auto mt-3 sm:mt-0">
                      <span className="w-8 h-8 rounded-full bg-[#e1e1e1] flex items-center justify-center">
                        <img src={call} alt="" className="w-[18px] sm:w-[23px]" />
                      </span>
                      <span className="w-8 h-8 rounded-full bg-[#e1e1e1] flex items-center justify-center">
                        <img src={msg} alt="" className="w-[18px] sm:w-[23px]" />
                      </span>
                      <button className="bg-[#228B22] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                        Invite
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}