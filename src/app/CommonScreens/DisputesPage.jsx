import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import Arrow from "../../assets/profile/arrow_back.svg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DisputesPage() {
  const navigate = useNavigate();
  const [disputesRaisedBy, setDisputesRaisedBy] = useState([]);
  const [disputesAgainst, setDisputesAgainst] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("raisedBy");
  const [subTab, setSubTab] = useState("Direct");

  const handleUnauthorized = () => {
    console.log("handleUnauthorized: Clearing localStorage and redirecting to login");
    localStorage.removeItem("bharat_token");
    localStorage.removeItem("isProfileComplete");
    localStorage.removeItem("role");
    localStorage.removeItem("otp");
    localStorage.removeItem("selectedAddressId");
    toast.error("Session expired, please log in again", { toastId: "unauthorized" });
    navigate("/login");
  };

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token || !token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
          console.log("fetchDisputes: No valid token, redirecting to login");
          handleUnauthorized();
          return;
        }

        // Fetch disputes raised by user
        const resRaisedBy = await fetch(`${BASE_URL}/dispute/getDisputesRaisedBy`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataRaisedBy = await resRaisedBy.json();

        if (!resRaisedBy.ok) {
          if (resRaisedBy.status === 401) {
            console.log("fetchDisputes: 401 Unauthorized, redirecting to login");
            handleUnauthorized();
            return;
          }
          toast.error(dataRaisedBy.message || "Failed to fetch disputes raised by", { toastId: "fetchDisputesRaisedByError" });
          return;
        }

        // Fetch disputes against user
        const resAgainst = await fetch(`${BASE_URL}/dispute/getDisputesAgainst`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataAgainst = await resAgainst.json();

        if (!resAgainst.ok) {
          if (resAgainst.status === 401) {
            console.log("fetchDisputes: 401 Unauthorized, redirecting to login");
            handleUnauthorized();
            return;
          }
          toast.error(dataAgainst.message || "Failed to fetch disputes against", { toastId: "fetchDisputesAgainstError" });
          return;
        }

        setDisputesRaisedBy(dataRaisedBy.disputes || []);
        setDisputesAgainst(dataAgainst.disputes || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching disputes:", error);
        toast.error("Something went wrong while fetching disputes!", { toastId: "fetchDisputesGeneralError" });
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  const renderDisputeCard = (dispute) => (
    <div
      key={dispute._id}
      className="border border-gray-200 rounded-xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Dispute ID: {dispute.unique_id}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-700">
            <span className="font-semibold">Order ID:</span>{" "}
            {dispute.order_id.project_id}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Order Title:</span>{" "}
            {dispute.order_id.title}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Order Description:</span>{" "}
            {dispute.order_id.description}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Flow Type:</span>{" "}
            {dispute.flow_type.charAt(0).toUpperCase() + dispute.flow_type.slice(1)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Amount:</span> ₹{dispute.amount.toLocaleString()}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`capitalize ${
                dispute.status === "pending"
                  ? "text-yellow-600"
                  : dispute.status === "resolved"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {dispute.status}
            </span>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(dispute.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(dispute.updatedAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div>
          <p className="text-gray-700">
            <span className="font-semibold">Raised By:</span>{" "}
            {dispute.raised_by.full_name} (ID: {dispute.raised_by.unique_id})
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Against:</span>{" "}
            {dispute.against.full_name} (ID: {dispute.against.unique_id})
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Description:</span>{" "}
            {dispute.description}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Requirement:</span>{" "}
            {dispute.requirement}
          </p>
          {dispute.reason && (
            <p className="text-gray-700">
              <span className="font-semibold">Reason:</span> {dispute.reason}
            </p>
          )}
        </div>
      </div>
      {dispute.images && dispute.images.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Dispute Images
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
            {dispute.images.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                <img
                  src={image}
                  alt={`Dispute Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={() => handleImageClick(image)}
                  onError={() =>
                    toast.error(
                      `Failed to load image ${index + 1}. Please check the URL.`,
                      { toastId: `imageError-${index}` }
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const filteredDisputes = (disputes) =>
    disputes.filter(
      (dispute) => dispute.flow_type.toLowerCase() === subTab.toLowerCase()
    );

  return (
    <>
      <Header />
      <div className="mt-5 mx-4 sm:mx-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-700 mb-6 hover:underline"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="max-w-5xl mx-auto mt-12 p-6 sm:p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Disputes
        </h2>

        {/* Main Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-3 px-4 text-center font-semibold text-lg transition-colors duration-300 ${
              activeTab === "raisedBy"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
            onClick={() => setActiveTab("raisedBy")}
          >
            Raised by Me
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-semibold text-lg transition-colors duration-300 ${
              activeTab === "against"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
            onClick={() => setActiveTab("against")}
          >
            Against Me
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["Direct", "Bidding", "Emergency"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full font-medium text-sm sm:text-base transition-colors duration-200 ${
                subTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-green-100"
              }`}
              onClick={() => setSubTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Disputes Content */}
        {loading ? (
          <div className="text-center text-gray-600 text-lg">
            <svg
              className="animate-spin h-8 w-8 text-green-600 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading disputes...
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "raisedBy" &&
              (filteredDisputes(disputesRaisedBy).length === 0 ? (
                <div className="text-center text-gray-600 text-lg">
                  No disputes found for {subTab} flow type.
                </div>
              ) : (
                filteredDisputes(disputesRaisedBy).map(renderDisputeCard)
              ))}
            {activeTab === "against" &&
              (filteredDisputes(disputesAgainst).length === 0 ? (
                <div className="text-center text-gray-600 text-lg">
                  No disputes found for {subTab} flow type.
                </div>
              ) : (
                filteredDisputes(disputesAgainst).map(renderDisputeCard)
              ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
