import { useState, useEffect  } from "react";
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import Accepted from "./Accepted";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useLocation,useNavigate } from "react-router-dom";
import Arrow from "../../../assets/profile/arrow_back.svg";
export default function Bid() {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const service_provider = localStorage.getItem("user_id");
  const bidding_offer_id = localStorage.getItem("bidding_offer_id");
    const navigate = useNavigate();

  // Modal States
  const [isBidModal, setIsBidModal] = useState(false);
  const [isEditBidModal, setIsEditBidModal] = useState(false);

  // Data States
  const [data, setData] = useState(null);
  const [worker, setWorker] = useState(null);

  // // Existing Bid (fetched from API)
  const [existingBid, setExistingBid] = useState(null); // { _id, amount, description }
  const [bidLoading, setBidLoading] = useState(false);

  // Offer / Negotiation
  const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);

  // Loading / Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
 


  // Slider settings
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

  // Fetch banner images
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

  
  const { state } = useLocation();

  const task = state?.task;
    console.log(task);
  const hasMyBid = !!task?.offer;

  useEffect(() => {
  if (task?.offer) {
    setExistingBid(task.offer);
  }
}, [task]);

  if (!task) {
    return (
      <div className="text-center py-20 text-red-600 text-2xl font-bold">
        No task details found.
      </div>
    );
  }
  // console.log("Existing Bid:", existingBid);

  return (
    <>
      <Header />
       <div className="container mx-auto px-4 py-4 mt-20">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-[#228B22] hover:text-green-800 font-semibold"
              >
                <img src={Arrow} alt="Back" className="w-6 h-6 mr-2" />
                Back
              </button>
            </div>
      
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      <div className="min-h-screen p-4 sm:p-6">
        <div className="container max-w-5xl mx-auto my-10 p-8 shadow-lg rounded-3xl">
          <h1 className="text-2xl text-center font-bold mb-4">Work Detail</h1>

          {/* Work Image */}
          {worker?.image?.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              className="w-full h-[360px]"
            >
              {worker.image.map((url, index) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-[360px] object-cover"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <img
              src={hisWorkImg}
              alt="No project images available"
              className="w-full h-[360px] object-cover mt-5"
            />
          )}

          {task && (
            <div className="py-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  {/* <span className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm font-semibold px-3 py-1 rounded-full mt-2">
                    <FaMapMarkerAlt size={18} color="#228B22" />
                    <span className="truncate">{worker.location || "N/A"}</span>
                  </span> */}
                  <span
                    onClick={() => setIsMapModalOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-gray-700 text-sm font-semibold px-3 py-1 rounded-full mt-2"
                  >
                    <FaMapMarkerAlt size={18} color="#228B22" />
                    <span className="truncate">{task.location || "N/A"}</span>
                  </span>
                  <p className="font-semibold text-lg my-2 text-[#008000]">
                    Cost :- ₹{task.cost}/-
                  </p>
                  <div className="text-gray-600">
                    <p className="text-lg">
                      <strong>Deadline:</strong>{" "}
                      {task.deadline
                        ? new Date(
                            task.deadline.split("/").reverse().join("-")
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-6">
                  <p className="bg-black text-white text-md px-4 rounded-full inline-block">
                    {task.project_id}
                  </p>
                  <div className="text-gray-600">
                    <p className="text-lg">
                      <strong> Posted Date:</strong>{" "}
                      {task.deadline
                        ? new Date(
                            task.createdAt.split("/").reverse().join("-")
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                  <span className="text-gray-600 font-semibold block">
                    Status:{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium
                        ${task.hire_status === "pending" ? "bg-yellow-500" : ""}
                        ${
                          task.hire_status === "cancelled" ? "bg-[#FF0000]" : ""
                        }
                        ${
                          task.hire_status === "completed" ? "bg-[#228B22]" : ""
                        }
                        ${
                          task.hire_status === "cancelledDispute"
                            ? "bg-[#FF8C00]"
                            : ""
                        }
                        ${
                          task.hire_status === "accepted" ? "bg-blue-500" : ""
                        }`}
                    >
                      {task.hire_status
                        ? task.hire_status
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
                Category:
                {task.category_id?.name ||
                  task.category_name ||
                  task.categoryTitle ||
                  task.category ||
                  "N/A"}
              </p>
              <p className="font-semibold">
                SubCategory:{" "}
                {task?.sub_category_ids?.map((sub) => sub.name).join(", ")}
              </p>

              <h3 className="text-lg font-semibold">Task Details</h3>
              <div className="border border-[#228B22] rounded-lg p-4 text-sm text-gray-700 space-y-3">
                <p>{task.description || "No description available"}</p>
              </div>

              {/* BID / EDIT BID BUTTONS */}
              <div className="flex justify-center gap-6">
                {task.hire_status === "cancelled" && (
                  <div className="flex items-center justify-center gap-2 bg-[#FF0000] text-white px-6 py-3 rounded-lg font-medium">
                    <img src={cancel} alt="Cancelled" className="w-5 h-5" />
                    Cancelled Task By User
                  </div>
                )}
                {task.hire_status === "completed" && (
                  <div className="flex items-center justify-center gap-2 bg-[#228B22] text-white px-6 py-3 rounded-lg font-medium">
                    <span className="px-8 py-2 bg-[#228B22] text-white rounded-lg text-lg font-semibold">
                      Task Completed
                    </span>
                  </div>
                )}

                {/* Pending Case */}
                {task.hire_status === "pending" && (
                  <>
                    {hasMyBid ? (
                      <button
                        onClick={() => setIsEditBidModal(true)}
                        className="text-lg font-semibold text-white py-2 px-4 rounded-lg bg-[#008000] hover:bg-green-700"
                      >
                        Edit Bid (₹{existingBid?.bid_amount})
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsBidModal(true)}
                        className="text-lg font-semibold text-white py-2 px-4 rounded-lg bg-[#008000] hover:bg-green-700"
                      >
                        Bid
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Offer / Negotiate Section */}
          {task?.hire_status === "pending" && (
            <div className="flex flex-col items-center p-6">
              <div className="flex space-x-4 mb-12 bg-[#EDEDED] rounded-[50px] p-[12px]">
                <button
                  onClick={() => setIsOfferActive(true)}
                  className={`px-16 py-2 rounded-full font-medium shadow-sm ${
                    isOfferActive
                      ? "bg-[#228B22] text-white border border-green-600"
                      : "border border-green-600 text-green-600"
                  }`}
                >
                  Offer Price ({data?.offer_amount || 0})
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
                  min="0"
                />
              )}
            </div>
          )}

          {task?.hire_status === "pending" && (
            <div className="text-center">
              <button
                className="bg-[#228B22] text-white w-100 px-10 py-3 rounded-md font-semibold"
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
        {(task?.hire_status === "accepted" ||
          task?.hire_status === "completed" ||
          task?.hire_status === "cancelledDispute") &&
          task?.platform_fee_paid && (
            <Accepted
              serviceProvider={task?.user_id}
              user_id={task?.service_provider_id?._id}
              assignedWorker={assignedWorker}
              paymentHistory={task?.service_payment?.payment_history}
              fullPaymentHistory={task?.service_payment}
              orderId={id}
              hireStatus={task?.hire_status}
            />
          )}
      </div>

      {/* Warning Section */}
      {task?.hire_status === "accepted" && task?.platform_fee_paid && (
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
                {task?.hire_status === "completed"
                  ? "Create Dispute"
                  : "Cancel Task and Create Dispute"}
              </button>
            </Link>
          </div>
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
            <div className="mt-5 text-center">
              {/* <button
                onClick={() => handleGetDirections(worker?.location)}
                className="px-6 py-2 bg-[#228B22] text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Get Directions
              </button> */}
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
        />
      )}
    </>
  );
}
