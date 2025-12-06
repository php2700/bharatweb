import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../component/Header";
// import Header from "./../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Work from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import pdfIcon from "../../../assets/directHiring/pdficon2.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RejectedWorklist() {
  const [activeTab, setActiveTab] = useState("Accepted");
  const [taskData, setTaskData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [downloadingIds, setDownloadingIds] = useState([]);
  const [expandedAddresses, setExpandedAddresses] = useState({});
  const [expandedIds, setExpandedIds] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("bharat_token");

  const toggleExpand = (id) =>
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAddress = (taskId) =>
    setExpandedAddresses((prev) => ({ ...prev, [taskId]: !prev[taskId] }));

  // Load banner images
  const fetchBannerImages = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/banner/getAllBannerImages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data?.success && data.images?.length > 0) {
        setBannerImages(data.images);
      }
    } catch (err) {
      console.error("Banner Load Error:", err);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

  // Load Rejected data
  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      setLoading(true);

      let endpoint = "";

      if (activeTab === "Accepted") {
        endpoint = `${BASE_URL}/emergency-order/getAcceptedEmergencyOrders`;
      } else if (activeTab === "Rejected") {
        endpoint = `${BASE_URL}/emergency-order/getRejectedEmergencyOrders`;
      }

      try {
        const { data } = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("RAW RESPONSE:", data);
        console.log("RAW DATA FIELD:", data?.data);
        const mapped = (data?.data || []).map((t) => ({
          
          id: t._id,

          project_id: t.project_id || "N/A",

          image: t.image_urls?.[0] || t.image_url?.[0] || Work,

          name: t.title || t.category_id?.name || "Unnamed Task",

          category_name: t.category_id?.name || "N/A",

 sub_category_ids: Array.isArray(t.sub_category_ids)
    ? t.sub_category_ids
    : [],

          description: t.description || "",

          date: t.createdAt
            ? new Date(t.createdAt).toLocaleDateString()
            : "Unknown",

          price: t.service_payment?.amount || "0",

          completiondate: t.deadline
            ? new Date(t.deadline).toLocaleDateString()
            : "No deadline",

          status: t.hire_status || t.status || "rejected",

          bid_status:
            t.accepted_by_providers?.[0]?.status ||
            t.provider_status?.status ||
            "pending",

          provider_id:
            t.provider_status?.provider ||
            t.accepted_by_providers?.[0]?.provider ||
            null,

          location: t.google_address || t.location || t.address || "Unknown",

          latitude: t.latitude || null,
          longitude: t.longitude || null,

          user_name: t.user_id?.full_name || "Unknown User",
          user_phone: t.user_id?.phone || "Unknown Phone",
          cost:t.cost,
        }));

        
        setTaskData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeTab, token]);

  const filteredTasks = taskData.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.category_name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.project_id.toLowerCase().includes(q)
    );
  });

  // PDF Download
  const handledownload = async (id, type) => {
    setDownloadingIds((prev) => [...prev, id]);

    try {
      const { data } = await axios.get(
        `${BASE_URL}/user/invoice/${type}/${id}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${type}_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Failed to download invoice.");
    } finally {
      setDownloadingIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const renderAddress = (task) => {
    const isExpanded = expandedAddresses[task.id];
    const maxLength = 60;

    if (task.location.length <= maxLength || isExpanded) {
      return (
        <div>
          <span className="flex items-center text-sm text-gray-700">
            <FaMapMarkerAlt size={18} color="#228B22" className="mr-1" />
            {task.location}
          </span>
          {isExpanded && (
            <button
              onClick={() => toggleAddress(task.id)}
              className="text-xs text-gray-500 ml-6"
            >
              See Less
            </button>
          )}
        </div>
      );
    }

    return (
      <div>
        <span className="flex items-center text-sm text-gray-700">
          <FaMapMarkerAlt size={18} color="#228B22" className="mr-1" />
          {task.location.substring(0, maxLength)}...
        </span>
        <button
          onClick={() => toggleAddress(task.id)}
          className="text-xs text-green-600 ml-6"
        >
          See More
        </button>
      </div>
    );
  };

  return (
    <>
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4 mt-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000]"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" />
          Back
        </button>
      </div>

      {/* Banner */}
      <div className="w-full max-w-[95%] mx-auto rounded-[50px] overflow-hidden shadow-xl relative bg-[#f2e7ca] mt-5 h-[220px] sm:h-[400px]">
              <Slider {...sliderSettings}>
                {bannerImages.length > 0 ? (
                  bannerImages.map((banner, index) => (
                    <div
                      key={index}
                      className="w-full h-[220px] sm:h-[400px] relative"
                    >
                      {/* Yeh image class perfect fit karegi har device pe */}
                      <img
                        src={banner}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-fill object-center"
                        onError={(e) => {
                          e.target.src = "/src/assets/Home-SP/default.png";
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-[220px] sm:h-[400px] bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-600 font-medium">
                      No banners available
                    </p>
                  </div>
                )}
              </Slider>
            </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl text-center mt-5 font-bold">
        Emergency Work
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-10 bg-gray-100 p-2 mt-4">
        {["Accepted", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-[#228B22] text-white"
                : "border border-[#228B22] text-[#228B22]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex justify-center mt-6">
        <div className="relative w-full max-w-4xl">
          <img
            src={Search}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5"
          />
          <input
            type="search"
            placeholder="Search rejected tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 bg-gray-100 rounded-lg"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="max-w-4xl mx-auto mt-8 space-y-6">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-center">No rejected tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md"
            >
              {/* Image */}
              <div className="w-full sm:w-1/3 h-48 bg-gray-100 relative">
                <img
                  src={task.image}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = Work)}
                />
                 <span
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 
                   bg-black/80 backdrop-blur text-white text-xs 
                   px-4 py-1 rounded-full shadow-md"
                  >
                    {task?.project_id}
                  </span>
              </div>

              {/* Content */}
              <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
  {task.name.charAt(0).toUpperCase() + task.name.slice(1)}
</h2>

                  <p className="text-sm">Posted: {task.date}</p>
                </div>

                {/* Description */}
                {task.description && (
                  <>
                    <p
                      className={`text-sm mt-1 ${
                        expandedIds[task.id] ? "" : "line-clamp-3"
                      }`}
                    >
                      {task.description}
                    </p>
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="text-xs text-green-600 mt-1"
                    >
                      {expandedIds[task.id] ? "See Less" : "See More"}
                    </button>
                  </>
                )}

                {/* Price */}
                <p className="text-green-700 font-bold mt-2">₹{task.price}</p>

                {/* Address + view details */}
                <div className="flex justify-between mt-3 items-center">
                  <div className="w-2/3">{renderAddress(task)}</div>

                  <button
                    onClick={() =>
                      navigate(
                        activeTab === "Accepted"
                          ? `/worker/emergency-details/accepted-worker`
                          :`/worker/emergency-details/rejected-worker`,
                            {
                          state: {
                            task: {
                              id: task.id || task.order_id || task._id,
                              title: task.title ||task.name ||task.workName ||"Untitled Work",
                              location:task.location || task.google_address ||task.address,
                                
                               
                                
                              deadline: task.deadline ||
                               
                                task.completionDate ||
                                task.completion_date || 
                                task.endDate ||
                                task.to_be_completed ||
                                task.due_date ||
                                task.date,
                              createdAt:
                                task.createdAt ||
                                task.date ||
                                task.postedAt ||
                                task.created_on ||
                                task.created,
                              amount:
                                task.amount ||
                                task.price ||
                                task.service_payment?.amount,
                              project_id: task.project_id,

                              images:
                                task.images ||
                                task.image_urls ||
                                task.image_url ||
                                [],

                              reason:
                                task.reason ||
                                task.rejected_reason ||
                                task.rejected_offer?.reason,

                              description: task.description,
                              hire_status: task.status,
                              offer_history: task.offer_history,
                              cost: task.cost,

                              category_name: task.category_name,
                              offer: task.offer || null,
                              user_name:task.user_name,
                              user_phone:task.user_phone,
                           sub_category_ids: task.sub_category_ids || [],
                            },
                          },
                          // state:{task}
                        }

                      )
                    }
                    className="border border-green-600 text-green-600 px-4 py-1 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}
