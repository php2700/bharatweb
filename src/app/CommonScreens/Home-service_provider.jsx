// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../../component/Header";
// import Footer from "../../component/footer";
// import Hiring from "../../assets/Home-SP/hiring1.png";
// import Bidding from "../../assets/Home-SP/bidding.png";
// import Emergency from "../../assets/Home-SP/emergency.png";
// import Promise from "../../assets/Home-SP/promise.png";
// import Paper from "../../assets/Home-SP/paper.svg";
// import Vector from "../../assets/Home-SP/Vector.svg";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Swal from "sweetalert2";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserProfile } from "../../redux/userSlice";
// import defaultWorkImage from "../../assets/directHiring/his-work.png";
// import { FaMapMarkerAlt } from "react-icons/fa";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const IMAGE_URL = import.meta.env.VITE_SOCKET_URL;
// export default function ServiceProviderHome() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("bharat_token");
//   const { profile } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const [bannerImages, setBannerImages] = useState([]);
//   const [bannerLoading, setBannerLoading] = useState(false);
//   const [bannerError, setBannerError] = useState(null);

//   const [directHiring, setDirectHiring] = useState([]);
//   const [directHiringLoading, setDirectHiringLoading] = useState(false);
//   const [directHiringError, setDirectHiringError] = useState(null);

//   const [bidding, setBidding] = useState([]);
//   const [biddingLoading, setBiddingLoading] = useState(false);
//   const [biddingError, setBiddingError] = useState(null);

//   const [emergency, setEmergency] = useState([]);
//   const [emergencyLoading, setEmergencyLoading] = useState(false);
//   const [emergencyError, setEmergencyError] = useState(null);
//   const [expanded, setExpanded] = useState({});
//   const [expandedLocation, setExpandedLocation] = useState(null);

//   const capitalizeFirst = (str) => {
//     if (!str) return "";
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   const toggleExpand = (id) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // Fetch banner images
//   const fetchBannerImages = async () => {
//     try {
//       setBannerLoading(true);
//       const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       // console.log("Banner API response:", data);

//       if (res.ok) {
//         if (Array.isArray(data.images) && data.images.length > 0) {
//           setBannerImages(data.images);
//         } else {
//           setBannerImages([]);
//           setBannerError("No banners available");
//         }
//       } else {
//         const errorMessage =
//           data.message || `HTTP error ${res.status}: ${res.statusText}`;
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

//   // Fetch direct hiring
//   const fetchDirectHiring = async () => {
//     try {
//       setDirectHiringLoading(true);
//       const res = await fetch(`${BASE_URL}/direct-order/getOrdersByProvider`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       // console.log("Direct Hiring API response:", data);

//       if (res.ok) {
//         if (Array.isArray(data.data)) {
//           setDirectHiring(
//             data.data.map((item) => ({
//               id: item._id,
//               image: item.image_url[0] || defaultWorkImage,
//               work: item.title || "Make a chair",
//               description:
//                 item.description ||
//                 "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//               amount: item.service_payment.amount || "0",
//               location: item.address || "Indore M.P.",
//             }))
//           );
//         } else {
//           setDirectHiring([]);
//           setDirectHiringError("No direct hiring tasks available");
//         }
//       } else {
//         const errorMessage =
//           data.message || `HTTP error ${res.status}: ${res.statusText}`;
//         console.error("Failed to fetch direct hiring:", errorMessage);
//         setDirectHiringError(errorMessage);
//       }
//     } catch (err) {
//       console.error("Error fetching direct hiring:", err.message);
//       setDirectHiringError(err.message);
//     } finally {
//       setDirectHiringLoading(false);
//     }
//   };

//   // Fetch bidding
//   const fetchBidding = async () => {
//     try {
//       setBiddingLoading(true);
//       const res = await fetch(
//         `${BASE_URL}/bidding-order/getAvailableBiddingOrders`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();
//       // console.log("Bidding API response:", data);

//       if (res.ok) {
//         if (Array.isArray(data.data)) {
//           setBidding(
//             data.data.map((item) => ({
//               id: item._id,
//               image: item.image_url[0] || defaultWorkImage,
//               work: item.title || "Make a chair",
//               description:
//                 item.description ||
//                 "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//               amount: item.cost || "0",
//               location: item.address || "Indore M.P.",
//             }))
//           );
//         } else {
//           setBidding([]);
//           setBiddingError("No bidding tasks available");
//         }
//       } else {
//         const errorMessage =
//           data.message || `HTTP error ${res.status}: ${res.statusText}`;
//         console.error("Failed to fetch bidding:", errorMessage);
//         setBiddingError(errorMessage);
//       }
//     } catch (err) {
//       console.error("Error fetching bidding:", err.message);
//       setBiddingError(err.message);
//     } finally {
//       setBiddingLoading(false);
//     }
//   };

