import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // agar aapko id URL se lena hai
import Footer from "../../../component/footer";
import Header from "../../../component/Header";

import hisWorkImg from "../../../assets/directHiring/his-work.png";

import { Search } from "lucide-react";

import BidModel from "./BidModel";
import EditBidModal from "./EditBidModel";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Bid() {
  const { id } = useParams(); // agar route me /bid/:id hai to ye kaam karega
  const [isBidModel, setIsBidModel] = useState(false);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditBidModel, setIsEditBidModel] = useState(false)
  const [bidData, setBidData] = useState();

  const closeBidModel = () => {
    setIsBidModel(false);
  };


  const closeEditBidModel = () => {
    setIsEditBidModel(false)
  }

  const token = localStorage.getItem("bharat_token"); // 🔑 get token

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
          skills: data.description
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


  useEffect(() => {
    const fetchBidData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bidding-order/getBiddingOffers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response, "response")

        setBidData(response?.data?.data[0]);
      } catch (error) {
        setError(`Failed to get Bidding Data: ${error?.response?.data?.message || error.message}`);
      }
    };

      fetchBidData();
  }, [id, token,isEditBidModel]);

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error)
    return <div className="text-center py-6 text-red-500">{error}</div>;
  console.log(worker);
  return (
    <>
      <Header />

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
              {
                bidData?.bid_amount ? <div onClick={() => setIsEditBidModel(true)}
                  className="text-xl text-white bg-[#008000] text-center py-1 border cursor-pointer rounded-lg w-1/4 mx-auto">
                  Edit Bid (Rs. {bidData?.bid_amount})
                </div> : <div onClick={() => setIsBidModel(true)}
                  className="text-xl text-white bg-[#008000] text-center py-1 border rounded-lg w-1/4 mx-auto">
                  Bid
                </div>
              }
            </div>
          )}
        </div>
      </div>
      <Footer />
      {isBidModel && <BidModel isOpen={isBidModel} onClose={closeBidModel} orderId={id} />}
      {isEditBidModel && <EditBidModal isOpen={isEditBidModel} onClose={closeEditBidModel} bidData={bidData} />}
    </>
  );
}