import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Arrow from "../../assets/profile/arrow_back.svg";
import Location from "../../assets/Details/location.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import defaultPic from "../../assets/default-image.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ViewProfileDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [WorkerTab, setWorkerTab] = useState("work");
  const [workIndex, setWorkIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
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
      console.error("Error fetching banner images:", err.message);
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  // Fetch category and subcategory names
  const fetchCategoryAndSubcategories = async (categoryId, subcategoryIds, emergencySubcategoryIds) => {
    try {
      const token = localStorage.getItem("bharat_token");
      const categoryResponse = await axios.get(`${BASE_URL}/category/getCategory/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const categoryName = categoryResponse.data?.success ? categoryResponse.data.category.name : "Not Available";

      const subcategoryPromises = subcategoryIds.map((id) =>
        axios.get(`${BASE_URL}/subcategory/getSubcategory/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const subcategoryResponses = await Promise.all(subcategoryPromises);
      const subcategoryNames = subcategoryResponses.map((res) =>
        res.data?.success ? res.data.subcategory.name : "Unknown"
      );

      const emergencySubcategoryPromises = emergencySubcategoryIds.map((id) =>
        axios.get(`${BASE_URL}/subcategory/getSubcategory/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const emergencySubcategoryResponses = await Promise.all(emergencySubcategoryPromises);
      const emergencySubcategoryNames = emergencySubcategoryResponses.map((res) =>
        res.data?.success ? res.data.subcategory.name : "Unknown"
      );

      return { categoryName, subcategoryNames, emergencySubcategoryNames };
    } catch (error) {
      console.error("Error fetching category/subcategories:", error);
      return {
        categoryName: "Not Available",
        subcategoryNames: [],
        emergencySubcategoryNames: [],
      };
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchWorkerProfile = async () => {
      if (!userId) {
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

        const response = await axios.get(`${BASE_URL}/user/getUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data?.success) {
          const user = response.data.user;
          const { categoryName, subcategoryNames, emergencySubcategoryNames } =
            await fetchCategoryAndSubcategories(
              user.category_id,
              user.subcategory_ids,
              user.emergencysubcategory_ids
            );

          setWorker({
            ...user,
            category: { name: categoryName },
            subcategory_names: subcategoryNames,
            emergencySubcategory_names: emergencySubcategoryNames,
            customerReview: user.rateAndReviews,
            avgRating: user.rating,
            totalReviews: user.totalReview,
            profilePic: `${import.meta.env.VITE_SOCKET_URL}${user.profile_pic}` || defaultPic,
          });
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
    fetchBannerImages();
  }, [userId, navigate]);

  const memoizedWorker = useMemo(() => worker, [worker]);

  useEffect(() => {
    if (WorkerTab !== "work" || !memoizedWorker?.hiswork?.length) return;

    const interval = setInterval(() => {
      setWorkIndex((prevIndex) => (prevIndex + 1) % memoizedWorker.hiswork.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, memoizedWorker?.hiswork]);

  useEffect(() => {
    if (WorkerTab !== "review" || !memoizedWorker?.rateAndReviews?.length) return;

    const interval = setInterval(() => {
      setReviewIndex((prevIndex) => (prevIndex + 1) % memoizedWorker.rateAndReviews.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, memoizedWorker?.rateAndReviews]);

  useEffect(() => {
    if (WorkerTab !== "business" || !memoizedWorker?.businessImage?.length) return;

    const interval = setInterval(() => {
      setWorkIndex((prevIndex) => (prevIndex + 1) % memoizedWorker.businessImage.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [WorkerTab, memoizedWorker?.businessImage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">No worker data found.</p>
      </div>
    );
  }

  const {
    full_name = "N/A",
    location = { address: "Not Available" },
    full_address = [{ address: "Not Available" }],
    isShop = false,
    profilePic = null,
    skill = "No Skill Available",
  } = memoizedWorker;

  const testimage = profilePic && profilePic !== "Not Available";

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        className="z-50"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-600 hover:text-green-800 font-medium text-sm sm:text-base transition-colors mb-4"
        >
          <img src={Arrow} className="w-5 h-5 sm:w-6 sm:h-6 mr-2" alt="Back arrow" />
          Back
        </button>

        {/* Banner Slider */}
        <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden bg-gray-200 h-[200px] sm:h-[300px] lg:h-[400px] mt-6 shadow-lg">
          {bannerLoading ? (
            <p className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm sm:text-base">
              Loading banners...
            </p>
          ) : bannerError ? (
            <p className="absolute inset-0 flex items-center justify-center text-red-500 text-sm sm:text-base">
              Error: {bannerError}
            </p>
          ) : bannerImages.length > 0 ? (
            <Slider {...sliderSettings}>
              {bannerImages.map((banner, index) => (
                <div key={index}>
                  <img
                    src={banner || defaultPic}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[200px] sm:h-[300px] lg:h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = defaultPic;
                    }}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm sm:text-base">
              No banners available
            </p>
          )}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-left">
            {isShop ? "Business Details" : "Working Person Details"}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            <div className="relative w-full">
              {testimage ? (
                <img
                  src={profilePic}
                  alt="User Profile"
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    e.target.src = defaultPic;
                  }}
                />
              ) : (
                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center bg-gray-200 rounded-2xl shadow-lg text-gray-700 font-medium text-sm sm:text-base">
                  No Profile Picture available
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{full_name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <img src={Location} className="w-5 h-5" alt="Location icon" />
                <p className="text-gray-600 text-sm sm:text-base">{location.address}</p>
              </div>
              {full_address.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-semibold text-lg sm:text-xl text-gray-900">Additional Addresses</h3>
                  {full_address.map((addr, index) => (
                    <div key={index} className="text-gray-600 text-sm sm:text-base">
                      <span className="font-medium">{addr.title}: </span>
                      {addr.address} {addr.landmark && `(Landmark: ${addr.landmark})`}
                    </div>
                  ))}
                </div>
              )}
              <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-lg max-w-full">
                <h3 className="font-semibold text-lg sm:text-xl text-gray-900">About My Skill</h3>
                <p className="mt-2 text-gray-700 text-sm sm:text-base leading-relaxed">
                  {skill}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
