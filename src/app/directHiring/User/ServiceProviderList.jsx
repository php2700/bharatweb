import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../../../component/footer";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import Default from "../../../assets/default-image.jpg";
import Arrow from "../../../assets/profile/arrow_back.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaMapMarkerAlt,
  FaSortAlphaDown,
  FaSortAlphaUpAlt,
} from "react-icons/fa";
import Header from "../../../component/Header";
import defaultImage from "../../../assets/default-image.jpg";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* --------------------------------------------------------------
   Main page – STYLISH FILTERS + ASC/DESC + RATING FILTER
   -------------------------------------------------------------- */
export default function ServiceProviderList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category_id, subcategory_ids } = location.state || {};

  /* ---------- state ---------- */
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc / desc
  
  const [selectedSubcats, setSelectedSubcats] = useState([]); // multi‑select
  const [minRating, setMinRating] = useState(""); // NEW: rating filter

  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  // ================= FETCH BANNERS (same as NewTask.jsx) =================
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

      if (response.data?.success) {
        setBannerImages(response.data.images || []);
      } else {
        setBannerError(
          response.data.message || "Failed to fetch banner images"
        );
      }
    } catch (err) {
      setBannerError(err?.message || "Error fetching banners");
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

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
  }, [category_id, subcategory_ids,location.key]);

  /* collapse expandables when any filter changes */
  useEffect(() => {
    setWorkers((prev) =>
      prev.map((w) => ({
        ...w,
        isAddressExpanded: false,
        isSkillExpanded: false,
        isSubcatExpanded: false,
      }))
    );
  }, [searchQuery, sortOrder, selectedSubcats, minRating]);

  // slider settings (same as NewTask.jsx)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

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

  /** Unique sub‑category list */
  // const allSubcategories = useMemo(() => {
  //   const set = new Set();
  //   workers.forEach((w) =>
  //     (w.subcategory_names || []).forEach((s) => set.add(s))
  //   );
  //   return Array.from(set).sort((a, b) => a.localeCompare(b));
  // }, [workers]);

    const allSubcategories = useMemo(() => {
    const subs = [];
    workers.forEach((w) => {
      if (w.subcategory_names) {
        w.subcategory_names.forEach((name) => {
          if (name && !subs.includes(name)) subs.push(name);
        });
      }
    });
    return subs;
  }, [workers]);

  // --------------------------------------------------
  // 2️⃣ Create ID → NAME mapping (from worker data)
  // --------------------------------------------------
  const subcategoryIdToName = useMemo(() => {
    const map = {};
    workers.forEach((w) => {
      (w.subcategory_ids || []).forEach((id, index) => {
        const name = w.subcategory_names?.[index];
        if (id && name) map[id] = name;
      });
    });
    return map;
  }, [workers]);

  // -------------------------------------------------------------------
  // 3️⃣ Convert incoming subcategory_ids → names  
  // -------------------------------------------------------------------
