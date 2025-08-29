import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Gardening from "../../../assets/profile/profile image.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("bharat_token");
const Post = () => {
  const navigate = useNavigate();
   useEffect(()=>{
    const response = axios.get(`${BASE_URL}/work-category`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
   }, [])
  return (
    <>
      <Header />
      <div className="w-full max-w-[1000px] mx-auto mt-8 px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-700 mb-4 hover:underline"
        >
          ← Back
        </button>

        {/* Card container */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            Post Emergency Task
          </h2>

          <form className="space-y-4">
            {/* Work Category */}
            <div>
              <label className="block text-sm mb-1 font-bold">Work Category</label>
              <select className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Select category</option>
              </select>
            </div>

            {/* SubCategories */}
            <div>
              <label className="block text-sm mb-1 font-bold">SubCategories</label>
              <select className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Select Multiple/Single SubCategories</option>
              </select>
            </div>

            {/* Google Address */}
            <div>
              <label className="block text-sm mb-1 font-bold">Google Address (GPS)</label>
              <input
                type="text"
                placeholder="Abc gali 145 banglow no. indore"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-sm mb-1 font-bold">Detailed Address (Landmark)</label>
              <input
                type="text"
                placeholder="Abc gali 145 banglow no. indore"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm mb-1 font-bold">Contact</label>
              <input
                type="text"
                placeholder="0123456789"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm mb-1 font-bold">Task Completed by (Date & Time)</label>
              <input
                type="datetime-local"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm mb-1 font-bold">Upload Image</label>
              <input
                type="file"
                multiple
                className="w-full border rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {/* Preview placeholder */}
              <div className="flex gap-2 mt-2">
                <div className="w-16 h-16 rounded-md overflow-hidden border">
                  <img
                    src={Gardening}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-16 h-16 rounded-md overflow-hidden border">
                  <img
                    src={Gardening}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Task Fees */}
            <p className="text-center text-green-700 font-medium">
              Emergency Task Fees - Rs. 250/-
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

      {/* Bottom background image */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] my-10">
        <img
          src={Gardening}
          alt="Gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <Footer />
    </>
  );
};

export default Post;