//   // Fetch emergency
//   const fetchEmergency = async () => {
//     try {
//       setEmergencyLoading(true);
//       const res = await fetch(
//         `${BASE_URL}/emergency-order/filtered-emergency-orders`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();
//       // console.log("Emergency API response:", data);

//       if (res.ok) {
//         if (Array.isArray(data.data)) {
//           console.log(data.data, "ffff");
//           setEmergency(
//             data?.data.map((item) => ({
//               id: item._id,
//               image: item.image_urls[0] || defaultWorkImage,
//               work: item.title || "Emergency task",

//               description: item.description || "No description",
//               amount: item.service_payment.amount || "0",
//               location: item.google_address || "Indore M.P.",
//             }))
//           );
//         } else {
//           setEmergency([]);
//           setEmergencyError("No emergency tasks available");
//         }
//       } else {
//         const errorMessage =
//           data.message || `HTTP error ${res.status}: ${res.statusText}`;
//         console.error("Failed to fetch emergency:", errorMessage);
//         setEmergencyError(errorMessage);
//       }
//     } catch (err) {
//       console.error("Error fetching emergency:", err.message);
//       setEmergencyError(err.message);
//     } finally {
//       setEmergencyLoading(false);
//     }
//   };
//   const handleSeeAll = (route) => {
//     if (!token) {
//       Swal.fire({
//         title: "Login Required",
//         text: "You need to login to view all tasks!",
//         icon: "warning",
//         confirmButtonText: "Go to Login",
//         confirmButtonColor: "#228B22",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/login");
//         }
//       });
//       return;
//     }
//     navigate(route);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchBannerImages();
//     fetchDirectHiring();
//     fetchBidding();
//     fetchEmergency();
//   }, [navigate, token]);

//   let isEmergencyOn = false;
//   if (profile) {
//     isEmergencyOn = profile.isEmergency || false;
//   }

//   const handleToggle = async () => {
//     if (!token) {
//       Swal.fire({
//         title: "Login Required",
//         text: "You need to login to update emergency status!",
//         icon: "warning",
//         confirmButtonText: "Go to Login",
//         confirmButtonColor: "#228B22",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/login");
//         }
//       });
//       return;
//     }

//     const newEmergencyState = !isEmergencyOn;
//     try {
//       const response = await fetch(`${BASE_URL}/user/emergency`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ isEmergencyOn: newEmergencyState }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update emergency status");
//       }

//       dispatch(fetchUserProfile());
//       fetchEmergency();
//     } catch (error) {
//       console.error("Error updating emergency status:", error);
//       Swal.fire({
//         title: "Error",
//         text: "Failed to update emergency status. Please try again.",
//         icon: "error",
//         confirmButtonColor: "#228B22",
//       });
//     }
//   };

//   const handlePlan = () => {
//     if (!token) {
//       Swal.fire({
//         title: "Login Required",
//         text: "You need to login to access subscription plans!",
//         icon: "warning",
//         confirmButtonText: "Go to Login",
//         confirmButtonColor: "#228B22",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           navigate("/login");
//         }
//       });
//       return;
//     }
//     navigate("/subscription");
//   };

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

//   // Limit cards to 4 for display
//   const visibleDirectHiring = directHiring.slice(0, 4);
//   const visibleBidding = bidding.slice(0, 4);
//   const visibleEmergency = emergency.slice(0, 4);
//   return (
//     <>
//       <Header />
//       {token ? (
//         <>
//           {/* First Full Width Image with Slider */}
//           <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-20">
//             {bannerLoading ? (
//               <p className="absolute inset-0 flex items-center justify-center text-gray-500">
//                 Loading banners...
//               </p>
//             ) : bannerError ? (
//               <p className="absolute inset-0 flex items-center justify-center text-red-500">
//                 Error: {bannerError}
//               </p>
//             ) : bannerImages.length > 0 ? (
//               <Slider {...sliderSettings}>
//                 {bannerImages.map((banner, index) => (
//                   <div key={index}>
//                     <img
//                       src={banner || "/src/assets/Home-SP/default.png"}
//                       alt={`Banner ${index + 1}`}
//                       className="w-full h-[400px] object-cover"
//                       onError={(e) => {
//                         e.target.src = "/src/assets/Home-SP/default.png";
//                       }}
//                     />
//                   </div>
//                 ))}
//               </Slider>
//             ) : (
//               <p className="absolute inset-0 flex items-center justify-center text-gray-500">
//                 No banners available
//               </p>
//             )}
//           </div>

