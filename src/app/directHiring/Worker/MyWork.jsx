import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import banner from "../../../assets/profile/banner.png";
import Work from "../../../assets/directHiring/Work.png"; // Fallback image
import Search from "../../../assets/search-normal.svg";

export default function MyWork() {
  const [activeTab, setActiveTab] = useState("My Hire");
  const [work, setWork] = useState([]);
  const [filteredWork, setFilteredWork] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("bharat_token");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("bharat_token");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your work");
      navigate("/login");
      return;
    }

    const fetchWork = async () => {
      try {
        setLoading(true);
        setError(null);

        let endpoint;
        switch (activeTab) {
          case "My Hire":
            endpoint = `${BASE_URL}/direct-order/apiGetAllDirectOrders`;
            break;
          case "My Bidding":
            endpoint = `${BASE_URL}/direct-order/apiGetAllBiddingOrders`; 
            break;
          case "Emergency Tasks":
            endpoint = `${BASE_URL}/direct-order/apiGetAllEmergencyTasks`;
            break;
          default:
            endpoint = `${BASE_URL}/direct-order/apiGetAllDirectOrders`;
        }

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 && data.message === "Unauthorized role") {
            throw new Error(
              "You don't have the necessary permissions to view this data. Please contact support or try a different account."
            );
          } else if (response.status === 401) {
            throw new Error("Session expired. Please log in again.");
          } else if (response.status === 404) {
            throw new Error("No work found");
          } else {
            throw new Error(data.message || `Failed to fetch work data: ${response.statusText}`);
          }
        }

        const workData = Array.isArray(data) ? data : data.data || [];
        
        const transformedData = workData.map((item) => ({
          id: item.id || item.orderId,
          name: item.name || item.title || "Untitled",
          image: item.image ? `${BASE_URL}/${item.image}` : Work,
          skills: item.skills || item.description || "No description available",
          date: item.date || item.postedDate || "Unknown date",
          location: item.location || "Unknown Location",
        }));

        setWork(transformedData);
        setFilteredWork(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        if (err.message.includes("Session expired") || err.message.includes("Unauthorized role")) {
          navigate("/login");
        }
      }
    };

    fetchWork();
  }, [activeTab, token, navigate, BASE_URL]);

  // Handle search input
  useEffect(() => {
    if (searchQuery) {
      const filtered = work.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWork(filtered);
    } else {
      setFilteredWork(work);
    }
  }, [searchQuery, work]);

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
              className="rounded-lg pl-10 pr-4 py-2 w-5xl bg-[#F5F5F5] focus:outline-none"
              type="search"
              placeholder="Search for services"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Work Cards */}
        <div className="space-y-6 max-w-5xl justify-center mx-auto">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">
              {error}
              {error.includes("Unauthorized role") && (
                <div className="mt-2">
                  <button
                    onClick={handleLogout}
                    className="text-[#228B22] py-1 px-4 border border-[#228B22] rounded-lg"
                  >
                    Log in with a different account
                  </button>
                </div>
              )}
            </div>
          ) : filteredWork.length > 0 ? (
            filteredWork.map((workItem) => (
              <div
                key={workItem.id}
                className="flex bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Left Image */}
                <div className="relative w-1/3">
                  <img
                    src={workItem.image}
                    alt={workItem.name}
                    className="h-full w-full object-cover"
                    onError={(e) => (e.target.src = Work)} // Fallback on image load error
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-1 rounded-full">
                    #{workItem.id}2025
                  </span>
                </div>

                {/* Right Content */}
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {workItem.name}
                    </h2>
                    <p className="text-sm text-[#334247] mt-1">{workItem.skills}</p>
                    <p className="text-sm text-[#334247] mt-4 font-semibold">
                      Posted Date: {workItem.date}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="flex justify-between items-center w-full">
                    <span className="bg-[#F27773] text-white py-0 px-7 rounded-full">
                      {workItem.location}
                    </span>
                    <button
                      className="text-[#228B22] py-1 px-7 border border-[#228B22] rounded-lg"
                      onClick={() => navigate("/view-profile", { state: { work: workItem } })}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">No work available</div>
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