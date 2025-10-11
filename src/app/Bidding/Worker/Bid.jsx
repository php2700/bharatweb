import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import hisWorkImg from "../../../assets/directHiring/his-work.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BidModal from "./BidModel";
import EditBidModal from "./EditBidModel";

export default function Bid() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const service_provider = localStorage.getItem("user_id");
  // Modal States
  const [isBidModel, setIsBidModel] = useState(false);
  const [isEditBidModel, setIsEditBidModel] = useState(false);

  // Data States
  const [data, setData] = useState(null);
  const [worker, setWorker] = useState(null);

  // Bid States
  const [bidPlaced, setBidPlaced] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDescription, setBidDescription] = useState("");

  // Offer / Negotiation
  const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);

  // Loading / Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  // Fetch Work Details
  useEffect(() => {
    const fetchWorkDetails = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) throw new Error("Token not found");

        const response = await fetch(
          `${BASE_URL}/bidding-order/getBiddingOrderById/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch work details");

        const result = await response.json();
        const data = result.data;
      //  console.log("Fetched Work Details:", data); // Debug log
        setWorker({
          _id: data._id,
          order_id: data._id,
          project_id: data.project_id,
          workName: data.title,
          location: data.address,
          status: data.status,
          image: "d",
          amount: data.cost,
          date: data.createdAt,
          completionDate: data.deadline,
          skills: data.description,
          service_provider: data.service_provider,
          user: data.user_id._id,
          category_id: data.category_id || null, // ✅ ensure available
          sub_category_ids: data.sub_category_ids || [], // ✅ correct naming
        });
// console.log(data.sub_category_ids);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkDetails();
  }, [id, BASE_URL]);

  // Fetch Latest Negotiation
  useEffect(() => {
    const token = localStorage.getItem("bharat_token");
    if (!worker?.order_id || !token) return;

    const fetchNegotiation = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/negotiations/getLatestNegotiation/${worker.order_id}/service_provider`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const result = await res.json();
				console.log("Fetched Negotiation Data:", result); // Debug log
        setData(result);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchNegotiation();
  }, [worker, BASE_URL]);

  // Handle Negotiation
  const handleNegotiation = async (offer) => {
    const token = localStorage.getItem("bharat_token");
    if (!offer) {
      toast.error("Please enter offer amount ❗");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/negotiations/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: worker?.order_id,
          bidding_offer_id: data?._id,
          service_provider: service_provider,
          user: worker?.user,
          initiator: "service_provider",
          offer_amount: Number(offer),
          message: `Can you do it for ${offer}?`,
        }),
      });

      const result = await response.json();
      // console.log("Negotiation API Response:", result);

      if (response.ok) {
					setOffer(" ");
        toast.success(`You sent ₹${offer} Amount For Negotiation`);
      } else {
        toast.error(result.message || "Something went wrong ❌");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to start negotiation ❌");
    }
  };

  // Handle Bid Success
  const handleBidSuccess = (amount, description) => {
    setBidPlaced(true);
    setBidAmount(amount);
    setBidDescription(description);
    setIsBidModel(false);
  };

  // Handle Edit Bid Success
  const handleEditBidSuccess = (amount, description) => {
    setBidAmount(amount);
    setBidDescription(description);
    setIsEditBidModel(false);
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error)
    return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="container max-w-5xl mx-auto my-10 p-8 shadow-lg rounded-3xl">
          <div className="text-2xl text-center font-bold mb-4">Work Detail</div>

          <div>
            <img src={hisWorkImg} className="h-80 w-full" alt="Work" />
          </div>

          {worker && (
            <div className="py-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{worker.workName}</h2>
                  <span className="inline-block bg-[#F27773] text-white text-sm font-semibold px-3 rounded-full mt-2">
                    {worker.location}
                  </span>
                  <p className="font-semibold text-lg my-2 text-[#008000]">
                    ₹{worker.amount}/-
                  </p>
                </div>
                <div className="text-right">
                  <p className="bg-black text-white text-md px-4 rounded-full inline-block">
                    {worker.project_id}
                  </p>
                  <p className="text-md mt-2">
                    <span className="font-semibold">
                      Posted Date:{" "}
                      {new Date(worker.date).toLocaleDateString("en-GB")}
                    </span>
                  </p>
                  <p className="text-md">
                    <span className="font-semibold">
                      Completion Date:{" "}
                      {new Date(worker.completionDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold">Task Details</h3>

              <div className="border border-[#228B22] rounded-lg p-4 text-sm text-gray-700 space-y-3">
                <p>{worker.skills}</p>
              </div>

              <div
                onClick={() => {
                  if (bidPlaced) {
                    setIsEditBidModel(true);
                  } else {
                    setIsBidModel(true);
                  }
                }}
                className={`text-lg font-semibold text-white text-center py-1 border rounded-lg w-1/4 mx-auto cursor-pointer bg-[#008000] hover:bg-green-700`}
              >
                {bidPlaced ? `Edit Bid: (₹${bidAmount})` : "Bid"}
              </div>
            </div>
          )}

          <div className="flex flex-col items-center p-6">
            <div className="flex space-x-4 mb-12 bg-[#EDEDED] rounded-[50px] p-[12px]">
              <button
                onClick={() => setIsOfferActive(true)}
                className={`px-16 py-2 rounded-full font-medium shadow-sm ${
                  isOfferActive
                    ? "bg-[#228B22] text-white border border-green-600"
                    : "border border-green-600 text-green-600"
                }`}
              >
                Offer Price ({data?.offer_amount || 0})
              </button>
              <button
                onClick={() => setIsOfferActive(false)}
                className={`px-16 py-2 rounded-full font-medium shadow-md ${
                  !isOfferActive
                    ? "bg-[#228B22] text-white hover:bg-[#228B22]"
                    : "border border-green-600 text-green-600"
                }`}
              >
                Negotiate
              </button>
            </div>

            {!isOfferActive && (
              <input
                type="number"
                placeholder="Enter your offer amount"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-[531px] px-4 py-2 border-2 border-[#dce1dc] rounded-md text-center text-[#453e3f] placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-[#d1d1d1]"
              />
            )}
          </div>

          <div className="text-center">
            <button
              className="bg-[#228B22] text-white w-100 px-10 py-3 rounded-md font-semibold"
              onClick={() => {
                if (isOfferActive) {
                  alert("Request Accepted ✅");
                } else {
                  handleNegotiation(offer);
                }
              }}
            >
              {isOfferActive ? "Accept Request" : "Send Request"}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Add Bid Modal */}
      {isBidModel && (
        <BidModal
          isOpen={isBidModel}
          onClose={() => setIsBidModel(false)}
          orderId={worker?._id}
          onBidSuccess={handleBidSuccess}
        />
      )}

      {/* Edit Bid Modal */}
      {isEditBidModel && (
        <EditBidModal
          isOpen={isEditBidModel}
          onClose={() => setIsEditBidModel(false)}
          orderId={worker?._id}
          initialAmount={bidAmount || worker?.amount}
          initialDescription={bidDescription || worker?.skills}
          categoryId={worker?.category_id} // ✅ pass category_id
          subCategoryIds={worker?.sub_category_ids || []} // ✅ pass subCategoryIds
          onEditSuccess={handleEditBidSuccess}
        />
      )}
    </>
  );
}
