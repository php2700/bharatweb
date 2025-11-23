// import { useState, useEffect } from "react";
// import Footer from "./../../component/footer";
// import Header from "./../../component/Header";
// import filterIcon from "./../../assets/directHiring/filter-square.png";
// import { SearchIcon } from "lucide-react";
// import Arrow from "./../../assets/profile/arrow_back.svg";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useNavigate } from "react-router-dom";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import defaultWorkImage from "./../../assets/directHiring/Work.png";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function RecentPost() {
//   const [workers, setWorkers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bannerImages, setBannerImages] = useState([]);
//   const [bannerLoading, setBannerLoading] = useState(true);
//   const [bannerError, setBannerError] = useState(null);
//   const navigate = useNavigate();

//   const fetchBannerImages = async () => {
//     const token = localStorage.getItem("bharat_token");
//     try {
//       if (!token) {
//         throw new Error("No authentication token found");
//       }
//       const response = await axios.get(
//         `${BASE_URL}/banner/getAllBannerImages`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.data?.success) {
//         setBannerImages(response.data.images || []);
//         setBannerError(
//           response.data.images.length === 0 ? "No banners available" : null
//         );
//       } else {
//         const errorMessage =
//           response.data?.message || "Failed to fetch banner images";
//         setBannerError(errorMessage);
//       }
//     } catch (err) {
//       setBannerError(err.message);
//     } finally {
//       setBannerLoading(false);
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     fetchBannerImages();
//   }, []);

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: true,
//   };

//   useEffect(() => {
//     const fetchAvailableOrders = async () => {
//       console.log(BASE_URL);

//       try {
//         const token = localStorage.getItem("bharat_token");
//         setLoading(true);
//         const res = await fetch(
//           `${BASE_URL}/direct-order/getRejectedOffersByProvider`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!res.ok) {
//           throw new Error("Failed to fetch available orders");
//         }
//         const data = await res.json();
//         console.log("data", data);
//         const fetchedWorkers = data.data.map((item) => ({
//           project_id: item.project_id,
//           workName: item.title,
//           description: item.description,
//           status: item.status,
//           provider_id: item.provider_id,
//           isRejectedByUser: item.rejected_offer?.isRejectedByUser,
//           rejectedAt: item.rejected_at,
//           id: item._id,
//         }));
//         console.log("dhdhd", fetchedWorkers);
//         setWorkers(fetchedWorkers);
//       } catch (err) {
//         setError("Failed to fetch available bidding orders");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAvailableOrders();
//   }, []);

//   // Function to truncate description
//   const truncateDescription = (text, maxLength = 100) => {
//     if (text.length <= maxLength) return text;
//     return text.slice(0, maxLength) + "...";
//   };

//   if (loading) return <div className="text-center py-10">Loading...</div>;
//   if (error)
//     return <div className="text-center py-10 text-red-500">{error}</div>;

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen py-4 sm:py-6 bg-gray-50 mt-20">
//         <div className="container mx-auto px-4 py-4">
//           <button
//             className="flex items-center text-green-600 hover:text-green-800 font-semibold"
//             onClick={() => navigate(-1)}
//           >
//             <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
//             Back
//           </button>
//         </div>

//         {/* Top Banner Slider */}
//         <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[200px] sm:h-[300px] md:h-[400px] mt-5">
//           {bannerLoading ? (
//             <p className="absolute inset-0 flex items-center justify-center text-gray-500">
//               Loading banners...
//             </p>
//           ) : bannerError ? (
//             <p className="absolute inset-0 flex items-center justify-center text-red-500">
//               Error: {bannerError}
//             </p>
//           ) : bannerImages.length > 0 ? (
//             <Slider {...sliderSettings}>
//               {bannerImages.map((banner, index) => (
//                 <div key={index}>
//                   <img
//                     src={banner || "/src/assets/profile/default.png"}
//                     alt={`Banner ${index + 1}`}
//                     className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
//                     onError={(e) => {
//                       e.target.src = "/src/assets/profile/default.png";
//                     }}
//                   />
//                 </div>
//               ))}
//             </Slider>
//           ) : (
//             <p className="absolute inset-0 flex items-center justify-center text-gray-500">
//               No banners available
//             </p>
//           )}
//         </div>

//         <div className="container max-w-5xl p-4 sm:p-6 md:p-10 my-10 mx-auto">
//           <div>
//             <div className="text-2xl sm:text-3xl font-bold my-4 text-[#191A1D]">
//               Recent Posted Work
//             </div>
//             <div className="flex gap-4 mb-6">
//               <div className="relative w-full">
//                 <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="search"
//                   placeholder="Search for services"
//                   className="w-full pl-9 pr-3 py-2 bg-[#F5F5F5] rounded-lg"
//                 />
//               </div>
//               <img src={filterIcon} alt="Filter" className="w-8 h-8" />
//             </div>