//           {/* Second Image with Button */}
//           <div className="w-[90%] mx-auto relative mt-8">
//             <img
//               src={Promise}
//               alt="Second Banner"
//               className="w-full rounded-2xl object-cover h-[150px] border border-[#228B22] max-md:h-[120px]"
//             />

//             {/* Desktop Layout: Circle + Text on left, Button on right */}
//             <div className="hidden max-md:!hidden md:flex items-center absolute top-1/2 -translate-y-1/2 left-[100px] gap-[100px]">
//               <div className="flex items-center gap-[100px]">
//                 <div className="w-[100px] h-[100px] bg-white rounded-full shadow flex items-center justify-center">
//                   <img src={Paper} alt="Icon" className="w-12 h-12" />
//                 </div>
//                 <div className="flex flex-col">
//                   <h2 className="text-2xl font-semibold text-black">
//                     Pro Plan
//                   </h2>
//                   <p className="text-xl text-gray-600 mt-1">
//                     Expiry on: 15 Aug 2025
//                   </p>
//                   <span className="text-lg font-bold text-gray-800 mt-1">
//                     Subscription
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="hidden max-md:!hidden md:block absolute right-[100px] top-1/2 -translate-y-1/2">
//               <button
//                 onClick={handlePlan}
//                 className="bg-[#228B22] hover:bg-green-800 text-white px-6 py-2 rounded-xl shadow"
//               >
//                 Upgrade Now
//               </button>
//             </div>

//             {/* Mobile Layout: Button on right, Circle + Text to its right */}
//             <div className="md:hidden flex flex-row-reverse items-center absolute top-1/2 -translate-y-1/2 right-4 gap-3">
//               <button
//                 onClick={handlePlan}
//                 className="bg-[#228B22] hover:bg-green-800 text-white px-4 py-1 rounded-xl shadow"
//               >
//                 Upgrade Now
//               </button>
//               <div className="flex items-center gap-3">
//                 <div className="w-[70px] h-[70px] bg-white rounded-full shadow flex items-center justify-center">
//                   <img src={Paper} alt="Icon" className="w-8 h-8" />
//                 </div>
//                 <div className="flex flex-col">
//                   <h2 className="text-lg font-semibold text-black">Pro Plan</h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Expiry on: 15 Aug 2025
//                   </p>
//                   <span className="text-sm font-bold text-gray-800 mt-1">
//                     Subscription
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Emergency Toggle Section */}
//           <div className="md:w-[70%] w-[90%] mx-auto mt-8 flex items-center justify-between p-4 rounded-lg border border-white shadow-lg bg-[#CEFFDE]">
//             <div className="flex items-center gap-2">
//               <img src={Vector} alt="Warning Icon" className="w-6 h-6" />
//               <span className="text-black font-medium text-lg max-md:text-sm">
//                 Are you ready for Emergency task?
//               </span>
//             </div>
//             <div className="toggle-wrapper">
//               <button
//                 onClick={handleToggle}
//                 className={`toggle-button w-[40px] h-[25px] flex items-center rounded-full p-1 transition-colors duration-300 ${
//                   isEmergencyOn
//                     ? "bg-[#228B22] justify-end"
//                     : "bg-[#DF1414] justify-start"
//                 }`}
//                 style={{
//                   width: "40px",
//                   height: "25px",
//                   minWidth: "40px",
//                   minHeight: "25px",
//                 }}
//                 aria-label={
//                   isEmergencyOn
//                     ? "Disable emergency task"
//                     : "Enable emergency task"
//                 }
//                 aria-checked={isEmergencyOn}
//               >
//                 <div className="w-[15px] h-[15px] bg-white rounded-full shadow-md"></div>
//               </button>
//             </div>
//           </div>

//           {/* Recent Direct Hiring Section */}
//           <div className="w-full bg-[#EDFFF3] py-12 mt-10">
//             <div className="max-w-[90%] mx-auto">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-black max-md:text-lg">
//                   Recent Direct Hiring
//                 </h2>
//                 {directHiring.length > 4 && (
//                   <button
//                     onClick={() => handleSeeAll("/worker/work-list/My Hire")}
//                     className="text-black font-medium text-base cursor-pointer max-md:text-sm hover:text-[#228B22]"
//                   >
//                     See All
//                   </button>
//                 )}
//               </div>

