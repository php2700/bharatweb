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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import Accepted from "./Accepted";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import Arrow from "../../../assets/profile/arrow_back.svg";
export default function Bid() {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const service_provider = localStorage.getItem("user_id");
  const bidding_offer_id = localStorage.getItem("bidding_offer_id");
  const navigate = useNavigate();

  const [isBidModal, setIsBidModal] = useState(false);
  const [isEditBidModal, setIsEditBidModal] = useState(false);

  const [data, setData] = useState(null);
  const [worker, setWorker] = useState(null);

  const [existingBid, setExistingBid] = useState(null);
  const [bidLoading, setBidLoading] = useState(false);
  const [openImage, setOpenImage] = useState(null);

  const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [assignedWorker, setAssignedWorker] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [showFullLocation, setShowFullLocation] = useState(false);

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

      <div className="container mx-auto mt-20 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#228B22] hover:text-green-800 font-semibold cursor-pointer"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
          Back
        </button>
      </div>

      <div className="min-h-screen sm:p-6">
        <div className="container max-w-5xl mx-auto p-4 shadow-lg rounded-3xl">
          <h1 className="text-xl md:text-2xl text-center font-bold mb-4">
            Work Detail
          </h1>

          {/* Work Image */}
          {worker?.image?.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              className="w-full h-[200px] sm:h-[300px] md:h-[360px]"
            >
              {worker.image.map((url, index) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-[200px] sm:h-[300px] md:h-[360px] object-cover"
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
                className="w-full h-[200px] sm:h-[300px] md:h-[360px] object-cover mt-2"
              />
            </div>
          )}

          {task && (
            <div className="py-6 space-y-4">
              <div className=" flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4">
                <div>
                  <h2 className=" text-base md:text-lg font-semibold">
                    {task.title}
                  </h2>

                  <div className="flex items-start mt-2">
                    <span
                      onClick={() => setIsMapModalOpen(true)}
                      className="flex   cursor-pointer text-gray-700 text-sm font-semibold px-3 py-1 rounded-full "
                    >
                      <FaMapMarkerAlt size={15} color="#228B22" />
                    </span>
                    <div className="flex-1">
                      <p
                        lassName={`${
                          showFullLocation ? "whitespace-normal" : "truncate"
                        } max-w-[140px] sm:max-w-none`}
                      >
                        {task.location || "N/A"}
                      </p>

                      {task.location &&
                        task.location.split(" ").length > 8 &&
                        !showFullLocation && (
                          <button
                            onClick={() => setShowFullLocation(true)}
                            className="text-blue-600 text-xs font-semibold mt-1 sm:hidden"
                          >
                            See more
                          </button>
                        )}

                      {showFullLocation && (
                        <button
                          onClick={() => setShowFullLocation(false)}
                          className="text-blue-600 text-xs font-semibold mt-1 sm:hidden"
                        >
                          See less
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="font-semibold text-base md:text-lg my-2 text-[#008000]">
                    Cost :- ₹{task.cost}/-
                  </p>
                  <div className="text-gray-600">
                    <p className=" text-base md:text-lg">
                      <strong>Deadline:</strong>{" "}
                      {task.deadline
                        ? new Date(
                            task.deadline.split("/").reverse().join("-")
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-3">
                  <p className="bg-gray-800 text-white px-4 py-1 rounded-full  text-base md:text-lg block text-center">
                    {task.project_id}
                  </p>
                  <div className="text-gray-800   block">
                    <p className=" text-base md:text-lg">
                      <span className="font-semibold text-gray-700 mr-2">
                        Posted Date:
                      </span>
                      {task.deadline
                        ? new Date(
                            task.createdAt.split("/").reverse().join("-")
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center  text-base md:text-lg gap-2">
                    <span className="text-gray-700  font-semibold">
                      Order_Status:
                    </span>
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
                  </div>
                </div>
              </div>

              {/* <p className="font-semibold">
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
              </p> */}

              <h3 className=" text-base md:text-lg font-semibold">
                Task Details
              </h3>
              <div className="border border-[#228B22] rounded-lg p-4 text-sm text-gray-700 space-y-3">
                <p>{task.description || "No description available"}</p>
              </div>

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

                {task.hire_status === "pending" && (
                  <>
                    {hasMyBid ? (
                      <button
                        onClick={() => setIsEditBidModal(true)}
                        className=" text-base md:text-lg font-semibold text-white py-2 px-4 rounded-lg bg-[#008000] hover:bg-green-700"
                      >
                        Edit Bid (₹{existingBid?.bid_amount})
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsBidModal(true)}
                        className=" text-base md:text-lg font-semibold text-white py-2 px-4 rounded-lg bg-[#008000] hover:bg-green-700"
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
              <div className="flex flex-wrap gap-3 mb-12 md:bg-[#EDEDED] rounded-[50px] p-3 justify-center">
                <button
                  onClick={() => setIsOfferActive(true)}
                  className={`w-full sm:w-auto px-6 sm:px-16 py-2 rounded-full font-medium shadow-sm text-center  text-base md:text-lg ${
                    isOfferActive
                      ? "bg-[#228B22] text-white border border-green-600"
                      : "border border-green-600 text-green-600"
                  }`}
                >
                  Offer Price ({data?.offer_amount || 0})
                </button>
                <button
                  onClick={() => setIsOfferActive(false)}
                  className={`w-full sm:w-auto  text-base md:text-lg px-6 sm:px-16 py-2 rounded-full font-medium shadow-md text-center ${
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
                  className=" w-[280px] md:w-[531px] px-4 py-2 border-2 border-[#dce1dc] rounded-md text-center text-[#453e3f] placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-[#d1d1d1]"
                  min="0"
                />
              )}
            </div>
          )}

          {task?.hire_status === "pending" && (
            <div className="text-center  text-base md:text-lg">
              <button
                className="bg-[#228B22] text-white   w-80 md:w-100 px-10 py-3 rounded-md font-semibold"
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

      {/* Warning Section
      {task?.hire_status === "accepted" && task?.platform_fee_paid && (
        <div className="flex flex-col items-center justify-center space-y-6 mt-6 px-4">
          <div className="relative w-full max-w-md mx-auto">
            <div className="relative z-10 flex justify-center">
              <img
                src={warningIcon}
                alt="Warning"
                className="w-28 h-28 sm:w-40 sm:h-40 bg-white border border-[#228B22] rounded-lg p-2"
              />
            </div>
            <div className="bg-[#FBFBBA]border border-yellow-300 rounded-lg shadow-md 
                      p-3 sm:p-4 -mt-14 sm:-mt-20 pt-16 sm:pt-24 text-center">
              <h2 className="text-[#FE2B2B] font-bold text-base sm:text-lg">
                Warning Message
              </h2>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base">
                Lorem Ipsum is simply dummy text...
              </p>
            </div>
          </div>
          <div className="w-full max-w-md">
            <Link to={`/dispute/${id}/bidding`}>
              <button className="bg-[#EE2121] w-full sm:w-auto  hover:bg-red-600 text-white 
                           px-6 py-3 rounded-lg font-semibold shadow-md">
                {task?.hire_status === "completed"
                  ? "Create Dispute"
                  : "Cancel Task and Create Dispute"}
              </button>
            </Link>
          </div>
        </div>
      )} */}

      {/* Banner Slider */}
      {/* <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-[#f2e7ca] h-[400px] my-10">
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
      </div> */}
      <div className="w-full pt-2 sm:pt-4 lg:pt-5 px-3 sm:px-6 mb-5 lg:px-0">
        <div
          className="w-full  max-w-[95%] mx-auto rounded-[50px] overflow-hidden shadow-2xl relative bg-[#f2e7ca] mt-5 
                              h-[220px] sm:h-[400px] "
        >
          <Slider {...sliderSettings}>
            {bannerImages.length > 0 ? (
              bannerImages.map((banner, index) => (
                <div key={index} className="w-full h-[220px] sm:h-[400px]">
                  <img
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/Home-SP/default.png";
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <p className="text-gray-600 font-medium">
                  No banners available
                </p>
              </div>
            )}
          </Slider>
        </div>
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
