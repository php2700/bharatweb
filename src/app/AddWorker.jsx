import { useState } from "react";
import Header from "../component/Header";
import Footer from "../component/footer";

// Placeholder image imports (replace with actual paths in your project)
import image from "../assets/worker-profile.jpg";
import editicon from "../assets/edit-icon.svg";
import flag from "../assets/india-flag.png";
import downarrow from "../assets/down-arrow.svg";
import dob from "../assets/calendar-icon.svg";
import banner from "../assets/gardening-banner.jpg";

export default function AddWorkerDetails() {
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    aadharNumber: "",
    dateOfBirth: "",
    address: "",
    aadharImage: null,
  });

  // Input change handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // 👇 API call example
    // fetch("/api/add-worker", { method: "POST", body: JSON.stringify(formData) })
  };

  return (
    <>
      <Header />
      <div className="min-h-screen px-5 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-[83rem] xl:max-w-[60rem] shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-3 sm:p-4 space-y-4 lg:ml-[290px]">
          <div className="max-w-sm mx-auto sm:max-w-md lg:max-w-[36rem]">
            {/* Header */}
            <div className="flex items-center mb-10">
              <h1 className="text-[27px] font-[700] text-[#191A1D] flex-1 text-center mr-8">
                Add Worker Details
              </h1>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={image}
                      alt="Worker profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute bottom-7 right-2 w-7 h-7 bg-[#228B22] rounded-full flex items-center justify-center">
                  <img src={editicon} alt="Edit profile" className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
              />

              {/* Phone Number */}
              <div className="flex items-center h-[55px] w-full border border-gray-300 rounded-[19px] bg-white px-3 focus-within:border-gray-400">
                {/* Left: Flag + Country Code */}
                <div className="flex items-center gap-2">
                  <img
                    src={flag}
                    alt="India Flag"
                    className="w-5 h-5 object-cover rounded-sm"
                  />
                  <span className="text-[#000000] font-[700]">+91</span>
                  <img src={downarrow} alt="Dropdown arrow" className="w-4 h-4" />
                </div>

                {/* Middle: Phone Input */}
                <input
                  type="tel"
                  placeholder="9822515445"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="flex-1 h-[55px] px-3 text-base placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              {/* Aadhar Number */}
              <input
                type="text"
                placeholder="Aadhar Number"
                value={formData.aadharNumber}
                onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
              />

              {/* Date of Birth */}
              <div className="relative">
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] pr-12 w-full px-3"
                />
                <img
                  src={dob}
                  alt="Calendar icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                />
              </div>

              {/* Address */}
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
              />

              {/* Aadhaar Image Upload */}
              <div className="w-full">
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
                  {formData.aadharImage ? (
                    <span className="text-green-600 font-medium">
                      {formData.aadharImage.name}
                    </span>
                  ) : (
                    "Upload your Aadhaar Image"
                  )}
                </label>
                {formData.aadharImage && (
                  <img
                    src={URL.createObjectURL(formData.aadharImage)}
                    alt="Aadhaar Preview"
                    className="mt-3 w-40 h-40 object-cover rounded-lg border"
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full h-[55px] bg-[#228B22] hover:bg-green-600 text-white text-base font-medium rounded-[12.55px] shadow-sm"
                >
                  Add
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