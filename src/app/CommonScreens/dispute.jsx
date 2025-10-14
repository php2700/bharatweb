import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Arrow from "../../assets/profile/arrow_back.svg";
import axios from "axios";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dispute() {
  const { orderId, type } = useParams();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const navigate = useNavigate();

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
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

      if (response.data && Array.isArray(response.data.images) && response.data.images.length > 0) {
        setBannerImages(response.data.images);
      } else {
        setBannerImages([]);
        setBannerError("No banners available");
      }
    } catch (err) {
      console.error("Error fetching banner images:", err.message);
      setBannerError(err.response?.data?.message || err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      alert("You can upload a maximum of 5 images");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  // Remove selected image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!requirement.trim()) {
      newErrors.requirement = "Requirement is required";
    }

    // if (images.length === 0) {
    //   newErrors.images = "Please upload at least one image";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("bharat_token");

      const formData = new FormData();
      formData.append("order_id", orderId);
      formData.append("flow_type", type);
      formData.append("amount", Number(amount));
      formData.append("description", description);
      formData.append("requirement", requirement);

      // Append all selected images
      images.forEach((img) => formData.append("images", img));

      // Debug: log what is being sent
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        `${BASE_URL}/dispute/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Dispute submitted successfully");
      navigate(-1);
      // Reset form
      setAmount("");
      setDescription("");
      setRequirement("");
      setImages([]);
    } catch (error) {
      console.error(
        "Error submitting dispute:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Failed to submit dispute ❌\n" +
          JSON.stringify(error.response?.data || error.message)
      );
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4 mt-25">
        <Link
          to={-1}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Dispute</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enter Amount */}
          <div>
            <label className="block text-base font-medium mb-2">
              Enter Amount
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-2 border-[#c1b9b9] rounded-lg px-3 py-2"
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-medium mb-2">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-[#c1b9b9] rounded-lg px-3 py-2"
              placeholder="Enter description"
            ></textarea>
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Requirement */}
          <div>
            <label className="block text-base font-medium mb-2">
              Requirement
            </label>
            <textarea
              rows="3"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="w-full border-2 border-[#c1b9b9] rounded-lg px-3 py-2"
              placeholder="Enter requirement"
            ></textarea>
            {errors.requirement && (
              <p className="text-red-600 text-sm mt-1">{errors.requirement}</p>
            )}
          </div>

          {/* Upload */}
          <div>
            <label className="block text-base font-medium mb-2">Upload</label>
            <label className="w-full flex justify-center items-center border-2 border-[#c1b9b9] rounded-lg py-6 cursor-pointer text-[#228B22] hover:bg-green-50">
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              {images.length > 0
                ? `${images.length} image(s) selected`
                : "Upload Images (Max 5)"}
            </label>
            {/* {errors.images && (
              <p className="text-red-600 text-sm mt-1">{errors.images}</p>
            )} */}

            {/* Show preview of selected images with remove button */}
            <div className="flex flex-wrap mt-3 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 border rounded overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#228B22] text-white px-17 py-3 rounded-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Dispute"}
            </button>
          </div>
        </form>
      </div>

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
      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}
