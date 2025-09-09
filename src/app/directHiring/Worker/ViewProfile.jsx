import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Call from "../../../assets/ViewProfile/call.svg";
import msg from "../../../assets/ViewProfile/msg.svg";
import Warning from "../../../assets/ViewProfile/warning.svg";
import Profile from "../../../assets/ViewProfile/Worker.png";

export default function ViewProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback data with validation
  const work = location.state?.work || {
    id: 1,
    name: "Chair work",
    image: null,
    date: "21/02/25",
    skills: "No details available.",
    location: "Indore M.P.",
  };

  const profile = location.state?.profile || {
    name: "Mohan Sharma",
    fees: "200/-",
    image: Profile,
  };

  const assignedWorker = location.state?.assignedWorker || null;

  const [isAccepted, setIsAccepted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  const handleCancelClick = () => {
    setIsCancelled(true);
    setShowModal(true);
  };

  const handleConfirmCancel = () => {
    setShowModal(false);
    // navigate("/dispute");
  };

  return (
    <>
      <Header />
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/mywork"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back to work list" />
          Back
        </Link>
      </div>

      {/* Work Detail Section */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Work Detail</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <img
            src={work.image || "https://via.placeholder.com/800x400"}
            alt={`Image of ${work.name}`}
            className="w-full h-[360px] mx-auto object-cover mt-5"
          />
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div className="space-y-2 text-[#303030] text-lg font-semibold">
                <span>{work.name}</span>
                <div>
                  Chhawani Usha Ganj
                  <div className="bg-[#F27773] max-w-[120px] text-white px-5 py-1 rounded-full text-sm mt-2">
                    {work.location}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2 tracking-tight min-w-[150px]">
                <span className="bg-[#303030] text-white px-4 py-1 rounded-full text-sm block text-center">
                  #{work.id}asa11212
                </span>
                <span className="text-gray-600 font-semibold block">
                  Posted Date: {work.date}
                </span>
                <span className="text-gray-600 font-semibold block">
                  Completion Date: 21/2/26
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold mb-2">Work Title</h1>
              <div className="border border-[#228B22] rounded-lg p-4 mb-4 bg-[#F5F5F5]">
                <p className="text-gray-700 tracking-tight">
                  {work.skills ||
                    "Detailed skills information will be provided soon."}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="mt-6 border border-[#228B22] bg-[#F5F5F5] shadow-md rounded-lg p-4 mx-auto flex flex-col md:flex-row justify-between items-center max-w-[95%]">
            {isCancelled ? (
              <div className="flex flex-col md:flex-row justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.image || Profile}
                    alt={`Profile picture of ${profile.name}`}
                    className="w-[100px] h-[100px] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-xl text-[#191A1D]">
                      {profile.name}
                    </h3>
                    <p className="text-gray-600 text-base font-semibold">
                      Project Fees: {profile.fees}
                    </p>
                  </div>
                </div>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-semibold w-full md:w-auto mt-4 md:mt-0">
                  Cancelled by me
                </button>
              </div>
            ) : isAccepted ? (
              <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
                {/* Left - Profile Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.image || Profile}
                    alt={`Profile picture of ${profile.name}`}
                    className="w-[100px] h-[100px] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-xl text-[#191A1D]">
                      {profile.name}
                    </h3>
                    <p className="text-gray-600 text-base font-semibold">
                      Project Fees: {profile.fees}
                    </p>
                    <button className="mt-2 bg-[#228B22] text-white px-6 py-2 rounded-lg text-sm font-semibold w-full md:w-auto">
                      View Profile
                    </button>
                  </div>
                </div>

                {/* Middle - Contact Section */}
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-lg mb-2">
                    Contact with him
                  </h4>
                  <div className="flex space-x-3">
                    <button
                      className="bg-gray-200 p-3 rounded-full hover:bg-green-100 flex items-center justify-center"
                      aria-label="Call"
                    >
                      <img src={Call} alt="Call" className="w-6 h-6" />
                    </button>

                    <button
                      className="bg-gray-200 p-3 rounded-full hover:bg-green-100 flex items-center justify-center"
                      aria-label="Message"
                    >
                      <img src={msg} alt="Message" className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="flex flex-col items-center gap-3">
                  <button className="bg-[#228B22] text-white px-6 py-2 rounded-lg text-sm font-semibold w-full md:w-auto">
                    Accepted by me
                  </button>
                  <Link to="/emergency/worker/assign-work">
                    <button className="border border-[#228B22] text-[#228B22] px-6 py-2 rounded-lg hover:bg-green-50 text-sm font-semibold w-full md:w-auto">
                      Assign Work
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.image || Profile}
                    alt={`Profile picture of ${profile.name}`}
                    className="w-[100px] h-[100px] rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-xl text-[#191A1D]">
                      {profile.name}
                    </h3>
                    <p className="text-gray-600 text-base font-semibold">
                      Project Fees: {profile.fees}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-4 md:mt-0 md:ml-auto w-full md:w-[160px]">
                  <button
                    onClick={() => setIsAccepted(true)}
                    className="bg-[#228B22] text-white px-6 py-2 rounded-lg hover:bg-green-600 text-sm font-semibold w-full"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 text-sm font-semibold w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Assigned Person Section (Displayed when a worker is assigned) */}
          {assignedWorker && (
            <div className="mt-6 border border-green-500 rounded-lg p-4 bg-gray-100 shadow-md flex items-center justify-between max-w-4xl mx-auto">
              <span className="text-gray-700 font-semibold">
                Assigned Person
              </span>
              <div className="flex items-center space-x-4">
                <img
                  src={
                    assignedWorker.image ||
                    Profile ||
                    "https://via.placeholder.com/150"
                  }
                  alt={`Profile picture of ${assignedWorker.name || "Unknown"}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span className="text-lg font-semibold text-gray-900">
                  {assignedWorker.name || "No Name Available"}
                </span>
                <button className="bg-[#228B22] text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  View Profile
                </button>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          {isAccepted && (
            <div className="mt-6 border border-[#228B22] rounded-lg p-4 mx-auto max-w-[95%] bg-[#F5F5F5] shadow-md">
              <h2 className="font-bold text-lg mb-3">Payment Summary</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-gray-600">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Payment Type</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">1.</td>
                      <td className="px-4 py-2">Starting Payment</td>
                      <td className="px-4 py-2 text-[#228B22] font-semibold">
                        Paid
                      </td>
                      <td className="px-4 py-2">₹20,000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">2.</td>
                      <td className="px-4 py-2">Starting Payment</td>
                      <td className="px-4 py-2">-</td>
                      <td className="px-4 py-2">₹20,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                {/* Yellow warning box */}
                <div className="relative max-w-2xl mx-auto">
                  {/* Image */}
                  <div className="relative z-10">
                    <img
                      src={Warning}
                      alt="Warning"
                      className="w-40 h-40 mx-auto bg-white border border-[#228B22] rounded-lg px-2"
                    />
                  </div>

                  {/* Yellow background + paragraph */}
                  <div className="bg-[#FBFBBA] border border-yellow-300 rounded-lg shadow-md p-4 -mt-20 pt-24 text-center">
                    <h2 className="text-[#FE2B2B] font-bold -mt-2">
                      Warning Message
                    </h2>
                    <p className="text-gray-700 text-sm md:text-base">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting.
                    </p>
                  </div>
                </div>

                {/* Cancel button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
                >
                  Cancel Task and create dispute
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              Do you really want to cancel this task and create a dispute? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsCancelled(false); // Revert cancellation if user goes back
                }}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
              >
                No, Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}