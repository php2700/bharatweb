import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Gardening from "../../../assets/profile/profile image.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import Select from "react-select";
import paymentConfirmationImage from "../../../assets/paymentconfirmation.svg"
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("bharat_token");

const Post = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    google_address: "",
    detailed_address: "",
    contact: "",
    deadline: "",
    images: [],
    coordinates: { lat: null, lng: null },
  });
  const [validationErrors, setValidationErrors] = useState({});
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Single modal for payment confirmation
  const [razorpayOrder, setRazorpayOrder] = useState(null); // To store order details

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4",
    libraries: ["places"],
  });

  // Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/work-category`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch categories");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubcategories = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}/subcategories/${selectedCategory}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSubcategories(response.data.data || []);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch subcategories");
          setLoading(false);
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
      setSelectedSubcategories([]);
    }
  }, [selectedCategory]);

  // Handle map click
  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setFormData((prev) => ({
      ...prev,
      coordinates: { lat, lng },
    }));

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4`
      );
      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        setFormData((prev) => ({
          ...prev,
          google_address: address,
        }));
      } else {
        setError("Could not fetch address for the selected location");
      }
    } catch (err) {
      setError("Error fetching address");
    }
  };

  // Handle place selection
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setFormData((prev) => ({
        ...prev,
        google_address: place.formatted_address,
        coordinates: { lat, lng },
      }));
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
      }
    } else {
      setError("Invalid address selected");
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategories([]);
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (selectedOptions) => {
    setSelectedSubcategories(selectedOptions || []);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    if (files.length > 5) {
      setError("You can only upload a maximum of 5 images.");
    } else {
      setError(null);
      setFormData((prev) => ({ ...prev, images: files }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!selectedCategory) errors.category_id = "Category is required";
    if (selectedSubcategories.length === 0)
      errors.sub_category_ids = "At least one subcategory is required";
    if (!formData.google_address)
      errors.google_address = "Google address is required";
    if (!formData.detailed_address)
      errors.detailed_address = "Detailed address is required";
    if (!formData.contact) errors.contact = "Contact number is required";
    if (!formData.deadline) errors.deadline = "Deadline is required";
    if (formData.images.length === 0)
      errors.images = "At least one image is required";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fill in all required fields.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("category_id", selectedCategory);
    submissionData.append(
      "sub_category_ids",
      selectedSubcategories.map((option) => option.value).join(",")
    );
    submissionData.append("google_address", formData.google_address);
    submissionData.append("detailed_address", formData.detailed_address);
    submissionData.append("contact", formData.contact);
    submissionData.append("deadline", formData.deadline);
    formData.images.forEach((image) => {
      submissionData.append("images", image);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/emergency-order/create`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.razorpay_order) {
        const { id, amount } = response.data.razorpay_order;
        setRazorpayOrder({ id, amount: amount / 100 }); // Convert paise to INR
        setShowPaymentModal(true); // Trigger payment modal
      } else {
        setError("No Razorpay order found in response");
      }
    } catch (err) {
      setError("Failed to submit task: " + (err.response?.data?.message || err.message));
      console.error("Submission Error:", err);
    }
  };

  // Handle confirm from payment modal
  const handlePayConfirm = () => {
    setShowPaymentModal(false);
    if (razorpayOrder) {
      initiatePayment(razorpayOrder.id, razorpayOrder.amount * 100); // Convert back to paise
    }
  };

  // Handle payment with Razorpay
  const initiatePayment = (razorpayOrderId, amount) => {
    const options = {
      key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`, // Replace with your Razorpay Key ID
      amount: amount, // Amount in paise
      currency: "INR",
      name: "Your Company Name",
      description: "Emergency Task Platform Fee",
      order_id: razorpayOrderId,
      handler: async (response) => {
// Debug Razorpay response
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          };

          const verifyResponse = await axios.post(
            `${BASE_URL}/emergency-order/verify-platform-payment`,
            verifyData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (verifyResponse.status === 200) {
            navigate("/emergency/Work-list");
          } else {
            setError("Payment verification failed");
          }
        } catch (err) {
          setError("Error verifying payment: " + err.message);
          console.error(err);
        }
      },
      prefill: {
        contact: formData.contact,
      },
      theme: {
        color: "#10B981",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      setError("Payment failed. Please try again: " + response.error.description);
      console.error(response.error);
    });
    rzp.open();
  };

  // Format subcategories for react-select
  const subcategoryOptions = subcategories.map((subcategory) => ({
    value: subcategory._id,
    label: subcategory.name,
  }));

  // Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  // Default center for the map
  const defaultCenter = {
    lat: 22.7196,
    lng: 75.8577,
  };

  // Format deadline for display
  const formattedDate = formData.deadline
    ? new Date(formData.deadline).toLocaleDateString("en-GB")
    : "N/A";
  const formattedTime = formData.deadline
    ? new Date(formData.deadline).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  return (
    <>
      <Header />
      <div className="w-full max-w-[1000px] mx-auto mt-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-700 mb-4 hover:underline"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            Post Emergency Task
          </h2>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {loading && <p className="text-center">Loading...</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Work Category */}
            <div>
              <label className="block text-sm mb-1 font-bold">Work Category</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className={`w-full border ${
                  validationErrors.category_id ? "border-red-500" : "border-green-500"
                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {validationErrors.category_id && (
                <p className="text-red-500 text-sm">{validationErrors.category_id}</p>
              )}
            </div>

            {/* SubCategories */}
            <div>
              <label className="block text-sm mb-1 font-bold">SubCategories</label>
              <Select
                isMulti
                options={subcategoryOptions}
                value={selectedSubcategories}
                onChange={handleSubcategoryChange}
                className="w-full"
                classNamePrefix="select"
                placeholder="Select Multiple/Single SubCategories"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: validationErrors.sub_category_ids
                      ? "#EF4444"
                      : "#10B981",
                    "&:hover": { borderColor: "#10B981" },
                    boxShadow: "none",
                    "&:focus": {
                      boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
                    },
                  }),
                }}
              />
              {validationErrors.sub_category_ids && (
                <p className="text-red-500 text-sm">
                  {validationErrors.sub_category_ids}
                </p>
              )}
            </div>

            {/* Google Address */}
            <div>
              <label className="block text-sm mb-1 font-bold">
                Google Address (Search or Click on Map)
              </label>
              {isLoaded ? (
                <>
                  <Autocomplete
                    onLoad={(ref) => (autocompleteRef.current = ref)}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <input
                      type="text"
                      placeholder="Search for an address"
                      className={`w-full border ${
                        validationErrors.google_address
                          ? "border-red-500"
                          : "border-green-500"
                      } rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                  </Autocomplete>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={
                      formData.coordinates.lat
                        ? formData.coordinates
                        : defaultCenter
                    }
                    zoom={12}
                    onClick={handleMapClick}
                    onLoad={(map) => (mapRef.current = map)}
                  >
                    {formData.coordinates.lat && (
                      <Marker position={formData.coordinates} />
                    )}
                  </GoogleMap>
                  <input
                    type="text"
                    name="google_address"
                    value={formData.google_address}
                    onChange={handleInputChange}
                    placeholder="Selected address will appear here"
                    className={`w-full border ${
                      validationErrors.google_address
                        ? "border-red-500"
                        : "border-green-500"
                    } rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    readOnly
                  />
                </>
              ) : (
                <p>Loading Google Maps...</p>
              )}
              {validationErrors.google_address && (
                <p className="text-red-500 text-sm">
                  {validationErrors.google_address}
                </p>
              )}
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-sm mb-1 font-bold">
                Detailed Address (Landmark)
              </label>
              <input
                type="text"
                name="detailed_address"
                value={formData.detailed_address}
                onChange={handleInputChange}
                placeholder="Abc gali 145 banglow no. indore"
                className={`w-full border ${
                  validationErrors.detailed_address
                    ? "border-red-500"
                    : "border-green-500"
                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {validationErrors.detailed_address && (
                <p className="text-red-500 text-sm">
                  {validationErrors.detailed_address}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm mb-1 font-bold">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="0123456789"
                className={`w-full border ${
                  validationErrors.contact ? "border-red-500" : "border-green-500"
                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {validationErrors.contact && (
                <p className="text-red-500 text-sm">{validationErrors.contact}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm mb-1 font-bold">
                Task Completed by (Date & Time)
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className={`w-full border ${
                  validationErrors.deadline
                    ? "border-red-500"
                    : "border-green-500"
                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {validationErrors.deadline && (
                <p className="text-red-500 text-sm">{validationErrors.deadline}</p>
              )}
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm mb-1 font-bold">
                Upload Image (Max 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full border ${
                  validationErrors.images ? "border-red-500" : "border-green-500"
                } rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {validationErrors.images && (
                <p className="text-red-500 text-sm">{validationErrors.images}</p>
              )}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((file, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 rounded-md overflow-hidden border"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Task Fees */}
            <p className="text-center text-green-700 font-medium">
              Emergency Task Fees - Rs. 250/-
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-md font-medium hover:bg-green-800"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Payment Confirmation Modal (Single Modal) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPaymentModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold text-center mb-4">
              Payment Confirmation
            </h3>
            <div className="flex justify-center mb-4">
              {/* Replace with actual illustration path */}
              <img
                src={paymentConfirmationImage}
                alt="Payment"
                className="w-32"
              />
            </div>
            <p className="text-center mb-2">Date: {formattedDate}</p>
            <p className="text-center mb-2">Time: {formattedTime}</p>
            <p className="text-center mb-2">Amount: 0 INR</p>
            <p className="text-center mb-2">
              Platform Fees: {razorpayOrder ? razorpayOrder.amount : 200} INR
            </p>
            <hr className="my-2" />
            <p className="text-center font-bold mb-4">
              Total: {razorpayOrder ? razorpayOrder.amount : 200} INR
            </p>
            <div className="flex justify-around">
              <button
                onClick={handlePayConfirm}
                className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800"
              >
                Pay
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] my-10">
        <img
          src={Gardening}
          alt="Gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <Footer />
    </>
  );
};

export default Post;
