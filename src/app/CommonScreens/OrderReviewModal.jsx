import { useEffect } from "react";
import { motion } from "framer-motion";
import Review from "./Review"; // import your Review component

export default function OrderReviewModal({ show, onClose, orderId, type }) {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // close when clicking outside
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-lg w-[90%] md:w-[600px] max-h-[85vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Review Content */}
        <div className="p-4 md:p-6">
          <Review orderId={orderId} type={type} />
        </div>
      </motion.div>
    </div>
  );
}
