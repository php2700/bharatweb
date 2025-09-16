import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import image from "../../assets/addworker/worker-profile.png";
import flag from "../../assets/addworker/flag.png";
import dobIcon from "../../assets/addworker/icon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewWorker() {
  const { id } = useParams(); // Get worker ID from URL
  const navigate = useNavigate();
  const [workerData, setWorkerData] = useState({
    name: "",
    phone: "",
    aadharNumber: "",
    dateOfBirth: "",
    address: "",
    image: null, // Profile image URL
    aadharImage: null, // Aadhaar image URL
  });
  const [loading, setLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  // Fetch banner images
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
      console.log("Banner API response:", data); // Debug response

      if (res.ok) {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setBannerImages(data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = data.message || `HTTP error ${res.status}: ${res.statusText}`;
        console.error("Failed to fetch banner images:", errorMessage);
        setBannerError(errorMessage);
      }
    } catch (err) {
      console.error("Error fetching banner images:", err.message);
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  // Fetch worker details
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchWorker = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        const res = await fetch(`${BASE_URL}/worker/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const worker = data.worker;
          const dobValue = worker.dob
            ? new Date(worker.dob).toISOString().split("T")[0]
            : "";

          setWorkerData({
            name: worker.name || "N/A",
            phone: worker.phone || "N/A",
            aadharNumber: worker.aadharNumber || "N/A",
            dateOfBirth: dobValue || "N/A",
            address: worker.address || "N/A",
            image: worker.image || null,
            aadharImage: worker.aadharImage || null,
          });
        } else {
          toast.error("Failed to fetch worker details");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching worker details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
    fetchBannerImages();
  }, [id, BASE_URL]);

  // Handle Back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Slider settings for react-slick
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen px-5 py-6 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="w-full max-w-[83rem] xl:max-w-[60rem] shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-3 sm:p-20 space-y-4 lg:ml-[290px]">
          <div className="max-w-sm mx-auto sm:max-w-md lg:max-w-[36rem]">
            <div className="flex items-center mb-10">
              <h1 className="text-[27px] font-[700] text-[#191A1D] flex-1 text-center mr-8">
                Worker Details
              </h1>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 rounded-full overflow-hidden p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={workerData.image || image}
                    alt="Worker profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Worker Details */}
            <div className="space-y-5">
              {/* Name */}
              <div>
                <p className="text-base font-medium text-gray-700">Name</p>
                <p className="h-[55px] text-base border border-gray-300 rounded-[19px] px-3 w-full flex items-center">
                  {workerData.name}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-base font-medium text-gray-700">Phone</p>
                <div className="flex items-center h-[55px] w-full border border-gray-300 rounded-[19px] px-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={flag}
                      alt="India Flag"
                      className="w-5 h-5 object-cover rounded-sm"
                    />
                    <span className="text-[#000000] font-[700]">+91</span>
                  </div>
                  <p className="flex-1 px-3 text-base">{workerData.phone}</p>
                </div>
              </div>

              {/* Aadhaar Number */}
              <div>
                <p className="text-base font-medium text-gray-700">Aadhaar Number</p>
                <p className="h-[55px] text-base border border-gray-300 rounded-[19px] px-3 w-full flex items-center">
                  {workerData.aadharNumber}
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <p className="text-base font-medium text-gray-700">Date of Birth</p>
                <div className="relative">
                  <p className="h-[55px] text-base border border-gray-300 rounded-[19px] px-3 w-full flex items-center">
                    {workerData.dateOfBirth}
                  </p>
                  <img
                    src={dobIcon}
                    alt="Calendar icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-base font-medium text-gray-700">Address</p>
                <p className="h-[55px] text-base border border-gray-300 rounded-[19px] px-3 w-full flex items-center">
                  {workerData.address}
                </p>
              </div>

              {/* Aadhaar Image */}
              <div>
                <p className="text-base font-medium text-gray-700">Aadhaar Image</p>
                {workerData.aadharImage ? (
                  <img
                    src={workerData.aadharImage}
                    alt="Aadhaar Preview"
                    className="mt-3 w-40 h-40 object-cover rounded-lg border"
                  />
                ) : (
                  <p className="text-gray-500">No Aadhaar image available</p>
                )}
              </div>

              {/* Back Button */}
              <div className="pt-6">
                <button
                  onClick={handleBack}
                  className="w-full h-[55px] bg-[#228B22] hover:bg-green-600 text-white text-base font-medium rounded-[12.55px] shadow-sm"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Slider */}
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
                    src={banner || "/src/assets/profile/default.png"} // Fallback image
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/profile/default.png"; // Fallback on image load error
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

        <div className="mt-[50px]">
          <Footer />
        </div>
      </div>
    </>
  );
}