import bidModelImg from "../../../assets/directHiring/biddModel.png";
import { useState } from "react";

export default function BidModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("$14.00");
  const [description, setDescription] = useState(
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text..."
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-50">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-2xl px-6 py-8">
        <h2 className="text-center font-bold text-xl">Bid</h2>

        <img
          src={bidModelImg}
          alt="Bid Illustration"
          className="mx-auto mt-6 mb-6 h-40"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(amount, description);
          }}
          className="space-y-4"
        >
          <div className="text-left">
            <label className="block font-medium mb-1">Enter Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="text-left">
            <label className="block font-medium mb-1">Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
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
