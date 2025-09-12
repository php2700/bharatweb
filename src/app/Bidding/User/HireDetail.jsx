import Header from "../../../component/Header";
import banner from "../../../assets/banner.png";
import Footer from "../../../component/footer";
import serviceProviderImg from "../../../assets/directHiring/service-provider.png";
import NoPicAvailable from '../../../assets/bidding/No_Image_Available.jpg';

import locationIcon from "../../../assets/directHiring/location-icon.png";
import hisWorkImg from "../../../assets/directHiring/his-work.png";
import ratingImgages from "../../../assets/directHiring/rating.png";
import aadharImg from "../../../assets/directHiring/aadhar.png";
import { useLocation, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HireDetail() {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const { id } = useParams();
  const location=useLocation();
    const { bidding_offer_id, order_id } = location.state || {};
    
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [providerDetail, setProviderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);
  const dispatch = useDispatch();
 
  const { profile} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch])
  if(profile && profile.data){
    localStorage.setItem('user_id',profile.data._id);
  }
  
useEffect(() => {
    const token = localStorage.getItem("bharat_token");
    

    fetch(`${BASE_URL}/negotiations/getLatestNegotiation/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);
  useEffect(() => {
    const fetchServiceProviderById = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) return;

        const res = await fetch(`${BASE_URL}/user/getServiceProvider/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setProviderDetail(data.data);
        } else {
          console.error(data.message || "Failed to fetch provider");
        }
      } catch (err) {
        console.error("Error fetching provider:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceProviderById();
    }
  }, [id]);

  const imagsArray = [
    hisWorkImg,
    serviceProviderImg,
    hisWorkImg,
    serviceProviderImg,
    hisWorkImg,
    serviceProviderImg,
  ];

  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % imagsArray.length);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [imagsArray.length]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!providerDetail) {
    return <div className="text-center py-10">No Provider Found</div>;
  }
  const handleNagotiation=async(offer)=>{
    const userId = localStorage.getItem("user_id"); // user id from localStorage
    const token = localStorage.getItem("bharat_token"); // bearer token from localStorage

    if (!offer) {
      toast.error("Please enter offer amount ❗");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/negotiations/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // bearer token
        },
        body: JSON.stringify({
          order_id, // from location.state
          bidding_offer_id, // from location.state
          service_provider: id, // from URL
          user: userId, // from localStorage
          initiator: "user", // fixed
          offer_amount: Number(offer), // from parameter
          message: `Can you do it for ${offer}?`, // dynamic with offer
        }),
      });

      const data = await response.json();
      console.log("Negotiation API Response:", data);

      if (response.ok) {
        toast.success(`You sent ₹${offer} Amount For Negotiation`);
      } else {
        alert(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to start negotiation ❌");
    }
  }

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-50">
        {/* Banner */}
        <div className="w-full mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Banner"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>

        <div className="container max-w-6xl mx-auto my-10">
          <div className="text-xl sm:text-2xl font-bold mb-6">Direct Hiring</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Profile Pic */}
            <div>
              <img
                src={providerDetail.profilePic || NoPicAvailable}
                alt="Service Provider"
                className="rounded-xl shadow-lg"
              />
            </div>

            <div className="space-y-4">
              {/* Name + Rating */}
              <div className="flex justify-between items-center">
                <div className="text-lg sm:text-xl font-semibold text-gray-800">
                  {providerDetail.full_name}
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-semibold">
                      ({providerDetail.rating || 0}
                    </span>
                    <img
                      className="h-5 w-5 mx-1"
                      src={ratingImgages}
                      alt="Rating"
                    />
                    <span className="font-semibold">)</span>
                  </div>
                  <div className="text-[#228B22] underline font-semibold">
                    {providerDetail.totalReview} Reviews
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <img
                  src={locationIcon}
                  alt="Location"
                  className="h-5 mr-2 text-green-500"
                />
                {providerDetail.location?.address || "Location not available"}
              </div>

              {/* Category + Subcategory */}
              <div className="text-gray-700">
                <p>
                  <span className="font-semibold text-green-600">
                    Category-{" "}
                  </span>
                  {providerDetail.category_name}
                </p>
                <p>
                  <span className="font-semibold text-green-600">
                    Sub-Categories-{" "}
                  </span>
                  {providerDetail.subcategory_names?.join(", ")}
                </p>
              </div>

              {/* About */}
              <div className="bg-gray-50 shadow-2xl rounded-lg p-4 text-sm text-gray-600">
                <div className="font-semibold text-xl text-gray-800 mb-2">
                  About My Skill
                </div>
                <p>{providerDetail.skill || "No skill info available."}</p>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                <button className="border border-[#228B22] text-[#228B22] font-medium py-2 px-4 rounded-lg">
                  💬 Message
                </button>
                <button className="border border-[#228B22] text-[#228B22] font-medium py-2 px-8 rounded-lg">
                  📞 Call
                </button>
              </div>
            </div>
          </div>

          {/* His Work + Review Tabs */}
          <div className="flex justify-center gap-4 my-10">
            <button className="py-1 px-10 bg-[#D3FFD3] rounded-lg border text-[#008000] cursor-pointer">
              His Work
            </button>
            <button className="py-1 px-6 rounded-lg border text-[#008000] cursor-pointer">
              Customer Review
            </button>
          </div>
        </div>

        {/* Image Slider */}
        <div className="bg-[#D3FFD3] h-90 flex items-center relative">
          <img
            className="h-80 w-1/2 mx-auto"
            src={imagsArray[imageIndex]}
            alt="His Work"
          />

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {imagsArray?.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300
                ${idx === imageIndex ? "bg-green-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="container max-w-2xl mx-auto my-10 space-y-6">
          <div className="shadow-2xl rounded-lg py-4 px-10">
            <h2 className="font-semibold text-lg mb-2">Document</h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 p-2 rounded">📄</span>
                <span className="font-medium">Aadhar card</span>
              </div>
              <div className="bg-[#A9FFB3] h-24 w-40 flex justify-center">
                <img
                  src={providerDetail.documents || aadharImg}
                  alt="Document"
                  className="h-23 rounded-md border w-[127px]"
                />
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Rate & Reviews</h2>
            {providerDetail.rateAndReviews?.length > 0 ? (
              providerDetail.rateAndReviews.map((review, idx) => (
                <div
                  key={idx}
                  className="shadow-2xl rounded-lg p-4 mb-4 bg-white"
                >
                  <div className="flex text-yellow-500 mb-1">{"★★★★☆"}</div>
                  <div className="font-medium">{review.title}</div>
                  <p className="text-sm text-gray-600 mb-2">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{new Date(review.date).toDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews available.</p>
            )}
          </div>

          {/* Offer/Negotiate Section */}
          <div className="flex flex-col items-center  p-6 ">
            <div className="flex space-x-4 mb-12 bg-[#EDEDED] rounded-[50px] p-[12px]">
              <button
                onClick={() => setIsOfferActive(true)}
                className={`px-16 py-2 rounded-full font-medium shadow-sm ${
                  isOfferActive
                    ? "bg-[#228B22] text-white border border-green-600"
                    : "border border-green-600 text-green-600"
                }`}
              >
                Offer Price (0)
              </button>
              <button
                onClick={() => setIsOfferActive(false)}
                className={`px-16 py-2 rounded-full font-medium shadow-md ${
                  !isOfferActive
                    ? "bg-[#228B22] text-white hover:bg-[#228B22]"
                    : "border border-green-600 text-green-600"
                }`}
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

{/* Accept / Send Request */}
<div className="text-center">
  <button
    className="bg-[#228B22] text-white w-full px-10 py-3 rounded-md font-semibold"
    onClick={() => {
      if (isOfferActive) {
        alert("Request Accepted ✅");
      } else {
        handleNagotiation(offer);
      }
    }}
  >
    {isOfferActive ? "Accept Request" : "Send Request"}
  </button>
</div>

        </div>
      </div>
      <Footer />
    </>
  );
}
