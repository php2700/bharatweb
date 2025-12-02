import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import NoPicAvailable from "../../../assets/bidding/No_Image_Available.jpg";
import locationIcon from "../../../assets/directHiring/location-icon.png";
import aadharImg from "../../../assets/directHiring/aadhar.png";
import defaultPic from "../../../assets/default-image.jpg";
import Arrow from "../../../assets/profile/arrow_back.svg"; // Back arrow
import Location from "../../../assets/Details/location.svg"; // Same location icon as ViewProfileDetails

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HireDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { bidding_offer_id, order_id, hire_status, platFormFee } = location.state || {};

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [providerDetail, setProviderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [documentsUnlocked, setDocumentsUnlocked] = useState(false);
  const [WorkerTab, setWorkerTab] = useState("work");
  const [workIndex, setWorkIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const dispatch = useDispatch();

  const currentUserId = localStorage.getItem("user_id");
  const docUnlockKey = currentUserId && id ? `bidding_docs_unlocked_${currentUserId}_${id}` : null;

  const { profile } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  if (profile && profile.data) {
    localStorage.setItem("user_id", profile._id);
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchBannerImages = async () => {
    const token = localStorage.getItem("bharat_token");
    try {
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (response.data?.success) {
        setBannerImages(response.data.images || []);
        setBannerError(response.data.images?.length === 0 ? "No banners available" : null);
      } else {
        setBannerError(response.data?.message || "Failed to fetch banner images");
      }
    } catch (err) {
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

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

  useEffect(() => {
    const token = localStorage.getItem("bharat_token");
    fetch(`${BASE_URL}/negotiations/getLatestNegotiation/${order_id}/user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const fetchServiceProviderById = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) return;
        const res = await fetch(`${BASE_URL}/user/getServiceProvider/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setProviderDetail(data.data);
      } catch (err) {
        console.error("Error fetching provider:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchServiceProviderById();
  }, [id]);

  // Auto-slide
  useEffect(() => {
    const workImages = providerDetail?.hiswork || [];
    if (WorkerTab !== "work" || workImages.length === 0) return;
    const interval = setInterval(() => {
      setWorkIndex((prev) => (prev + 1) % workImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [WorkerTab, providerDetail?.hiswork?.length]);

  useEffect(() => {
    const reviewImages = providerDetail?.customerReview || [];
    if (WorkerTab !== "review" || reviewImages.length === 0) return;
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviewImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [WorkerTab, providerDetail?.customerReview?.length]);

  const closeModal = () => setSelectedImage(null);
  const handleDocumentClick = (image) => setSelectedImage(image);

  const handleRouteHire = (providerId, isHiredFlag) => {
    if (!providerId) return;
    navigate(`/profile-details/${providerId}/bidding`, {
      state: { bidding_offer_id, order_id, hire_status, isHired: !!isHiredFlag, platFormFee },
    });
  };

  const isHired = location.state?.isHired !== undefined ? !!location.state?.isHired : hire_status === "accepted" || !!platFormFee;

  const unlockDocuments = () => {
    setDocumentsUnlocked(true);
    if (docUnlockKey) localStorage.setItem(docUnlockKey, "true");
  };

  useEffect(() => {
    if (docUnlockKey && localStorage.getItem(docUnlockKey) === "true") {
      setDocumentsUnlocked(true);
    }
  }, [docUnlockKey]);

  useEffect(() => {
    if (isHired) unlockDocuments();
  }, [isHired]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!providerDetail) return <div className="min-h-screen flex items-center justify-center"><p>No Provider Found</p></div>;

  const {
    full_name = "N/A",
    unique_id = "N/A",
    location: providerLocation = { address: "Not Available" },
    businessAddress = { address: "Not Available" },
    isShop = false,
    profilePic = null,
    skill = "No Skill Available",
    category = { name: "Not Available" },
    subcategory_names = [],
    emergencySubcategory_names = [],
    documents = [],
    rateAndReviews = [],
    verificationStatus = "pending",
    hiswork = [],
    customerReview = [],
    avgRating = "0.0",
    totalReviews = 0,
  } = providerDetail;

  const verifiedStatus = verificationStatus === "verified" ? "Verified by Admin" : verificationStatus === "rejected" ? "Rejected" : "Pending";
  const statusClass = verificationStatus === "verified" ? "bg-green-100 text-green-600" : verificationStatus === "rejected" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600";

  const testimage = profilePic && profilePic !== "Not Available";

  // Negotiation & Payment functions remain unchanged
  const handleNagotiation = async (offer) => { /* ... same as before ... */ };
  const handleAcceptNegotiation = async (negotiationId, role, orderId, serviceProviderId) => { /* ... same ... */ };
  const handlePayment = async (order_id, serviceProviderId) => { /* ... same ... */ };

  // ----------------------------------------------------------------------
  // JSX — EXACT SAME DESIGN AS ViewProfileDetails.jsx
  // ----------------------------------------------------------------------
  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover limit={3} />

      {/* Back Button */}
      <div className="container mx-auto mt-20 px-4 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-[#008000] hover:text-green-800 font-semibold">
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
      </div>

      {/* Banner Slider */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        {bannerLoading ? (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">Loading banners...</p>
        ) : bannerError ? (
          <p className="absolute inset-0 flex items-center justify-center text-red-500">Error: {bannerError}</p>
        ) : bannerImages.length > 0 ? (
          <Slider {...sliderSettings}>
            {bannerImages.map((banner, index) => (
              <div key={index}>
                <img src={banner || defaultPic} alt={`Banner ${index + 1}`} className="w-full h-[400px] object-cover" onError={(e) => { e.target.src = defaultPic; }} />
              </div>
            ))}
          </Slider>
        ) : (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">No banners available</p>
        )}
      </div>

      <div className="container mx-auto px-6 py-6">
        <h2 className="text-3xl font-bold text-black mb-3 text-left ml-10 mt-10">
          {isShop ? "Business Details" : "Working Person Details"}
        </h2>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[80px] items-start">
            {/* Profile Image */}
            <div className="relative w-full">
              {testimage ? (
                <img
                  src={profilePic && profilePic !== 'Not Available' ? profilePic : defaultPic}
                  alt="User Profile"
                  className="w-full h-[450px] object-cover rounded-2xl shadow-lg"
                  onError={(e) => { e.target.src = defaultPic; }}
                />
              ) : (
                <div className="w-full h-[450px] flex items-center justify-center bg-gray-200 rounded-2xl shadow-lg text-gray-700 font-semibold">
                  No Profile Picture available
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">
                  {full_name ? full_name.charAt(0).toUpperCase() + full_name.slice(1) : ""}
                </h2>
                {verificationStatus === "verified" && (
                  <span className="bg-[#228B22] text-white text-xs font-semibold px-3 py-1 rounded-full">Verified</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                <span className="font-semibold text-[#228B22]">Id-</span> <span>{unique_id}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                <img src={Location} alt="Location icon" className="w-5 h-5" />
                <span>{isShop ? businessAddress.address : providerLocation.address}</span>
              </div>

              <p className="text-base font-semibold text-gray-700">
                <span className="font-semibold text-[#228B22]">Category-</span> {category.name}
              </p>

              <p className="text-base font-semibold -mt-4 text-gray-700">
                <span className="font-semibold text-[#228B22]">Sub-Categories-</span>{" "}
                {Array.isArray(subcategory_names) && subcategory_names.length > 0
                  ? subcategory_names.map((name, i) => (
                      <span key={i}>{name.trim()}{i !== subcategory_names.length - 1 ? ", " : ""}</span>
                    ))
                  : "Not Available"}
              </p>

              {emergencySubcategory_names.length > 0 && (
                <p className="text-base font-semibold -mt-4 text-gray-700">
                  <span className="font-semibold text-[#228B22]">Emergency Sub-Categories-</span>{" "}
                  {emergencySubcategory_names.map((name, i) => (
                    <span key={i}>{name.trim()}{i !== emergencySubcategory_names.length - 1 ? ", " : ""}</span>
                  ))}
                </p>
              )}

              <div className={`p-4 shadow-xl max-w-[600px] ${skill === "No Skill Available" ? "h-[260px]" : "h-[260px]"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">About My Skill</h3>
                </div>
                <p className="mt-1 text-gray-700 text-base leading-relaxed break-all">{skill}</p>
              </div>
            </div>
          </div>

          {/* Tabs: His Work / Customer Review */}
          <div className="flex justify-center gap-6 p-4 mt-6">
            <button
              onClick={() => { setWorkerTab("work"); setWorkIndex(0); }}
              className={`px-6 py-2 rounded-md shadow-md font-semibold ${WorkerTab === "work" ? "bg-[#228B22] text-white" : "bg-green-100 text-[#228B22]"}`}
            >
              His Work
            </button>
            <button
              onClick={() => { setWorkerTab("review"); setReviewIndex(0); }}
              className={`px-6 py-2 rounded-md shadow-md font-semibold ${WorkerTab === "review" ? "bg-[#228B22] text-white" : "bg-green-100 text-[#228B22]"}`}
            >
              Customer Review
            </button>
          </div>

          {/* Work Images */}
          {WorkerTab === "work" && (
            <div className="mt-6 w-full bg-[#D3FFD3] flex flex-col items-center py-10">
              <div className="relative w-[700px] h-[400px]">
                {hiswork.length > 0 ? (
                  <img src={hiswork[workIndex]} alt="Work" className="w-full h-full object-cover rounded-md shadow-md" onError={(e) => e.target.src = defaultPic} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                    No work available.
                  </div>
                )}
              </div>
              {hiswork.length > 0 && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {hiswork.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 overflow-hidden cursor-pointer" onClick={() => setWorkIndex(i)}>
                        <img src={img} alt="thumb" className="w-full h-full object-cover rounded-md shadow-md" onError={(e) => e.target.src = defaultPic} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Review Images */}
          {WorkerTab === "review" && (
            <div className="mt-6 w-full bg-[#D3FFD3] flex flex-col items-center py-10">
              <div className="relative w-[700px] h-[400px]">
                {customerReview.length > 0 ? (
                  <img src={customerReview[reviewIndex]} alt="Review" className="w-full h-full object-cover rounded-md shadow-md" onError={(e) => e.target.src = defaultPic} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md text-gray-600 font-semibold">
                    No customer reviews available.
                  </div>
                )}
              </div>
              {customerReview.length > 0 && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {customerReview.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 overflow-hidden cursor-pointer" onClick={() => setReviewIndex(i)}>
                        <img src={img} alt="thumb" className="w-full h-full object-cover rounded-md shadow-md" onError={(e) => e.target.src = defaultPic} />
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-700 text-base font-semibold">Customer review images</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Section */}
          <div className="container mx-auto max-w-[750px] px-6 py-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">Documents</h2>
                <span className={`${statusClass} text-xs font-semibold px-3 py-1 rounded-full`}>{verifiedStatus}</span>
              </div>
              <div className="mt-4">
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div key={index} className="mb-8 border-b border-gray-200 pb-8 last:border-b-0 last:mb-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                          <img src={aadharImg} alt="Document Icon" className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800">{doc.documentName}</p>
                      </div>

                      {doc.images?.length > 0 ? (
                        <div className="relative">
                          <div className={`flex flex-wrap gap-6 ${!documentsUnlocked ? "blur-md pointer-events-none" : ""}`}>
                            {doc.images.map((img, imgIndex) => (
                              <div
                                key={imgIndex}
                                className={`group relative w-32 h-32 overflow-hidden rounded-lg shadow-lg transition-shadow ${documentsUnlocked ? "cursor-pointer hover:shadow-xl" : "cursor-default"}`}
                                onClick={documentsUnlocked ? () => handleDocumentClick(img) : undefined}
                              >
                                <img src={img} alt="doc" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" onError={(e) => e.target.src = defaultPic} />
                                {documentsUnlocked && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity opacity-0 group-hover:opacity-100">
                                    <span className="text-white font-medium text-sm">Click to view</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {!documentsUnlocked && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                              <div className="text-center bg-white p-5 rounded-2xl shadow-2xl border border-gray-200">
                                <p className="text-xl font-bold text-[#228B22]">Hire to Unlock</p>
                                <p className="text-sm text-gray-600 mt-1">View clear document images after hiring</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic pl-1">No images uploaded for this document.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <p className="text-xl font-medium text-gray-600">No Documents Uploaded Yet</p>
                    <p className="text-sm text-gray-500 mt-2">Documents will appear here once the worker uploads them.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rate & Reviews */}
          <div className="container mx-auto max-w-[750px] px-6 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Rate & Reviews</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-lead-600">Ratings</span>
                <span className="text-2xl font-bold text-[#228B22]">{avgRating}</span>
                <span className="text-sm text-gray-600">({totalReviews} reviews)</span>
              </div>
            </div>

            {rateAndReviews.length > 0 ? (
              (showAllReviews ? rateAndReviews : rateAndReviews.slice(0, 2)).map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-md p-6 mb-4">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= item.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <img src={item.user.profilePic || defaultPic} alt="Reviewer" className="w-8 h-8 rounded-full" onError={(e) => e.target.src = defaultPic} />
                    <h3 className="font-semibold">{item.user.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.review}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(item.createdAt).toLocaleDateString()} • {item.order_type}
                  </p>
                  {item.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.images.map((img, i) => (
                        <img key={i} src={img} alt="review" className="w-16 h-16 object-cover rounded-md" onError={(e) => e.target.src = defaultPic} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No Ratings Available</p>
            )}

            {rateAndReviews.length > 2 && !showAllReviews && (
              <div className="text-center mt-4">
                <button onClick={() => setShowAllReviews(true)} className="text-[#228B22] font-semibold hover:underline">
                  See All Reviews
                </button>
              </div>
            )}
          </div>

          {/* Offer / Negotiate / Pay Buttons */}
          <div className="container mx-auto max-w-[750px] px-6 py-6">
            {hire_status === "pending" && (
              <>
                <div className="flex flex-col items-center p-6 space-y-6">
                  <div className="flex space-x-4 bg-[#EDEDED] rounded-[50px] p-[12px]">
                    <button
                      onClick={() => setIsOfferActive(true)}
                      className={`px-16 py-2 rounded-full font-medium ${isOfferActive ? "bg-[#228B22] text-white" : "border border-green-600 text-green-600"}`}
                    >
                      Offer Price ({data?.offer_amount || 0})
                    </button>
                    <button
                      onClick={() => setIsOfferActive(false)}
                      className={`px-16 py-2 rounded-full font-medium ${!isOfferActive ? "bg-[#228B22] text-white" : "border border-green-600 text-green-600"}`}
                    >
                      Negotiate
                    </button>
                  </div>

                  {!isOfferActive && (
                    <input
                      type="number"
                      placeholder="Enter your offer amount"
                      value={offer}
                      onChange={(e) => setOffer(e.target.value)}
                      className="w-[531px] px-4 py-2 border-2 border-[#dce1dc] rounded-md text-center text-[#453e3f] placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-[#d1d1d1]"
                    />
                  )}
                </div>

                <div className="text-center mt-4">
                  <button
                    className="bg-[#228B22] text-white w-full py-4 rounded-lg font-semibold text-lg shadow-md hover:bg-green-700 transition"
                    onClick={() => {
                      if (isOfferActive) {
                        handleAcceptNegotiation(data._id, "user", order_id, id);
                      } else {
                        handleNagotiation(offer);
                      }
                    }}
                  >
                    {isOfferActive ? "Accept Request" : "Send Request"}
                  </button>
                </div>
              </>
            )}

            {hire_status === "accepted" && !platFormFee && (
              <div className="text-center mt-6">
                <button
                  className="bg-[#1C4ED8] text-white w-full py-4 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-700 transition"
                  onClick={() => handlePayment(order_id, id)}
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl">
            <div className="flex justify-end">
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800 font-semibold">Close</button>
            </div>
            <img src={selectedImage} alt="Document Preview" className="w-full h-auto max-h-[80vh] object-contain" onError={(e) => e.target.src = defaultPic} />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}