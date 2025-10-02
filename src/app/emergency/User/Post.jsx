import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Arrow from "../../../assets/profile/arrow_back.svg";
import axios from "axios";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import Select from "react-select";
import paymentConfirmationImage from "../../../assets/paymentconfirmation.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
	const [platformFee, setPlatformFee] = useState("");
  const [formData, setFormData] = useState({
    google_address: "",
    detailed_address: "",
    contact: "",
    deadline: "",
    images: [],
    coordinates: { lat: null, lng: null },
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);

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

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Banner API response:", response.data); // Debug response

      if (response.data?.success) {
        if (Array.isArray(response.data.images) && response.data.images.length > 0) {
          setBannerImages(response.data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = response.data?.message || "Failed to fetch banner images";
        console.error("Failed to fetch banner images:", errorMessage);
        setBannerError(errorMessage);
      }
    } catch (err) {
      console.error("Error fetching banner images:", err.message);
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);
 useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get-fee/emergency`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 🔹 Assuming response structure is { data: { fee: 200 } } or { fee: 200 }
        // Adjust the path based on your API response structure
        const fee = res.data.data?.fee  // Fallback to 200 if not found
        setPlatformFee(fee);
      } catch (error) {
        console.error("Error fetching platform fee:", error);
        setPlatformFee(200); // Fallback to default value
      }
    };

    fetchPlatformFee();
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
            `${BASE_URL}/emergency/subcategories/${selectedCategory}`,
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
      setError(
        "Failed to submit task: " + (err.response?.data?.message || err.message)
      );
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
      key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
      amount: amount,
      currency: "INR",
      name: "Your Company Name",
      description: "Emergency Task Platform Fee",
      order_id: razorpayOrderId,
      handler: async (response) => {
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
            navigate(`/user/work-list/Emergency Tasks`);
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
      setError(
        "Payment failed. Please try again: " + response.error.description
      );
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

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
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
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
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
              <label className="block text-sm mb-1 font-bold">
                Work Category
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className={`w-full border ${
                  validationErrors.category_id
                    ? "border-red-500"
                    : "border-green-500"
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
                <p className="text-red-500 text-sm">
                  {validationErrors.category_id}
                </p>
              )}
            </div>

            {/* SubCategories */}
            <div>
              <label className="block text-sm mb-1 font-bold">
                SubCategories
              </label>
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
                  validationErrors.contact
                    ? "border-red-500"
                    : "border-green-500"
                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {validationErrors.contact && (
                <p className="text-red-500 text-sm">
                  {validationErrors.contact}
                </p>
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
                <p className="text-red-500 text-sm">
                  {validationErrors.deadline}
                </p>
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
                  validationErrors.images
                    ? "border-red-500"
                    : "border-gray-200 bg-gray-200"
                } rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {validationErrors.images && (
                <p className="text-red-500 text-sm">
                  {validationErrors.images}
                </p>
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
              Emergency Task Fees - Rs. {platformFee || 250}/-
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

      {/* Payment Confirmation Modal */}
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
                className="bg-[#008000] text-white py-2 px-4 rounded-md hover:bg-green-800"
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

      {/* Banner Slider */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        {bannerLoading ? (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            Loading banners...
          </p>
        ) : bannerError ? (
          <p className="absolute inset-0 flex items-center justify-center text-red-500">
            Error: {bannerError}
          </p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((banner, index) => (
              <div key={index}>
                <img
                  src={banner || "/src/assets/profile/default.png"} // Fallback image
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/profile/default.png"; // Fallback on image load error
                  }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            No banners available
          </p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Post;
