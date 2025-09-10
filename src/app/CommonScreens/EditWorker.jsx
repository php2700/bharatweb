import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import image from "../../assets/addworker/worker-profile.png";
import editicon from "../../assets/addworker/edit-icon.svg";
import flag from "../../assets/addworker/flag.png";
import downarrow from "../../assets/addworker/downarrow.png";
import dobIcon from "../../assets/addworker/icon.png";
import banner from "../../assets/profile/banner.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditWorker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [image, setImage] = useState(null); // Renamed from `images` for consistency
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    aadharNumber: "",
    dateOfBirth: "",
    address: "",
    aadharImage: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bharat_token");
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
            address: worker.address || "",
            aadharImage: worker.aadharImage || null,
          });

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
  }, [id, navigate]);

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
    if (!formData.name.trim()) newErrors.name = "Name is required";
    const phoneNumber = formData.phone.replace(/\D/g, "");
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      newErrors.phone = "Enter a valid 10-digit phone number starting with 6-9";
    }
    const aadharNumber = formData.aadharNumber.replace(/\D/g, "");
    if (!formData.aadharNumber) {
      newErrors.aadharNumber = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(aadharNumber)) {
      newErrors.aadharNumber = "Aadhar must be 12 digits";
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.aadharImage) newErrors.aadharImage = "Aadhaar image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("bharat_token");
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
      bodyData.append("address", formData.address);
      if (image instanceof File) bodyData.append("image", image);
      if (formData.aadharImage instanceof File) bodyData.append("aadharImage", formData.aadharImage);

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

            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={image instanceof File ? URL.createObjectURL(image) : image || image}
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
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="flex-1 h-[55px] px-3 text-base placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

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

        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="mt-[50px]">
          <Footer />
        </div>
      </div>
    </>
  );
}