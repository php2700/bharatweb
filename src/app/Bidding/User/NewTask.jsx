


import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Calender from '../../../assets/bidding/calender.png'
import { useState } from "react";
import banner from "../../../assets/profile/banner.png";
import Arrow from "../../../assets/profile/arrow_back.svg";


export default function BiddingNewTask() {
 const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategory: [],
    location: "",
    googleAddress: "",
    description: "",
    cost: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
 

  return (
     <>
      <Header />

      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" />
          Back
        </Link>
      </div>
<div className="flex justify-center items-center min-h-screen bg-white px-4">
       
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-[72rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] xl:pb-[147px] lg:pb-[147px]">
          {/* Title */}
    
  <form
    onSubmit={handleSubmit}
    className="bg-wite w-full max-w-[51rem] rounded-2xl p-8 space-y-6 lg:ml-[153px]"
  >
    <h2 className="text-[30px] font-[700] text-center mb-6 text-[191A1D]">
      Post New Task
    </h2>

    {/* Title */}
    <div className="mt-[50px]">
      <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
        Title
      </label>
      <input
        type="text"
        name="title"
        placeholder="Enter title of work"
        value={formData.title}
        onChange={handleChange}
        className="w-full border-2 border-[#777777] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Category */}
  <div className="relative">
  <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
    Category
  </label>
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="appearance-none w-full border-2 border-[#777777] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">Select a category</option>
    <option value="plumbing">Plumbing</option>
    <option value="cleaning">Cleaning</option>
  </select>

  {/* Custom Dropdown Icon */}
   <div className="pointer-events-none absolute right-3 top-[45%]  text-gray-600 mt-[10px]">
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>

    {/* Sub Category */}
 <div className="relative">
  <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
    Sub Category (Multiple selection)
  </label>
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="appearance-none w-full border-2 border-[#777777] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">Select a category</option>
    <option value="plumbing">Plumbing</option>
    <option value="cleaning">Cleaning</option>
  </select>

  {/* Custom Dropdown Icon */}
   <div className="pointer-events-none absolute right-3 top-[45%]  text-gray-600 mt-[10px]">
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>


    {/* Location */}
    <div>
      <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
        Location
      </label>
      <input
        type="text"
        name="location"
        placeholder="Enter Full Address"
        value={formData.location}
        onChange={handleChange}
        className="w-full border-2 border-[#777777] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Google Address */}
    <div>
      <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
        Google Address
      </label>
      <input
        type="text"
        name="googleAddress"
        placeholder="Enter Location"
        value={formData.googleAddress}
        onChange={handleChange}
        className="w-full border-2 border-[#777777] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Description */}
    <div>
      <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
        Description
      </label>
      <textarea
        name="description"
        placeholder="Describe your task"
        value={formData.description}
        onChange={handleChange}
        className="w-full border-2 border-[#777777] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        rows="3"
      />
    </div>

    {/* Cost */}
    <div>
      <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
        Cost
      </label>
      <input
        type="number"
        name="cost"
        placeholder="Enter cost in INR"
        value={formData.cost}
        onChange={handleChange}
        className="w-full border-2 border-[#777777] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    {/* Deadline */}
   <div>
  <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
    Add Deadline
  </label>
  <div className="relative">
    {/* Calendar Icon */}
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
     <img src={Calender} alt="" className="w-5 h-5"/>
    </div>

    {/* Date Input */}
    <input
      type="input"
      name="deadline"
      value={formData.deadline}
      onChange={handleChange}
      className="w-full border-2 border-[#777777] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
</div>


    {/* Upload */}
    <div className="border-2 border-[#777777] rounded-xl p-6 text-center">
      <label className="cursor-pointer flex flex-col items-center">
        <svg
          className="w-10 h-10 text-[#228B22] mb-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3"
          />
        </svg>
        <span className="text-[#000000] font-medium">Upload Work Photo</span>
        <input type="file" className="hidden" />
       <button className="p-[2px] border border-[#228B22] rounded-[10px] w-[93px] mt-[13px] text-[#228B22] font-[500]">Upload</button>
      </label>
      
    </div>
     <span className="text-xs text-[#008000] font-[500] ">
          Upload (.png, .jpg, .jpeg) Files (300px * 300px)
        </span>

    {/* Submit */}
    <br />
    <button
      type="submit"
        className="w-80 bg-[#228B22] hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md mt-[34px]"
    >
      Post Task
    </button>
  </form>
        </div>
      </div>

      

      {/* Banner */}
      <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-15">
        <img
          src={banner}
          alt="Gardening"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
        />
      </div>

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
