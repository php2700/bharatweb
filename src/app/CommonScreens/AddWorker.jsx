// import { useState, useEffect } from "react";
// import axios from "axios";

// import Header from "../../component/Header";
// import Footer from "../../component/footer";
// import editicon from "../../assets/addworker/edit-icon.svg";
// import flag from "../../assets/addworker/flag.png";
// import downarrow from "../../assets/addworker/downarrow.png";
// import dob from "../../assets/addworker/icon.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// // import profile from "../../assets/addworker/bharatprofile.png"
// import profile from "../../assets/addworker/defaultDP.png";


// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function AddWorkerDetails() {
//   const [image, setImage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [countryCode, setCountryCode] = useState("+91");
//   const navigate = useNavigate();
//   const [bannerImages, setBannerImages] = useState([]);
//   const [bannerLoading, setBannerLoading] = useState(true);
//   const [bannerError, setBannerError] = useState(null);
//   const [address, setAddress] = useState();
//   const [showOptions, setShowOptions] = useState();
//   const token = localStorage.getItem("bharat_token");

//   // const [isMapModalOpen, setIsMapModalOpen] = useState(false);



//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     aadharNumber: "",
//     dateOfBirth: "",
//     address: "",
//     aadharImage: null,
//   });

//   const [errors, setErrors] = useState({});
//   const today = new Date();
//   const minDate = new Date(today.getFullYear() - 99, today.getMonth(), today.getDate())
//     .toISOString()
//     .split("T")[0];
//   const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
//     .toISOString()
//     .split("T")[0];

//   // Fetch banner images
//   const fetchBannerImages = async () => {
//     try {
//       const token = localStorage.getItem("bharat_token");
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       console.log("Banner API response:", data); // Debug response