//               {directHiringLoading ? (
//                 <p className="text-gray-500 text-center">
//                   Loading direct hiring tasks...
//                 </p>
//               ) : directHiringError ? (
//                 <p className="text-red-500 text-center">
//                   Error: {directHiringError}
//                 </p>
//               ) : directHiring.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {visibleDirectHiring.map((card, index) => (
//                     <div
//                       key={index}
//                       className="bg-white rounded-xl shadow-md p-2"
//                     >
//                       <div className="relative w-full">
//                         <img
//                           src={card.image}
//                           alt={capitalizeFirst(card.work)}
//                           className="w-full h-36 object-cover rounded-2xl"
//                         />
//                         {/* <div
//                           className="absolute bottom-2 right-2 px-4 py-1 rounded-full text-white text-sm"
//                           style={{ backgroundColor: "#372E27" }}
//                         >
//                           Add Feature
//                         </div> */}
//                       </div>
//                       <div className="flex items-center justify-between mt-2">
//                         <h3 className="text-xl font-semibold text-[#228B22] max-md:text-lg">
//                           {capitalizeFirst(card.work)}
//                         </h3>
//                         <p className="text-black font-medium max-md:text-sm">
//                           ₹{card.amount}
//                         </p>
//                       </div>
//                       <p
//                         key={card._id}
//                         className="text-gray-600 max-w-[87%] text-xs mt-1"
//                       >
//                         {expanded[card._id]
//                           ? capitalizeFirst(card.description)
//                           : capitalizeFirst(card.description).slice(0, 80)}

//                         {card.description.length > 80 && (
//                           <span
//                             onClick={() => toggleExpand(card._id)}
//                             className="text-blue-600 cursor-pointer ml-1"
//                           >
//                             {expanded[card._id] ? "See less" : "... See more"}
//                           </span>
//                         )}
//                       </p>

//                       <div className="flex items-center gap-2 px-0 mt-2 rounded-full text-gray-600 text-sm">
//                         <FaMapMarkerAlt
//                           className="text-[#228B22] flex-shrink-0"
//                           size={20}
//                         />

//                         <span className="truncate max-w-[200px]">
//                           {expandedLocation === card._id
//                             ? capitalizeFirst(card.location)
//                             : capitalizeFirst(card.location).slice(0, 30)}
//                         </span>

//                         {card.location.length > 30 && (
//                           <span
//                             onClick={() =>
//                               setExpandedLocation(
//                                 expandedLocation === card._id ? null : card._id
//                               )
//                             }
//                             className="text-blue-600 cursor-pointer text-xs ml-1"
//                           >
//                             {expandedLocation === card._id
//                               ? "See less"
//                               : "See more"}
//                           </span>
//                         )}
//                       </div>

//                       <div
//                         className="px-1 py-1 mt-2 rounded-lg text-[#228B22] text-base border border-[#228B22] w-[60%] font-semibold text-center mx-auto cursor-pointer hover:bg-[#228B22] hover:text-white transition max-md:text-sm"
//                         onClick={() =>
//                           navigate(`/hire/worker/order-detail/${card.id}`)
//                         }
//                       >
//                         View Details
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center">
//                   No direct hiring tasks available
//                 </p>
//               )}
//             </div>

//             {/* Bidding */}
//             <div className="max-w-[90%] mx-auto mt-[100px]">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-black max-md:text-lg">
//                   Bidding
//                 </h2>
//                 {bidding.length > 4 && (
//                   <button
//                     onClick={() => handleSeeAll("/bidding/recent-post")}
//                     className="text-black font-medium text-base cursor-pointer max-md:text-sm hover:text-[#228B22]"
//                   >
//                     See All
//                   </button>
//                 )}
//               </div>

//               {biddingLoading ? (
//                 <p className="text-gray-500 text-center">
//                   Loading bidding tasks...
//                 </p>
//               ) : biddingError ? (
//                 <p className="text-red-500 text-center">
//                   Error: {biddingError}
//                 </p>
//               ) : bidding.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {visibleBidding.map((card, index) => (
//                     <div
//                       key={index}
//                       className="bg-white rounded-xl shadow-md p-2"
//                     >
//                       <div className="relative w-full">
//                         <img
//                           src={
//                             card.image
//                               ? card.image
//                               : "/src/assets/directHiring/his-work.png"
//                           }
//                           alt={capitalizeFirst(card.work)}
//                           className="w-full h-36 object-cover rounded-2xl"
//                         />
//                         {/* <div
//                           className="absolute bottom-2 right-2 px-4 py-1 rounded-full text-white text-sm"
//                           style={{ backgroundColor: "#372E27" }}
//                         >
//                           Add Feature
//                         </div> */}
//                       </div>
//                       <div className="flex items-center justify-between mt-2">
//                         <h3 className="text-xl font-semibold text-[#228B22] max-md:text-lg">
//                           {capitalizeFirst(card.work)}
//                         </h3>
//                         <p className="text-black font-medium max-md:text-sm">
//                           ₹{card.amount}
//                         </p>
//                       </div>
//                       <p
//                         key={card._id}
//                         className="text-gray-600 max-w-[87%] text-xs mt-1"
//                       >
//                         {expanded[card._id]
//                           ? capitalizeFirst(card.description)
//                           : capitalizeFirst(card.description).slice(0, 80)}

