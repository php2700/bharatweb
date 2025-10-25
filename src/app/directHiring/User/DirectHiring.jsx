import React, { useState, useEffect, useRef } from "react";
import { Calendar, MapPin } from "lucide-react";
import Header from "../../../component/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

// 🔹 Load Google Maps script
const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&libraries=places`;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
  return () => document.body.removeChild(script);
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("bharat_token");

const DirectHiring = () => {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  const [showOptions, setShowOptions] = useState();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState();
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState([]);
  const [isShopVisited, setIsShopVisited] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [platformFee, setPlatformFee] = useState("");
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapAutocompleteRef = useRef(null); // 🔹 Ref for modal autocomplete
  const markerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get-fee/direct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fee = res.data.data?.fee; // Fallback to 200 if not found
        setPlatformFee(fee);
      } catch (error) {
        console.error("Error fetching platform fee:", error);
        setPlatformFee(200); // Fallback to default value
      }
    };

    fetchPlatformFee();
  }, []);

  // 🔹 Load Razorpay and Google Maps scripts
  useEffect(() => {
    const razorpayScript = document.createElement("script");
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);

    return () => {
      document.body.removeChild(razorpayScript);
    };
  }, [isMapModalOpen]);

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
    if (!title) newErrors.title = "Title is required.";
    else if (title.length < 3)
      newErrors.title = "Min 3 characters are required for title.";
    else if (title.length > 30)
      newErrors.title = "Title cannot exceed 30 characters.";
    if (!description) newErrors.description = "Description is required.";
    else if (description?.length < 5)
      newErrors.description = "Min 5 character description is required.";
    else if (description.length > 250)
      newErrors.description = "Description cannot exceed 250 characters.";
    if (!deadline) newErrors.deadline = "Deadline is required.";
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
      formData.append("address", address || profile?.location?.address);
      formData.append("description", description);
      formData.append("deadline", deadline);
      formData.append("isShopVisited", isShopVisited);
      images.forEach((image) => {
        formData.append("images", image);
      });

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

      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
        amount: razorpay_order.amount,
        currency: "INR",
        name: "Bharat App",
        description: "Direct Hiring Payment",
        order_id: razorpay_order.id,
        handler: async function (response) {
          try {
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
            if (verifyRes.status === 200) {
              navigate(`/my-hire/order-detail/${verifyRes.data?.order?._id}`);
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

  const openMapModal = () => {
    setIsMapModalOpen(true);
  };

  const closeMapModal = () => {
    setIsMapModalOpen(false);
  };

  const updateAddress = async (location) => {
    try {
      let obj = {
        latitude: location?.latitude,
        longitude: location?.longitude,
        address: location?.address,
      };
      let res = await axios.put(`${BASE_URL}/user/updateLocation`, obj, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log(error, "gg");
    }
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-6xl mx-auto flex justify-start mt-4 mt-20 px-4">
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
            </span>
            <div className="relative">
              <input
                id="address-input"
                type="text"
                readOnly
                value={address || profile?.location?.address}
                placeholder="Enter or select address"
                className="mt-1 block w-full rounded-lg border border-gray-300 pr-9 pl-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
                aria-invalid={errors.address ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="absolute right-3 top-2 px-2 py-1 text-sm rounded-lg border bg-gray-100 hover:bg-gray-200"
              >
                {showOptions ? "▲" : "▼"}
              </button>
              {showOptions && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg p-3 z-50">
                  {profile?.full_address?.map((loc) => (
                    <label
                      key={loc.address}
                      className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                    >
                      <input
                        type="radio"
                        name="address"
                        value={loc.address}
                        checked={address === loc.address}
                        onClick={() => {
                          setAddress(loc.address);
                          setShowOptions(false);
                          updateAddress(loc);
                        }}
                      />
                      <div className="flex flex-col bg-gray-50 rounded-lg p-2 w-full">
                        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                          <div>
                            <span className="block font-semibold text-xs">
                              Title
                            </span>
                            <span className="text-[12px] text-gray-800">
                              {loc.title}
                            </span>
                          </div>
                          <div>
                            <span className="block font-semibold text-xs">
                              House No
                            </span>
                            <span className="text-gray-700 text-[12px]">
                              {loc.houseno ? loc?.houseno : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="block font-semibold text-xs">
                              Area
                            </span>
                            <span className="text-gray-700 text-[12px]">
                              {loc.area ? loc.area : "N/A"}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="block font-semibold text-xs">
                              Full Address
                            </span>
                            <span className="text-gray-600 text-[12px]">
                              {loc.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </label>

          <div className="block">
            <span className="text-sm font-medium text-gray-600">
              Do you want to go to shop?
            </span>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isShopVisited"
                  checked={isShopVisited === true}
                  onChange={() => setIsShopVisited(true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isShopVisited"
                  checked={isShopVisited === false}
                  onChange={() => setIsShopVisited(false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">
              Add Completion time
            </span>
            <div className="relative">
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
                aria-invalid={errors.deadline ? "true" : "false"}
              />
              <Calendar
                className="absolute left-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("deadline-input").focus();
                }}
              />
              <input
                id="deadline-input"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="hidden"
              />
            </div>
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
            )}
          </label>

          <div>
            <span className="text-sm font-medium text-gray-600">
              Upload Images (Optional, 5 Max)
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

      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Address on Map</h3>
              <button
                onClick={closeMapModal}
                className="text-red-600 font-semibold"
              >
                Close
              </button>
            </div>
            <input
              id="map-autocomplete-input"
              type="text"
              placeholder="Search for an address"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-4"
            />
            <div
              ref={mapRef}
              className="w-full h-full rounded-lg border border-gray-300"
            />
            <button
              onClick={closeMapModal}
              className="mt-4 bg-[#228B22] text-white font-semibold py-2 rounded-lg"
            >
              Confirm Address
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DirectHiring;