//             <div className="grid gap-4">
//               {workers.map((worker) => (
//                 <div
//                   key={worker._id}
//                   className="grid grid-cols-1 md:grid-cols-12 items-start bg-white rounded-lg shadow-lg p-4 h-auto md:h-64 overflow-hidden"
//                 >
//                   <div className="relative col-span-1 md:col-span-4 bg-gray-100 rounded-lg overflow-hidden">
//                     <img
//                       src={worker.image}
//                       alt={worker.workName}
//                       className="w-full max-h-[500px] object-contain mx-auto block"
//                     />
//                     <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-center">
//                       <span className="rounded-full bg-black/80 text-white font-medium text-xs sm:text-sm px-4 py-2 text-center">
//                         {worker.project_id}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="md:col-span-8 p-4 space-y-2">
//                     <div className="flex flex-col sm:flex-row justify-between gap-2">
//                       <h2 className="text-base font-semibold text-gray-800">
//                         {worker.workName}
//                       </h2>
//                       <div className="text-sm font-semibold">
//                         Posted Date:{" "}
//                         {new Date(worker.date).toLocaleDateString("en-GB", {
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         })}
//                       </div>
//                     </div>

//                     <div className="text-sm text-gray-600">
//                       {truncateDescription(worker.description)}
//                     </div>
//                     <p className="text-sm font-semibold text-[#008000]">
//                       &#8377;{worker.amount}
//                     </p>
//                     <div className="text-sm font-semibold text-gray-800">
//                       Completion Date:{" "}
//                       {new Date(worker.completionDate).toLocaleDateString(
//                         "en-GB",
//                         {
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                         }
//                       )}
//                     </div>

//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4">
//                       <span className="text-gray-800 flex items-center px-1 py-1 rounded-full text-sm mt-2 w-fit">
//                         <FaMapMarkerAlt
//                           size={25}
//                           color="#228B22"
//                           className="mr-2"
//                         />
//                         {worker.location}
//                       </span>

//                       <Link
//                         to={`/bidding/worker/order-detail/${worker._id}`}
//                         className="text-[#228B22] py-1 px-4 border rounded-lg hover:bg-[#228B22] hover:text-white transition"
//                       >
//                         View Details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Bottom Banner Slider */}
//         <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[200px] sm:h-[300px] md:h-[400px] mt-5">
//           {bannerLoading ? (
//             <p className="absolute inset-0 flex items-center justify-center text-gray-500">
//               Loading banners...
//             </p>
//           ) : bannerError ? (
//             <p className="absolute inset-0 flex items-center justify-center text-red-500">
//               Error: {bannerError}
//             </p>
//           ) : bannerImages.length > 0 ? (
//             <Slider {...sliderSettings}>
//               {bannerImages.map((banner, index) => (
//                 <div key={index}>
//                   <img
//                     src={banner || "/src/assets/directHiring/Work.png"}
//                     alt={`Banner ${index + 1}`}
//                     className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
//                     onError={(e) => {
//                       e.target.src = "/src/assets/directHiring/Work.png";
//                     }}
//                   />
//                 </div>
//               ))}
//             </Slider>
//           ) : (
//             <p className="absolute inset-0 flex items-center justify-center text-gray-500">
//               No banners available
//             </p>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Arrow from "../../assets/profile/arrow_back.svg";
import Work from "../../assets/directHiring/Work.png";
import Search from "../../assets/search-normal.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import pdfIcon from "../../assets/directHiring/pdficon2.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RejectedWorklist() {
  const [activeTab, setActiveTab] = useState("Direct Rejected");
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

      if (activeTab === "Direct Rejected") {
        endpoint = `${BASE_URL}/direct-order/getRejectedOffersByProvider`;
      } else if (activeTab === "Bidding Rejected") {
        endpoint = `${BASE_URL}/bidding-order/getNotSelectedBiddingOrders`;
      }

      try {
        const { data } = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(data?.data);

        const mapped = (data?.data || []).map((t) => ({
          id: t._id,

          project_id: t.project_id || "N/A",
          image: t.image_urls?.[0] || t.image_url?.[0] || Work,
          name: t.title || t.category_id?.name || "Unnamed Task",
          category_name: t.category_id?.name || "N/A",
          description: t.description || "",
          date: t.createdAt
            ? new Date(t.createdAt).toLocaleDateString()
            : "Unknown",
          price: t.service_payment?.amount || "0",
          completiondate: t.deadline
            ? new Date(t.deadline).toLocaleDateString()
            : "No deadline",
          status: t.hire_status|| "rejected",
          location: t.google_address || t.location || t.address || "Unknown",
          latitude: t.latitude || null,
          longitude: t.longitude || null,
            offer_history: t.offer_history || []
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
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden h-[350px] bg-[#f2e7ca]">
        {bannerLoading ? (
          <p className="text-center mt-36">Loading banners...</p>
        ) : (
          <Slider {...sliderSettings}>
            {bannerImages.map((b, i) => (
              <div key={i}>
                <img
                  src={b}
                  className="w-full h-[350px] object-cover"
                  onError={(e) => (e.currentTarget.src = Work)}
                />
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl text-center mt-10 font-bold">
        Rejected Work
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-10 bg-gray-100 p-2 mt-4">
        {["Direct Rejected", "Bidding Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "border border-green-600 text-green-600"
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
              <div className="w-full sm:w-1/3 h-48 bg-gray-100">
                <img
                  src={task.image}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = Work)}
                />
              </div>

              {/* Content */}
              <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-lg">{task.name}</h2>
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
                        activeTab === "Direct Rejected"
                          ? `/worker/reject-worker/rejected-details`
                          : `/worker/rejected-worker/bid-details`,
                        {
                          state: {
                            task: {
                               id: task.id || task.order_id || task._id, 
                              title:
                                task.title ||
                                task.name ||
                                task.workName ||
                                "Untitled Work",
                              location:
                                task.location ||
                                task.google_address ||
                                task.address,
                              deadline:
                                task.deadline ||
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