//                         {card.description.length > 80 && (
//                           <span
//                             onClick={() => toggleExpand(card._id)}
//                             className="text-blue-600 cursor-pointer ml-1"
//                           >
//                             {expanded[card._id] ? "See less" : "... See more"}
//                           </span>
//                         )}
//                       </p>

//                       <div className="flex items-center gap-2 px-0 mt-2 rounded-full text-gray-600 text-sm">
//                         <FaMapMarkerAlt
//                           className="text-[#228B22] flex-shrink-0"
//                           size={20}
//                         />

//                         <span className="truncate max-w-[200px]">
//                           {expandedLocation === card._id
//                             ? capitalizeFirst(card.location)
//                             : capitalizeFirst(card.location).slice(0, 30)}
//                         </span>

//                         {card.location.length > 30 && (
//                           <span
//                             onClick={() =>
//                               setExpandedLocation(
//                                 expandedLocation === card._id ? null : card._id
//                               )
//                             }
//                             className="text-blue-600 cursor-pointer text-xs ml-1"
//                           >
//                             {expandedLocation === card._id
//                               ? "See less"
//                               : "See more"}
//                           </span>
//                         )}
//                       </div>

//                       <div
//                         className="px-1 py-1 mt-2 rounded-lg text-[#228B22] text-base border border-[#228B22] w-[60%] font-semibold text-center mx-auto cursor-pointer hover:bg-[#228B22] hover:text-white transition max-md:text-sm"
//                         onClick={() =>
//                           navigate(`/bidding/worker/order-detail/${card.id}`)
//                         }
//                       >
//                         View Details
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center">
//                   No bidding tasks available
//                 </p>
//               )}
//             </div>

//             {/* Emergency */}
//             {isEmergencyOn ? (
//               <div className="max-w-[90%] mx-auto mt-[100px]">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black max-md:text-lg">
//                     Emergency
//                   </h2>
//                   {emergency.length > 4 && (
//                     <button
//                       onClick={() => handleSeeAll("/emergency/tasks")}
//                       className="text-black font-medium text-base cursor-pointer max-md:text-sm hover:text-[#228B22]"
//                     >
//                       See All
//                     </button>
//                   )}
//                 </div>
//                 {emergencyLoading ? (
//                   <p className="text-gray-500 text-center">
//                     Loading emergency tasks...
//                   </p>
//                 ) : // : emergencyError ? (
//                 //   <p className="text-red-500 text-center">
//                 //     Please Turn on Emergency Button to get Emergency Task
//                 //   </p>
//                 // )

//                 emergency.length > 0 ? (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {visibleEmergency.map((card, index) => (
//                       <div
//                         key={index}
//                         className="bg-white rounded-xl shadow-md p-2"
//                       >
//                         <div className="relative w-full">
//                           <img
//                             src={
//                               card.image
//                                 ? card.image
//                                 : "/src/assets/directHiring/his-work.png"
//                             }
//                             alt={capitalizeFirst(card.work)}
//                             className="w-full h-36 object-cover rounded-2xl"
//                           />
//                         </div>
//                         <div className="flex items-center justify-between mt-2">
//                           <h3 className="text-xl font-semibold text-[#228B22] max-md:text-lg">
//                             {capitalizeFirst(card.work)}
//                           </h3>
//                           {/*<p className="text-black font-medium max-md:text-sm">
//                             ₹{card.amount}
//                           </p>*/}
//                         </div>
//                         <p
//                           key={card._id}
//                           className="text-gray-600 max-w-[87%] text-xs mt-1"
//                         >
//                           {expanded[card._id]
//                             ? capitalizeFirst(card.description)
//                             : capitalizeFirst(card.description).slice(0, 80)}

//                           {card.description.length > 80 && (
//                             <span
//                               onClick={() => toggleExpand(card._id)}
//                               className="text-blue-600 cursor-pointer ml-1"
//                             >
//                               {expanded[card._id] ? "See less" : "... See more"}
//                             </span>
//                           )}
//                         </p>
//                         <div className="flex items-center gap-2 px-0 mt-2 rounded-full text-gray-600 text-sm">
//                           <FaMapMarkerAlt
//                             className="text-[#228B22] flex-shrink-0"
//                             size={20}
//                           />

