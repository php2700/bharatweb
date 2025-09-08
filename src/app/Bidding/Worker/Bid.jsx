import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // agar aapko id URL se lena hai
import Footer from "../../../component/footer";
import Header from "../../../component/Header";

import hisWorkImg from "../../../assets/directHiring/his-work.png";

import { Search } from "lucide-react";

import BidModel from "./BidModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function Bid() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams(); // agar route me /bid/:id hai to ye kaam karega
  const [isBidModel, setIsBidModel] = useState(false);
   const [data, setData] = useState(null);
   const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("bharat_token");
    

    fetch(`${BASE_URL}/negotiations/getLatestNegotiation/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);
    
  let order_id='';
  let service_provider_get_id='';
  let user_get_id='';
  let bidding_offer_id='';
      if(data){
        order_id=data.order_id;
        service_provider_get_id=data.service_provider;
        user_get_id=data.user;
        bidding_offer_id=data._id;


      }

 const handleNagotiation=async(offer)=>{
   // user id from localStorage
    const token = localStorage.getItem("bharat_token"); // bearer token from localStorage

    if (!offer) {
      toast.error("Please enter offer amount ❗");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/negotiations/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // bearer token
        },
        body: JSON.stringify({
          order_id:order_id, // from location.state
          bidding_offer_id:bidding_offer_id, // from location.state
          service_provider: service_provider_get_id, // from URL
          user: user_get_id, // from localStorage
          initiator: "service_provider", // fixed
          offer_amount: Number(offer), // from parameter
          message: `Can you do it for ${offer}?`, // dynamic with offer
        }),
      });

      const data = await response.json();
      console.log("Negotiation API Response:", data);

      if (response.ok) {
        toast.success(`You sent ₹${offer} Amount For Negotiation`);
      } else {
        alert(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to start negotiation ❌");
    }
  }
  const closeBidModel = () => {
    setIsBidModel(false);
  };

  useEffect(() => {
    const fetchWorkDetails = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) {
          setError("Token not found");
          setLoading(false);
          return;
        }

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

        if (!response.ok) {
          throw new Error("Failed to fetch work details");
        }

        const alldata = await response.json();
        const data = alldata.data;
        console.log(data);

        setWorker({
          id: data._id,
          project_id: data.project_id,
          workName: data.title,
          location: data.address,
          status: data.status,
          image: 'd',
          amount: data.cost,
          date: data.createdAt,
          completionDate: data.deadline,
          skills:data.description
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load work details");
        setLoading(false);
      }
    };

    fetchWorkDetails();
  }, [id]);
  
  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error)
    return <div className="text-center py-6 text-red-500">{error}</div>;
;
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
                  
                  <span className="inline-block bg-red-500 text-white text-lg font-semibold px-3 rounded-full mt-2">
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
              <div onClick={() => setIsBidModel(true)}
               className="text-xl text-white bg-[#008000] text-center py-1 border rounded-lg w-1/4 mx-auto">
                Bid
              </div>
            </div>
          )}
               <div className="flex flex-col items-center  p-6 ">
            <div className="flex space-x-4 mb-12 bg-[#EDEDED] rounded-[50px] p-[12px]">
              <button
                onClick={() => setIsOfferActive(true)}
                className={`px-16 py-2 rounded-full font-medium shadow-sm ${
                  isOfferActive
                    ? "bg-[#228B22] text-white border border-green-600"
                    : "border border-green-600 text-green-600"
                }`}
              >
                Offer Price ({data.offer_amount})
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

{/* Accept / Send Request */}
<div className="text-center">
  <button
    className="bg-[#228B22] text-white w-100 px-10 py-3 rounded-md font-semibold"
    onClick={() => {
      if (isOfferActive) {
        alert("Request Accepted ✅");
      } else {
        handleNagotiation(offer);
      }
    }}
  >
    {isOfferActive ? "Accept Request" : "Send Request"}
  </button>
</div>
        </div>
       
      </div>
      <Footer />
      {isBidModel && <BidModel isOpen={isBidModel} onClose={closeBidModel} orderId={id}/>}
    </>
  );
}