//       if (res.ok) {
//         if (Array.isArray(data.images) && data.images.length > 0) {
//           setBannerImages(data.images);
//         } else {
//           setBannerImages([]);
//           setBannerError("No banners available");
//         }
//       } else {
//         const errorMessage = data.message || `HTTP error ${res.status}: ${res.statusText}`;
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

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     // Check for token on component mount
//     const token = localStorage.getItem("bharat_token");
//     if (!token) {
//       toast.error("You are not logged in. Please log in to continue.");
//       setTimeout(() => navigate("/login"), 2000);
//     }
//     fetchBannerImages();
//   }, [navigate]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg"];
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (!validTypes.includes(file.type)) {
//         toast.error("Please upload a valid image (JPEG, PNG, JPG)");
//         return;
//       }
//       if (file.size > maxSize) {
//         toast.error("Image size must be less than 5MB");
//         return;
//       }
//       setImage(file);
//     }
//   };

//   const handleAadharImageChange = (file) => {
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/jpg"];
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (!validTypes.includes(file.type)) {
//         toast.error("Please upload a valid image (JPEG, PNG, JPG)");
//         return;
//       }
//       if (file.size > maxSize) {
//         toast.error("Image size must be less than 5MB");
//         return;
//       }
//       return file;
//     }
//     return null;
//   };
//   useEffect(() => {
//     window.scrollTo(0, 0);

//     const token = localStorage.getItem("bharat_token");
//     if (!token) {
//       toast.error("You are not logged in. Please log in to continue.");
//       setTimeout(() => navigate("/login"), 2000);
//       return;
//     }

//     // ✅ Load saved address from profile map selection
//     const savedAddress = localStorage.getItem("user_address");
//     if (savedAddress && savedAddress.trim() !== "") {
//       setFormData((prev) => ({ ...prev, address: savedAddress }));
//       console.log("✅ Loaded address from localStorage:", savedAddress);
//     } else {
//       console.log("⚠️ No saved address found in localStorage");
//     }

//     fetchBannerImages();
//   }, [navigate]);


//   const handleInputChange = (field, value) => {
//     let processedValue = value;
//     if (field === "aadharImage") {
//       processedValue = handleAadharImageChange(value);
//       if (!processedValue) return;
//     }
//     setFormData((prev) => ({ ...prev, [field]: processedValue }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   const handleCountryCodeChange = () => {
//     setCountryCode(countryCode === "+91" ? "+1" : "+91");
//   };

//   const validateForm = () => {
//     let newErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";

//     // const phoneNumber = formData.phone.replace(/\D/g, "");
//     // if (!formData.phone) {
//     //   newErrors.phone = "Phone number is required";
//     // } else if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
//     //   newErrors.phone = "Enter a valid 10-digit phone number starting with 6-9";
//     // }
//     // const phoneNumber = formData.phone.replace(/\D/g, ""); // remove non-digits
//     const phoneNumber = formData.phone.trim().replace(/\D/g, "");

//     if (!phoneNumber) {
//       newErrors.phone = "Phone number is required";
//     } else if (phoneNumber.length !== 10) {
//       newErrors.phone = "Phone number must be exactly 10 digits";
//     } else if (!/^[6-9]/.test(phoneNumber)) {
//       newErrors.phone = "Phone number must start with digits 6–9";
//     }


//     const aadharNumber = formData.aadharNumber.replace(/\D/g, "");
//     if (!formData.aadharNumber) {
//       newErrors.aadharNumber = "Aadhar number is required";
//     } else if (!/^\d{12}$/.test(aadharNumber)) {
//       newErrors.aadharNumber = "Aadhar must be exactly 12 digits";
//     }

//     if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";

//     // if (!formData.address.trim()) newErrors.address = "Address is required";

//     if (!formData.aadharImage) newErrors.aadharImage = "Aadhaar image is required";

//     // if (!image) newErrors.image = "Profile image is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem("bharat_token");
//       if (!token) {
//         toast.error("You are not logged in. Please log in to continue.");
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }

//       const bodyData = new FormData();
//       bodyData.append("name", formData.name);
//       bodyData.append("phone", formData.phone);
//       bodyData.append("aadharNumber", formData.aadharNumber);
//       bodyData.append("dob", formData.dateOfBirth);
//       bodyData.append("address", formData.address);
//       bodyData.append("image", image);
//       bodyData.append("aadharImage", formData.aadharImage);
//       bodyData.append("status", "pending");
//       bodyData.append("rejectReason", "");
//       const res = await fetch(`${BASE_URL}/worker/add`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: bodyData,
//       });

//       const data = await res.json();
//       console.log("API Response:", data);

//       if (res.ok && data.success) {
//         toast.success("Worker Added Successfully");
//         setFormData({
//           name: "",
//           phone: "",
//           aadharNumber: "",
//           dateOfBirth: "",
//           address: "",
//           aadharImage: null,
//         });
//         setImage(null);
//         setErrors({});
//         setTimeout(() => {
//           navigate("/workerlist");
//         }, 2000);
//       } else {
//         toast.error(data.message || "Failed to add worker");
//         if (data.message.includes("token")) {
//           navigate("/login");
//         }
//       }
//     } catch (err) {
//       console.error("Error adding worker:", err);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
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
//   const updateAddress = async (location) => {
//     try {
//       let obj = {
//         latitude: location?.latitude,
//         longitude: location?.longitude,
//         address: location?.address,
//       };
//       let res = await axios.put(`${BASE_URL}/user/updateLocation`, obj, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (error) {
//       console.log(error, "gg");
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="min-h-screen px-5 py-6 sm:px-6 lg:px-8">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="w-full max-w-[83rem] xl:max-w-[60rem] shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-3 sm:p-20 space-y-4 lg:ml-[290px]">
//           <div className="max-w-sm mx-auto sm:max-w-md lg:max-w-[36rem]">
//             <div className="flex items-center mb-10">
//               <h1 className="text-[27px] font-[700] text-[#191A1D] flex-1 text-center mr-8">
//                 Add Worker Details
//               </h1>
//             </div>

//             <div className="flex justify-center mb-8">
//               <div className="relative">
//                 <div className="w-48 h-48 rounded-full overflow-hidden p-1">
//                   <div className="w-full h-full rounded-full overflow-hidden">
//                     <img
//                       // src={image ? URL.createObjectURL(image) : profile}
//                       src={image instanceof File ? URL.createObjectURL(image) : image || profile}

//                       alt="Worker profile image"
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = "/src/assets/addworker/default-profile.png"; // fallback if image fails
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   id="profileUpload"
//                   className="hidden"
//                   onChange={handleImageChange}
//                 />
//                 <label
//                   htmlFor="profileUpload"
//                   className="absolute bottom-7 right-2 w-9 h-9 bg-[#228B22] rounded-full flex items-center justify-center cursor-pointer"
//                   aria-label="Upload profile image"
//                 >
//                   <img src={editicon} alt="Edit profile image icon" className="w-5 h-5" />
//                 </label>
//               </div>
//               {errors.image && <p className="text-red-500 text-sm mt-1 text-center">{errors.image}</p>}
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange("name", e.target.value)}
//                   className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
//                   aria-label="Worker name"
//                 />
//                 {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//               </div>

