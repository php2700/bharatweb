// Accepted.jsx
import { useEffect } from "react";
import Profile from "../../../assets/ViewProfile/Worker.png";
import Call from "../../../assets/ViewProfile/call.svg";
import Message from "../../../assets/ViewProfile/msg.svg";
import { Link, useNavigate } from "react-router-dom";

export default function Accepted({
  serviceProvider,
  assignedWorker,
  paymentHistory,
  orderId,
  user,
}) {
  if (!serviceProvider && !assignedWorker) {
    return null; // Don't render if no data is available
  }
  const service_provider_id = user;
  const order_id = orderId;
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleChatOpen = (receiverId) => {
    navigate(`/chats/${receiverId}`); // go to chat page
  };
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-lg font-semibold mb-4">User Details</h2>

      {/* Service Provider Details */}
      {serviceProvider && (
        <div className="bg-gray-100 border border-[#228B22] p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            {/* --- Left: Profile Info --- */}
            <div className="flex items-center space-x-4">
              <img
                src={serviceProvider.profile_pic || Profile}
                alt={`Profile of ${serviceProvider.full_name || "Worker"}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <p className="text-lg font-semibold">
                {serviceProvider.full_name || "Unknown Worker"}
              </p>
            </div>

            {/* --- Center: Call & Message Icons --- */}
            <div className="flex items-center space-x-3 justify-center">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer">
                <img src={Call} alt="Call" className="w-5 h-5" />
              </div>
              <div
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer"
                onClick={() => handleChatOpen(serviceProvider._id)}
              >
                <img src={Message} alt="Message" className="w-5 h-5" />
              </div>
            </div>

            {/* --- Right: Buttons --- */}
            <div className="flex flex-col gap-3">
              <button className="px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-600 hover:text-white"
							onClick={() => navigate(`/profile-user-details/${serviceProvider._id}`)}
							>
                View Profile
              </button>
              {assignedWorker ? (
                <button className="px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-600 hover:text-white">
                  Assigned
                </button>
              ) : (
                <Link
                  to={`/assign-work/${orderId}/direct`}
                  className="px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-600 hover:text-white text-center"
                >
                  Assign work
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assigned Worker Details */}
      {assignedWorker && (
        <div className="mb-4">
          {/* Heading outside the gray box */}
          <h3 className="text-base font-semibold mb-2">Assigned Person</h3>

          {/* Gray container only for worker details */}
          <div className="border border-[#228B22] bg-[#F5F5F5] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              {/* Worker Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={assignedWorker.image || Profile}
                  alt={`Profile of ${assignedWorker.name || "Worker"}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">
                    {assignedWorker.name || "Unknown Worker"}
                  </p>
                </div>
              </div>

              {/* View Profile Button aligned right */}
              <Link
                to={`/view-worker/${assignedWorker._id}`}
                className="px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-semibold hover:bg-green-50"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      {paymentHistory && (
        <div className="bg-[#F5F5F5] border border-[#228B22] rounded-lg shadow p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Payment Summary</h3>
          </div>

          {/* Payment List */}
          {paymentHistory.map((payment, index) => (
            <div
              key={payment._id}
              className="flex items-center justify-between bg-white border-4 border-[#F5F5F5] py-3 first:border-t-0 w-full"
            >
              {/* Index & Description */}
              <div className="flex items-center space-x-5 p-2">
                {" "}
                {/* reduced gap */}
                <span className="font-semibold">{index + 1}.</span>
                <span>{payment.description || "Starting Payment"}</span>
              </div>

              {/* Status */}
              <div className="mx-2 ">
                {payment.status === "success" &&
                  payment.release_status === "pending" && (
                    <span className="text-yellow-600 font-semibold">
                      User Paid
                    </span>
                  )}
                {payment.release_status === "release_requested" && (
                  <span className="text-blue-600 font-semibold">
                    Request Sent
                  </span>
                )}
                {payment.release_status === "released" && (
                  <span className="text-green-700 font-semibold">Paid</span>
                )}
                {payment.release_status === "refunded" && (
                  <span className="text-red-600 font-semibold">Refunded</span>
                )}
              </div>

              {/* Amount */}
              <div className="font-semibold mx-3">₹{payment.amount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
