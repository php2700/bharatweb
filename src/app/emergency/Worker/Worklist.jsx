import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Work from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import pdfIcon from "../../../assets/directHiring/pdficon2.png"; // <-- NEW

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Worklist() {
  const { task } = useParams(); // e.g., "My%20Bidding"
  const decodedTask = task ? decodeURIComponent(task) : "Emergency Tasks";

  const [activeTab, setActiveTab] = useState(decodedTask);
  const [taskData, setTaskData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState([]); // <-- NEW

  const navigate = useNavigate();
  const token = localStorage.getItem("bharat_token");

  /* -------------------------------------------------
     Helper – map tab → invoice type
  ------------------------------------------------- */
  const downloadTypeFromTab = (tab) => {
    const map = {
      "My Bidding": "bidding",
      "My Hire": "my-hire",
      "Emergency Tasks": "emergency",
    };
    return map[tab] || "bidding";
  };

  /* -------------------------------------------------
     Fetch banner images
  ------------------------------------------------- */
  const fetchBannerImages = async () => {
    try {
      if (!token) throw new Error("No authentication token found");

      const { data } = await axios.get(
        `${BASE_URL}/banner/getAllBannerImages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success && Array.isArray(data.images) && data.images.length) {
        setBannerImages(data.images);
      } else {
        setBannerImages([]);
        setBannerError("No banners available");
      }
    } catch (err) {
      console.error("Banner error:", err);
      setBannerError(err?.message || "Failed to load banners");
    } finally {
      setBannerLoading(false);
    }
  };

  /* -------------------------------------------------
     Initialise tab + banners
  ------------------------------------------------- */
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();

    const validTabs = ["My Bidding", "My Hire", "Emergency Tasks"];
    if (validTabs.includes(decodedTask)) {
      setActiveTab(decodedTask);
    } else {
      setActiveTab("Emergency Tasks");
      navigate("/worker/work-list/Emergency%20Tasks", { replace: true });
    }
  }, [task, navigate]);

  /* -------------------------------------------------
     Fetch tasks for the active tab
  ------------------------------------------------- */
  useEffect(() => {
    if (!activeTab || !token) return;

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      let endpoint;
      switch (activeTab) {
        case "My Bidding":
          endpoint = `${BASE_URL}/bidding-order/getAllBiddingOrdersForProvider`;
          break;
        case "My Hire":
          endpoint = `${BASE_URL}/direct-order/getOrdersByProvider`;
          break;
        case "Emergency Tasks":
          endpoint = `${BASE_URL}/emergency-order/getAllEmergencyOrdersforProvider`;
          break;
        default:
          setError("Invalid tab");
          setLoading(false);
          return;
      }

      try {
        const { data } = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const mapped = (data?.data || []).map((t) => ({
          id: t._id,
          project_id: t.project_id || "N/A",
          image: t.image_urls?.[0] || t.image_url?.[0] || Work,
          name: t.category_id?.name || t.title || "Unnamed Task",
          date: t.createdAt
            ? new Date(t.createdAt).toLocaleDateString()
            : "Unknown Date",
          skills:
            t.sub_category_ids?.map((s) => s.name).join(", ") ||
            t.skills?.join(", ") ||
            t.description ||
            "No skills listed",
          price: t.platform_fee
            ? `₹${t.platform_fee.toLocaleString()}`
            : t.price
            ? `₹${t.price}`
            : "Price TBD",
          completiondate: t.deadline
            ? new Date(t.deadline).toLocaleDateString()
            : "No deadline",
          status: t.hire_status || t.status || "N/A",
          location:
            t.google_address || t.location || t.address || "Unknown Location",
        }));

        setTaskData(mapped);
      } catch (err) {
        console.error(err);
        setError(`Failed to load ${activeTab}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeTab, token]);

  /* -------------------------------------------------
     Search handler
  ------------------------------------------------- */
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  /* -------------------------------------------------
     PDF download
  ------------------------------------------------- */
  const handledownload = async (id, type) => {
    if (!id) return alert("Invalid task id");
    if (!token) return alert("Not authenticated");

    setDownloadingIds((prev) => [...prev, id]);

    try {
      let endpoint = "";
      if (type === "bidding")
        endpoint = `${BASE_URL}/user/invoice/bidding/${id}`;
      else if (type === "my-hire")
        endpoint = `${BASE_URL}/user/invoice/direct/${id}`;
      else if (type === "emergency")
        endpoint = `${BASE_URL}/user/invoice/emergency/${id}`;
      else throw new Error("Invalid type");

      const { data } = await axios.get(endpoint, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${type}_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Could not download invoice.");
    } finally {
      setDownloadingIds((prev) => prev.filter((tid) => tid !== id));
    }
  };

  /* -------------------------------------------------
     Filter tasks
  ------------------------------------------------- */
  const filteredTasks = taskData.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* -------------------------------------------------
     Tab click → update URL
  ------------------------------------------------- */
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/worker/work-list/${encodeURIComponent(tab)}`);
  };

  /* -------------------------------------------------
     Slider config
  ------------------------------------------------- */
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  /* -------------------------------------------------
     Render
  ------------------------------------------------- */
  return (
    <>
      <Header />

      {/* Back */}
      <div className="container mx-auto px-4 py-4 mt-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
          Back
        </button>
      </div>

      {/* Top Banner */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        {bannerLoading ? (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            Loading banners...
          </p>
        ) : bannerError ? (
          <p className="absolute inset-0 flex items-center justify-center text-red-500">
            {bannerError}
          </p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((b, i) => (
              <div key={i}>
                <img
                  src={b}
                  alt={`Banner ${i + 1}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => (e.currentTarget.src = Work)}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            No banners available
          </p>
        )}
      </div>

      {/* Main Section */}
      <div className="container max-w-full mx-auto my-10">
        <h1 className="text-xl sm:text-2xl max-w-5xl text-center mb-5 font-bold mx-auto">
          My Work
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-8 sm:gap-[200px] bg-gray-100 p-2 mb-6 flex-wrap">
          {["My Bidding", "My Hire", "Emergency Tasks"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 sm:px-9 py-2 rounded-full font-semibold transition-all text-sm sm:text-base ${
                activeTab === tab
                  ? "bg-[#228B22] text-white"
                  : "text-[#228B22] border border-[#228B22] hover:bg-[#228B22] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-5xl">
            <img
              src={Search}
              alt="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            />
            <input
              type="search"
              placeholder="Search for services"
              value={searchQuery}
              onChange={handleSearchChange}
              className="rounded-lg pl-10 pr-4 py-2 w-full bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22]"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {loading ? (
            <p className="text-center">Loading tasks...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-center">
              No {activeTab.toLowerCase()} available.
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full sm:w-[300px] h-48 sm:h-auto bg-gray-100">
                  <img
                    src={task.image}
                    alt={task.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = Work)}
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full">
                    {task.project_id}
                  </span>
                </div>

                {/* Content */}
                <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {task.name}
                    </h2>
                    <p className="text-sm text-[#334247] font-medium">
                      Posted: {task.date}
                    </p>
                  </div>

                  <p className="text-sm flex justify-between text-[#334247] mt-2 line-clamp-2">
                    {task.skills}
                    <button
                      onClick={() =>
                        handledownload(task.id, downloadTypeFromTab(activeTab))
                      }
                      disabled={downloadingIds.includes(task.id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 text-xs"
                      title="Download Invoice"
                    >
                      <img src={pdfIcon} alt="PDF" className="w-5 h-5" />
                      {downloadingIds.includes(task.id)
                        ? "Downloading..."
                        : "Download PDF"}
                    </button>
                  </p>

                  <p className="text-green-600 font-bold mt-2">{task.price}</p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                    <p className="text-sm text-[#334247] font-medium">
                      Completion: {task.completiondate}
                    </p>
                    <p
                      className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded capitalize ${
                        task.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : task.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "cancelledDispute"
                          ? "bg-orange-100 text-orange-800"
                          : task.status === "accepted" ||
                            task.status === "assigned"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      Status: {task.status.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
                    <span className="flex items-center text-gray-700 text-sm">
                      <FaMapMarkerAlt
                        size={20}
                        color="#228B22"
                        className="mr-1"
                      />
                      {task.location.length > 30
                        ? `${task.location.slice(0, 30)}...`
                        : task.location}
                    </span>

                    <button
                      onClick={() => {
                        const routes = {
                          "My Bidding": "bidding/worker",
                          "My Hire": "hire/worker",
                          "Emergency Tasks": "emergency/worker",
                        };
                        navigate(
                          `/${routes[activeTab]}/order-detail/${task.id}`
                        );
                      }}
                      className="text-[#228B22] py-1 px-6 border border-[#228B22] rounded-lg hover:bg-[#228B22] hover:text-white transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Banner */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-10">
          {bannerLoading ? (
            <p className="absolute inset-0 flex items-center justify-center text-gray-500">
              Loading...
            </p>
          ) : bannerError ? (
            <p className="absolute inset-0 flex items-center justify-center text-red-500">
              {bannerError}
            </p>
          ) : bannerImages.length > 0 ? (
            <Slider {...sliderSettings}>
              {bannerImages.map((b, i) => (
                <div key={i}>
                  <img
                    src={b}
                    alt={`Banner ${i + 1}`}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => (e.currentTarget.src = Work)}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="absolute inset-0 flex items-center justify-center text-gray-500">
              No banners
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