//               <div>
//                 <div className="flex items-center h-[55px] w-full border border-gray-300 rounded-[19px] bg-white px-3 focus-within:border-gray-400">
//                   <div className="flex items-center gap-2 cursor-pointer" onClick={handleCountryCodeChange}>
//                     <img src={flag} alt="Country flag" className="w-5 h-5 object-cover rounded-sm" />
//                     <span className="text-[#000000] font-[700]">{countryCode}</span>
//                     <img src={downarrow} alt="Dropdown arrow" className="w-4 h-4" />
//                   </div>
//                   {/* <input
//                     type="tel"
//                     placeholder="9822515445"
//                     value={formData.phone}
//                     onChange={(e) => handleInputChange("phone", e.target.value)}
//                     className="flex-1 h-[55px] px-3 text-base placeholder:text-gray-400 focus:outline-none"
//                     aria-label="Phone number"
//                   /> */}
//                   <input
//                     type="tel"
//                     placeholder="9822515445"
//                     value={formData.phone}
//                     onChange={(e) => {
//                       // Allow only digits
//                       const onlyDigits = e.target.value.replace(/\D/g, "");
//                       handleInputChange("phone", onlyDigits);
//                     }}
//                     maxLength="10"
//                     className="flex-1 h-[55px] px-3 text-base placeholder:text-gray-400 focus:outline-none"
//                     aria-label="Phone number"
//                   />

//                 </div>
//                 {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//               </div>

//               <input
//                 type="text"
//                 placeholder="Aadhar Number"
//                 value={formData.aadharNumber}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "aadharNumber",
//                     e.target.value.replace(/\D/g, "").slice(0, 12) // Limit to 12 digits
//                   )
//                 }
//                 className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
//                 aria-label="Aadhaar number"
//               />



//               <div
//                 className="relative"
//                 onClick={() => document.getElementById("dob-input").showPicker?.()}
//               >
//                 <input
//                   id="dob-input"
//                   type="date"
//                   value={formData.dateOfBirth}
//                   onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
//                   className="h-[55px] text-base border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] pr-12 w-full px-3 cursor-pointer"
//                   aria-label="Date of birth"
//                   min={minDate}
//                   max={maxDate}
//                 />
//                 <img
//                   src={dob}
//                   alt="Calendar icon"
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
//                 />
//                 {errors.dateOfBirth && (
//                   <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
//                 )}
//               </div>


