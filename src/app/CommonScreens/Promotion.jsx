import React, { useState } from "react";
import Subscription from "./Subscription";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import BankDetails from "./BankDetails";
import Referral from "./Referral";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Promotion() {
  
  const token = localStorage.getItem("bharat_token");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phone: "",
    amount: 100,
    images: [],
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


 const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files); 
  setFormData((prev) => ({
    ...prev,
    images: [...prev.images, ...selectedFiles],
  }));
};


  // Remove specific image by index
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Open Razorpay payment window
  const openRazorpay = async (order) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "The Bharat Works",
      description: "Promotion Payment",
      order_id: order.id,
      handler: async function (response) {
        // Payment success
        console.log("Payment Successful:", response);

        const formDataToSend = new FormData();
           formData.images.forEach((file) => {
          formDataToSend.append("images", file);
        });

        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("amount", formData.amount);
        formDataToSend.append("paymentId", response.razorpay_payment_id);

        // Append all images
     
        formData.images.forEach((file, i) => {
  console.log("Image", i, file.name, file.size, file.type);
});


        await axios.post(`${BASE_URL}/promotion/create`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          title: "",
          description: "",
          phone: "",
          amount: 100,
          images: [],
        });
        toast.success("Payment successful!");
      },
      theme: { color: "#0f873d" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createOrder = await axios.post(
        `${BASE_URL}/emergency-order/create-razorpay-order`,
        { amount: formData.amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Pass razorpay order object to openRazorpay
      openRazorpay(createOrder.data.razorOrder);
    } catch (error) {
      console.error(
        error?.response?.data?.message ||
          error?.message ||
          "something went wrong"
      );
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "something went wrong"
      );
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6 mt-20">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
            Create Promotion
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter promotion title"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                disabled
                className="w-full p-3 border rounded-lg focus:ring focus:ring-green-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images
              </label>

              {/* Custom file input */}
              <div className="flex items-center">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md font-medium"
                >
                  Select Images
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mt-4">
                  {formData.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group w-32 h-32 rounded-lg overflow-hidden border shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${i}`}
                        className="w-full h-full object-cover"
                      />
                      {/* X button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Add Promotion
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