useEffect(() => {
  // ignore if no subcategory_ids
  if (!subcategory_ids || selectedSubcats.length > 0) return;

  // If already names
  if (
    Array.isArray(subcategory_ids) &&
    subcategory_ids.every(
      (x) => typeof x === "string" && allSubcategories.includes(x)
    )
  ) {
    setSelectedSubcats(subcategory_ids);
    return;
  }

  // IDs → names
  if (Array.isArray(subcategory_ids)) {
    const names = subcategory_ids
  .map((id) => subcategoryIdToName[id])
  .filter(Boolean);

setSelectedSubcats(names);

  }
}, [subcategory_ids, allSubcategories, subcategoryIdToName]);


  


  /** Filtered & sorted list */
  const filteredWorkers = useMemo(() => {
    let list = workers;

    // SEARCH
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (w) =>
          (w.full_name || "").toLowerCase().includes(q) ||
          (w.skill || "").toLowerCase().includes(q) ||
          (w.unique_id || "").toLowerCase().includes(q)
      );
    }

    // SUB‑CATEGORY FILTER
    if (selectedSubcats.length) {
      list = list.filter((w) =>
        w.subcategory_names?.some((s) => selectedSubcats.includes(s))
      );
    }

    // RATING FILTER
    if (minRating) {
      const min = Number(minRating);
      list = list.filter((w) => {
        const rating = Number(w.averageRating) || 0;
        return rating >= min;
      });
    }

    // ALPHABETICAL SORT
    list = [...list].sort((a, b) =>
      sortOrder === "asc"
        ? a.full_name.localeCompare(b.full_name)
        : b.full_name.localeCompare(a.full_name)
    );
    list = [...list].sort((a, b) => {
      switch (sortOrder) {
        case "tasks-desc":
          return (b.totalTasks || 0) - (a.totalTasks || 0);
        case "tasks-asc":
          return (a.totalTasks || 0) - (b.totalTasks || 0);
        case "desc":
          return b.full_name.localeCompare(a.full_name);
        case "asc":
        default:
          return a.full_name.localeCompare(b.full_name);
      }
    });

    return list;
  }, [workers, searchQuery, selectedSubcats, sortOrder, minRating]);

  const handleRouteHire = (id) =>
    navigate(`/profile-details/${id}/direct`, {
      state: { hire_status: "NoStatus", isHired: false },
    });

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
            className="flex items-center text-green-600 hover:text-green-800 font-semibold transition"
            onClick={() => {
              setSearchQuery("");
              setSelectedSubcats([]);
              setSortOrder("asc");
              setMinRating("");
              navigate(-1);
            }}
          >
            <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
            Back
          </button>
        </div>

        {/* BANNER SLIDER (same UI as NewTask.jsx) */}
        <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden my-10 h-48 sm:h-64 lg:h-[400px] bg-[#f2e7ca]">
          {bannerLoading ? (
            <p className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base">
              Loading banners...
            </p>
          ) : bannerError ? (
            <p className="flex items-center justify-center h-full text-red-500 text-sm sm:text-base">
              Error: {bannerError}
            </p>
          ) : bannerImages.length > 0 ? (
            <Slider {...sliderSettings}>
              {bannerImages.map((banner, i) => (
                <div key={i}>
                  <img
                    src={banner}
                    alt=""
                    className="w-full h-48 sm:h-64 lg:h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base">
              No banners available
            </p>
          )}
        </div>

        {/* Workers list */}
       
    <div className="container max-w-5xl mx-auto my-6 px-4">
      {/* ---------- STYLISH FILTER BAR (desktop logic unchanged) ---------- */}
      <div
        className="
          flex flex-col lg:flex-row justify-between lg:items-center p-4 lg:p-5 gap-4
          bg-white/80 backdrop-blur-xl rounded-2xl
          shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-gray-200 transition-all w-full
        "
      >
        <h1 className="text-lg lg:text-xl font-bold text-gray-600 tracking-tight">
          Direct Hiring
        </h1>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full">
          {/* SEARCH */}
          <div className="relative w-full lg:w-72">
            <input
              type="search"
              placeholder="Search by Name, Id or Skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-300
                text-sm lg:text-base text-gray-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                transition-all
              "
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* SUB-CATEGORY MULTI SELECT */}
          <div className="relative w-full lg:w-64">
            <select
              multiple
              size={1}
              style={{ appearance: "none" }}
              value={selectedSubcats}
              onChange={(e) => {
                const opts = Array.from(e.target.selectedOptions, (o) => o.value);
                setSelectedSubcats(opts);
              }}
              className="
                w-full p-2.5 pr-8 rounded-xl cursor-pointer bg-gray-50 border border-gray-300
                text-sm lg:text-base text-gray-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500
                transition-all max-h-44 overflow-y-auto
              "
            >
              <option disabled className="text-gray-400">
                {allSubcategories.length ? "— Select Sub-categories —" : "No sub-categories"}
              </option>

              {allSubcategories.map((sc) => (
                <option key={sc} value={sc} className="py-1.5 pl-2 pr-8 rounded hover:bg-green-50 cursor-pointer text-sm">
                  {selectedSubcats.includes(sc) ? "✓ " : ""}
                  {sc}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.96a.75.75 0 011.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* SORT + RATING */}
          <div className="relative w-full lg:w-56">
            <select
              value={`${sortOrder}|${minRating}`}
              onChange={(e) => {
                const [order, rating] = e.target.value.split("|");
                setSortOrder(order);
                setMinRating(rating);
              }}
              className="
                w-full p-2.5 pr-8 rounded-xl bg-gray-50 border border-gray-300 text-sm lg:text-base text-gray-700 shadow-inner
                focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-gray-400 transition-all
              "
              style={{ appearance: "none" }}
            >
              <option value="asc|">A → Z (Alphabetical)</option>
              <option value="desc|">Z → A (Alphabetical)</option>

              <option disabled>───── Rating ─────</option>
              <option value="asc|5">5 stars & up</option>
              <option value="asc|4">4 stars & up</option>
              <option value="asc|3">3 stars & up</option>
              <option value="asc|2">2 stars & up</option>
              <option value="asc|1">1 star & up</option>
              <option value="asc|">All Ratings</option>
              <option disabled>───── Tasks ─────</option>
              <option value="tasks-desc|">Task Count High → Low</option>
              <option value="tasks-asc|">Task Count Low → High</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.96a.75.75 0 011.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- LIST ---------- */}
      {loading ? (
        <p className="text-center text-gray-500 mt-8">Loading workers...</p>
      ) : filteredWorkers.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No workers found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredWorkers.map((worker) => {
            const fullAddress = capitalizeWords(worker?.location?.address) || "Unknown";
            const addressLong = fullAddress.length > 70;
            const displayedAddress = worker.isAddressExpanded ? fullAddress : getTruncated(fullAddress, 12);

            const fullSkill = capitalizeWords(worker?.skill) || "";
            const skillLong = fullSkill.length > 70;
            const displayedSkill = worker.isSkillExpanded ? fullSkill : getTruncated(fullSkill, 12);

            const subcatString = (worker?.subcategory_names || []).join(", ");
            const subcatLong = subcatString.length > 70;
            const displayedSubcat = worker.isSubcatExpanded ? subcatString : getTruncated(subcatString, 12);

            return (
              <div
                key={worker._id}
                className="
                  grid grid-cols-12 bg-white rounded-xl shadow-md p-4 sm:p-5 gap-4
                  transition hover:shadow-xl overflow-hidden
                "
              >
                {/* Image */}
                <div className="col-span-12 sm:col-span-4 flex justify-center sm:justify-start">
                  <img
                    src={worker.profile_pic || Default}
                    alt={worker.full_name}
                    className="
                      h-36 w-36 sm:h-[200px] sm:w-[200px] rounded-xl object-cover shadow flex-shrink-0
                    "
                    onError={(e) => {
                      if (Default) e.currentTarget.src = Default;
                    }}
                  />
                </div>

                {/* Details */}
                <div className="col-span-12 sm:col-span-8 flex flex-col justify-between min-w-0">
                  {/* Name + rating */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h2 className="text-base sm:text-xl font-semibold text-gray-800 truncate max-w-full">
                      {capitalizeWords(worker.full_name)}{" "}
                      <span className="text-gray-600 text-xs sm:text-sm font-medium">
                        (Id: {worker?.unique_id})
                      </span>
                    </h2>

                    <div className="flex items-center gap-1 shrink-0">
                      {ratingImg ? <img className="h-4 w-4 sm:h-5 sm:w-5" src={ratingImg} alt="Rating" /> : null}
                      <span className="font-medium text-sm">{worker?.averageRating ?? "N/A"}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-1 truncate">
                    Category:{" "}
                    <span className="font-medium">{worker?.category_name}</span>
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Total Tasks: <span className="font-medium">{worker?.totalTasks ?? 0}</span>
                  </p>

                  {/* Sub-categories */}
                  <div className="flex items-center gap-2 text-gray-700 mt-2">
                    <span className="font-medium text-sm">SubCategories:</span>
                    <div className="flex items-center flex-1 min-w-0">
                      <span
                        className={`inline-block text-sm ${worker.isSubcatExpanded ? "break-words" : "whitespace-nowrap overflow-hidden text-ellipsis"}`}
                        title={subcatString}
                      >
                        {displayedSubcat}
                      </span>
                      {subcatLong && (
                        <button
                          onClick={() => toggleField(worker._id, "isSubcatExpanded")}
                          className="ml-1 text-xs font-medium text-green-600 hover:underline flex-shrink-0"
                        >
                          {worker.isSubcatExpanded ? "See Less" : "See More"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Skill */}
                  <div className="mt-2">
                    <p className="font-medium text-gray-800 text-sm">About My Skill</p>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center flex-1 min-w-0">
                        <span
                          className={`inline-block text-sm ${worker.isSkillExpanded ? "break-words" : "whitespace-nowrap overflow-hidden text-ellipsis"}`}
                          title={fullSkill}
                        >
                          {displayedSkill}
                        </span>
                        {skillLong && (
                          <button
                            onClick={() => toggleField(worker._id, "isSkillExpanded")}
                            className="ml-1 text-xs font-medium text-green-600 hover:underline flex-shrink-0"
                          >
                            {worker.isSkillExpanded ? "See Less" : "See More"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address + Buttons */}
                  <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-600 text-sm flex-1 min-w-0">
                      <FaMapMarkerAlt size={16} color="#228B22" className="flex-shrink-0" />
                      <div className="min-w-0">
                        <span
                          className={`inline-block text-sm ${worker.isAddressExpanded ? "break-words" : "whitespace-nowrap overflow-hidden text-ellipsis"}`}
                          title={fullAddress}
                        >
                          {displayedAddress}
                        </span>
                        {addressLong && (
                          <button
                            onClick={() => toggleField(worker._id, "isAddressExpanded")}
                            className="ml-1 text-xs font-medium text-green-600 hover:underline flex-shrink-0"
                          >
                            {worker.isAddressExpanded ? "See Less" : "See More"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRouteHire(worker._id)}
                        className="px-3 py-1.5 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleHire(worker._id)}
                        className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
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
  


        {/* BANNER SLIDER (same UI as NewTask.jsx) */}
        <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden my-10 h-48 sm:h-64 lg:h-[400px] bg-[#f2e7ca]">
          {bannerLoading ? (
            <p className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base">
              Loading banners...
            </p>
          ) : bannerError ? (
            <p className="flex items-center justify-center h-full text-red-500 text-sm sm:text-base">
              Error: {bannerError}
            </p>
          ) : bannerImages.length > 0 ? (
            <Slider {...sliderSettings}>
              {bannerImages.map((banner, i) => (
                <div key={i}>
                  <img
                    src={banner}
                    alt=""
                    className="w-full h-48 sm:h-64 lg:h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base">
              No banners available
            </p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>

      {/* Global button style */}
      <style jsx>{`
        button {
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
