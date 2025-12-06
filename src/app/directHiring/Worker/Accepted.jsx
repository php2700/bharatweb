// Accepted.jsx
import { useEffect } from "react";
import Profile from "../../../assets/default-image.jpg";
import Call from "../../../assets/ViewProfile/call.svg";
import Message from "../../../assets/ViewProfile/msg.svg";
import { Link, useNavigate } from "react-router-dom";

export default function Accepted({
  serviceProvider,
  assignedWorker,
  paymentHistory,
  fullPaymentHistory,
  hireStatus,
  orderId,
  user_id,
}) {
  if (!serviceProvider && !assignedWorker) {
    return null; // Don't render if no data is available
  }

  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleChatOpen = (receiverId, senderId) => {
    // Save receiverId in localStorage
    localStorage.setItem("receiverId", receiverId);
    localStorage.setItem("senderId", senderId);
    // Redirect to chat page
    navigate("/chats");
  };
  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">User Details</h2>

        {/* Service Provider Details */}
       {serviceProvider && (
    <div className="bg-gray-100 border border-[#228B22] p-4 rounded-lg mb-4">
   
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        
        {/* Left: Profile */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <img
            src={serviceProvider.profile_pic || Profile}
            alt={serviceProvider.full_name || "User"}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
          <p className="text-lg font-semibold truncate">
            {serviceProvider.full_name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ") || "Unknown User"}
          </p>
        </div>


        {hireStatus !== "cancelled" && hireStatus !== "cancelledDispute" && (
          <div className="flex flex-col sm:flex-row items-center flex-3 gap-4">
            {/* Call & Chat Icons */}
            <div className="flex items-center space-x-6  mx-auto">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer">
                <img src={Call} alt="Call" className="w-5 h-5" />
              </div>
              <div
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer"
                onClick={() => handleChatOpen(serviceProvider._id, user_id)}
              >
                <img src={Message} alt="Message" className="w-5 h-5" />
              </div>
            </div>

        
            <div className=" ml-4 w-full sm:w-auto  flex-shrink-0  ">
              {assignedWorker ? (
                <button className="w-full sm:w-auto px-6 py-2 border border-[#228B22]  text-[#228B22] bg-white rounded-lg font-medium  cursor-not-allowed ">
                  Assigned
                </button>
              ) : (
                <Link
                  to={`/assign-work/${orderId}/direct`}
                  className="block text-center px-6 py-2 border border-[#228B22] text-[#228B22] bg-white rounded-lg font-medium  hover:bg-green-600 hover:text-white"
                >
                  Assign work
                </Link>
              )}
            </div>
          </div>
        )}
      </div>  


    </div>  
  )}

 

        {/* Assigned Worker Details */}
        {assignedWorker && (
          <div className="mb-4">
            {/* Heading outside the gray box */}
            <h3 className="text-base font-semibold mb-2">Assigned Person</h3>

            {/* Gray container only for worker details */}
            <div className="bg-[#F5F5F5] border border-[#228B22] rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Worker Info */}
               <div className="flex items-center  gap-3">
                  <img
                    src={assignedWorker.image || Profile}
                    alt={`Profile of ${assignedWorker.name || "Worker"}`}
                    className="w-14 h-14 min-w-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold truncate">
                      {assignedWorker.name
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ") || "Unknown Worker"}
                    </p>
                  </div>
                </div>

                {/* View Profile Button aligned right */}
                <Link
                  to={`/view-worker/${assignedWorker._id}`}
                   className="px-3 py-1.5 text-sm border border-[#228B22] 
                 text-[#228B22] bg-white rounded-lg font-medium 
                 hover:bg-green-50 ml-2 sm:ml-5 shrink-0 text-center"
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
            {paymentHistory?.length > 0 ? (
              paymentHistory.map((payment, index) => (
                <div
                  key={payment._id}
                  className="grid grid-cols-12 gap-4 items-center bg-white border-b border-gray-200 py-5 px-4 last:border-b-0 "
                >
                  {/* Index + Description */}
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-2 text-sm sm:text-base ">
                    <span className="font-semibold">{index + 1}.</span>
                    <span>{payment.description.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "Starting Payment"}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-12 sm:col-span-4 ">
                    {payment.status === "success" &&
                      payment.release_status === "pending" && (
                        <span className="text-yellow-600 text-sm md:text-xl font-semibold">
                          Waiting for User Approval
                        </span>
                      )}

                    {payment.release_status === "release_requested" && (
                      <span className="text-blue-600 font-semibold">In Progress</span>
                    )}

                    {payment.release_status === "released" && (
                      <span className="text-green-700 font-semibold">Paid</span>
                    )}

                    {payment.release_status === "rejected" && (
                      <span className="text-red-600 font-semibold">
                        Admin Rejected
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="col-span-12 sm:col-span-3  font-semibold">
                    ₹{payment.amount}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center font-semibold">
                No Payment History{" "}
              </div>
            )}
          </div>
        )}
        <p className="font-bold m-3 text-gray-900">
          Note:&nbsp;
          <span className="text-sm text-red-600 font-semibold">
            Amount will be deposited within 7 to 8 working days.
          </span>
        </p>
        <div className="p-4 bg-white shadow-md rounded-lg mt-10">
          <table className="w-full border border-gray-300 rounded-md overflow-hidden">
            <thead style={{ backgroundColor: "#228B22", color: "white" }}>
              <tr>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Total Project Value</td>
                <td className="border p-2">₹{fullPaymentHistory.amount}</td>
              </tr>
              <tr>
                <td className="border p-2">Pending for User Approval</td>
                <td className="border p-2">
                  ₹{paymentHistory
                  .filter((p) =>
                    ["pending"].includes(p.release_status)
                  )
                  .reduce((sum, p) => sum + p.amount, 0)}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Paid to You</td>
                <td className="border p-2">
                  ₹
                  {paymentHistory
                    .filter((p) =>
                      ["release_requested", "released"].includes(
                        p.release_status
                      )
                    )
                    .reduce((sum, p) => sum + p.amount, 0)}
                </td>
                {/* <td className="border p-2">₹{fullPaymentHistory.platform_fee}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
