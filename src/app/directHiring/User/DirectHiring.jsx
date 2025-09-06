import React, { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import Header from "../../../component/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("bharat_token");

const DirectHiring = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleImageUpload = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const invalidFiles = selectedFiles.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      setErrors({ images: "Only JPEG/PNG images up to 5MB are allowed." });
      return;
    }

    if (images.length + selectedFiles.length > 5) {
      setErrors({ images: "You can only upload up to 5 images." });
      return;
    }

    setErrors((prev) => ({ ...prev, images: "" }));
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!address) newErrors.address = "Address is required";
    if (!description) newErrors.description = "Description is required";
    if (!deadline) newErrors.deadline = "Deadline is required";
    if (images.length === 0)
      newErrors.images = "At least one image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    if (!id) {
      setErrors({ general: "Something went wrong with the provider ID." });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("first_provider_id", id);
      formData.append("title", title);
      formData.append("address", address);
      formData.append("description", description);
      formData.append("deadline", deadline);
      images.forEach((image) => {
        formData.append("images", image);
      });

      // 🔹 Step 1: Create direct order & Razorpay order
      const res = await axios.post(
        `${BASE_URL}/direct-order/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { razorpay_order } = res.data;
      console.log("rrooamount", razorpay_order.amount)

      // 🔹 Step 2: Open Razorpay Checkout
      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
        amount: razorpay_order.amount,
        currency: "INR",
        name: "Bharat App",
        description: "Direct Hiring Payment",
        order_id: razorpay_order.id,
        handler: async function (response) {
          try {
            // 🔹 Step 3: Verify payment
            const verifyRes = await axios.post(
              `${BASE_URL}/direct-order/verify-platform-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (verifyRes.status == 200) {
              navigate("/user/work-list/My Hire");
            } else {
              setErrors({ general: "Payment verification failed." });
            }
          } catch (err) {
            setErrors({ general: "Error verifying payment." });
          }
        },
        theme: { color: "#228B22" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Failed to submit the form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-6xl mx-auto flex justify-start mt-4 px-4">
        <button
          onClick={handleBack}
          className="text-[#228B22] text-sm hover:underline"
        >
          &lt; Back
        </button>
      </div>

      <div className="min-h-screen flex justify-center py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8 space-y-6"
          noValidate
        >
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
            Direct Hiring
          </h2>
          {errors.general && (
            <p className="text-red-500 text-center">{errors.general}</p>
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title of work"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">
              Platform Fees
            </span>
            <input
              type="text"
              value="Rs 200.00"
              disabled
              className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 text-base text-gray-600"
              aria-disabled="true"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">
              Description
            </span>
            <textarea
              rows={4}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base"
              aria-invalid={errors.description ? "true" : "false"}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600 flex items-center justify-between">
              Address
              <span className="text-[#228B22] cursor-pointer">Edit</span>
            </span>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Full Address"
                className="mt-1 block w-full rounded-lg border border-gray-300 pr-9 pl-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
                aria-invalid={errors.address ? "true" : "false"}
              />
              <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">
              Add deadline and time
            </span>
            <div className="relative">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
                aria-invalid={errors.deadline ? "true" : "false"}
              />
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
            )}
          </label>

          <div>
            <span className="text-sm font-medium text-gray-600">
              Upload (5 Max photos)
            </span>
            <div className="border border-gray-300 rounded-lg p-6 text-center mb-4 bg-gray-50">
              <label className="cursor-pointer text-[#228B22] text-sm font-medium">
                Upload Image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-4 justify-start">
                {images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#228B22] text-white font-semibold py-3 rounded-lg text-lg transition-all shadow-md ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#1e7a1e]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Hire"}
          </button>
        </form>
      </div>
    </>
  );
};

export default DirectHiring;