//               {/* <div>
//                 <input
//                   type="text"
//                   placeholder="Address"
//                   value={formData.address}
//                   onChange={(e) => handleInputChange("address", e.target.value)}
//                   className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
//                   aria-label="Address"
//                 />
//                 {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//               </div> */}
//               {/* <div>
//                 <input
//                   type="text"
//                   placeholder="Address"
//                   value={formData.address}
//                   onChange={(e) => handleInputChange("address", e.target.value)}
//                   className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
//                   aria-label="Address"
//                 />
//                 {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
//               </div> */}
//               <label className="block">
//                 <span className="text-sm font-medium text-gray-600 flex items-center justify-between">
//                   Address
//                 </span>
//                 <div className="relative">
//                   <input
//                     id="address-input"
//                     type="text"
//                     readOnly
//                     value={address || profile?.location?.address}
//                     placeholder="Enter or select address"
//                     className="mt-1 block w-full rounded-lg border border-gray-300 pr-9 pl-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
//                     aria-invalid={errors.address ? "true" : "false"}
//                     onClick={() => setShowOptions(!showOptions)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowOptions(!showOptions)}
//                     className="absolute right-3 top-2 px-2 py-1 text-sm rounded-lg border bg-gray-100 hover:bg-gray-200"
//                   >
//                     {showOptions ? "▲" : "▼"}
//                   </button>
//                   {showOptions && (
//                     <div className="absolute top-full left-0 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg p-3 z-50">
//                       {profile?.full_address?.map((loc) => (
//                         <label
//                           key={loc.address}
//                           className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
//                         >
//                           <input
//                             type="radio"
//                             name="address"
//                             value={loc.address}
//                             checked={address === loc.address}
//                             onClick={() => {
//                               setAddress(loc.address);
//                               setShowOptions(false);
//                               updateAddress(loc);
//                             }}
//                           />
//                           <div className="flex flex-col bg-gray-50 rounded-lg p-2 w-full">
//                             <div className="grid grid-cols-3 gap-x-4 gap-y-2">
//                               <div>
//                                 <span className="block font-semibold text-xs">
//                                   Title
//                                 </span>
//                                 <span className="text-[12px] text-gray-800">
//                                   {loc.title}
//                                 </span>
//                               </div>
//                               <div>
//                                 <span className="block font-semibold text-xs">
//                                   House No
//                                 </span>
//                                 <span className="text-gray-700 text-[12px]">
//                                   {loc.houseno ? loc?.houseno : "N/A"}
//                                 </span>
//                               </div>
//                               <div>
//                                 <span className="block font-semibold text-xs">
//                                   Area
//                                 </span>
//                                 <span className="text-gray-700 text-[12px]">
//                                   {loc.area ? loc.area : "N/A"}
//                                 </span>
//                               </div>
//                               <div className="col-span-2">
//                                 <span className="block font-semibold text-xs">
//                                   Full Address
//                                 </span>
//                                 <span className="text-gray-600 text-[12px]">
//                                   {loc.address}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 {errors.address && (
//                   <p className="text-red-500 text-sm mt-1">{errors.address}</p>
//                 )}
//               </label>

//               {/* 
//               <div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleInputChange("aadharImage", e.target.files[0])}
//                   className="hidden"
//                   id="aadharUpload"
//                 />
//                 <label
//                   htmlFor="aadharUpload"
//                   className="flex items-center justify-start h-[55px] cursor-pointer text-gray-500 border border-gray-300 bg-white rounded-[19px] px-3 w-full"
//                   aria-label="Upload Aadhaar image"
//                 >
//                   {formData.aadharImage ? (
//                     <span className="text-green-600 font-medium">{formData.aadharImage.name}</span>
//                   ) : (
//                     "Upload your Aadhaar Image"
//                   )}
//                 </label>
//                 {errors.aadharImage && <p className="text-red-500 text-sm mt-1">{errors.aadharImage}</p>}
//                 {formData.aadharImage && (
//                   <img
//                     src={URL.createObjectURL(formData.aadharImage)}
//                     alt="Aadhaar image preview"
//                     className="mt-3 w-40 h-40 object-cover rounded-lg border"
//                   />
//                 )}
//               </div> */}
//               <div className="w-full">
//                 {/* Title */}
//                 <p className="text-sm font-medium text-gray-600 mb-2">Upload Aadhaar Image</p>

//                 {/* Hidden input */}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   id="aadharUpload"
//                   onChange={(e) => handleInputChange("aadharImage", e.target.files[0])}
//                   className="hidden"
//                 />

