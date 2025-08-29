


import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Calender from '../../../assets/bidding/Calender.png'
import { useState } from "react";
import Gardening from "../../../assets/profile/profile image.png";
import Arrow from "../../../assets/profile/arrow_back.svg";
const tasks = [
  {
    id: "#we2323",
    title: "Make a chair",
    price: "₹1,500",
    date: "21/02/25",
    desc: "Lorem ipsum dolor ...",
    location: "Indore M.P",
    status: "pending",
  },
  {
    id: "#we2323",
    title: "Make a chair",
    price: "₹1,500",
    date: "21/02/25",
    desc: "Lorem ipsum dolor ...",
    location: "Indore M.P",
    status: "cancelled",
  },
  {
    id: "#we2323",
    title: "Make a chair",
    price: "₹1,500",
    date: "21/02/25",
    desc: "Lorem ipsum dolor ...",
    location: "Indore M.P",
    status: "accepted",
  },
  {
    id: "#we2323",
    title: "Make a chair",
    price: "₹1,500",
    date: "21/02/25",
    desc: "Lorem ipsum dolor ...",
    location: "Indore M.P",
    status: "completed",
  },
  {
    id: "#we2323",
    title: "Make a chair",
    price: "₹1,500",
    date: "21/02/25",
    desc: "Lorem ipsum dolor ...",
    location: "Indore M.P",
    status: "cancelled",
  },
];

const statusColors = {
  pending: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-600",
  accepted: "bg-green-100 text-green-600",
  completed: "bg-green-200 text-green-700",
};

export default function MyHireBidding() {
    const [activeTab, setActiveTab] = useState("Bidding Task");
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
<div className="bg-white min-h-screen px-4 py-6">
  <div className="max-w-5xl mx-auto">
    {/* Page Title */}
    <h1 className="text-xl font-semibold mb-4">My Hire</h1>

    {/* Tabs */}
    <div className="flex gap-3 mb-4 lg:gap-57 bg-[#F6F6F6]">
      {["Bidding Task", "Hire", "Emergency Tasks"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-1 rounded-full border transition w-[185px] h-[42px] ${
            activeTab === tab
              ? "bg-[#228B22] text-white"
              : "bg-white text-[#4CA04C] border-[#228B22] font-[600]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Search Bar */}
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search for services"
        className="w-full border rounded-full px-4 py-2 outline-none shadow-sm"
      />
    </div>

    {/* Task Cards */}
    <div className="space-y-5">
      {tasks.map((task, idx) => (
        <div
          key={idx}
          className="flex bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
        >
          {/* Image */}
          <img
            src="https://img.freepik.com/premium-photo/young-carpenter-working-workshop-wood-working-skill_31965-68566.jpg"
            alt={task.title}
            className="w-40 h-32 object-cover"
          />

          {/* Details */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <p className="text-[21px] text-[#191A1D] font-[600]">{task.id}</p>
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <p className="font-bold">{task.price}</p>
              <p className="text-sm text-gray-500">Date: {task.date}</p>
              <p className="text-sm text-gray-500">{task.desc}</p>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                {task.location}
              </span>
            </div>

            {/* Status + Button */}
            <div className="flex justify-between items-center mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[task.status]
                }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              <button className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


      

      {/* Banner */}
      <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-15">
        <img
          src={Gardening}
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
