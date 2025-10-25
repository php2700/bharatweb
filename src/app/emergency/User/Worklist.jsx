// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Header from "../../../component/Header";
// import Footer from "../../../component/footer";
// import Arrow from "../../../assets/profile/arrow_back.svg";
// import Work from "../../../assets/directHiring/Work.png";
// import Search from "../../../assets/search-normal.svg";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import pdf from "../../../assets/directHiring/pdficon2.png";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function Worklist() {
//   const { task } = useParams(); // e.g., "My%20Bidding"
//   const [activeTab, setActiveTab] = useState(task); // Default tab
//   const [taskData, setTaskData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // State for search input
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bannerImages, setBannerImages] = useState([]);
//   const [bannerLoading, setBannerLoading] = useState(true);
//   const [bannerError, setBannerError] = useState(null);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("bharat_token");

//   // Fetch banner images
//   const fetchBannerImages = async () => {
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
//         if (
//           Array.isArray(response.data.images) &&
//           response.data.images.length > 0
//         ) {
//           setBannerImages(response.data.images);
//         } else {
//           setBannerImages([]);
//           setBannerError("No banners available");
//         }
//       } else {
//         const errorMessage =
//           response.data?.message || "Failed to fetch banner images";
//         console.error("Failed to fetch banner images:", errorMessage);
//         setBannerError(errorMessage);
//       }
//     } catch (err) {
//       console.error("Error fetching banner images:", err.message);
//       setBannerError(err.message);
//     } finally {
//       setBannerLoading(false);
//     }
//   };

//   // Set activeTab based on route parameter and fetch banners
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     fetchBannerImages();
//     if (task) {
//       const decodedTask = decodeURIComponent(task);
//       const validTabs = ["My Bidding", "My Hire", "Emergency Tasks"];
//       if (validTabs.includes(decodedTask)) {
//         setActiveTab(decodedTask);
//       } else {
//         setActiveTab("Emergency Tasks");
//         navigate("/user/work-list/Emergency%20Tasks");
//       }
//     }
//   }, [task, navigate]);

//   // Fetch tasks based on activeTab
//   useEffect(() => {
//     if (!activeTab || !token) return;

//     const fetchTasks = async () => {
//       try {
//         setLoading(true);
//         let endpoint ;
//         switch (activeTab) {
//           case "My Bidding":
//             endpoint = `${BASE_URL}/bidding-order/getAllBiddingOrdersForUser`;
//             break;
//           case "My Hire":
//             endpoint = `${BASE_URL}/direct-order/getOrdersByUser`;
//             break;
//           case "Emergency Tasks":
//             endpoint = `${BASE_URL}/emergency-order/getAllEmergencyOrdersByRole`;
//             break;
//           default:
//             throw new Error("Invalid tab selected");
//         }

//         const response = await axios.get(endpoint, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });


//         // Map API response to the expected structure
//         const mappedTasks = response.data.data.map((task) => ({
//           id: task._id,
//           project_id: task.project_id || "N/A",
//           image: task.image_urls?.[0] || task.image || Work, // Fallback to Work image
//           name: task.category_id?.name || task.title || "Unnamed Task",
//           date: task.createdAt
//             ? new Date(task.createdAt).toLocaleDateString()
//             : "Unknown Date",
//           skills:
//             task.sub_category_ids?.map((sub) => sub.name).join(", ") ||
//             task.skills?.join(", ") ||
//             task.description ||
//             "No skills listed",
//           price: task.service_payment?.amount
//             ? `₹${task.service_payment.amount}`
//             : task.price
//               ? `₹${task.price}`
//               : "Price TBD",
//           completiondate: task.deadline
//             ? new Date(task.deadline).toLocaleDateString()
//             : "No deadline",
//           status: task.hire_status || "N/A",
//           location:
//             task.google_address ||
//             task.location ||
//             task.address ||
//             "Unknown Location",
//         }));

