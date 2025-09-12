import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import banner from "../../assets/profile/banner.png";
import Arrow from "../../assets/profile/arrow_back.svg";
import Location from "../../assets/Details/location.svg";
import Aadhar from "../../assets/Details/profile-line.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProfileDetails() {
  const { serviceProviderId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [WorkerTab, setWorkerTab] = useState("work");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log("serviceProviderId", serviceProviderId);

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      if (!serviceProviderId) { // Fixed: Use serviceProviderId instead of workerId
        console.error("No serviceProviderId provided");
        toast.error("Invalid service provider ID");
        setLoading(false);
        navigate("/workerlist");
        return;
      }

      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) {
          console.error("No token found");
          toast.error("Please log in to view worker profile");
          navigate("/login");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/user/getServiceProvider/${serviceProviderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.status) {
          setWorker(response.data.data);
        } else {
          console.error("Failed to fetch worker profile:", response.data?.message);
          toast.error("Failed to load worker profile.");
        }
      } catch (error) {
        console.error("Error fetching worker profile:", error);
        toast.error("Something went wrong while fetching the profile!");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerProfile();
  }, [serviceProviderId, navigate]);

  useEffect(() => {
    if (WorkerTab !== "work" || !worker?.hiswork?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % worker.hiswork.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, worker?.hiswork]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No worker data found.</p>
      </div>
    );
  }

  const {
    full_name = "N/A",
    full_address = [{ address: "Not Available" }],
    profilePic = "Not Available",
    skill = "No Skill Available",
    category_name = "Not Available",
    subcategory_names = "Not Available",
    documents = "Not Available",
    rateAndReviews = [],
    verified = false,
    hiswork = [],
    age = "N/A",
    gender = "N/A",
  } = worker;

  const verifiedStatus = verified
    ? "Verified by Admin"
    : worker.rejected
    ? "Rejected"
    : "Pending";
  const statusClass = verified
    ? "bg-green-100 text-green-600"
    : worker.rejected
    ? "bg-red-100 text-red-600"
    : "bg-yellow-100 text-yellow-600";

  const testimage = profilePic && profilePic !== "Not Available";
  const element =
    documents !== "Not Available" ? (
      <img
        src={documents}
        alt="Document"
        className="w-40 h-24 object-cover rounded-md shadow"
      />
    ) : (
      <div className="w-40 h-24 flex items-center justify-center bg-gray-200 rounded-md shadow text-gray-700">
        Not Uploaded
      </div>
    );

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
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
      </div>
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={banner}
          alt="Gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-6 py-6">
        <h2 className="text-3xl font-bold text-black mb-3 text-left ml-10 mt-10">
          Working Person Details
        </h2>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
            <div className="relative">
              {testimage ? (
                <img
                  src={profilePic}
                  alt="User Profile"
                  className="w-[85%] h-[400px] object-cover rounded-2xl shadow-md"
                />
              ) : (
                <div className="w-full h-[550px] flex items-center justify-center bg-gray-200 rounded-2xl shadow-md text-gray-700 font-semibold">
                  No Profile Picture available
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{full_name}</h2>
                {verified && (
                  <span className="bg-[#228B22] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                <img src={Location} alt="Location icon" className="w-5 h-5" />
                <span>{full_address[0]?.address || "Not Available"}</span>
              </div>
              <div className="flex flex-col font-semibold text-base text-gray-700">
                <span>Age: {age}</span>
                <span>Gender: {gender}</span>
              </div>
              <p className="text-base font-semibold text-gray-700">
                <span className="font-semibold text-[#228B22]">Category-</span>{" "}
                {category_name}
              </p>
              <p className="text-base font-semibold -mt-4 text-gray-700">
                <span className="font-semibold text-[#228B22]">
                  Sub-Categories-
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
                  {hiswork.length > 0 ? (
                    <img
                      src={hiswork[currentIndex]}
                      alt={`Work sample ${currentIndex + 1}`}
                      className="w-full h-full object-cover rounded-md shadow-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                      No work available.
                    </div>
                  )}
                </div>
                {hiswork.length > 0 && (
                  <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap gap-4 justify-center">
                      {hiswork.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 overflow-hidden"
                        >
                          <img
                            src={img}
                            alt={`Work sample ${index + 1}`}
                            className="w-full h-full object-cover rounded-md shadow-md"
                          />
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
                </div>
              </div>
            )}
          </div>
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
            {rateAndReviews.length > 0 ? (
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
              <p className="text-gray-500 text-center">No Ratings Available</p>
            )}
            {rateAndReviews.length > 0 && (
              <div className="text-center mt-4">
                <button className="text-[#228B22] font-semibold hover:underline">
                  See All Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}