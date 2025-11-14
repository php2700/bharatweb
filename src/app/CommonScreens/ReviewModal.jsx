// RateWorkerModal.jsx
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Swal from "sweetalert2";

export default function ReviewModal({
  show,
  onClose,
  orderId,
  service_provider_id,
  type,
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [images, setImages] = useState([]);
  // console.log("ReviewModal props:", {
  //   show,
  //   onClose,
  //   orderId,
  //   service_provider_id,
  //   type,
  // });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      const formData = new FormData();
      formData.append("serviceProviderId", service_provider_id); // ✅ correct key for backend
      formData.append("review", feedback);
      formData.append("rating", rating);

      if (orderId) formData.append("orderId", orderId);
      if (type) formData.append("type", type);
      images.forEach((img) => formData.append("images", img));
      console.log("imgggg", images);

      await axios.post(`${BASE_URL}/user/add-review`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Thank you for rating the Worker!",
        icon: "success",
        confirmButtonColor: "#228B22",
      }).then(() => {
        setRating(0);
        setFeedback("");
        setImages([]);
        onClose();
      });
    } catch (err) {
      console.error(err);

      // ❌ Error SweetAlert
      Swal.fire({
        title: "Error!",
        text: "Failed to submit rating. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4 text-green-700 text-center">
          Rate the Worker
        </h2>
        <p className="text-lg font-semibold mb-4 text-gray-600 text-center -mt-4">
          How was your experience with us?
        </p>

        {/* Stars */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => setRating(star)}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-10 w-10 cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.045 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
        </div>

        {/* Feedback */}
        <textarea
          placeholder="Write your feedback..."
          className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:border-green-500"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {/* Upload Images */}
        {/*<* className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">
            Upload Images (max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 5);
							// console.log("files", files)
              setImages(files);
            }}
            className="w-full mb-2"
          />
          <input
            type="text"
            placeholder="Upload Images"
            readOnly
            value={images.map((img) => img.name).join(", ")}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-green-500 cursor-pointer"
            onClick={() => document.querySelector('input[type="file"]').click()}
          />
				
          {/* Preview */}
        {/* <div className="flex flex-wrap mt-2 gap-2">
            {images.map((img, index) => (
							// console.log("kdkdkd",img),
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt={`preview-${index}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div> */}

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">
            Upload Images (max 5)
          </label>

          {/* HIDDEN INPUT */}
          <input
            id="imageUploadInput"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 5);
              setImages(files);
            }}
            className="hidden"
          />

          {/* CUSTOM BUTTON */}
          <button
            type="button"
            onClick={() => document.getElementById("imageUploadInput").click()}
            className="bg-[#228B22] text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
          >
            Upload Images
          </button>

          {/* FILE NAMES BOX */}
          <input
            type="text"
            readOnly
            placeholder="No images selected"
            value={images.map((img) => img.name).join(", ")}
            className="w-full border border-gray-300 mt-2 p-2 rounded focus:outline-none focus:border-green-500 cursor-pointer"
            onClick={() => document.getElementById("imageUploadInput").click()}
          />

          {/* Preview */}
          <div className="flex flex-wrap mt-2 gap-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt={`preview-${index}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="px-6 py-3 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-[#228B22] text-white rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
