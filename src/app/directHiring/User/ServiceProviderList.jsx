import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import Default from "../../../assets/default-image.jpg";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* --------------------------------------------------------------
   Re‑usable banner slider (top + bottom)
   -------------------------------------------------------------- */
const BannerSlider = ({ images, loading, error }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (loading)
    return (
      <p className="absolute inset-0 flex items-center justify-center text-gray-500">
        Loading banners...
      </p>
    );
  if (error)
    return (
      <p className="absolute inset-0 flex items-center justify-center text-red-500">
        Error: {error}
      </p>
    );
  if (!images.length)
    return (
      <p className="absolute inset-0 flex items-center justify-center text-gray-500">
        No banners available
      </p>
    );

  return (
    <Slider {...settings}>
      {images.map((src, i) => (
        <div key={i}>
          <img
            src={src || "/src/assets/profile/default.png"}
            alt={`Banner ${i + 1}`}
            className="w-full h-[400px] object-cover"
            onError={(e) =>
              (e.currentTarget.src = "/src/assets/profile/default.png")
            }
          />
        </div>
      ))}
    </Slider>
  );
};

/* --------------------------------------------------------------
   Main page
   -------------------------------------------------------------- */
export default function ServiceProviderList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category_id, subcategory_ids } = location.state || {};

  /* ---------- state ---------- */
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  /* ---------- banner fetch ---------- */
  const fetchBannerImages = useCallback(async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) throw new Error("No authentication token found");

      const { data } = await axios.get(
        `${BASE_URL}/banner/getAllBannerImages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data?.success && Array.isArray(data.images) && data.images.length) {
        setBannerImages(data.images);
      } else {
        setBannerError("No banners available");
      }
    } catch (e) {
      setBannerError(e.message);
    } finally {
      setBannerLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, [fetchBannerImages]);

  /* ---------- workers fetch ---------- */
  useEffect(() => {
    const fetchWorkers = async () => {
      if (!category_id || !subcategory_ids) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("bharat_token");
        const { data } = await axios.post(
          `${BASE_URL}/user/getServiceProviders`,
          { category_id, subcategory_ids },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data?.status) {
          const withToggle = (data.data || []).map((w) => ({
            ...w,
            isAddressExpanded: false,
            isSkillExpanded: false,
            isSubcatExpanded: false,
          }));
          setWorkers(withToggle);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [category_id, subcategory_ids]);

  /* collapse all when search / sort changes */
  useEffect(() => {
    setWorkers((prev) =>
      prev.map((w) => ({
        ...w,
        isAddressExpanded: false,
        isSkillExpanded: false,
        isSubcatExpanded: false,
      }))
    );
  }, [searchQuery, sortOrder]);

  /* ---------- helpers ---------- */
  const handleHire = (id) => navigate(`/direct-hiring/${id}`);

  const capitalizeWords = (text) =>
    text
      ? text
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : "";

  const getTruncated = (text, limit = 25) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  const filteredWorkers = workers
    .filter((w) => {
      const q = searchQuery.toLowerCase();
      return (
        w.full_name?.toLowerCase().includes(q) ||
        w.skill?.toLowerCase().includes(q) ||
				w.unique_id?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.full_name.localeCompare(b.full_name)
        : b.full_name.localeCompare(a.full_name)
    );

  const handleRouteHire = (id) =>
    navigate(`/profile-details/${id}/direct`, {
      state: { hire_status: "NoStatus", isHired: false },
    });

  /** Toggle any expandable field */
  const toggleField = (id, field) => {
    setWorkers((prev) =>
      prev.map((w) => (w._id === id ? { ...w, [field]: !w[field] } : w))
    );
  };

  /* ---------- render ---------- */
  return (
    <>
      <Header />
      <div className="min-h-screen p-4 mt-20 sm:p-6 bg-gray-50">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
          <button
            className="flex items-center text-green-600 hover:text-green-800 font-semibold"
            onClick={() => navigate(-1)}
          >
            <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
            Back
          </button>
        </div>

        {/* Top banner */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <BannerSlider
            images={bannerImages}
            loading={bannerLoading}
            error={bannerError}
          />
        </div>

        {/* Workers list */}
        <div className="container max-w-5xl mx-auto my-10">
          <div className="flex flex-col sm:flex-row justify-between items-center p-3 gap-3">
            <div className="text-2xl font-bold">Direct Hiring</div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                className="border rounded-lg p-2 w-full sm:w-64"
                type="search"
                placeholder="Search by Name and Id"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 whitespace-nowrap"
              >
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading workers...</p>
          ) : filteredWorkers.length === 0 ? (
            <p className="text-center text-gray-500">No workers found.</p>
          ) : (
            <div className="space-y-6">
              {filteredWorkers.map((worker) => {
                /* ---------- ADDRESS ---------- */
                const fullAddress =
                  capitalizeWords(worker?.location?.address) || "Unknown";
                const addressLong = fullAddress.length > 70;
                const displayedAddress = worker.isAddressExpanded
                  ? fullAddress
                  : getTruncated(fullAddress, 12);

                /* ---------- SKILL ---------- */
                const fullSkill = capitalizeWords(worker?.skill) || "";
                const skillLong = fullSkill.length > 70;
                const displayedSkill = worker.isSkillExpanded
                  ? fullSkill
                  : getTruncated(fullSkill, 12);

                /* ---------- SUBCATEGORIES ---------- */
                const subcatString = (worker?.subcategory_names || []).join(
                  ", "
                );
                const subcatLong = subcatString.length > 70;
                const displayedSubcat = worker.isSubcatExpanded
                  ? subcatString
                  : getTruncated(subcatString, 12);

                return (
                  <div
                    key={worker._id}
                    className="grid grid-cols-12 bg-white rounded-lg shadow-lg p-4 gap-4 sm:gap-8"
                  >
                    {/* Image */}
                    <div className="col-span-12 sm:col-span-4 flex justify-center sm:justify-start">
                      <img
                        src={worker.profile_pic || Default}
                        alt={worker.full_name}
                        className="h-48 w-48 sm:h-[200px] sm:w-[200px] rounded-lg object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="col-span-12 sm:col-span-8 flex flex-col justify-between">
                      {/* Name + rating */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                          {capitalizeWords(worker.full_name)}{" "}
                          <span className="text-gray-700">
                            (Id: {worker?.unique_id})
                          </span>
                        </h2>
                        <div className="flex items-center gap-1">
                          <img
                            className="h-5 w-5"
                            src={ratingImg}
                            alt="Rating"
                          />
                          <span>{worker?.averageRating ?? "N/A"}</span>
                        </div>
                      </div>

                      <p className="text-gray-700">
                        Category: {worker?.category_name}
                      </p>

                      {/* Sub-categories – single line */}
                      <div className="flex items-center gap-1 text-gray-700 mt-1">
                        <span className="font-medium">SubCategories:</span>
                        <div className="flex items-center flex-1 overflow-hidden">
                          <span
                            className={`inline-block ${
                              worker.isSubcatExpanded
                                ? ""
                                : "whitespace-nowrap overflow-hidden text-ellipsis"
                            }`}
                          >
                            {displayedSubcat}
                          </span>
                          {subcatLong && (
                            <button
                              onClick={() =>
                                toggleField(worker._id, "isSubcatExpanded")
                              }
                              className="ml-1 text-xs font-medium text-[#228B22] hover:underline flex-shrink-0"
                            >
                              {worker.isSubcatExpanded
                                ? "See Less"
                                : "See More"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* About My Skill – single line */}
                      <div className="mt-2">
                        <p className="font-medium text-gray-800">
                          About My Skill
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center flex-1 overflow-hidden">
                            <span
                              className={`inline-block ${
                                worker.isSkillExpanded
                                  ? ""
                                  : "whitespace-nowrap overflow-hidden text-ellipsis"
                              }`}
                            >
                              {displayedSkill}
                            </span>
                            {skillLong && (
                              <button
                                onClick={() =>
                                  toggleField(worker._id, "isSkillExpanded")
                                }
                                className="ml-1 text-xs font-medium text-[#228B22] hover:underline flex-shrink-0"
                              >
                                {worker.isSkillExpanded
                                  ? "See Less"
                                  : "See More"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ---------- ADDRESS + ACTION BUTTONS ---------- */}
                      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Address – ONE line */}
                        <div className="flex items-center gap-1 text-gray-600 text-sm flex-1 min-w-0">
                          <FaMapMarkerAlt
                            size={18}
                            color="#228B22"
                            className="flex-shrink-0"
                          />
                          <div className="flex items-center overflow-hidden">
                            <span
                              className={`inline-block ${
                                worker.isAddressExpanded
                                  ? ""
                                  : "whitespace-nowrap overflow-hidden text-ellipsis"
                              }`}
                              title={fullAddress}
                            >
                              {displayedAddress}
                            </span>
                            {addressLong && (
                              <button
                                onClick={() =>
                                  toggleField(worker._id, "isAddressExpanded")
                                }
                                className="ml-1 text-xs font-medium text-[#228B22] hover:underline flex-shrink-0"
                              >
                                {worker.isAddressExpanded
                                  ? "See Less"
                                  : "See More"}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Action buttons – always inside the card */}
                        <div className="flex gap-2 flex-shrink-0 sm:self-end">
                          <button
                            className="fixed-btn text-[#228B22] text-sm py-1.5 px-3 border border-[#228B22] rounded-lg hover:bg-green-50 transition"
                            onClick={() => handleRouteHire(worker._id)}
                          >
                            View Profile
                          </button>
                          <button
                            className="fixed-btn text-white bg-[#228B22] text-sm py-1.5 px-6 rounded-lg hover:bg-green-700 transition"
                            onClick={() => handleHire(worker._id)}
                          >
                            Hire
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom banner */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-10">
          <BannerSlider
            images={bannerImages}
            loading={bannerLoading}
            error={bannerError}
          />
        </div>
      </div>

      <div className="mt-[50px]">
        <Footer />
      </div>

      {/* Global styles */}
      <style jsx>{`
        .fixed-btn {
          min-width: 110px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