//                 {/* Upload box (same design as screenshot) */}
//                 <label
//                   htmlFor="aadharUpload"
//                   className="flex items-center justify-center h-[55px] border border-gray-300 bg-gray-50 rounded-[10px] cursor-pointer hover:bg-gray-100 transition text-green-600 font-medium"
//                 >
//                   {formData.aadharImage ? formData.aadharImage.name : "Upload Image"}
//                 </label>

//                 {/* Error message */}
//                 {errors.aadharImage && (
//                   <p className="text-red-500 text-sm mt-1">{errors.aadharImage}</p>
//                 )}

//                 {/* Preview (optional) */}
//                 {formData.aadharImage && (
//                   <img
//                     src={URL.createObjectURL(formData.aadharImage)}
//                     alt="Aadhaar preview"
//                     className="mt-3 w-40 h-40 object-cover rounded-md border"
//                   />
//                 )}
//               </div>




//               <div className="pt-6">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full h-[55px] bg-[#228B22] hover:bg-green-600 disabled:bg-gray-400 text-white text-base font-medium rounded-[12.55px] shadow-sm"
//                   aria-label="Add worker"
//                 >
//                   {isSubmitting ? "Adding..." : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Banner Slider */}
//         <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5 lg:h-[300px]">
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
//                     src={banner || "/src/assets/addworker/default.png"} // Fallback image
//                     alt={`Banner ${index + 1}`}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = "/src/assets/addworker/default.png"; // Fallback on image load error
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

//         <div className="mt-[50px]">
//           <Footer />
//         </div>
//       </div>
//     </>
//   );
// }




import { useState, useEffect } from "react";
import axios from "axios";
// --- 1. useSelector को import करें --- // <<-- बदला हुआ
import { useSelector } from "react-redux";

import Header from "../../component/Header";
import Footer from "../../component/footer";
import editicon from "../../assets/addworker/edit-icon.svg";
import flag from "../../assets/addworker/flag.png";
import downarrow from "../../assets/addworker/downarrow.png";
import dob from "../../assets/addworker/icon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Arrow from "../../assets/profile/arrow_back.svg";

