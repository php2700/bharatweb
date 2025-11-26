import { useState, useEffect } from "react";
import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import filterIcon from "../../../assets/directHiring/filter-square.png";
import { SearchIcon } from "lucide-react";
import Arrow from "../../../assets/profile/arrow_back.svg";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import defaultWorkImage from "../../../assets/directHiring/Work.png";
import Search from "../../../assets/search-normal.svg";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RecentPost() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
   const [taskData, setTaskData] = useState([]);
   const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();


  const fetchBannerImages = async () => {
    const token = localStorage.getItem("bharat_token");
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get(
        `${BASE_URL}/banner/getAllBannerImages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.success) {
        setBannerImages(response.data.images || []);
        setBannerError(
          response.data.images.length === 0 ? "No banners available" : null
        );
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch banner images";
        setBannerError(errorMessage);
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
    const fetchAvailableOrders = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/bidding-order/getAvailableBiddingOrders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch available orders");
        }
        const data = await res.json();
				// console.log("data", data);
        const fetchedWorkers = (data.data || []).map((item) => ({
          project_id: item.project_id,
          _id: item._id,
          workName: item.title,
          location: item.google_address,
          status: item.status,
          image: item.image_url[0] || defaultWorkImage,
          amount: item.cost,
          date: item.createdAt,
          completionDate: item.deadline,
          description: item.description,
          category: item.category_name || "",
subcategory: item.subcategory_name || "",
skills: item.skills || ""
        }));
				// console.log("dhdhd", fetchedWorkers);
        setWorkers(fetchedWorkers);
      } catch (err) {
        setError("Failed to fetch available bidding orders");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableOrders();
  }, []);


// Is pure 'filteredTasks' wale code block ko hata kar ye paste karein:

const filteredWorkers = workers.filter((worker) => {
  const q = searchQuery.toLowerCase().trim();
  if (!q) return true;

  return (
    (worker.workName?.toLowerCase().includes(q) || false) ||
    (worker.description?.toLowerCase().includes(q) || false) ||
    (worker.location?.toLowerCase().includes(q) || false) ||
    (worker.project_id?.toString().toLowerCase().includes(q) || false) ||
    (worker.category?.toLowerCase().includes(q) || false) ||
    (worker.subcategory?.toLowerCase().includes(q) || false) ||
    (worker.skills?.toLowerCase().includes(q) || false)
  );
});
   const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Function to truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen py-4 sm:py-6 bg-gray-50 mt-20">
        <div className="container mx-auto px-4 py-4">
          <button
            className="flex items-center text-green-600 hover:text-green-800 font-semibold"
            onClick={() => navigate(-1)}
          >
            <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
            Back
          </button>
        </div>

        {/* Top Banner Slider */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[200px] sm:h-[300px] md:h-[400px] mt-5">
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
                    src={banner || "/src/assets/profile/default.png"}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/profile/default.png";
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

        <div className="container max-w-5xl p-4 sm:p-6 md:p-10 my-10 mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-bold my-4 text-[#191A1D]">
              Recent Posted Work
            </div>
            {/* <div className="flex gap-4 mb-6">
              <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for services"
                  className="w-full pl-9 pr-3 py-2 bg-[#F5F5F5] rounded-lg"
                />
              </div>
              <img src={filterIcon} alt="Filter" className="w-8 h-8" />
            </div> */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-5xl">
            <img
              src={Search}
              alt="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            />
            <input
              type="search"
              placeholder="Search by Project Id, title, category, subcategory, description, skills, or location..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="rounded-lg pl-10 pr-4 py-2 w-full bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm"
            />
          </div>
        </div>
            {/* <div className="grid gap-4">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker._id}
                  className="grid grid-cols-1 md:grid-cols-12 items-start bg-white rounded-lg shadow-lg p-4 h-auto md:h-64 overflow-hidden"
                >
                  <div className="relative col-span-1 md:col-span-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={worker.image}
                      alt={worker.workName}
                      className="w-full max-h-[500px] object-contain mx-auto block"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-center">
                      <span className="rounded-full bg-black/80 text-white font-medium text-xs sm:text-sm px-4 py-2 text-center">
                        {worker.project_id}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-8 p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <h2 className="text-base font-semibold text-gray-800">
                        {worker.workName}
                      </h2>
                      <div className="text-sm font-semibold">
                        Posted Date:{" "}
                        {new Date(worker.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {truncateDescription(worker.description)}
                    </div>
                    <p className="text-sm font-semibold text-[#008000]">
                      &#8377;{worker.amount}
                    </p>
                    <div className="text-sm font-semibold text-gray-800">
                      Completion Date:{" "}
                      {new Date(worker.completionDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4">
                      <span className="text-gray-800 flex items-center px-1 py-1 rounded-full text-sm mt-2 w-fit">
                        <FaMapMarkerAlt
                          size={25}
                          color="#228B22"
                          className="mr-2"
                        />
                        {worker.location}
                      </span>

                      <Link
                        to={`/bidding/worker/order-detail/${worker._id}`}
                        className="text-[#228B22] py-1 px-4 border rounded-lg hover:bg-[#228B22] hover:text-white transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}
            <div className="grid gap-4">
  {filteredWorkers.length > 0 ? (
    filteredWorkers.map((worker) => (
      <div
        key={worker._id}
        className="grid grid-cols-1 md:grid-cols-12 items-start bg-white rounded-lg shadow-lg p-4 h-auto md:h-64 overflow-hidden"
      >
        <div className="relative col-span-1 md:col-span-4 bg-gray-100 rounded-lg overflow-hidden h-full flex items-center justify-center">
          <img
            src={worker.image}
            alt={worker.workName}
            className="w-full max-h-[500px] object-contain mx-auto block"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-center">
            <span className="rounded-full bg-black/80 text-white font-medium text-xs sm:text-sm px-4 py-2 text-center">
              {worker.project_id}
            </span>
          </div>
        </div>

        <div className="md:col-span-8 p-4 space-y-2">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <h2 className="text-base font-semibold text-gray-800">
              {worker.workName}
            </h2>
            <div className="text-sm font-semibold">
              Posted Date:{" "}
              {new Date(worker.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {truncateDescription(worker.description)}
          </div>
          <p className="text-sm font-semibold text-[#008000]">
            &#8377;{worker.amount}
          </p>
          <div className="text-sm font-semibold text-gray-800">
            Completion Date:{" "}
            {new Date(worker.completionDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4">
            <span className="text-gray-800 flex items-center px-1 py-1 rounded-full text-sm mt-2 w-fit">
              <FaMapMarkerAlt
                size={25}
                color="#228B22"
                className="mr-2"
              />
              {worker.location}
            </span>

            <Link
              to={`/bidding/worker/order-detail/${worker._id}`}
              className="text-[#228B22] py-1 px-4 border rounded-lg hover:bg-[#228B22] hover:text-white transition"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-10 text-gray-500 font-medium col-span-1 md:col-span-12">
      No matching work found.
    </div>
  )}
</div>
          </div>
        </div>

        {/* Bottom Banner Slider */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[200px] sm:h-[300px] md:h-[400px] mt-5">
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
                    src={banner || "/src/assets/directHiring/Work.png"}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/directHiring/Work.png";
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
      </div>
      <Footer />
    </>
  );
}
