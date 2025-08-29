import React, { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import Header from "../../../component/Header";
import { useNavigate } from "react-router-dom";

const DirectHiring = () => {
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />

      <div className="w-full max-w-6xl mx-auto flex justify-start mt-4 px-4">
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
        >
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">
            Direct hiring
          </h2>

          {/* Title */}
          <label className="block">
            <span className="text-sm font-medium text-gray-600">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title of work"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">
              Platform Fees
            </span>
            <input
              type="text"
              value="Rs 200.00"
              disabled
              className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-2 text-base text-gray-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">
              Description
            </span>
            <textarea
              rows={4}
              value="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
              disabled
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600 flex items-center justify-between">
              Address
              <span className="text-[#228B22] cursor-pointer">Edit</span>
            </span>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Full Address"
                className="mt-1 block w-full rounded-lg border border-gray-300 pr-9 pl-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
              />
              <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">
              Add deadline and time
            </span>
            <div className="relative">
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
              />
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </label>

          <div>
            <span className="text-sm font-medium text-gray-600">
              Upload (5 Max photos)
            </span>

            <div className="border border-gray-300 rounded-lg p-6 text-center mb-4 bg-gray-50">
              <label className="cursor-pointer   text-[#228B22] text-sm font-medium">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden "
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-4 justify-start">
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
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
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
            className="w-full bg-[#228B22] text-white font-semibold py-3 rounded-lg text-lg hover:bg-[#228B22] transition-all shadow-md"
          >
            Hire
          </button>
        </form>
      </div>
    </>
  );
};

export default DirectHiring;
