import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import banner from "../../../assets/profile/banner.png";
import Work from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";

export default function MyHireBidding() {
  const [activeTab, setActiveTab] = useState("Bidding Task");
  const [Biddingorders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // 🔹 Show all state
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("bharat_token"); // Token from localStorage
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${BASE_URL}/bidding-order/apiGetAllBiddingOrders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setOrders(data.data || []); // assuming API returns { data: [...] }
        } else {
          console.error(data.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleBack = () => {
    navigate(-1);
  };

  // Limit orders to 7 if showAll is false
  const visibleOrders = showAll ? Biddingorders : Biddingorders.slice(0, 5);

  return (
    <>
      <Header />

      {/* Back Button */}
      <div className="container mx-auto mt-20 px-4 py-4">
        <div
          onClick={handleBack}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold cursor-pointer"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </div>
      </div>

      {/* Work Section */}
      <div className="container max-w-full mx-auto my-10">
        <div className="text-xl sm:text-2xl max-w-5xl font-bold mx-auto">
          My Work
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-[90px] lg:gap-[227px] bg-gray-100 p-2 mb-6">
          {["Bidding Task", "Hire", "Emergency Tasks"].map((tab) => (
            <button
              key={tab}
              className={`px-6 sm:px-9 py-1 rounded-full font-semibold ${
                activeTab === tab
                  ? "bg-[#228B22] text-white"
                  : "text-[#228B22] border border-[#228b22]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6 px-4">
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

        {/* Work Cards */}
        <div className="space-y-6 max-w-5xl justify-center mx-auto px-4">
          {activeTab === "Bidding Task" &&
            visibleOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Left Image */}
                <div className="relative w-full sm:w-1/3 h-64 sm:h-auto">
                  <img
                    src={
                      order.image_url && order.image_url.length > 0
                        ? `https://api.thebharatworks.com/${order.image_url[0]}`
                        : Work
                    }
                    alt={order.title}
                    className="h-85 w-85 object-cover"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-17 py-3 rounded-full">
                    {order.project_id}
                  </span>
                </div>

                {/* Right Content */}
                <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {order.title}
                    </h2>
                    <p className="text-[17px] text-[#008000] mt-2 font-[500]">
                      ₹{order.cost}
                    </p>
                    <p className="text-sm text-[#334247] mt-2 font-[400]">
                      Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-[#334247] mt-1 font-[400]">
                      {order.description}
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-2">
                    {/* Location */}
                    <span className="bg-[#F27773] text-white py-1 px-7 rounded-full text-center sm:text-left">
                      {order.address}
                    </span>

                    {/* Status & Button */}
                    <div className="flex flex-col items-end gap-2">
                      {/* Status badge optional */}
                      {order.status && (
                        <span
                          className={`py-1 px-7 rounded-full text-white font-semibold ${
                            order.status === "Cancelled"
                              ? "bg-[#DB5757]"
                              : order.status === "Completed"
                              ? "bg-[#56DB56]"
                              : "bg-[#56DB56]"
                          }`}
                        >
                          {order.status}
                        </span>
                      )}

                      {/* View Profile always */}
                      

<Link
  to={`/bidding/getworkdetail/${order._id}`}
  className="text-white py-1 px-7 border border-[#228B22] rounded-lg bg-[#228B22] inline-block text-center"
>
  View Profile
</Link>


                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* See All / Show Less */}
        {Biddingorders.length > 5 && (
          <div className="flex justify-center my-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="py-2 px-8 text-white rounded-full bg-[#228B22]"
            >
              {showAll ? "Show Less" : "See All"}
            </button>
          </div>
        )}

        {/* Banner Image */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
