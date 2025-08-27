import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Gardening from "../../../assets/profile/profile image.png";

export default function Dispute() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
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

    if (!image) {
      newErrors.image = "Please upload an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log({ amount, description, requirement, image });
      alert("Dispute submitted successfully ✅");
      // API call can go here
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
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
              className="w-full border rounded-lg px-3 py-2"
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
              className="w-full border rounded-lg px-3 py-2"
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
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter requirement"
            ></textarea>
            {errors.requirement && (
              <p className="text-red-600 text-sm mt-1">{errors.requirement}</p>
            )}
          </div>

          {/* Upload */}
          <div>
            <label className="block text-base font-medium mb-2">Upload</label>
            <label className="w-full flex justify-center items-center border-2 border-[#777777] rounded-lg py-6 cursor-pointer text-[#228B22] hover:bg-green-50">
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
              {image ? image.name : "Upload Image"}
            </label>
            {errors.image && (
              <p className="text-red-600 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#228B22] text-white px-17 py-3 rounded-sm font-medium hover:bg-green-700"
            >
              Dispute
            </button>
          </div>
        </form>
      </div>
      {/* Gardening Image Section */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={Gardening}
          alt="Gardening illustration"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
        />
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}