//         setTaskData(mappedTasks);
//         console.log(mappedTasks, "fffffffffffff");
//         setError(null);
//       } catch (err) {
//         console.error(err);
//         setError(`Failed to fetch ${activeTab} data. Please try again later.`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [activeTab, token]);

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };
//   const handledownload = async (id, type) => {
//     try {
//       const token = localStorage.getItem("bharat_token");

//       let endpoint = "";

//       // Task type के आधार पर सही API endpoint चुनना
//       if (type === "bidding") {
//         endpoint = `${BASE_URL}/bidding-order/download-pdf/${id}`;
//       } else if (type === "my-hire") {
//         endpoint = `${BASE_URL}/direct-order/download-pdf/${id}`;
//       } else if (type === "emergency") {
//         endpoint = `${BASE_URL}/emergency-order/download-pdf/${id}`;
//       } else {
//         throw new Error("Invalid type");
//       }

//       const response = await axios.get(endpoint, {
//         responseType: "blob", // ये ज़रूरी है ताकि PDF binary में आए
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // Blob से डाउनलोड लिंक बनाना
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `task_${id}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("PDF dwonload error:", error.message);
//       alert("error during download");
//     }
//   };


//   // Filter tasks based on search query
//   const filteredTasks = taskData.filter(
//     (task) =>
//       task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.location.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle tab click and update URL
//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     const formattedTab = encodeURIComponent(tab); // e.g., "My Bidding" to "My%20Bidding"
//     navigate(`/user/work-list/${formattedTab}`);
//   };

//   // Slider settings for react-slick
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

//   return (
//     <>
//       <Header />
//       {/* Back Button */}
//       <div className="container mx-auto px-4 py-4 mt-20">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
//         >
//           <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
//           Back
//         </button>
//       </div>

//       {/* Top Banner Slider */}
//       <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
//         {bannerLoading ? (
//           <p className="absolute inset-0 flex items-center justify-center text-gray-500">
//             Loading banners...
//           </p>
//         ) : bannerError ? (
//           <p className="absolute inset-0 flex items-center justify-center text-red-500">
//             Error: {bannerError}
//           </p>
//         ) : bannerImages.length > 0 ? (
//           <Slider {...sliderSettings}>
//             {bannerImages.map((banner, index) => (
//               <div key={index}>
//                 <img
//                   src={banner || "/src/assets/profile/default.png"} // Fallback image
//                   alt={`Banner ${index + 1}`}
//                   className="w-full h-[400px] object-cover"
//                   onError={(e) => {
//                     e.target.src = "/src/assets/profile/default.png"; // Fallback on image load error
//                   }}
//                 />
//               </div>
//             ))}
//           </Slider>
//         ) : (
//           <p className="absolute inset-0 flex items-center justify-center text-gray-500">
//             No banners available
//           </p>
//         )}
//       </div>

//       {/* Work Section */}
//       <div className="container max-w-full mx-auto my-10">
//         <div className="text-xl sm:text-2xl max-w-5xl text-center mb-5 font-bold mx-auto">
//           My Hiring
//         </div>
//         {/* Tabs */}
//         <div className="flex justify-center gap-[200px] bg-gray-100 p-2 mb-6">
//           {["My Bidding", "My Hire", "Emergency Tasks"].map((tab) => (
//             <button
//               key={tab}
//               className={`px-9 py-1 rounded-full font-semibold ${activeTab === tab
//                 ? "bg-[#228B22] text-white"
//                 : "text-[#228B22] border border-[#228b22]"
//                 }`}
//               onClick={() => handleTabClick(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Search */}
//         <div className="flex justify-center mb-6">
//           <div className="relative w-full max-w-5xl">
//             <img
//               src={Search}
//               alt="Search"
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
//             />
//             <input
//               className="rounded-lg pl-10 pr-4 py-2 w-full bg-[#F5F5F5] focus:outline-none"
//               type="search"
//               placeholder="Search for services"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>
//         </div>

//         {/* Dynamic Task List */}
//         <div className="space-y-6 max-w-5xl justify-center mx-auto">
//           {loading ? (
//             <div className="text-center">Loading...</div>
//           ) : error ? (
//             <div className="text-center text-red-500">{error}</div>
//           ) : filteredTasks.length === 0 ? (
//             <div className="text-center">No {activeTab} available.</div>
//           ) : (
//             filteredTasks.map((task) => (
//               <div
//                 key={task.id}
//                 className="flex bg-white rounded-xl shadow-md overflow-hidden"
//               >
//                 {/* Left Image Section */}
//                 <div className="relative w-1/3">
//                   <img
//                     src={task.image}
//                     alt={task.name}
//                     className="h-full w-full object-cover"
//                   />
//                   <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-1 rounded-full">
//                     {task.project_id}
//                   </span>
//                 </div>

//                 {/* Right Content Section */}
//                 <div className="w-2/3 p-4 flex flex-col justify-between">
//                   <div className="flex justify-between items-start">
//                     <h2 className="text-lg font-semibold text-gray-800">
//                       {task.name}
//                     </h2>
//                     {/* <p className="text-sm text-[#334247] font-semibold">
//                       Posted Date: {task.date}
//                     </p> */}
//                     <div className="text-sm text-[#334247] font-semibold flex flex-col">
//                       <span>Posted Date: {task.date}</span>

//                       {/* 🔽 PDF download link below date */}
//                       {/* {task.pdf_url && (
//                         <a
//                           href={`https://api.thebharatworks.com/${task.pdf_url}`}
//                           download
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:underline text-xs mt-1"
//                         >
//                           📄 Download PDF
//                         </a>
//                       )} */}
//                       <button
//                         onClick={() => handledownload(task.id, activeTab === "My Bidding" ? "bidding" : activeTab === "My Hire" ? "direct" : "emergency")}
//                         className="text-blue-600 hover:underline text-xs mt-1"
//                       >
//                         {/* 📄 Download PDF */}
//                         <img
//                           src={pdf}  // apne actual PDF icon ka path yahan daalein
//                           alt="Download PDF"
//                           className="w-13 h-13"        // size adjust karne ke liye
//                         />
//                       </button>

//                     </div>

//                   </div>
//                   <p className="text-sm text-[#334247] mt-2">
//                     {(() => {
//                       const words = task.skills?.split(" ") || [];
//                       const limitedText = words.slice(0, 40).join(" ");
//                       return words.length > 40
//                         ? `${limitedText}...`
//                         : limitedText;
//                     })()}
//                   </p>
//                   <p className="text-green-600 font-bold mt-3">{task.price}</p>
//                   <div className="flex justify-between items-start">
//                     <p className="text-sm text-[#334247] mt-1 font-semibold">
//                       Completion Date: {task.completiondate}
//                     </p>
//                     <p
//                       className={`text-sm font-semibold px-2 py-1 rounded 
//     ${task.status === "pending"
//                           ? "bg-yellow-200 text-yellow-800"
//                           : task.status === "cancelled"
//                             ? "bg-red-200 text-red-800"
//                             : task.status === "completed"
//                               ? "bg-green-200 text-green-800"
//                               : task.status === "cancelledDispute"
//                                 ? "bg-orange-200 text-orange-800"
//                                 : task.status === "accepted"
//                                   ? "bg-blue-200 text-blue-800"
//                                   : ""
//                         }`}
//                     >
//                       Project Status:{" "}
//                       {task.status
//                         .replace(/([A-Z])/g, " $1") // split camelCase (CancelledDispute → Cancelled Dispute)
//                         .trim()
//                         .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
//                       {/* Capitalize each word */}
//                     </p>
//                   </div>
//                   <div className="mt-3"></div>
//                   <div className="flex justify-between items-center mt-4">
//                     <span className="text-gray-800 flex items-center px-1 py-1 rounded-full text-sm mt-2 w-fit">
//                       <FaMapMarkerAlt
//                         size={25}
//                         color="#228B22"
//                         className="mr-2"
//                       />{" "}
//                       {task.location}
//                     </span>
//                     {/*<button
//                       className="text-[#228B22] py-1 px-7 border border-[#228B22] rounded-lg"
//                       onClick={() =>
//                         navigate(
//                           `/${
//                             activeTab === "Emergency Tasks"
//                               ? "emergency"
//                               : activeTab.toLowerCase().replace(" ", "-")
//                           }/order-detail/${task.id}`
//                         )
//                       }
//                     >
//                       View Details
//                     </button>*/}
//                     <button
//                       className="text-[#228B22] py-1 px-7 border border-[#228B22] rounded-lg"
//                       onClick={() => {
//                         const tabRoutes = {
//                           "My Bidding": "bidding",
//                           "My Hire": "my-hire",
//                           "Emergency Tasks": "emergency",
//                         };

//                         const route = tabRoutes[activeTab];
//                         navigate(`/${route}/order-detail/${task.id}`);
//                       }}
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* See All */}
//         <div className="flex justify-center my-8">
//           <button className="py-2 px-8 text-white rounded-full bg-[#228B22]">
//             See All
//           </button>
//         </div>

