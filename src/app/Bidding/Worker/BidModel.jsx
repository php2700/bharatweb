import bidModelImg from "../../../assets/directHiring/biddModel.png";
import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BidModal({
  isOpen,
  onClose,
  orderId,
  onBidSuccess,
  platformFee,
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (platformFee && platformFee > 0) {
      const minRequiredAmount = platformFee * 10;

      if (Number(amount) <= minRequiredAmount) {
        toast.error(
          `Bid amount must be greater than ₹${minRequiredAmount} because platform fee is ₹${platformFee}.`
        );
        return; // Yahan se wapas bhej denge, API call nahi hogi
      }
    }

    const token = localStorage.getItem("bharat_token");

    const payload = {
      order_id: orderId,
      bid_amount: amount,
      duration: duration,
      message: description,
    };

    try {
      const response = await fetch(`${BASE_URL}/bidding-order/placeBid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Bid placed successfully ✅",
          icon: "success",
        });
        localStorage.setItem("bidding_offer_id", data?.data?._id);
        onBidSuccess(amount, description, duration);
        onClose();
      } else {
        toast.error(data.message || "Failed to place bid ❌");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Something went wrong!");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-2xl px-6 py-8">
        <h2 className="text-center font-bold text-xl">Bid</h2>

        <img
          src={bidModelImg}
          alt="Bid Illustration"
          className="mx-auto mt-6 mb-6 h-40"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block font-medium mb-1">Enter Amount</label>
       <input
  type="text"
  value={amount}
  onChange={(e) => {
    const value = e.target.value;

    // Only digits allowed and max length 10
    if (/^\d*$/.test(value) && value.length <= 10) {
      setAmount(value);
    }
  }}
  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
  required
/>

          </div>

          <div className="text-left">
            <label className="block font-medium mb-1">Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>
          <div className="text-left">
            <label className="block font-medium mb-1">Duration</label>
           <input
  type="text"
  value={duration}
  onChange={(e) => {
    const value = e.target.value;

    // Only digits & max length 3
    if (/^\d{0,3}$/.test(value)) {
      setDuration(value);
    }
  }}
  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
  required
/>

          </div>

          <div className="flex w-1/2 mx-auto justify-center gap-4 mt-6">
            <button
              type="submit"
              className="px-2 py-2 w-1/2 bg-[#228B22] text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              Bid
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-2 w-1/2 border border-[#228B22] text-[#228B22] font-medium rounded-lg hover:bg-green-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
