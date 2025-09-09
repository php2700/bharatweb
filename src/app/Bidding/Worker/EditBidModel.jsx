import bidModelImg from "../../../assets/directHiring/biddModel.png";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditBidModal({
  isOpen,
  onClose,
  orderId,
  initialAmount,
  initialDescription,
  initialSubCategoryId, // ✅ add this
  onEditSuccess,
}) {
  const [amount, setAmount] = useState(initialAmount || "");
  const [description, setDescription] = useState(initialDescription || "");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("bharat_token");

    // ✅ sub_category_ids should be an array
    const payload = {
  order_id: orderId,
  title: "Updated Bid",
  category_id: "12345",
  sub_category_ids: initialSubCategoryId
    ? Array.isArray(initialSubCategoryId)
      ? initialSubCategoryId
      : [initialSubCategoryId] // ensure it's an array
    : [], 
  address: "Some Address",
  google_address: "Google Address here",
  description,
  cost: amount,
  deadline: "2025-09-15",
  images: [],
};


    // 🛠 Debug logs
    console.log("Payload being sent:", payload);
    console.log("sub_category_ids type:", typeof payload.sub_category_ids, payload.sub_category_ids);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bidding-order/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Bid updated successfully ✅");
        onEditSuccess(amount, description);
        onClose();
      } else {
        toast.error(data.message || "Failed to update bid ❌");
        console.error("Server error response:", data);
      }
    } catch (error) {
      console.error("Error updating bid:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-2xl px-6 py-8">
        <h2 className="text-center font-bold text-xl">Edit Bid</h2>

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
              onChange={(e) => setAmount(e.target.value)}
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

          <div className="flex w-1/2 mx-auto justify-center gap-4 mt-6">
            <button
              type="submit"
              className="px-2 py-2 w-1/2 bg-[#228B22] text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              Update Bid
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