//                           <span className="truncate max-w-[400px]">
//                             {expandedLocation === card._id
//                               ? capitalizeFirst(card.location)
//                               : capitalizeFirst(card.location).slice(0, 30)}
//                           </span>

//                           {card.location.length > 30 && (
//                             <span
//                               onClick={() =>
//                                 setExpandedLocation(
//                                   expandedLocation === card._id
//                                     ? null
//                                     : card._id
//                                 )
//                               }
//                               className="text-blue-600 cursor-pointer text-xs ml-1"
//                             >
//                               {expandedLocation === card._id
//                                 ? "See less"
//                                 : "See more"}
//                             </span>
//                           )}
//                         </div>
//                         <div
//                           className="px-1 py-1 mt-2 rounded-lg text-[#228B22] text-base border border-[#228B22] w-[60%] font-semibold text-center mx-auto cursor-pointer hover:bg-[#228B22] hover:text-white transition max-md:text-sm"
//                           onClick={() =>
//                             navigate(`/emergency/worker/${card.id}`)
//                           }
//                         >
//                           View Details
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 text-center">
//                     No emergency tasks available
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <div className="max-w-[90%] mx-auto mt-[100px]">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-black max-md:text-lg">
//                     Emergency
//                   </h2>
//                 </div>
//                 <p className="text-red-500 text-center">
//                   Please Turn on Emergency Button to get Emergency Task
//                 </p>
//               </div>
//             )}
//           </div>
//         </>
//       ) : (
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-gray-500">Please log in to view content.</p>
//         </div>
//       )}
//       <div className="mt-[50px]">
//         <Footer />
//       </div>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Promise from "../../assets/Home-SP/promise.png";
import Paper from "../../assets/Home-SP/paper.svg";
import Vector from "../../assets/Home-SP/Vector.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userSlice";
import defaultWorkImage from "../../assets/directHiring/his-work.png";
import { FaMapMarkerAlt } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ServiceProviderHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem("bharat_token");
  const { profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerError, setBannerError] = useState(null);

  const [directHiring, setDirectHiring] = useState([]);
  const [directHiringLoading, setDirectHiringLoading] = useState(false);
  const [directHiringError, setDirectHiringError] = useState(null);

  const [bidding, setBidding] = useState([]);
  const [biddingLoading, setBiddingLoading] = useState(false);
  const [biddingError, setBiddingError] = useState(null);

  const [emergency, setEmergency] = useState([]);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState(null);

  // States
  const [expandedDesc, setExpandedDesc] = useState({});
  const [expandedLoc, setExpandedLoc] = useState({});

  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const toggleDesc = (id) => {
    setExpandedDesc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLoc = (id) => {
    setExpandedLoc((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Helper Component for Rendering Description (Fixes Overflow) ---
  const DescriptionText = ({ text, id }) => {
    const isExpanded = expandedDesc[id];
    const limit = 60; // Characters limit
    const displayText = isExpanded ? text : text.slice(0, limit);
    const showButton = text.length > limit;

    return (
      <div className="text-gray-600 text-xs mt-2 w-full">
        <p className="break-words whitespace-normal leading-relaxed">
          {capitalizeFirst(displayText)}
          {!isExpanded && showButton && "..."}
          
          {showButton && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleDesc(id);
              }}
              className="text-blue-600 font-semibold cursor-pointer ml-1 hover:underline"
            >
              {isExpanded ? "See less" : "See more"}
            </span>
          )}
        </p>
      </div>
    );
  };

  // --- Helper Component for Rendering Location (Fixes Alignment) ---
  const LocationText = ({ text, id }) => {
    const isExpanded = expandedLoc[id];
    const limit = 35; // Characters limit
    const displayText = isExpanded ? text : text.slice(0, limit);
    const showButton = text.length > limit;

    return (
      <div className="flex items-start gap-2 mt-2 text-gray-600 text-sm w-full">
        <FaMapMarkerAlt className="text-[#228B22] flex-shrink-0 mt-1" size={16} />
        <div className="flex-1 min-w-0">
          <p className="break-words whitespace-normal leading-tight text-xs">
            {capitalizeFirst(displayText)}
            {!isExpanded && showButton && "..."}
            
            {showButton && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLoc(id);
                }}
                className="text-blue-600 font-semibold cursor-pointer ml-1 hover:underline whitespace-nowrap"
              >
                {isExpanded ? "See less" : "See more"}
              </span>
            )}
          </p>
        </div>
      </div>
    );
  };

  // ... (API Calls remain exactly the same as before) ...
  const fetchBannerImages = async () => {
    try {
      setBannerLoading(true);
      const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && Array.isArray(data.images)) setBannerImages(data.images);
      else setBannerImages([]);
    } catch (err) { setBannerError(err.message); } finally { setBannerLoading(false); }
  };

  const fetchDirectHiring = async () => {
    try {
      setDirectHiringLoading(true);
      const res = await fetch(`${BASE_URL}/direct-order/getOrdersByProvider`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setDirectHiring(data.data.map((item) => ({
          id: item._id, image: item.image_url[0] || defaultWorkImage, work: item.title, description: item.description, amount: item.service_payment.amount, location: item.address
        })));
      } else setDirectHiring([]);
    } catch (err) { setDirectHiringError(err.message); } finally { setDirectHiringLoading(false); }
  };

  const fetchBidding = async () => {
    try {
      setBiddingLoading(true);
      const res = await fetch(`${BASE_URL}/bidding-order/getAvailableBiddingOrders`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setBidding(data.data.map((item) => ({
          id: item._id, image: item.image_url[0] || defaultWorkImage, work: item.title, description: item.description, amount: item.cost, location: item.address
        })));
      } else setBidding([]);
    } catch (err) { setBiddingError(err.message); } finally { setBiddingLoading(false); }
  };

  const fetchEmergency = async () => {
    try {
      setEmergencyLoading(true);
      const res = await fetch(`${BASE_URL}/emergency-order/filtered-emergency-orders`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setEmergency(data.data.map((item) => ({
          id: item._id, image: item.image_urls[0] || defaultWorkImage, work: item.title, description: item.description, amount: item.service_payment.amount, location: item.google_address
        })));
      } else setEmergency([]);
    } catch (err) { setEmergencyError(err.message); } finally { setEmergencyLoading(false); }
  };

  const handleSeeAll = (route) => {
    if (!token) return navigate("/login");
    navigate(route);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!token) { navigate("/login"); return; }
    fetchBannerImages();
    fetchDirectHiring();
    fetchBidding();
    fetchEmergency();
  }, [navigate, token]);

  // ... (Bank details & Emergency logic same) ...
  let isEmergencyOn = profile ? profile.isEmergency || false : false;

  const handleToggle = async () => {
     if (!token) return navigate("/login");
     // ... logic
     try {
        await fetch(`${BASE_URL}/user/emergency`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isEmergencyOn: !isEmergencyOn }),
        });
        dispatch(fetchUserProfile());
        fetchEmergency();
     } catch (e) { console.error(e) }
  };
  const handlePlan = () => navigate("/account");

  const sliderSettings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000, arrows: true };
  const visibleDirectHiring = directHiring.slice(0, 4);
  const visibleBidding = bidding.slice(0, 4);
  const visibleEmergency = emergency.slice(0, 4);

  return (
    <>
      <Header />
      {token ? (
        <>
          {/* ... Banners ... */}
          <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-20">
             <Slider {...sliderSettings}>
                {bannerImages.map((banner, index) => (
                  <div key={index}><img src={banner} className="w-full h-[400px] object-cover" onError={(e) => { e.target.src = "/src/assets/Home-SP/default.png"; }} /></div>
                ))}
              </Slider>
          </div>
          
           <div className="w-[90%] mx-auto relative mt-8">
            <img src={Promise} className="w-full rounded-2xl object-cover h-[150px] border border-[#228B22]" />
            <div className="hidden max-md:!hidden md:block absolute right-[100px] top-1/2 -translate-y-1/2">
              <button onClick={handlePlan} className="bg-[#228B22] text-white px-6 py-2 rounded-xl shadow">Upgrade Now</button>
            </div>
           </div>

          {/* Emergency Toggle */}
          <div className="md:w-[70%] w-[90%] mx-auto mt-8 flex items-center justify-between p-4 rounded-lg border border-white shadow-lg bg-[#CEFFDE]">
            <div className="flex items-center gap-2">
              <img src={Vector} className="w-6 h-6" />
              <span className="text-black font-medium text-lg max-md:text-sm">Are you ready for Emergency task?</span>
            </div>
            <div className="toggle-wrapper">
               <button onClick={handleToggle} className={`toggle-button w-[40px] h-[25px] flex items-center rounded-full p-1 transition-colors duration-300 ${isEmergencyOn ? "bg-[#228B22] justify-end" : "bg-[#DF1414] justify-start"}`}>
                 <div className="w-[15px] h-[15px] bg-white rounded-full shadow-md"></div>
               </button>
            </div>
          </div>

          {/* --- Direct Hiring Section --- */}
          <div className="w-full bg-[#EDFFF3] py-12 mt-10">
            <div className="max-w-[90%] mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black max-md:text-lg">Recent Direct Hiring</h2>
                {directHiring.length > 4 && (
                  <button onClick={() => handleSeeAll("/worker/work-list/My Hire")} className="text-black font-medium text-base hover:text-[#228B22]">See All</button>
                )}
              </div>

              {directHiringLoading ? <p className="text-center">Loading...</p> : directHiring.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {visibleDirectHiring.map((card) => (
                    <div key={card.id} className="bg-white rounded-xl shadow-md p-3 flex flex-col h-full">
                      <div className="relative w-full h-36">
                        <img src={card.image} alt={card.work} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <h3 className="text-lg font-semibold text-[#228B22] truncate w-[70%]">{capitalizeFirst(card.work)}</h3>
                        <p className="text-black font-medium text-sm">₹{card.amount}</p>
                      </div>

                      {/* Fixed Description */}
                      <DescriptionText text={card.description || "No Description"} id={card.id} />

                      {/* Fixed Location */}
                      <LocationText text={card.location || "Location not available"} id={card.id} />

                      <div className="mt-auto pt-3">
                        <div className="px-1 py-2 rounded-lg text-[#228B22] text-sm border border-[#228B22] w-full font-semibold text-center cursor-pointer hover:bg-[#228B22] hover:text-white transition"
                          onClick={() => navigate(`/hire/worker/order-detail/${card.id}`)}>
                          View Details
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center text-gray-500">No direct hiring tasks</p>}
            </div>

            {/* --- Bidding Section --- */}
            <div className="max-w-[90%] mx-auto mt-[50px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black max-md:text-lg">Bidding</h2>
                {bidding.length > 4 && (
                  <button onClick={() => handleSeeAll("/bidding/recent-post")} className="text-black font-medium hover:text-[#228B22]">See All</button>
                )}
              </div>

              {biddingLoading ? <p className="text-center">Loading...</p> : bidding.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {visibleBidding.map((card) => (
                    <div key={card.id} className="bg-white rounded-xl shadow-md p-3 flex flex-col h-full">
                      <div className="relative w-full h-36">
                        <img src={card.image} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <h3 className="text-lg font-semibold text-[#228B22] truncate w-[70%]">{capitalizeFirst(card.work)}</h3>
                        <p className="text-black font-medium text-sm">₹{card.amount}</p>
                      </div>

                      <DescriptionText text={card.description || "No Description"} id={card.id} />
                      <LocationText text={card.location || "Location not available"} id={card.id} />

                      <div className="mt-auto pt-3">
                        <div className="px-1 py-2 rounded-lg text-[#228B22] text-sm border border-[#228B22] w-full font-semibold text-center cursor-pointer hover:bg-[#228B22] hover:text-white transition"
                          onClick={() => navigate(`/bidding/worker/order-detail/${card.id}`)}>
                          View Details
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-center text-gray-500">No bidding tasks</p>}
            </div>

            {/* --- Emergency Section --- */}
            {isEmergencyOn ? (
              <div className="max-w-[90%] mx-auto mt-[50px] mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black max-md:text-lg">Emergency</h2>
									{console.log("lele", emergency.length)}
                  {emergency.length > 4 && (
                    <button onClick={() => handleSeeAll("/emergency/tasks")} className="text-black font-medium hover:text-[#228B22]">See All</button>
                  )}
                </div>

                {emergencyLoading ? <p className="text-center">Loading...</p> : emergency.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {visibleEmergency.map((card) => (
                      <div key={card.id} className="bg-white rounded-xl shadow-md p-3 flex flex-col h-full">
                        <div className="relative w-full h-36">
                          <img src={card.image} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                           <h3 className="text-lg font-semibold text-[#228B22] truncate w-full">{capitalizeFirst(card.work)}</h3>
                        </div>

                        <DescriptionText text={card.description || "No Description"} id={card.id} />
                        <LocationText text={card.location || "Location not available"} id={card.id} />

                        <div className="mt-auto pt-3">
                          <div className="px-1 py-2 rounded-lg text-[#228B22] text-sm border border-[#228B22] w-full font-semibold text-center cursor-pointer hover:bg-[#228B22] hover:text-white transition"
                            onClick={() => navigate(`/emergency/worker/${card.id}`)}>
                            View Details
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-center text-gray-500">No emergency tasks</p>}
              </div>
            ) : (
               <div className="max-w-[90%] mx-auto mt-[100px] pb-10">
                <h2 className="text-xl font-bold text-black">Emergency</h2>
                <p className="text-red-500 text-center mt-4">Please Turn on Emergency Button to get Emergency Task</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">Please log in.</p>
        </div>
      )}
      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
