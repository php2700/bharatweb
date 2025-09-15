import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectRole } from "../../redux/roleSlice";
import { fetchUserProfile } from "../../redux/userSlice";
import { fetchEmergencyStatus, updateEmergencyStatus } from "../../redux/emergencySlice";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import banner from "../../assets/profile/banner.png";
import Arrow from "../../assets/profile/arrow_back.svg";
import User from "../../assets/Details/User.png";
import Edit from "../../assets/Details/edit.svg";
import Location from "../../assets/Details/location.svg";
import Vector from "../../assets/Home-SP/Vector.svg";
import Aadhar from "../../assets/Details/profile-line.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNotification } from "../../redux/notificationSlice";
import Default from "../../assets/default-image.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Details() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [image, setImage] = useState(User);
  const fileInputRef = useRef(null);
  const hiddenFileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.user);
  const { isEmergencyOn, status: emergencyStatus, error: emergencyError } = useSelector((state) => state.emergency);
  const selectedRole = useSelector((state) => state.role.selectedRole);
  const savedRole = localStorage.getItem("role");
  const [activeTab, setActiveTab] = useState("user");
  const [WorkerTab, setWorkerTab] = useState("work");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  let verification = false;
  if (profile && profile.data) {
    verification = profile.data.verified;
  }

  const getUserId = () => {
    return profile?.data?.userId || localStorage.getItem('userId') || 'default';
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchEmergencyStatus());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab !== "Worker") return;

    if (profile?.data?.verified && !localStorage.getItem(`workerVerifiedFirstSwitchShown_${getUserId()}`)) {
      Swal.fire({
        title: "Yay! You got verified by the admin",
        text: "Your profile is now verified!",
        icon: "success",
        confirmButtonColor: "#228B22",
        confirmButtonText: "OK",
      }).then(() => {
        localStorage.setItem(`workerVerifiedFirstSwitchShown_${getUserId()}`, "true");
      });
    dispatch(
      addNotification({
        title: "Profile Verified",
        message: "Congratulations! Your profile has been verified by the admin.",
      })
    );
    }
  }, [activeTab, profile?.data?.verified]); 

  useEffect(() => {
    if (activeTab !== "Worker") return;

    if (!profile?.data?.verified) {
      if (profile?.data?.rejected) {
        console.log("Profile rejected, showing rejection alert");
        Swal.fire({
          title: "Oops! Admin rejected your profile",
          text: "Please fill details properly.",
          icon: "error",
          confirmButtonColor: "#228B22",
          confirmButtonText: "Go to Edit Profile",
        }).then(() => {
          toast.dismiss();
          navigate("/editprofile", { state: { activeTab: "worker" } });
          setActiveTab("user");
          dispatch(selectRole("user"));
          localStorage.setItem("role", "user");
        });
      } else if (!validateWorkerProfile()) {
        console.log("Profile incomplete, showing incomplete alert");
        Swal.fire({
          title: "Your Worker profile is not completed",
          text: "Please complete your profile to access the Worker tab.",
          icon: "warning",
          confirmButtonColor: "#228B22",
          confirmButtonText: "Go to Edit Profile",
        }).then(() => {
          toast.dismiss();
          navigate("/editprofile", { state: { activeTab: "worker" } });
          setActiveTab("user");
          dispatch(selectRole("user"));
          localStorage.setItem("role", "user");
        });
      } else {
        console.log("Profile complete but unverified, showing pending alert");
        Swal.fire({
          title: "Verification Pending",
          text: "Your verification by admin is pending, it will take 2-3 days.",
          icon: "info",
          confirmButtonColor: "#228B22",
          confirmButtonText: "OK",
        }).then(() => {
          toast.dismiss();
          requestRoleUpgrade();
          setActiveTab("user");
          dispatch(selectRole("user"));
          localStorage.setItem("role", "user");
        });
      }
    } else {
      console.log("Profile verified, allowing Worker tab access");
    }
  }, [activeTab, profile, navigate]);
  let full_name = "N/A";
  let address = "N/A";
  let images = "";
  let skill = "Not Available";
  let category_name = "Not Available";
  let subcategory_names = "Not Available";
  let document = "Not Available";
  let status = false;
  let workImages = [];
  let verifiedStatus = "Pending";
  let statusClass = "bg-yellow-100 text-yellow-600";
  let rateAndReviews;
  let age = "N/A";
  let gender = "N/A";
  let element;
  if (profile && profile.data) {
    full_name = profile.data.full_name || "Not Available";
    address = profile.data.full_address[0]?.address || "Not Available";
    images = profile.data.profilePic || "Not Available";
    skill = profile.data.skill || "No Skill Available";
    category_name = profile.data.category_name || "Not Available";
    subcategory_names = profile.data.subcategory_names || "Not Available";
    document = profile.data.documents || "Not Available";
    rateAndReviews = profile.data.rateAndReviews || "Not Available";
    status = profile.data.verified || false;
    workImages = profile.data.hiswork || [];
    if (profile.data.verified) {
      verifiedStatus = "Verified by Admin";
      statusClass = "bg-green-100 text-green-600";
    } else if (profile.data.rejected) {
      verifiedStatus = "Rejected";
      statusClass = "bg-red-100 text-red-600";
    } else {
      verifiedStatus = "Pending";
      statusClass = "bg-yellow-100 text-yellow-600";
    }
    age = profile.data.age || "N/A";
    gender = profile.data.gender || "N/A";

    element =
      document !== "Not Available" ? (
        <img
          src={document}
          alt="Document"
          className="w-40 h-24 object-cover rounded-md shadow"
        />
      ) : (
        <div className="w-40 h-24 flex items-center justify-center bg-gray-200 rounded-md shadow text-gray-700">
          Not Uploaded
        </div>
      );
  }

  const testimage = images && images !== "Not Available";
  useEffect(() => {
    if (activeTab !== "Worker" || WorkerTab !== "work" || workImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % workImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeTab, WorkerTab, workImages]);

  const handleEditClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG/PNG images are allowed!", { toastId: "profile-pic-error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);

    try {
      const token = localStorage.getItem("bharat_token");
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`${BASE_URL}/user/updateProfilePic`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile image updated successfully!", { toastId: "profile-pic-success" });
        dispatch(fetchUserProfile());
      } else {
        toast.error(data.message || "Failed to update profile image.", { toastId: "profile-pic-fail" });
      }
    } catch (err) {
      console.error("Error uploading profile pic:", err);
      toast.error("Something went wrong while uploading the image!", { toastId: "profile-pic-error-catch" });
    }
  };
  const handleGalleryEditClick = () => {
    hiddenFileInputRef.current.click();
  };
  const handleGalleryFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    const totalImages = workImages.length + selectedFiles.length;
    if (totalImages > 5) {
      Swal.fire({
        title: "Upload Limit Exceeded",
        text: "You can only have a maximum of 5 images in total!",
        icon: "error",
        confirmButtonColor: "#228B22",
        confirmButtonText: "OK",
      });
      return;
    }

    const formPayload = new FormData();
    selectedFiles.forEach((file, index) => {
      const uniqueFile = new File(
        [file],
        `${Date.now()}_${index}_${file.name}`,
        {
          type: file.type,
        }
      );
      formPayload.append("hiswork", uniqueFile);
    });

    const authToken = localStorage.getItem("bharat_token");
    try {
      setIsUploading(true);
      const response = await fetch(`${BASE_URL}/user/updateHisWork`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formPayload,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Images updated successfully!", { toastId: "gallery-success" });
        dispatch(fetchUserProfile());
      } else {
        toast.error(data.message || "Failed to update images", { toastId: "gallery-fail" });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong while uploading images!", { toastId: "gallery-error" });
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };
  const handleRemoveImage = async (imageIndex) => {
    try {
      const token = localStorage.getItem("bharat_token");
      const imageToRemove = workImages[imageIndex];
      const res = await fetch(`${BASE_URL}/user/deleteHisworkImage`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagePath: imageToRemove }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Image removed successfully!", { toastId: "remove-image-success" });
        dispatch(fetchUserProfile());
      } else {
        toast.error(data.message || "Failed to remove image.", { toastId: "remove-image-fail" });
      }
    } catch (err) {
      console.error("Error removing image:", err);
      toast.error("Something went wrong while removing the image!", { toastId: "remove-image-error" });
    }
  };
  const handleToggle = () => {
    dispatch(updateEmergencyStatus(!isEmergencyOn));
  };
  const Editpage = () => {
    toast.dismiss();
    const tabToNavigate = activeTab === "Worker" ? "worker" : "user";
    navigate("/editprofile", { state: { activeTab: tabToNavigate } });
  };
  const validateUserProfile = () => {
    if (
      !profile?.data?.full_name ||
      profile.data.full_name === "Not Available" ||
      !profile?.data?.full_address?.[0]?.address ||
      profile.data.full_address[0]?.address === "Not Available" ||
      !profile?.data?.skill ||
      profile.data.skill === "No Skill Available"
    ) {
      return false;
    }
    return true;
  };
  const validateWorkerProfile = () => {
    if (
      !profile?.data?.full_name ||
      !profile?.data?.skill ||
      !profile?.data?.category_id ||
      !profile?.data?.subcategory_ids?.length ||
      !profile?.data?.documents
    ) {
      return false;
    }
    return true;
  };
  const requestRoleUpgrade = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/user/request-role-upgrade`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Role upgrade requested successfully!", { toastId: "role-upgrade-success" });
        dispatch(fetchUserProfile());
      } else {
        toast.error(data.message || "Failed to request role upgrade.", { toastId: "role-upgrade-fail" });
      }
    } catch (err) {
      console.error("Error requesting role upgrade:", err);
      toast.error("Something went wrong while requesting role upgrade!", { toastId: "role-upgrade-error" });
    }
  };
  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return;

    toast.dismiss();
    if (newTab === "user") {
      setActiveTab("user");
      dispatch(selectRole("user"));
      localStorage.setItem("role", "user");
    } else if (newTab === "Worker") {
      if (validateWorkerProfile() && profile?.data?.verified) {
        setActiveTab("Worker");
        dispatch(selectRole("service_provider"));
        localStorage.setItem("role", "service_provider");
      } else {
        setActiveTab("Worker");
      }
    }
  };

  return (
    <>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
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
      <div className="w-full bg-[#D9D9D9] py-6 mt-10">
        <div className="flex justify-center gap-10 mt-6">
          <button
            onClick={() => handleTabSwitch("user")}
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
            onClick={() => handleTabSwitch("Worker")}
            className={`px-6 py-2 rounded-md font-semibold shadow-md transition-colors duration-300 ${
              activeTab === "Worker"
                ? "bg-[#228B22] text-white"
                : "bg-white text-[#228B22]"
            }`}
            aria-label="View Worker Profile"
          >
            Worker Profile
          </button>
        </div>
      </div>
      <div className="container mx-auto px-6 py-6">
        <button
          onClick={Editpage}
          type="button"
          className="flex items-center gap-2 text-white bg-[#228B22] hover:bg-[#0254c6] focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 float-right transition-colors duration-300"
        >
          <img src={Edit} alt="Edit" width="20px" />
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
                    className="w-[85%] h-[400px] object-cover rounded-2xl shadow-md"
                  />
                ) : (
                  <img
                    src={Default}
                    alt="User Profile"
                    className="w-[85%] h-[400px] object-cover rounded-2xl shadow-md"
                  />
                )}
                <button
                  className="absolute bottom-3 left-3 bg-[#228B22] p-2 rounded-full shadow-md"
                  aria-label="Edit Profile Image"
                  onClick={handleEditClick}
                >
                  <img src={Edit} alt="Edit icon" className="w-7 h-7" />
                </button>
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
                <div className="flex items-center gap-2 text-gray-600 font-semibold">
                  <img src={Location} alt="Location icon" className="w-5 h-5" />
                  <span>{address}</span>
                </div>
                <div className="flex flex-col font-semibold text-base text-gray-700">
                  <span>Age: {age}</span>
                  <span>Gender: {gender}</span>
                </div>
                <div
                  className={`p-4 shadow-xl max-w-[600px] mt-10 ${
                    skill === "No Skill Available" ? "h-[260px]" : "h-[260px]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">About My Skill</h3>
                  </div>
                  <p className="mt-1 text-gray-700 text-base leading-relaxed break-all">
                    {skill}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Worker" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
              <div className="relative">
                {testimage ? (
                  <img
                    src={images}
                    alt="User Profile"
                    className="w-[85%] h-[400px] object-cover rounded-2xl shadow-md"
                  />
                ) : (
                  <div className="w-full h-[550px] flex items-center justify-center bg-gray-200 rounded-2xl shadow-md text-gray-700 font-semibold">
                    No Profile Picture available
                  </div>
                )}
                <button
                  className="absolute bottom-3 left-3 bg-[#228B22] p-2 rounded-full shadow-md"
                  aria-label="Edit Profile Image"
                  onClick={handleEditClick}
                >
                  <img src={Edit} alt="Edit icon" className="w-7 h-7" />
                </button>
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
                  {profile?.data?.verified && (
                    <span className="bg-[#228B22] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-semibold">
                  <img src={Location} alt="Location icon" className="w-5 h-5" />
                  <span>{address}</span>
                </div>
                <div className="flex flex-col font-semibold text-base text-gray-700">
                  <span>Age: {age}</span>
                  <span>Gender: {gender}</span>
                </div>
                <p className="text-base font-semibold text-gray-700">
                  <span className="font-semibold text-[#228B22]">
                    Category-
                  </span>{" "}
                  {category_name}
                </p>
                <p className="text-base font-semibold -mt-4 text-gray-700">
                  <span className="font-semibold text-[#228B22]">
                    {" "}
                    Sub-Categories-{" "}
                  </span>{" "}
                  {Array.isArray(subcategory_names)
                    ? subcategory_names.map((name, index) => (
                        <span key={index}>
                          {name}
                          {index !== subcategory_names.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : subcategory_names}
                </p>
                <div
                  className={`p-4 shadow-xl max-w-[600px] ${
                    skill === "Not Available" ? "h-[260px]" : "h-[260px]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">About My Skill</h3>
                  </div>
                  <p className="mt-1 text-gray-700 text-base leading-relaxed break-all">
                    {skill}
                  </p>
                </div>
              </div>
            </div>
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-center gap-6 p-4 mt-6">
                <button
                  onClick={() => {
                    setWorkerTab("work");
                    setCurrentIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md shadow-md font-semibold ${
                    WorkerTab === "work"
                      ? "bg-[#228B22] text-white"
                      : "bg-green-100 text-[#228B22]"
                  }`}
                  aria-label="View Work"
                >
                  His Work
                </button>
                <button
                  onClick={() => {
                    setWorkerTab("review");
                    setCurrentIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md shadow-md font-semibold ${
                    WorkerTab === "review"
                      ? "bg-[#228B22] text-white"
                      : "bg-green-100 text-[#228B22]"
                  }`}
                  aria-label="View Customer Reviews"
                >
                  Customer Review
                </button>
              </div>
              {WorkerTab === "work" && (
                <div className="mt-6 w-full bg-[#D3FFD3] flex flex-col items-center py-10">
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
                          <img src={Edit} alt="Edit" className="w-6 h-6" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                        No work available.<br />you can upload up to 5 images here.
                        <div
                          className="absolute top-2 right-2 w-12 h-12 bg-[#228B22] rounded-full flex items-center justify-center shadow-md cursor-pointer"
                          onClick={handleGalleryEditClick}
                        >
                          <img src={Edit} alt="Edit" className="w-6 h-6" />
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
                  {workImages.length > 0 && (
                    <div className="mt-6 flex flex-col items-center gap-4">
                      <div className="flex flex-wrap gap-4 justify-center">
                        {workImages.map((img, index) => (
                          <div key={index} className="relative w-24 h-24 overflow-hidden">
                            <img
                              src={img}
                              alt={`Work sample ${index + 1}`}
                              className="w-full h-full object-cover rounded-md shadow-md"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                              aria-label={`Remove work image ${index + 1}`}
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-700 text-base font-semibold">
                        (You can upload up to 5 images here)
                      </p>
                    </div>
                  )}
                </div>
              )}
              {WorkerTab === "review" && (
                <div className="mt-6 w-full bg-[#D3FFD3] flex justify-center items-center py-10">
                  <div className="relative w-[700px] h-[400px]">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                      <p className="text-lg text-center">
                        Customer reviews are not available at this moment.
                      </p>
                      <p className="text-sm text-center mt-2">
                        Please check back later for updates on customer feedback.
                      </p>
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-semibold rounded-md">
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {activeTab === "Worker" && (
              <div className="md:w-[700px] w-[90%] mx-auto mt-8 flex items-center justify-between p-4 rounded-lg border border-white shadow-lg">
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
            )}
            <div className="container mx-auto max-w-[750px] px-6 py-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold">Document</h2>
                  <span
                    className={`${statusClass} text-xs font-semibold px-3 py-1 rounded-full`}
                  >
                    {verifiedStatus}
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
            <div className="container mx-auto max-w-[750px] px-6 py-6">
              <h2 className="text-xl font-bold mb-4">Rate & Reviews</h2>
              {rateAndReviews && rateAndReviews.length > 0 ? (
                rateAndReviews.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 mb-4"
                  >
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star, i) => (
                        <span
                          key={i}
                          className={
                            i < item.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{item.date}</p>
                    <div className="flex mt-3">
                      {item.reviewers?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Reviewer"
                          className="w-8 h-8 rounded-full border -ml-2 first:ml-0"
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No Ratings Available
                </p>
              )}
              {rateAndReviews && rateAndReviews.length > 0 && (
                <div className="text-center mt-4">
                  <button className="text-[#228B22] font-semibold hover:underline">
                    See All Review
                  </button>
                </div>
              )}
            </div>
            <div className="container mx-auto max-w-[550px] px-6 py-6">
              <Link to="/workerlist">
                <button className="w-full bg-[#228B22] text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700">
                  Add workers
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}