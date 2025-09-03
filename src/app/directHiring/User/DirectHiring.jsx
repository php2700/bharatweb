import React, { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import Header from "../../../component/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DirectHiring = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState();

  const handleImageUpload = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      setError("You can only upload up to 5 images.");
      return;
    }
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errors = {};
    if (!title) {
      errors["title"] = "title is required";
    }
    if (!address) {
      errors["address"] = "address is required";
    }
    if (!description) {
      errors["description"] = "description is required";
    }
    if (!deadline) {
      errors["deadline"] = "deadline is required";
    }
    if (!images?.length) {
      errors["images"] = "images is required";
    }

    return Object.keys(errors)?.length == 0;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validate()) {
        setError("Please fill in all required fields.");
        return;
      }
      if (!id) throw new Error("something went wrong");

      const formData = new FormData();
      formData.append("first_provider_id", id);
      formData.append("title", title);
      formData.append("address", address);
      formData.append("description", description);
      formData.append("deadline", deadline);
      formData.append("image", images);

      const res = await axios.post(`${BASE_URL}/direct-order/create`, formData);
      console.log(res);
    } catch (error) {
      setError(`error`);
    }
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
          {error && <p className="text-red-500 text-center">{error}</p>}

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
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
