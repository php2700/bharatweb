import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import banner from "../../assets/profile/banner.png";
import Arrow from "../../assets/profile/arrow_back.svg";
import User from "../../assets/Details/User.png";
import Edit from "../../assets/Details/edit.svg";
import Pencil from "../../assets/Details/pencil.svg";
import Location from "../../assets/Details/location.svg";
import Call from "../../assets/Details/call.svg";
import Chat from "../../assets/Details/chat.svg";
import Sample from "../../assets/Details/sample.png";
import Sample2 from "../../assets/Details/sample2.jpg";
import Vector from "../../assets/Home-SP/Vector.svg";
import Aadhar from "../../assets/Details/profile-line.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userSlice";
import edit from "../../assets/login/edit.png";
import EditProfile from "./EditProfile";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Details() {
  const [image, setImage] = useState(User); // image state
  const fileInputRef = useRef(null); // ref for hidden input
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  let element;
  let testimage;
  let full_name = "N/A";
  let address = "N/A";
  let images = "";
  let skill = "Not Available";
  let category_name = "Not Available";
  let subcategory_names = "Not Available";
  let document = "Not Available";
  let status = false;
  let verified;
  if (profile && profile.data) {
    full_name = profile.data.full_name
      ? profile.data.full_name
      : "Not Available";
    address = profile.data.full_address[0].address
      ? profile.data.full_address[0].address
      : "Not Available";
    images = profile.data.profilePic
      ? profile.data.profilePic
      : "Not Available";
    skill = profile.data.skill ? profile.data.skill : "Not Available";
    category_name = profile.data.category_name
      ? profile.data.category_name
      : "Not Available";
    subcategory_names = profile.data.subcategory_names
      ? profile.data.subcategory_names
      : "Not Available";
    document = profile.data.documents
      ? profile.data.documents
      : "Not Available";
    status = profile.data.verified ? profile.data.verified : false;

    if (profile.data.documents) {
      element = (
        <img
          src={document}
          alt="Image not uploaded"
          className="w-40 h-24 object-cover rounded-md shadow"
        />
      );
    } else {
      element = (
        <div className="w-40 h-24 flex items-center justify-center bg-gray-200 rounded-md shadow text-gray-700">
          No Uploaded
        </div>
      );
    }
    testimage = profile.data.profilePic && profile.data.profilePic !== "";
  }
  if (status == true) {
    verified = "Verified by Admin";
  } else {
    verified = "Pending";
  }

  // button click → input trigger
  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  // file select hone par
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Allowed types check
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG/PNG images are allowed!");
      return;
    }

    // ✅ Preview ke liye
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result); // setImage = state for preview
    reader.readAsDataURL(file);

    // ✅ API me upload karne ke liye
    try {
      const token = localStorage.getItem("bharat_token");
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(
        "https://api.thebharatworks.com/api/user/updateProfilePic",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile image updated successfully!");
      } else {
        alert(data.message || "Failed to update profile image.");
      }
    } catch (err) {
      console.error("Error uploading profile pic:", err);
      alert("Something went wrong while uploading the image!");
    }
  };

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("user");

  const [vendorTab, setVendorTab] = useState("work");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEmergencyOn, setIsEmergencyOn] = useState(false);

  let workImages = [];
  if (profile && profile.data) {
    workImages = profile.data.hiswork ? profile.data.hiswork : "Not Avaialable";
  }

  const reviewImages = [Sample2, Sample];
  const Editpage = () => {
    navigate("/editprofile", { state: { activeTab } });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "vendor") {
        if (vendorTab === "work") {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % workImages.length);
        } else if (vendorTab === "review") {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewImages.length);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTab, vendorTab]);

  const handleToggle = () => {
    setIsEmergencyOn(!isEmergencyOn);
  };
  const [isUploading, setIsUploading] = useState(false);
  const hiddenFileInputRef = useRef(null);
  const handleGalleryEditClick = () => {
    if (hiddenFileInputRef.current) hiddenFileInputRef.current.click();
  };

  // 🔹 File input change -> upload to API
  const handleGalleryFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;
    if (selectedFiles.length > 5) {
      toast.error("You can upload maximum 5 images at once");
      return;
    }

    const formPayload = new FormData();

    // ✅ Append files with unique names and correct field name (hiswork[])
    selectedFiles.forEach((file, index) => {
      const uniqueFile = new File(
        [file],
        `${Date.now()}_${index}_${file.name}`,
        {
          type: file.type,
        }
      );
      formPayload.append("hiswork", uniqueFile); // <-- note the []
    });

    const authToken = localStorage.getItem("bharat_token");

    try {
      setIsUploading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/updateHisWork`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` },
          body: formPayload, // ✅ no JSON header, keep as multipart/form-data
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Images updated successfully!");
        setGalleryImages(data.updatedImages || []);
      } else {
        toast.error(data.message || "Failed to update images");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={banner}
          alt="Gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-full bg-[#D9D9D9] py-6">
        <div className="flex justify-center gap-10 mt-6">
          <button
            onClick={() => setActiveTab("user")}
            className={`px-6 py-2 rounded-md font-semibold shadow-md transition-colors duration-300 ${
              activeTab === "user"
                ? "bg-[#228B22] text-white"
                : "bg-white text-[#228B22]"
            }`}
            aria-label="View User Profile"
          >
            User Profile
          </button>
          <button
            onClick={() => setActiveTab("vendor")}
            className={`px-6 py-2 rounded-md font-semibold shadow-md transition-colors duration-300 ${
              activeTab === "vendor"
                ? "bg-[#228B22] text-white"
                : "bg-white text-[#228B22]"
            }`}
            aria-label="View Vendor Profile"
          >
            Vendor Profile
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <button
          onClick={() => Editpage()}
          type="button"
          className="flex items-center gap-2 text-white bg-[#228B22] 
             hover:bg-[#0254c6] 
             focus:ring-4 focus:outline-none focus:ring-green-300 
             dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
             me-2 mb-2 float-right transition-colors duration-300"
        >
          <img src={edit} alt="Edit" width="20px" />
          Edit Profile
        </button>

        {activeTab === "user" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
              <div className="relative">
                {testimage ? (
                  <img
                    src={images}
                    alt="User Profile"
                    className="w-full h-[550px] object-cover rounded-2xl shadow-md"
                  />
                ) : (
                  <div className="w-full h-[550px] flex items-center justify-center bg-gray-200 rounded-2xl shadow-md text-gray-700 font-semibold">
                    Not available
                  </div>
                )}

                <button
                  className="absolute bottom-3 left-3 bg-[#228B22] p-2 rounded-full shadow-md"
                  aria-label="Edit Profile Image"
                  onClick={handleEditClick} // 🔹 click triggers file input
                >
                  <img src={Edit} alt="Edit icon" className="w-7 h-7" />
                </button>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{full_name}</h2>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <img src={Location} alt="Location icon" className="w-5 h-5" />
                  <span>{address}</span>
                </div>
                <div
                  className={`p-4 shadow-xl  max-w-[600px] ${
                    skill === "Not Available" ? "h-[260px]" : "h-[260px]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xl">About My Skill</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mt-10">
                    {skill}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vendor" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
              <div className="relative">
                {testimage ? (
                  <img
                    src={images}
                    alt="User Profile"
                    className="w-full h-[550px] object-cover rounded-2xl shadow-md"
                  />
                ) : (
                  <div className="w-full h-[550px] flex items-center justify-center bg-gray-200 rounded-2xl shadow-md text-gray-700 font-semibold">
                    Not available
                  </div>
                )}
                <button
                  className="absolute bottom-3 left-3 bg-[#228B22] p-2 rounded-full shadow-md"
                  aria-label="Edit Profile Image"
                  onClick={handleEditClick} // 🔹 click triggers file input
                >
                  <img src={Edit} alt="Edit icon" className="w-7 h-7" />
                </button>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{full_name}</h2>
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <img src={Location} alt="Location icon" className="w-5 h-5" />
                  <span>{address}</span>
                </div>
                <p className="text-base">
                  <span className="font-bold text-[#228B22]">Category-</span>{" "}
                  {category_name}
                </p>
                <p className="text-base -mt-4">
                  <span className="font-bold text-[#228B22]">
                    Sub-Categories-
                  </span>{" "}
                  {subcategory_names.map((name, index) => (
                    <span key={index}>
                      {name}
                      {index !== subcategory_names.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>

                <div
                  className={`p-4 shadow-xl  max-w-[600px] ${
                    skill === "Not Available" ? "h-[260px]" : "h-[260px]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xl">About My Skill</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {skill}
                  </p>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-center gap-6 p-4 mt-6">
                <button
                  onClick={() => {
                    setVendorTab("work");
                    setCurrentIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md shadow-md font-semibold ${
                    vendorTab === "work"
                      ? "bg-[#228B22] text-white"
                      : "bg-green-100 text-[#228B22]"
                  }`}
                  aria-label="View Work"
                >
                  His Work
                </button>
                <button
                  onClick={() => {
                    setVendorTab("review");
                    setCurrentIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md shadow-md font-semibold ${
                    vendorTab === "review"
                      ? "bg-[#228B22] text-white"
                      : "bg-green-100 text-[#228B22]"
                  }`}
                  aria-label="View Customer Reviews"
                >
                  Customer Review
                </button>
              </div>

              {vendorTab === "work" && (
                <div className="mt-6 w-full bg-[#D3FFD3] flex justify-center items-center py-10">
                  <div className="relative w-[700px] h-[400px]">
                    {workImages.length > 0 ? (
                      <>
                        <img
                          src={workImages[currentIndex]}
                          alt={`Work sample ${currentIndex + 1}`}
                          className="w-full h-full object-cover rounded-md shadow-md"
                        />
                        <div
                          className="absolute top-2 right-2 w-12 h-12 bg-[#228B22] rounded-full flex items-center justify-center shadow-md cursor-pointer"
                          onClick={handleGalleryEditClick}
                        >
                          <img src={edit} alt="Edit" className="w-6 h-6" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                        Not available
                        <div
                          className="absolute top-2 right-2 w-12 h-12 bg-[#228B22] rounded-full flex items-center justify-center shadow-md cursor-pointer"
                          onClick={handleGalleryEditClick}
                        >
                          <img src={edit} alt="Edit" className="w-6 h-6" />
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={hiddenFileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFileChange}
                      className="hidden"
                    />

                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-bold text-lg rounded-md">
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {vendorTab === "review" && (
                <div className="mt-6 w-full bg-[#D3FFD3] flex justify-center items-center py-10">
                  <div className="relative w-[700px]">
                    <img
                      src={images[currentIndex]}
                      alt={`Review ${currentIndex + 1}`}
                      className="w-full rounded-md shadow-md"
                    />
                    <div
                      className="absolute top-2 right-2 w-12 h-12 bg-[#228B22] rounded-full flex items-center justify-center shadow-md cursor-pointer"
                      onClick={handleEditClick}
                    >
                      <img src={Edit} alt="please" className="w-6 h-6" />
                    </div>

                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-semibold rounded-md">
                        Uploading...
                      </div>
                    )}

                    <ToastContainer position="top-right" autoClose={3000} />
                  </div>
                </div>
              )}
            </div>

            <div className="md:w-[700px] w-[90%] mx-auto mt-8 flex items-center justify-between p-4 rounded-lg border border-white shadow-lg ">
              <div className="flex items-center gap-2">
                <img src={Vector} alt="Warning Icon" className="w-6 h-6" />
                <span className="text-black font-medium text-lg max-md:text-sm">
                  Emergency task
                </span>
              </div>
              <div className="toggle-wrapper">
                <button
                  onClick={handleToggle}
                  className={`toggle-button w-[40px] h-[25px] flex items-center rounded-full p-1 transition-colors duration-300 ${
                    isEmergencyOn
                      ? "bg-[#228B22] justify-end"
                      : "bg-[#DF1414] justify-start"
                  }`}
                  style={{
                    width: "40px",
                    height: "25px",
                    minWidth: "40px",
                    minHeight: "25px",
                  }}
                  aria-label={
                    isEmergencyOn
                      ? "Disable emergency task"
                      : "Enable emergency task"
                  }
                  aria-checked={isEmergencyOn}
                >
                  <div className="w-[15px] h-[15px] bg-white rounded-full shadow-md"></div>
                </button>
              </div>
            </div>

            {/* Document Section */}
            <div className="container mx-auto max-w-[750px] px-6 py-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold">Document</h2>
                  <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {verified}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                      <img
                        src={Aadhar}
                        alt="Document Icon"
                        className="w-9 h-9"
                      />
                    </div>
                    <p className="font-medium">Aadhar card</p>
                  </div>
                  {element}
                </div>
              </div>
            </div>

            {/* Rate & Reviews Section */}
            <div className="container mx-auto max-w-[750px] px-6 py-6">
              <h2 className="text-xl font-bold mb-4">Rate & Reviews</h2>

              {/* Review Card */}
              {[1, 2].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 mb-4"
                >
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star, i) => (
                      <span
                        key={i}
                        className={i < 4 ? "text-yellow-400" : "text-gray-300"}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Content */}
                  <h3 className="font-semibold">Made a computer table</h3>
                  <p className="text-gray-600 text-sm">
                    It is a long established fact that a reader will be
                    distracted by the readable
                  </p>
                  <p className="text-xs text-gray-400 mt-2">14 Apr, 2023</p>

                  {/* Reviewer Images */}
                  <div className="flex mt-3">
                    {[1, 2, 3, 4].map((img) => (
                      <img
                        key={img}
                        src={User}
                        alt="Reviewer"
                        className="w-8 h-8 rounded-full border -ml-2 first:ml-0"
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* See All Review Button */}
              <div className="text-center mt-4">
                <button className="text-[#228B22] font-semibold hover:underline">
                  See All Review
                </button>
              </div>
            </div>

            {/* Add Workers Button */}
            <div className="container mx-auto max-w-[550px] px-6 py-6">
              <button className="w-full bg-[#228B22] text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700">
                Add workers
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
