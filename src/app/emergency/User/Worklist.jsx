import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import banner from "../../../assets/profile/banner.png";
import Work from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Worklist() {
  const { task } = useParams();
  const [activeTab, setActiveTab] = useState();
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("bharat_token");

  useEffect(() => {
    if (!task) return;
    setActiveTab(task);
  }, [task]);

  useEffect(() => {
    if (!activeTab) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/emergency-order/getAllEmergencyOrdersByRole`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Map API response to the expected structure
        const mappedTasks = response.data.data.map((task) => ({
          id: task._id,
          project_id: task.project_id,
          image: task.image_urls?.[0] || Work, // Use first image or fallback
          name: task.category_id?.name || "Unnamed Task",
          date: new Date(task.createdAt).toLocaleDateString(), // Format date
          skills:
            task.sub_category_ids?.map((sub) => sub.name).join(", ") ||
            "No skills listed",
          price: task.service_payment?.amount
            ? `₹${task.service_payment.amount}`
            : "Price TBD",
          completiondate: task.deadline
            ? new Date(task.deadline).toLocaleDateString()
            : "No deadline",
          location: task.google_address || "Unknown Location",
        }));

        setTaskData(mappedTasks);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch ${activeTab}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeTab]);

  return (
    <>
      <Header />
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
      </div>

      {/* Top Banner */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={banner}
          alt="Gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Work Section */}
      <div className="container max-w-full mx-auto my-10">
        <div className="text-xl sm:text-2xl max-w-5xl font-bold mx-auto">
          My Work
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-[200px] bg-gray-100 p-2 mb-6">
          <button
            className={`px-9 py-1 rounded-full font-semibold ${
              activeTab === "My Bidding"
                ? "bg-[#228B22] text-white"
                : "text-[#228B22] border border-[#228b22]"
            }`}
            onClick={() => setActiveTab("My Bidding")}
          >
            My Bidding
          </button>
          <button
            className={`px-9 py-1 rounded-full font-semibold ${
              activeTab === "My Hire"
                ? "bg-[#228B22] text-white"
                : "text-[#228B22] border border-[#228b22]"
            }`}
            onClick={() => setActiveTab("My Hire")}
          >
            My Hire
          </button>
          <button
            className={`px-9 py-1 rounded-full font-semibold ${
              activeTab === "Emergency Tasks"
                ? "bg-[#228B22] text-white"
                : "text-[#228B22] border border-[#228b22]"
            }`}
            onClick={() => setActiveTab("Emergency Tasks")}
          >
            Emergency Tasks
          </button>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-5xl">
            <img
              src={Search}
              alt="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            />
            <input
              className="rounded-lg pl-10 pr-4 py-2 w-full bg-[#F5F5F5] focus:outline-none"
              type="search"
              placeholder="Search for services"
            />
          </div>
        </div>

        {/* Dynamic Task List */}
        <div className="space-y-6 max-w-5xl justify-center mx-auto">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : taskData.length === 0 ? (
            <div className="text-center">No {activeTab} available.</div>
          ) : (
            taskData.map((task) => (
              <div
                key={task.id}
                className="flex bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Left Image Section */}
                <div className="relative w-1/3">
                  <img
                    src={task.image}
                    alt={task.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-1 rounded-full">
                    {task.project_id}
                  </span>
                </div>

                {/* Right Content Section */}
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {task.name}
                    </h2>
                    <p className="text-sm text-[#334247] font-semibold">
                      Posted Date: {task.date}
                    </p>
                  </div>
                  <p className="text-sm text-[#334247] mt-2">{task.skills}</p>
                  <div className="mt-3">
                    <p className="text-green-600 font-bold">{task.price}</p>
                    <p className="text-sm text-[#334247] mt-1 font-semibold">
                      Completion Date: {task.completiondate}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="bg-[#F27773] text-white py-1 px-6 rounded-full">
                      {task.location}
                    </span>
                    <button
                      className="text-[#228B22] py-1 px-7 border border-[#228B22] rounded-lg"
                      onClick={() =>
                        navigate(`/emergency/order-detail/${task.id}`)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* See All */}
        <div className="flex justify-center my-8">
          <button className="py-2 px-8 text-white rounded-full bg-[#228B22]">
            See All
          </button>
        </div>
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
