
import { useState, useEffect } from "react";
import { Link ,useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // axios import for updateAddress
import { useSelector } from "react-redux"; // <<-- 1. useSelector import

import Header from "../../component/Header";
import Footer from "../../component/footer";
import editicon from "../../assets/addworker/edit-icon.svg";
import flag from "../../assets/addworker/flag.png";
import downarrow from "../../assets/addworker/downarrow.png";
import dob from "../../assets/addworker/icon.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import defaultProfileImage from "../../assets/addworker/defaultDP.png"; 
import Arrow from "../../assets/profile/arrow_back.svg";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditWorker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user); // <<-- 2. Redux से profile data को निकालें
  const token = localStorage.getItem("bharat_token"); // Token outside to be accessible by updateAddress

  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    aadharNumber: "",
    dateOfBirth: "",
    address: "", // Initialized empty, will be set from profile or fetched worker data
    aadharImage: null,
  });
  const [address, setAddress] = useState(""); // <<-- 3. New state for address
  const [showOptions, setShowOptions] = useState(false); // State for address dropdown

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 99, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setBannerImages(data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = data.message || `HTTP error ${res.status}: ${res.statusText}`;
        setBannerError(errorMessage);
      }
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();

    if (!token) {
      toast.error("You are not logged in. Please log in to continue.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchWorker = async () => {
      try {
        const res = await fetch(`${BASE_URL}/worker/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const worker = data.worker;
          const dobValue = worker.dob ? new Date(worker.dob).toISOString().split("T")[0] : "";

          setFormData({
            name: worker.name || "",
            countryCode: "+91",
            phone: worker.phone || "",
            aadharNumber: worker.aadharNumber || "",
            dateOfBirth: dobValue,
            address: worker.address || "", // Will be overwritten by 'address' state if Redux profile exists
            aadharImage: worker.aadharImage || null,
          });

          // Set the main address state from worker data or Redux profile
          const initialAddress = worker.address || profile?.location?.address || "";
          setAddress(initialAddress); // <<-- 4. Set address from fetched worker data or Redux profile

          if (worker.image) setImage(worker.image);
        } else {
          toast.error(data.message || "Failed to fetch worker details");
          if (data.message.includes("token")) {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Fetch worker error:", err);
        toast.error("Error fetching worker details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id, navigate, profile, token]); // Add profile and token to dependencies

  const handleInputChange = (field, value) => {
    let processedValue = value;
    if (field === "aadharImage") {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (value && !validTypes.includes(value.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, JPG)");
        return;
      }
      if (value && value.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, JPG)");
        return;
      }
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImage(file);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name must contain only letters";
    }
    const phoneNumber = formData.phone.trim().replace(/\D/g, "");

    if (!phoneNumber) {
      newErrors.phone = "Phone number is required";
    } else if (phoneNumber.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    } else if (!/^[6-9]/.test(phoneNumber)) {
      newErrors.phone = "Phone number must start with digits 6–9";
    }
   const aadharNumber = formData.aadharNumber.trim();

if (!aadharNumber) {
  newErrors.aadharNumber = "Aadhar number is required";
} else if (!/^\d{12}$/.test(aadharNumber)) {
  newErrors.aadharNumber = "Aadhar number must be exactly 12 digits";
}
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!address.trim()) newErrors.address = "Address is required"; // <<-- 8. Use 'address' state for validation
    if (!formData.aadharImage) newErrors.aadharImage = "Aadhaar image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (!token) {
        toast.error("You are not logged in. Please log in to continue.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const bodyData = new FormData();
      bodyData.append("name", formData.name);
      bodyData.append("phone", formData.phone);
      bodyData.append("aadharNumber", formData.aadharNumber);
      bodyData.append("dob", formData.dateOfBirth);
      bodyData.append("address", address); // <<-- 7. Use the 'address' state for submission
      if (image instanceof File) bodyData.append("image", image);
      if (formData.aadharImage instanceof File) bodyData.append("aadharImage", formData.aadharImage);
  // bodyData.append("verifyStatus", "pending");

      const res = await fetch(`${BASE_URL}/worker/edit/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: bodyData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Worker updated successfully");
        setTimeout(() => navigate("/workerlist"), 2000);
      } else {
        toast.error(data.message || "Failed to update worker");
        if (data.message.includes("token")) {
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Update worker error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };



  

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

  const updateAddress = async (location) => {
    try {
      let obj = {
        latitude: location?.latitude,
        longitude: location?.longitude,
        address: location?.address,
      };
      await axios.put(`${BASE_URL}/user/updateLocation`, obj, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log(error, "Error updating address");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen px-5 py-6 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="w-full max-w-[83rem] xl:max-w-[60rem] shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-3 sm:p-20 space-y-4 lg:ml-[290px]">
                <div className="flex items-center mb-6">
            <Link
              to="/workerlist"
              className="flex items-center text-[#008000] hover:text-green-800 font-semibold text-xl"
              aria-label="Go back to previous page"
            >
              <img src={Arrow} className="w-7 h-7 mr-2" alt="Back arrow icon" />
              Back
            </Link>
          </div>
          <div className="max-w-sm mx-auto sm:max-w-md lg:max-w-[36rem]">
            <div className="flex items-center mb-10">
              <h1 className="text-[27px] font-[700] text-[#191A1D] flex-1 text-center mr-8">
                Edit Worker Details
              </h1>
            </div>

            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={image instanceof File ? URL.createObjectURL(image) : image || defaultProfileImage} // <<-- 9. image का नाम इस्तेमाल करें
                      alt="Worker profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="profileUpload"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="profileUpload"
                  className="absolute bottom-7 right-2 w-9 h-9 bg-[#228B22] rounded-full flex items-center justify-center cursor-pointer"
                >
                  <img src={editicon} alt="Edit profile" className="w-5 h-5" />
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <div className="flex items-center h-[55px] w-full border border-gray-300 rounded-[19px] bg-white px-3 focus-within:border-gray-400">
                  <div className="flex items-center gap-2">
                    <img src={flag} alt="India Flag" className="w-5 h-5 object-cover rounded-sm" />
                    <span className="text-[#000000] font-[700]">{formData.countryCode}</span>
                    <img src={downarrow} alt="Dropdown arrow" className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="9822515445"
                    value={formData.phone}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "");
                      handleInputChange("phone", onlyDigits);
                    }}
                    maxLength="10"
                    className="flex-1 h-[55px] px-3 text-base placeholder:text-gray-400 focus:outline-none"
                    aria-label="Phone number"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
<div>
  <input
    type="text"
    placeholder="Aadhar Number"
    value={formData.aadharNumber}
    onChange={(e) =>
      handleInputChange(
        "aadharNumber",
        e.target.value.replace(/\D/g, "").slice(0, 12)
      )
    }
    className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
    aria-label="Aadhaar number"
  />
  {errors.aadharNumber && (
    <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>
  )}
</div>


              <div className="relative">
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="h-[55px] text-base border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] pr-12 w-full px-3"
                  aria-label="Date of birth"
                  min={minDate}
                  max={maxDate}
                />
                <img src={dob} alt="Calendar icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              {/* <<-- 5. Address Input Field Changes -->> */}
              <label className="block">
                <span className="text-sm font-medium text-gray-600">Address</span>
                <div className="relative">
                  <input
                    id="address-input"
                    type="text"
                    readOnly // Make it read-only
                    value={address} // <<-- 5. Use the 'address' state here
                    placeholder="Enter or select address"
                    className="mt-1 block w-full rounded-lg border border-gray-300 pr-9 pl-4 py-2 text-base"
                    onClick={() => setShowOptions(!showOptions)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOptions(!showOptions)}
                    className="absolute right-3 top-2 px-2 py-1 text-sm rounded-lg border bg-gray-100"
                  >
                    {showOptions ? "▲" : "▼"}
                  </button>
                  {showOptions && (
                    <div className="absolute top-full left-0 mt-2 w-full rounded-lg border bg-white shadow-lg p-3 z-50">
                      {profile?.full_address?.length > 0 ? (
                        profile.full_address.map((loc, index) => (
                          <label
                            key={index} // Use index if loc.address might not be unique
                            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                          >
                            <input
                              type="radio"
                              name="address"
                              value={loc.address}
                              checked={address === loc.address}
                              onChange={() => { // <<-- 6. Update address state on selection
                                setAddress(loc.address);
                                setFormData(prev => ({ ...prev, address: loc.address })); // Also update formData
                                setShowOptions(false);
                                updateAddress(loc);
                              }}
                            />
                            <div className="flex flex-col bg-gray-50 rounded-lg p-2 w-full">
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                <div>
                                  <span className="block font-semibold text-xs">Title</span>
                                  <span className="text-[12px] text-gray-800">{loc.title}</span>
                                </div>
                                <div>
                                  <span className="block font-semibold text-xs">House No</span>
                                  <span className="text-gray-700 text-[12px]">{loc.houseno ? loc?.houseno : "N/A"}</span>
                                </div>
                                <div>
                                  <span className="block font-semibold text-xs">Area</span>
                                  <span className="text-gray-700 text-[12px]">{loc.area ? loc.area : "N/A"}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="block font-semibold text-xs">Full Address</span>
                                  <span className="text-gray-600 text-[12px]">{loc.address}</span>
                                </div>
                              </div>
                            </div>
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No saved addresses found.</p>
                      )}
                    </div>
                  )}
                </div>
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </label>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange("aadharImage", e.target.files[0])}
                  className="hidden"
                  id="aadharUpload"
                />
                <label
                  htmlFor="aadharUpload"
                  className="flex items-center justify-start h-[55px] cursor-pointer text-gray-500 border border-gray-300 bg-white rounded-[19px] px-3 w-full"
                >
                  {formData.aadharImage instanceof File ? (
                    <span className="text-green-600 font-medium">{formData.aadharImage.name}</span>
                  ) : formData.aadharImage ? (
                    <span className="text-green-600 font-medium">Aadhaar Image</span>
                  ) : (
                    "Upload your Aadhaar Image"
                  )}
                </label>
                {errors.aadharImage && <p className="text-red-500 text-sm mt-1">{errors.aadharImage}</p>}
                {formData.aadharImage && (
                  <img
                    src={formData.aadharImage instanceof File ? URL.createObjectURL(formData.aadharImage) : formData.aadharImage}
                    alt="Aadhaar Preview"
                    className="mt-3 w-40 h-40 object-cover rounded-lg border"
                  />
                )}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full h-[55px] bg-[#228B22] hover:bg-green-600 text-white text-base font-medium rounded-[12.55px] shadow-sm"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
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
                    src={banner || "/src/assets/profile/default.png"}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/profile/default.png";
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

        <div className="mt-[50px]">
          <Footer />
        </div>
      </div>
    </>
  );
}