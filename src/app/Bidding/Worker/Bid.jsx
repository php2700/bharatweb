import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import hisWorkImg from "../../../assets/directHiring/his-work.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BidModal from "./BidModel";
import EditBidModal from "./EditBidModel";
import cancel from "../../../assets/bidding/cancel.png";
import warningIcon from "../../../assets/ViewProfile/warning.svg";
import backArrow from "../../../assets/profile/arrow_back.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import Accepted from "./Accepted";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Bid() {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const service_provider = localStorage.getItem("user_id");
  const bidding_offer_id = localStorage.getItem("bidding_offer_id");

  // ---------------- STATE DEFINITIONS ----------------
  const [isBidModal, setIsBidModal] = useState(false);
  const [isEditBidModal, setIsEditBidModal] = useState(false);
  const [data, setData] = useState(null);
  const [worker, setWorker] = useState(null);
  const [existingBid, setExistingBid] = useState(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // ✅ Platform Fee State
  const [platformFee, setPlatformFee] = useState(0);

  // ✅ Image Zoom State
  const [openImage, setOpenImage] = useState(null);

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

  // ---------------- USE EFFECTS ----------------

  // 1. Fetch Platform Fee
  useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        const response = await axios.get(`${BASE_URL}/get-fee/bidding`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data?.data?.fee) {
          setPlatformFee(response.data.data.fee);
        } else if (response.data?.fee) {
          setPlatformFee(response.data.fee);
        }
      } catch (err) {
        console.error("Failed to fetch platform fee:", err);
      }
    };
    fetchPlatformFee();
  }, [BASE_URL]);

  // 2. Fetch Banner Images
  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `${BASE_URL}/banner/getAllBannerImages`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success && Array.isArray(response.data.images)) {
          setBannerImages(response.data.images);
        } else {
          setBannerError("No banners available");
        }
      } catch (err) {
        setBannerError(err.message || "Failed to fetch banner images");
      } finally {
        setBannerLoading(false);
      }
    };

    fetchBannerImages();
    window.scrollTo(0, 0);
  }, [BASE_URL]);

  // 3. Fetch Work Details
  useEffect(() => {
    const fetchWorkDetails = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) throw new Error("Token not found");

        const response = await axios.get(
          `${BASE_URL}/bidding-order/getBiddingOrderById/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAssignedWorker(response.data.assignedWorker || null);
        if (!response.data?.status)
          throw new Error("Failed to fetch work details");

        const result = response.data.data;

        setWorker({
          _id: result._id,
          order_id: result._id,
          project_id: result.project_id,
          workName: result.title,
          location: result.address,
          status: result.status,
          image: result.image_url || [],
          amount: result.cost,
          platform_fee_paid: result.platform_fee_paid,
          date: result.createdAt,
          completionDate: result.deadline,
          skills: result.description,
          service_provider_id: result.service_provider_id,
          user_id: result.user_id,
          category_id: result.category_id || null,
          sub_category_ids: result.sub_category_ids || [],
          hire_status: result.hire_status,
          service_payment: result.service_payment,
        });
      } catch (err) {
        console.error("Fetch Work Details Error:", err);
        setError(err.message || "Failed to fetch work details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkDetails();
  }, [id, BASE_URL]);

  // 4. Fetch Existing Bid
  useEffect(() => {
    const fetchExistingBid = async () => {
      if (!worker?.order_id || !service_provider) return;

      try {
        setBidLoading(true);
        const token = localStorage.getItem("bharat_token");
        const res = await axios.get(
          `${BASE_URL}/bidding-order/getBiddingOfferByOrder/${worker.order_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data?.status && res.data.data) {
          setExistingBid(res.data.data);
        } else {
          setExistingBid(null);
        }
      } catch (err) {
        console.error("Fetch existing bid error:", err);
        setExistingBid(null);
      } finally {
        setBidLoading(false);
      }
    };

    fetchExistingBid();
  }, [worker?.order_id, service_provider, BASE_URL]);

  // 5. Fetch Negotiation
  useEffect(() => {
    const fetchNegotiation = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!worker?.order_id || !token) return;

        const res = await fetch(
          `${BASE_URL}/negotiations/getLatestNegotiation/${worker.order_id}/service_provider`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await res.json();
        if (result) {
          setData(result);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Fetch Negotiation Error:", err);
        setError(err.message || "Failed to fetch negotiation data");
        setData(null);
      }
    };

    fetchNegotiation();
  }, [worker, BASE_URL]);

  // ---------------- HANDLER FUNCTIONS ----------------

  const handleGetDirections = (destinationAddress) => {
    if (destinationAddress) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        destinationAddress
      )}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      toast.warn("Destination address not found!");
    }
  };

  // 🔥 VALIDATION ADDED BACK HERE (Send Request) 🔥
  const handleNegotiation = async (offerAmount) => {
    if (!offerAmount || isNaN(offerAmount) || offerAmount <= 0) {
      toast.error("Please enter a valid offer amount");
      return;
    }

    // ✅ Validation Logic: Offer > Fee * 10
    if (platformFee && platformFee > 0) {
      const minRequiredAmount = platformFee * 10;

      if (Number(offerAmount) <= minRequiredAmount) {
        toast.error(
          `Offer amount must be greater than ₹${minRequiredAmount} because platform fee is ₹${platformFee}.`
        );
        return;
      }
    }

    try {
      const token = localStorage.getItem("bharat_token");
      const response = await axios.post(
        `${BASE_URL}/negotiations/start`,
        {
          order_id: worker?.order_id,
          bidding_offer_id,
          service_provider,
          user: worker?.user_id?._id,
          initiator: "service_provider",
          offer_amount: Number(offerAmount),
          message: `Can you do it for ${offerAmount}?`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setOffer("");
        toast.success(`You sent ₹${offerAmount} for negotiation`);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Negotiation API Error:", error);
      toast.error("Failed to start negotiation");
    }
  };

  const handleBidSuccess = (amount, description, duration, bidId) => {
    setExistingBid({
      bid_amount: amount,
      message: description,
      duration: duration,
      _id: bidId,
    });
    setIsBidModal(false);
  };

  const handleEditBidSuccess = (newAmount, newDesc, newDuration) => {
    setExistingBid((prev) => ({
      ...prev,
      bid_amount: newAmount,
      message: newDesc,
      duration: newDuration,
    }));
    setIsEditBidModal(false);
  };

  const handleAcceptNegotiation = async (id, role) => {
    if (!id) {
      toast.error("Negotiation ID is missing");
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      const response = await axios.put(
        `${BASE_URL}/negotiations/accept/${id}`,
        { role },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        toast.success("You accepted the negotiation");
        window.location.reload();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Accept Negotiation API Error:", error);
      toast.error("Failed to accept negotiation");
    }
  };
useEffect(() => {
  if (worker?.service_provider_id?._id) {
    console.log("Provider ID:", worker.service_provider_id._id);
  }
}, [worker]);

  if (loading) return <div className="text-center py-6">Loading...</div>;
  if (error)
    return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto mt-20 px-4 py-4">
        <button
          className="flex items-center text-[#228B22] hover:text-green-800 font-semibold"
          onClick={() => window.history.back()}
        >
          <img src={backArrow} className="w-6 h-6 mr-2" alt="Back" />
          Back
        </button>
      </div>

      <div className="min-h-screen p-4">
        <div className="container max-w-5xl mx-auto my-10 p-8 shadow-lg rounded-3xl">
          <h1 className="text-2xl text-center font-bold mb-4">Work Detail</h1>

          {/* Work Image with Click Zoom */}
          {worker?.image?.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              className="w-full h-[360px]"
              emulateTouch={true}
              onClickItem={(index) => setOpenImage(worker.image[index])}
            >
              {worker.image.map((url, index) => (
                <div key={index} className="cursor-pointer">
                  <img
                    src={url}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-[360px] object-cover"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div
              onClick={() => setOpenImage(hisWorkImg)}
              className="cursor-pointer"
            >
              <img
                src={hisWorkImg}
                alt="No project images available"
                className="w-full h-[360px] object-cover mt-5"
              />
            </div>
          )}

          {worker && (
            <div className="py-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{worker.workName}</h2>
                  <span
                    onClick={() => setIsMapModalOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm font-semibold px-3 py-1 rounded-full mt-2"
                  >
                    <FaMapMarkerAlt size={18} color="#228B22" />
                    <span className="truncate">{worker.location || "N/A"}</span>
                  </span>
                  <p className="font-semibold text-lg my-2 text-[#008000]">
                    Cost :- ₹{worker.amount}/-
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">
                      Completion Date:{" "}
                      {new Date(worker.completionDate).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="bg-black text-white text-md px-4 rounded-full inline-block">
                    {worker.project_id}
                  </p>
                  <p className="text-md mt-2">
                    <span className="font-semibold">
                      Posted Date:{" "}
                      {new Date(worker.date).toLocaleDateString("en-GB")}
                    </span>
                  </p>
                  <span className="text-gray-600 font-semibold block">
                    Status:{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium
                        ${
                          worker.hire_status === "pending"
                            ? "bg-yellow-500"
                            : ""
                        }
                        ${
                          worker.hire_status === "cancelled"
                            ? "bg-[#FF0000]"
                            : ""
                        }
                        ${
                          worker.hire_status === "completed"
                            ? "bg-[#228B22]"
                            : ""
                        }
                        ${
                          worker.hire_status === "cancelledDispute"
                            ? "bg-[#FF8C00]"
                            : ""
                        }
                        ${
                          worker.hire_status === "accepted" ? "bg-blue-500" : ""
                        }`}
                    >
                      {worker.hire_status
                        ? worker.hire_status
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        : "Unknown Status"}
                    </span>
                  </span>
                </div>
              </div>

              <p className="font-semibold">
                Category: {worker?.category_id?.name}
              </p>
              <p className="font-semibold">
                SubCategory:{" "}
                {worker?.sub_category_ids?.map((sub) => sub.name).join(", ")}
              </p>

              <h3 className="text-lg font-semibold">Task Details</h3>
              <div className="border border-[#228B22] rounded-lg p-4 text-sm text-gray-700 space-y-3">
                <p>{worker.skills || "No description available"}</p>
              </div>

              {/* BID / EDIT BID BUTTONS */}
              <div className="flex justify-center gap-6">
                {worker.hire_status === "cancelled" && (
                  <div className="flex items-center justify-center gap-2 bg-[#FF0000] text-white px-6 py-3 rounded-lg font-medium">
                    <img src={cancel} alt="Cancelled" className="w-5 h-5" />
                    Cancelled Task By User
                  </div>
                )}
                {worker.hire_status === "completed" && (
                  <div className="flex items-center justify-center gap-2 bg-[#228B22] text-white px-6 py-3 rounded-lg font-medium">
                    <span className="px-8 py-2 bg-[#228B22] text-white rounded-lg text-lg font-semibold">
                      Task Completed
                    </span>
                  </div>
                )}
                {worker.hire_status === "cancelledDispute" && (
                  <div className="flex items-center justify-center gap-2 bg-[#FF8C00] text-white px-6 py-3 rounded-lg font-medium">
                    <span className="px-8 py-2 bg-[#FF8C00] text-white rounded-lg text-lg font-semibold">
                      Cancelled (Dispute)
                    </span>
                  </div>
                )}

                {/* PENDING: Show Bid or Edit Bid */}
                {worker.hire_status === "pending" && (
                  <>
                    {!bidLoading && !existingBid && (
                      <button
                        onClick={() => setIsBidModal(true)}
                        className="text-lg font-semibold text-white py-2 px-4 rounded-lg bg-[#008000] hover:bg-green-700"
                      >
                        Bid
                      </button>
                    )}

                    {!bidLoading && existingBid && (
                      <button
                        onClick={() => setIsEditBidModal(true)}
                        className="text-lg font-semibold text-white py-2 px-4 rounded-lg bg-[#008000] hover:bg-green-700"
                      >
                        Edit Bid: (₹{existingBid.bid_amount})
                      </button>
                    )}

                    {bidLoading && (
                      <div className="text-gray-600">Checking your bid…</div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Offer / Negotiate Section */}
          {worker?.hire_status === "pending" && (
            <div className="flex flex-col items-center p-6">
              <div className="flex space-x-4 mb-12 bg-[#EDEDED] rounded-[50px] p-[12px]">
                <button
                  onClick={() => setIsOfferActive(true)}
                  className={`px-16 py-2 rounded-full font-medium cursor-pointer shadow-sm ${
                    isOfferActive
                      ? "bg-[#228B22] text-white border border-green-600"
                      : "border border-green-600 text-green-600"
                  }`}
                >
                  Offer Price ({data?.offer_amount || 0})
                </button>
                <button
                  onClick={() => setIsOfferActive(false)}
                  className={`px-16 py-2 rounded-full font-medium shadow-md cursor-pointer ${
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
                  min="0"
                />
              )}
            </div>
          )}

          {worker?.hire_status === "pending" && (
            <div className="text-center">
              <button
                className="bg-[#228B22] text-white w-100 px-10 py-3 rounded-md font-semibold cursor-pointer"
                onClick={() => {
                  if (isOfferActive) {
                    handleAcceptNegotiation(data?._id, "service_provider");
                  } else {
                    handleNegotiation(offer);
                  }
                }}
              >
                {isOfferActive ? "Accept Request" : "Send Request"}
              </button>
            </div>
          )}
        </div>

        {/* Accepted Section */}
        {(worker?.hire_status === "accepted" ||
          worker?.hire_status === "completed" ||
          worker?.hire_status === "cancelledDispute") &&
          worker?.platform_fee_paid && (
            <Accepted
              serviceProvider={worker?.user_id}
              user_id={worker?.service_provider_id?._id}
              assignedWorker={assignedWorker}
              paymentHistory={worker?.service_payment?.payment_history}
              fullPaymentHistory={worker?.service_payment}
              orderId={id}
              hireStatus={worker?.hire_status}
            />
          )}
      </div>

      {/* Warning Section */}
      {worker?.hire_status === "accepted" && worker?.platform_fee_paid && (
        <div className="flex flex-col items-center justify-center space-y-6 mt-6">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative z-10">
              <img
                src={warningIcon}
                alt="Warning"
                className="w-40 h-40 mx-auto bg-white border border-[#228B22] rounded-lg px-2"
              />
            </div>
            <div className="bg-[#FBFBBA] border border-yellow-300 rounded-lg shadow-md p-4 -mt-20 pt-24 text-center">
              <h2 className="text-[#FE2B2B] font-bold -mt-2">
                Warning Message
              </h2>
              <p className="text-gray-700 text-sm md:text-base">
                Lorem Ipsum is simply dummy text...
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link to={`/dispute/${id}/bidding`}>
              <button className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md">
                Cancel Task and Create Dispute
              </button>
            </Link>
          </div>
        </div>
      )}
      {worker?.hire_status === "completed" && (
        <div className="flex justify-center mt-4">
          <Link to={`/dispute/${id}/bidding`}>
            <button className="bg-[#EE2121] hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md">
              Create Dispute
            </button>
          </Link>
        </div>
      )}

      {/* Banner Slider */}
      <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-[#f2e7ca] h-[400px] my-10">
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
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = hisWorkImg;
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

      <Footer />

      {/* Lightbox / Image Zoom Modal */}
      {openImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpenImage(null)}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={openImage}
              alt="Preview"
              className="max-w-[98vw] max-h-[95vh] w-auto h-auto rounded-lg shadow-2xl object-contain"
            />
            <button
              onClick={() => setOpenImage(null)}
              className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-white text-black rounded-full shadow-lg text-2xl font-bold cursor-pointer hover:bg-gray-200"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Work Location on Map</h2>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="text-red-500 font-bold text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="w-full h-96 rounded-lg overflow-hidden border">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                  worker?.location || ""
                )}`}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isBidModal && (
        <BidModal
          isOpen={isBidModal}
          onClose={() => setIsBidModal(false)}
          orderId={worker?._id}
          onBidSuccess={handleBidSuccess}
          platformFee={platformFee} // 🔥 Fee passed to Modal
        />
      )}

      {isEditBidModal && existingBid && (
        <EditBidModal
          isOpen={isEditBidModal}
          onClose={() => setIsEditBidModal(false)}
          orderId={worker?._id}
          initialAmount={existingBid.bid_amount}
          initialDuration={existingBid.duration}
          initialDescription={existingBid.message}
          bidId={existingBid._id}
          onEditSuccess={handleEditBidSuccess}
          platformFee={platformFee} // 🔥 Fee passed to Edit Modal too
        />
      )}
    </>
  );
}