//         {/* Bottom Banner Slider */}
//         <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
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
//                     src={banner || "/src/assets/profile/default.png"} // Fallback image
//                     alt={`Banner ${index + 1}`}
//                     className="w-full h-[400px] object-cover"
//                     onError={(e) => {
//                       e.target.src = "/src/assets/profile/default.png"; // Fallback on image load error
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
import pdf from "../../../assets/directHiring/pdficon2.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Worklist() {
  const { task } = useParams(); // e.g., "My%20Bidding"
  const [activeTab, setActiveTab] = useState(task ? decodeURIComponent(task) : "");
  const [taskData, setTaskData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState([]); // array of ids being downloaded
  const navigate = useNavigate();
  const token = localStorage.getItem("bharat_token");

  // Helper to set download state
  const setDownloading = (id, val) => {
    setDownloadingIds((prev) => {
      if (val) return Array.from(new Set([...prev, id]));
      return prev.filter((x) => x !== id);
    });
  };

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        if (Array.isArray(response.data.images) && response.data.images.length > 0) {
          setBannerImages(response.data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = response.data?.message || "Failed to fetch banner images";
        console.error("Failed to fetch banner images:", errorMessage);
        setBannerError(errorMessage);
      }
    } catch (err) {
      console.error("Error fetching banner images:", err?.message || err);
      setBannerError(err?.message || "Error fetching banners");
    } finally {
      setBannerLoading(false);
    }
  };

  // Set activeTab based on route parameter and fetch banners
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();

    if (task) {
      const decodedTask = decodeURIComponent(task);
      const validTabs = ["My Bidding", "My Hire", "Emergency Tasks"];
      if (validTabs.includes(decodedTask)) {
        setActiveTab(decodedTask);
      } else {
        setActiveTab("Emergency Tasks");
        navigate("/user/work-list/Emergency%20Tasks");
      }
    } else {
      // default to Emergency Tasks if not provided
      setActiveTab((prev) => prev || "Emergency Tasks");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  // Fetch tasks based on activeTab
  useEffect(() => {
    if (!activeTab || !token) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        let endpoint;
        switch (activeTab) {
          case "My Bidding":
            endpoint = `${BASE_URL}/bidding-order/getAllBiddingOrdersForUser`;
            break;
          case "My Hire":
            endpoint = `${BASE_URL}/direct-order/getOrdersByUser`;
            break;
          case "Emergency Tasks":
            endpoint = `${BASE_URL}/emergency-order/getAllEmergencyOrdersByRole`;
            break;
          default:
            throw new Error("Invalid tab selected");
        }

        const response = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const list = response.data?.data || [];

        // Map API response to the expected structure
        const mappedTasks = list.map((t) => ({
          id: t._id,
          project_id: t.project_id || "N/A",
          image: t.image_urls?.[0] || t.image || Work,
          name: t.category_id?.name || t.title || "Unnamed Task",
          date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Unknown Date",
          skills:
            (t.sub_category_ids?.map((sub) => sub.name).join(", ")) ||
            (Array.isArray(t.skills) ? t.skills.join(", ") : t.skills) ||
            t.description ||
            "No skills listed",
          price: t.service_payment?.amount
            ? `₹${t.service_payment.amount}`
            : t.price
            ? `₹${t.price}`
            : "Price TBD",
          completiondate: t.deadline ? new Date(t.deadline).toLocaleDateString() : "No deadline",
          status: t.hire_status || t.status || "N/A",
          location: t.google_address || t.location || t.address || "Unknown Location",
        }));

        setTaskData(mappedTasks);
        setError(null);
      } catch (err) {
        console.error(err);
        setTaskData([]);
        setError(`Failed to fetch ${activeTab} data. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeTab, token]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Download handler: uses special invoice endpoint for bidding (localhost:5001)
  const handledownload = async (id, type) => {
    if (!id) return alert("Invalid task id");
    const authToken = localStorage.getItem("bharat_token");
    if (!authToken) return alert("User not authenticated");

    try {
      setDownloading(id, true);

      let endpoint = "";

      if (type === "bidding") {
        // use the specific local invoice endpoint required
        endpoint = `${BASE_URL}/user/invoice/bidding/${id}`;
      } else if (type === "my-hire") {
        endpoint = `${BASE_URL}/user/invoice/direct/${id}`;
      } else if (type === "emergency") {
        endpoint = `${BASE_URL}/user/invoice/emergency/${id}`;
      } else {
        throw new Error("Invalid type");
      }

      const response = await axios.get(endpoint, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response || !response.data) {
        throw new Error("No file returned from server");
      }

      const blob = new Blob([response.data], { type: response.data.type || "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // make filename clearer
      const filename = `invoice_${type}_${id}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error?.message || error);
      alert("Error during PDF download: " + (error?.message || "Please try again"));
    } finally {
      setDownloading(id, false);
    }
  };

  // Filter tasks based on search query (search name, skills, location)
  const filteredTasks = taskData.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.name || "").toLowerCase().includes(q) ||
      (t.skills || "").toLowerCase().includes(q) ||
      (t.location || "").toLowerCase().includes(q) ||
      (t.project_id || "").toLowerCase().includes(q)
    );
  });

  // Handle tab click and update URL
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const formattedTab = encodeURIComponent(tab); // e.g., "My Bidding" -> "My%20Bidding"
    navigate(`/user/work-list/${formattedTab}`);
  };

  // Slider settings
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

  // Helper: map activeTab to download type string
  const downloadTypeFromTab = (tab) => {
    if (tab === "My Bidding") return "bidding";
    if (tab === "My Hire") return "my-hire";
    return "emergency";
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4 mt-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
      </div>

      {/* Top Banner Slider */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        {bannerLoading ? (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            Loading banners...
          </p>
        ) : bannerError ? (
          <p className="absolute inset-0 flex items-center justify-center text-red-500">
            Error: {bannerError}
          </p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((banner, index) => (
              <div key={index}>
                <img
                  src={banner || "/src/assets/profile/default.png"}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/profile/default.png";
                  }}
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

      {/* Work Section */}
      <div className="container max-w-full mx-auto my-10">
        <div className="text-xl sm:text-2xl max-w-5xl text-center mb-5 font-bold mx-auto">
          My Hiring
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-[200px] bg-gray-100 p-2 mb-6">
          {["My Bidding", "My Hire", "Emergency Tasks"].map((tab) => (
            <button
              key={tab}
              className={`px-9 py-1 rounded-full font-semibold ${
                activeTab === tab ? "bg-[#228B22] text-white" : "text-[#228B22] border border-[#228b22]"
              }`}
              onClick={() => handleTabClick(tab)}
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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            />
            <input
              className="rounded-lg pl-10 pr-4 py-2 w-full bg-[#F5F5F5] focus:outline-none"
              type="search"
              placeholder="Search for services"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Dynamic Task List */}
        <div className="space-y-6 max-w-5xl justify-center mx-auto">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center">No {activeTab} available.</div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="flex bg-white rounded-xl shadow-md overflow-hidden">
                {/* Left Image Section */}
                <div className="relative w-1/3">
                  <img src={task.image} alt={task.name} className="h-full w-full object-cover" />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-1 rounded-full">
                    {task.project_id}
                  </span>
                </div>

                {/* Right Content Section */}
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-800">{task.name}</h2>

                    <div className="text-sm text-[#334247] font-semibold flex flex-col items-end">
                      <span>Posted Date: {task.date}</span>

                      <button
                        onClick={() => handledownload(task.id, downloadTypeFromTab(activeTab))}
                        className="text-blue-600 hover:underline text-xs mt-1 flex items-center gap-2"
                        disabled={downloadingIds.includes(task.id)}
                        title="Download Invoice PDF"
                      >
                        <img src={pdf} alt="Download PDF" className="w-6 h-6" />
                        {downloadingIds.includes(task.id) ? (
                          <span className="text-xs">Downloading...</span>
                        ) : (
                          <span className="text-xs">Download PDF</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-[#334247] mt-2">
                    {(() => {
                      const words = (task.skills || "").split(" ");
                      const limitedText = words.slice(0, 40).join(" ");
                      return words.length > 40 ? `${limitedText}...` : limitedText;
                    })()}
                  </p>

                  <p className="text-green-600 font-bold mt-3">{task.price}</p>

                  <div className="flex justify-between items-start">
                    <p className="text-sm text-[#334247] mt-1 font-semibold">Completion Date: {task.completiondate}</p>
                    <p
                      className={`text-sm font-semibold px-2 py-1 rounded ${
                        task.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : task.status === "cancelled"
                          ? "bg-red-200 text-red-800"
                          : task.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : task.status === "cancelledDispute"
                          ? "bg-orange-200 text-orange-800"
                          : task.status === "accepted"
                          ? "bg-blue-200 text-blue-800"
                          : ""
                      }`}
                    >
                      Project Status:{" "}
                      {String(task.status)
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </p>
                  </div>

                  <div className="mt-3"></div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-800 flex items-center px-1 py-1 rounded-full text-sm mt-2 w-fit">
                      <FaMapMarkerAlt size={25} color="#228B22" className="mr-2" /> {task.location}
                    </span>

                    <button
                      className="text-[#228B22] py-1 px-7 border border-[#228B22] rounded-lg"
                      onClick={() => {
                        const tabRoutes = {
                          "My Bidding": "bidding",
                          "My Hire": "my-hire",
                          "Emergency Tasks": "emergency",
                        };
                        const route = tabRoutes[activeTab];
                        navigate(`/${route}/order-detail/${task.id}`);
                      }}
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
          <button className="py-2 px-8 text-white rounded-full bg-[#228B22]">See All</button>
        </div>

        {/* Bottom Banner Slider (same as top) */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          {bannerLoading ? (
            <p className="absolute inset-0 flex items-center justify-center text-gray-500">Loading banners...</p>
          ) : bannerError ? (
            <p className="absolute inset-0 flex items-center justify-center text-red-500">Error: {bannerError}</p>
          ) : bannerImages.length > 0 ? (
            <Slider {...sliderSettings}>
              {bannerImages.map((banner, index) => (
                <div key={index}>
                  <img
                    src={banner || "/src/assets/profile/default.png"}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/profile/default.png";
                    }}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="absolute inset-0 flex items-center justify-center text-gray-500">No banners available</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
