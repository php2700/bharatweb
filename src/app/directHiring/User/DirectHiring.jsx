import React, { useState } from "react";
import { Calendar, MapPin } from "lucide-react"; // optional icons
import Header from "../../../component/Header";
import { useNavigate } from "react-router-dom";

const DirectHiring = () => {
  const navigate=useNavigate()
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, address, deadline, images });
    alert("Form submitted ✅");
  };

  const handleBack=()=>{
    navigate('/homeuser')
  }

  return (
    <>
      <Header />
      <div className="w-full max-w-6xl mx-auto flex justify-start mt-4">
        <button
          onClick={() => {
            handleBack;
          }}
          className="text-green-600 text-sm hover:underline"
        >
          &lt; Back
        </button>
      </div>
      <div className="min-h-screen flex justify-center  py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white shadow-2xl rounded-lg p-6"
        >
          <h2 className="text-center text-xl font-semibold mb-6">
            Direct hiring
          </h2>

          <label className="block mb-4">
            <span className="text-sm text-gray-700">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title of work"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:ring-green-600"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm text-gray-700">Platform Fees</span>
            <input
              type="text"
              value="Rs 200.00"
              disabled
              className="mt-1 block w-full rounded-md bg-gray-100 border border-gray-300 px-3 py-2 text-sm text-gray-600"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm text-gray-700">Description</span>
            <textarea
              rows={3}
              value="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm text-gray-700 flex items-center justify-between">
              Address{" "}
              <span className="text-green-600 cursor-pointer">Edit</span>
            </span>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Full Address"
                className="mt-1 block w-full rounded-md border border-gray-300 pr-9 pl-3 py-2 text-sm focus:border-green-600 focus:ring-green-600"
              />
              <MapPin className="absolute right-2 top-3 h-4 w-4 text-gray-400" />
            </div>
          </label>

          <label className="block mb-4">
            <span className="text-sm text-gray-700">Add deadline and time</span>
            <div className="relative">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-green-600 focus:ring-green-600"
              />
              <Calendar className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
            </div>
          </label>

          <label className="block mb-2">
            <span className="text-sm text-gray-700">Upload (5 Max photos)</span>
          </label>
          <div className="border rounded-md p-4 text-center mb-4">
            <label className="cursor-pointer text-green-600 text-sm font-medium">
              Upload Image
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <div className="flex gap-3 flex-wrap mt-3 justify-center">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
          >
            Hire
          </button>
        </form>
      </div>
    </>
  );
};

export default DirectHiring;
