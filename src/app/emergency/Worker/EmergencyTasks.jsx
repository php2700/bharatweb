import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import banner from "../../../assets/profile/banner.png";
import Work from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EmergencyTasks() {
  const [activeTab, setActiveTab] = useState("Emergency Tasks");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("bharat_token");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/emergency-order/filtered-emergency-orders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
console.log("Fetched tasks:", data);
        // Assuming API response is an array of tasks with fields like:
        // { id, title, description, posted_date, completion_date, price, location }
        const transformedData = data.data.map((item) => ({
          id: item._id,
					project_id: item.project_id,
          name: item.category_id.name,
          image: item.image_urls[0] || "https://via.placeholder.com/150",
          date: new Date(item.createdAt).toLocaleDateString("en-GB"),
          completiondate: new Date(item.deadline).toLocaleDateString("en-GB"),
          price: item.platform_fee ? `₹${item.platform_fee.toLocaleString()}` : "₹0",
          skills: item.sub_category_ids.map((sub) => sub.name).join(", "),
          location: item.google_address || "Unknown Location",
        }));

        setTasks(transformedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]); // Add token to dependency array to refetch if token changes

  return (
    <>
      <Header />
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
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
          Emergency Work
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

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center text-gray-600">Loading tasks...</div>
        )}
        {error && <div className="text-center text-red-600">{error}</div>}

        {/* Task List */}
        {!loading && !error && (
          <div className="space-y-6 max-w-5xl justify-center mx-auto">
            {activeTab === "Emergency Tasks" &&
              tasks.map((task) => (
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
                          navigate(`/emergency/worker/${task.id}`)
                        }
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

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
