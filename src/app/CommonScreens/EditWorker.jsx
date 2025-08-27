// src/pages/EditWorker.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/footer";
import image from "../assets/addworker/worker-profile.png";
import editicon from "../assets/addworker/edit-icon.svg";
import flag from "../assets/addworker/flag.png";
import downarrow from "../assets/addworker/downarrow.png";
import dobIcon from "../assets/addworker/icon.png";
import banner from "../assets/Details/Gardening.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditWorker() {
  const { id } = useParams(); // URL se id
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [images, setImage] = useState(null); // Profile image (File or URL)
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    aadharNumber: "",
    dateOfBirth: "",
    address: "",
    aadharImage: null, // File or URL
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Input change handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // Aadhaar image change
  const handleAadhaarChange = (e) => {
    const file = e.target.files[0];
    if (file) handleInputChange("aadharImage", file);
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.aadharNumber) newErrors.aadharNumber = "Aadhar number is required";
    else if (!/^\d{12}$/.test(formData.aadharNumber))
      newErrors.aadharNumber = "Aadhar must be 12 digits";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.aadharImage) newErrors.aadharImage = "Aadhaar image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch worker details
  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/worker/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
            console.log(data.success);
        if (data.success) {
          const worker = data.worker;
          const dobValue = worker.dob ? new Date(worker.dob).toISOString().split("T")[0] : "";

          setFormData({
            name: worker.name || "",
            countryCode: "+91",
            phone: worker.phone || "",
            aadharNumber: worker.aadharNumber || "",
            dateOfBirth: dobValue,
            address: worker.address || "",
            aadharImage: worker.aadharImage || null, // URL from API
          });

          if (worker.image) setImage(worker.image); // profile image URL
        } else {
          toast.error("Failed to fetch worker details");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching worker details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id]);

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const bodyData = new FormData();
      bodyData.append("name", formData.name);
      bodyData.append("phone", formData.phone);
      bodyData.append("aadharNumber", formData.aadharNumber);
      bodyData.append("dob", formData.dateOfBirth);
      bodyData.append("address", formData.address);

      if (images instanceof File) bodyData.append("image", images);
      if (formData.aadharImage instanceof File) bodyData.append("aadharImage", formData.aadharImage);

      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/worker/edit/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: bodyData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Worker updated successfully");
        setTimeout(() => navigate("/workerlist"), 2000);
      } else {
        toast.error(data.message || "Failed to update worker");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
          <div className="max-w-sm mx-auto sm:max-w-md lg:max-w-[36rem]">
            <div className="flex items-center mb-10">
              <h1 className="text-[27px] font-[700] text-[#191A1D] flex-1 text-center mr-8">
                Edit Worker Details
              </h1>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={images instanceof File ? URL.createObjectURL(images) : images || image}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
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

              {/* Phone */}
              <div>
                <div className="flex items-center h-[55px] w-full border border-gray-300 rounded-[19px] bg-white px-3 focus-within:border-gray-400">
                  <div className="flex items-center gap-2">
                    <img src={flag} alt="India Flag" className="w-5 h-5 object-cover rounded-sm" />
                    <span className="text-[#000000] font-[700]">+91</span>
                    <img src={downarrow} alt="Dropdown arrow" className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="9822515445"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="flex-1 h-[55px] px-3 text-base placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Aadhaar Number */}
              <div>
                <input
                  type="text"
                  placeholder="Aadhar Number"
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                  className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
                />
                {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>}
              </div>

              {/* DOB */}
              <div className="relative">
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="h-[55px] text-base border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] pr-12 w-full px-3"
                />
                <img src={dobIcon} alt="Calendar icon" className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              {/* Address */}
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* Aadhaar Image */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAadhaarChange}
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
                    <span className="text-green-600 font-medium">432325525255.jpg</span>
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

              {/* Submit */}
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

        <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[412px] mt-15">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>

        <div className="mt-[50px]">
          <Footer />
        </div>
      </div>
    </>
  );
}