// --- 2. image का नाम बदलें ताकि profile से conflict न हो --- // <<-- बदला हुआ
import defaultProfileImage from "../../assets/addworker/defaultDP.png";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddWorkerDetails() {
  // --- 3. Redux से profile data को निकालें --- // <<-- बदला हुआ
  const { profile } = useSelector((state) => state.user);

  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const navigate = useNavigate();
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [address, setAddress] = useState(""); // Default address state
  const [showOptions, setShowOptions] = useState(false);
  const token = localStorage.getItem("bharat_token");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    aadharNumber: "",
    dateOfBirth: "",
    address: "",
    aadharImage: null,
  });

  const [errors, setErrors] = useState({});
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 99, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  // --- 4. Component load होने पर default address सेट करें --- // <<-- बदला हुआ
  useEffect(() => {
    if (profile?.location?.address) {
      setAddress(profile.location.address);
      setFormData((prev) => ({ ...prev, address: profile.location.address }));
    }
  }, [profile]);


  const fetchBannerImages = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setBannerImages(data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = data.message || `HTTP error ${res.status}: ${res.statusText}`;
        setBannerError(errorMessage);
      }
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("bharat_token");
    if (!token) {
      toast.error("You are not logged in. Please log in to continue.");
      setTimeout(() => navigate("/login"), 2000);
    }
    fetchBannerImages();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, JPG)");
        return;
      }
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImage(file);
    }
  };

  const handleAadharImageChange = (file) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, JPG)");
        return;
      }
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      return file;
    }
    return null;
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;
    if (field === "aadharImage") {
      processedValue = handleAadharImageChange(value);
      if (!processedValue) return;
    }
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCountryCodeChange = () => {
    setCountryCode(countryCode === "+91" ? "+1" : "+91");
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name must contain only letters";
    }
    const phoneNumber = formData.phone.trim().replace(/\D/g, "");
    if (!phoneNumber) {
      newErrors.phone = "Phone number is required";
    } else if (phoneNumber.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    } else if (!/^[6-9]/.test(phoneNumber)) {
      newErrors.phone = "Phone number must start with digits 6–9";
    }
    const aadharNumber = formData.aadharNumber.trim();

    if (!aadharNumber) {
      newErrors.aadharNumber = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(aadharNumber)) {
      newErrors.aadharNumber = "Aadhar number must be exactly 12 digits";
    }

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!address) newErrors.address = "Address is required";
    if (!formData.aadharImage) newErrors.aadharImage = "Aadhaar image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        toast.error("You are not logged in. Please log in to continue.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      const bodyData = new FormData();
      bodyData.append("name", formData.name);
      bodyData.append("phone", formData.phone);
      bodyData.append("aadharNumber", formData.aadharNumber);
      bodyData.append("dob", formData.dateOfBirth);
      bodyData.append("address", address); // Use the address from state
      bodyData.append("image", image);
      bodyData.append("aadharImage", formData.aadharImage);

      const res = await fetch(`${BASE_URL}/worker/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: bodyData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Worker Added Successfully");
        setTimeout(() => navigate("/workerlist"), 2000);
      } else {
        toast.error(data.message || "Failed to add worker");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
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
    arrows: true,
  };

  const updateAddress = async (location) => {
    try {
      let obj = {
        latitude: location?.latitude,
        longitude: location?.longitude,
        address: location?.address,
      };
      await axios.put(`${BASE_URL}/user/updateLocation`, obj, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log(error, "Error updating address");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen px-5 py-6 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="w-full max-w-[83rem] xl:max-w-[60rem] shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-3 sm:p-20 space-y-4 lg:ml-[290px]">
          <div className="flex items-center mb-6">
            <Link
              to="/workerlist"
              className="flex items-center text-[#008000] hover:text-green-800 font-semibold text-xl"
              aria-label="Go back to previous page"
            >
              <img src={Arrow} className="w-7 h-7 mr-2" alt="Back arrow icon" />
              Back
            </Link>
          </div>
          <div className="max-w-sm mx-auto sm:max-w-md lg:max-w-[36rem]">
            <div className="flex items-center mb-6">
              {/* <Link
                to="/"
                className="flex items-center text-[#008000] hover:text-green-800 font-semibold text-xl"
                aria-label="Go back to previous page"
              >
                <img src={Arrow} className="w-7 h-7 mr-2" alt="Back arrow icon" />
                Back
              </Link> */}
            </div>

            {/* ✅ Title center aligned below Back button */}
            <h1 className="text-[27px] font-[700] text-[#191A1D] text-center mb-10">
              Add Worker Details
            </h1>


            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img

                      src={image ? URL.createObjectURL(image) : defaultProfileImage}
                      alt="Worker profile image"
                      className="w-full h-full  object-cover"
                    />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="profileUpload"
                  className="hidden"
                  onChange={handleImageChange}

                />
                <label
                  htmlFor="profileUpload"
                  className="absolute bottom-7 right-2 w-9 h-9 bg-[#228B22] rounded-full flex items-center justify-center cursor-pointer"
                  aria-label="Upload profile image"
                >
                  <img src={editicon} alt="Edit profile image icon" className="w-5 h-5" />
                </label>
              </div>
              {errors.image && <p className="text-red-500 text-sm mt-1 text-center">{errors.image}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <div className="flex items-center h-[55px] w-full border border-gray-300 rounded-[19px] bg-white px-3 focus-within:border-gray-400">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={handleCountryCodeChange}>
                    <img src={flag} alt="Country flag" className="w-5 h-5 object-cover rounded-sm" />
                    <span className="text-[#000000] font-[700]">{countryCode}</span>
                    <img src={downarrow} alt="Dropdown arrow" className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter Your Mobile Number"
                    value={formData.phone}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "");
                      handleInputChange("phone", onlyDigits);
                    }}
                    maxLength="10"
                    className="flex-1 h-[55px] px-3 text-base placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Aadhar Number"
                  value={formData.aadharNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "aadharNumber",
                      e.target.value.replace(/\D/g, "").slice(0, 12)
                    )
                  }
                  className="h-[55px] text-base placeholder:text-gray-500 border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] px-3 w-full"
                  aria-label="Aadhaar number"
                />
                {errors.aadharNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>
                )}
              </div>


<div className="relative">
  {/* Label */}
  <label
    htmlFor="dob-input"
    className="block text-gray-700 text-sm font-medium mb-2"
  >
    Enter your date of birth
  </label>

  {/* Wrapper div — click anywhere triggers calendar */}
  <div
    className="relative"
    onClick={() => {
      const input = document.getElementById("dob-input");
      if (input) {
        input.showPicker?.();
        input.focus();
      }
    }}
  >
    <input
      id="dob-input"
      type="date"
      value={formData.dateOfBirth}
      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
      className="h-[55px] text-base border border-gray-300 focus:border-gray-400 bg-white rounded-[19px] pr-12 w-full px-3 cursor-pointer"
      min={minDate}
      max={maxDate}
      aria-label="Date of birth"
      style={{ colorScheme: "light" }} // ensures visible picker style
    />

    {/* Calendar icon */}
    <img
      src={dob}
      alt="Calendar icon"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
    />
  </div>

  {/* Error message */}
  {errors.dateOfBirth && (
    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
  )}
</div>


              <label className="block">
                <span className="text-sm font-medium text-gray-600">Address</span>
                <div className="relative">
                  <input
                    id="address-input"
                    type="text"
                    readOnly
                    value={address} // Use the state variable here
                    placeholder="Enter or select address"
                    className="mt-1 block w-full rounded-lg border border-gray-300 pr-9 pl-4 py-2 text-base"
                    onClick={() => setShowOptions(!showOptions)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOptions(!showOptions)}
                    className="absolute right-3 top-2 px-2 py-1 text-sm rounded-lg border bg-gray-100"
                  >
                    {showOptions ? "▲" : "▼"}
                  </button>
                  {showOptions && (
                    <div className="absolute top-full left-0 mt-2 w-full rounded-lg border bg-white shadow-lg p-3 z-50">
                      {profile?.full_address?.map((loc) => (
                        <label
                          key={loc.address}
                          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                        >
                          <input
                            type="radio"
                            name="address"
                            value={loc.address}
                            checked={address === loc.address}
                            onChange={() => { // onChange is better for radio buttons
                              setAddress(loc.address);
                              setFormData(prev => ({ ...prev, address: loc.address }));
                              setShowOptions(false);
                              updateAddress(loc);
                            }}
                          />
                          <div className="flex flex-col bg-gray-50 rounded-lg p-2 w-full">
                            {/* ... (address details) ... */}
                            {loc.address}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </label>

              <div className="w-full">
                <p className="text-sm font-medium text-gray-600 mb-2">Upload Aadhaar Image</p>
                <input
                  type="file"
                  accept="image/*"
                  id="aadharUpload"
                  onChange={(e) => handleInputChange("aadharImage", e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="aadharUpload"
                  className="flex items-center justify-center h-[55px] border border-gray-300 bg-gray-50 rounded-[10px] cursor-pointer"
                >
                  {formData.aadharImage ? formData.aadharImage.name : "Upload Image"}
                </label>
                {errors.aadharImage && <p className="text-red-500 text-sm mt-1">{errors.aadharImage}</p>}
              </div>
               {formData.aadharImage && (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-600 mb-2">Preview:</p>
      <img
        src={URL.createObjectURL(formData.aadharImage)}
        alt="Aadhaar preview"
        className="w-[200px] h-[100px] max-w-md h-auto object-cover rounded-lg border border-gray-300 shadow-sm"
      />
    </div>
  )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[55px] bg-[#228B22] hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg"
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Banner Slider */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5 lg:h-[300px]">
          {/* ... (slider code remains the same) ... */}
        </div>

        <div className="mt-[50px]">
          <Footer />
        </div>
      </div>
    </>
  );
}