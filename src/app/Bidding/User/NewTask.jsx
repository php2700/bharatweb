import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Arrow from "../../../assets/profile/arrow_back.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calender from "../../../assets/bidding/calender.png";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import PostNewTask3 from "../../../assets/PostNewTask3.jpg";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../../redux/userSlice";

export default function BiddingNewTask() {
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.user || {});

  // ====== LOCAL STATES ======
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    profile?.location?.address || ""
  );
  const [selectedAddressObj, setSelectedAddressObj] = useState(null);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState({});
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [platformFee, setPlatformFee] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategories: [],
    googleAddress: "",
    description: "",
    cost: "",
    deadline: "",
    images: [],
  });

  // ====== NEW ADDRESS MODAL STATES (were missing) ======
  const [newTitle, setNewTitle] = useState("");
  const [newHouseNo, setNewHouseNo] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newLandmark, setNewLandmark] = useState("");

  // pickedLocation for map (latitude, longitude, address)
  const [pickedLocation, setPickedLocation] = useState({
    latitude: profile?.location?.latitude || null,
    longitude: profile?.location?.longitude || null,
    address: profile?.location?.address || "",
  });

  // map refs (you can wire Google Maps or other map library here)
  const mapRef = useRef(null);
  const mapAutocompleteRef = useRef(null);

  // token used for API calls
  const token =
    typeof window !== "undefined" ? localStorage.getItem("bharat_token") : null;

  let location = "";
  if (profile && profile.data) {
    location = profile.data.full_address || "";
  }

  // ================= FETCH BANNERS =================
  const fetchBannerImages = async () => {
    try {
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
    fetchBannerImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get-fee/bidding`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // 🔹 Assuming response structure is { data: { fee: 200 } } or { fee: 200 }
        // Adjust the path based on your API response structure
        const fee = res.data.data?.fee; // Fallback to 200 if not found
        setPlatformFee(fee);
      } catch (error) {
        console.error("Error fetching platform fee:", error);
        setPlatformFee(200); // Fallback to default value
      }
    };

    fetchPlatformFee();
  }, []);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!token) return; // no token — skip
        const res = await fetch(`${BASE_URL}/work-category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCategories(
            (data.data || []).map((cat) => ({
              value: cat._id,
              label: cat.name,
            }))
          );
        } else {
          toast.error(data.message || "Failed to fetch categories");
        }
      } catch (error) {
        console.error(error);
        toast.error("Server error while fetching categories");
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= CATEGORY / SUBCATEGORY HANDLERS =================
  const handleCategoryChange = async (selected) => {
    const selectedCatId = selected?.value || "";
    setFormData({ ...formData, category: selectedCatId, subCategories: [] });

    if (!selectedCatId) return setSubcategories([]);

    try {
      if (!token) return;
      const res = await fetch(`${BASE_URL}/subcategories/${selectedCatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSubcategories(
          (data.data || []).map((sub) => ({ value: sub._id, label: sub.name }))
        );
      } else {
        toast.error(data.message || "Failed to fetch subcategories");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while fetching subcategories");
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      subCategories: selectedOptions ? selectedOptions.map((s) => s.value) : [],
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ================= ADDRESS SELECTION =================
  const handleSelect = async (addr, index) => {
    // UI Update instantly
    setSelectedAddress(addr.address);
    setSelectedAddressObj(addr);

    // Update localStorage (optional)
    localStorage.setItem("selectedAddressId", addr._id);
    localStorage.setItem("selectedAddressTitle", addr.address);

    // also update formData.googleAddress so form submit works immediately
    setFormData((prev) => ({ ...prev, googleAddress: addr.address }));

    // Close dropdown
    setShowDropdown(false);

    // Update location API
    try {
      const token = localStorage.getItem("bharat_token");

      await fetch(`${BASE_URL}/user/updatelocation`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: addr.latitude,
          longitude: addr.longitude,
          address: addr.address,
        }),
      });

      // VERY IMPORTANT:
      // This reloads profile → triggers header rerender
      dispatch(fetchUserProfile());
      // Show success modal as in DirectHiring
      Swal.fire("Success", "Location updated", "success");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update location");
    }
  };

  useEffect(() => {
    if (
      selectedAddressObj &&
      isAddressConfirmed[profile?.full_address?.indexOf(selectedAddressObj)]
    ) {
      updateLocation(selectedAddressObj);
      setShowDropdown(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddressConfirmed, selectedAddressObj]);

  const updateLocation = async (addr) => {
    try {
      if (!token) return;
      const response = await fetch(`${BASE_URL}/user/updatelocation`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: addr.latitude || 28.6139,
          longitude: addr.longitude || 77.209,
          address: addr.address || "New Delhi, India",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({ ...prev, googleAddress: addr.address }));
        // Show success modal
        Swal.fire("Success", "Location updated", "success");
      } else toast.error(data.message || "Failed to update location");
    } catch (error) {
      console.error(error);
      toast.error("Server error while updating location");
    }
  };
  // helper: dynamically load Google Maps (put near top of component or above the useEffect)

  const loadGoogleMapsScript = (callback) => {
    if (window.google && window.google.maps) {
      callback();
      return;
    }
    const existing = document.getElementById("google-maps-script");
    if (existing) {
      existing.addEventListener("load", callback);
      return;
    }
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => callback();
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      // optionally show a user-friendly toast/Swal here
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (!isAddAddressModalOpen) return;

    // ensure google maps script is loaded, then initialize map inside callback
    loadGoogleMapsScript(() => {
      // Now window.google is guaranteed (or error logged). Proceed with initialization:
      const defaultCenter = {
        lat: pickedLocation.latitude || 28.6139,
        lng: pickedLocation.longitude || 77.209,
      };

      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
      });

      let marker = new window.google.maps.Marker({
        position: defaultCenter,
        map,
        draggable: true,
      });

      const geocoder = new window.google.maps.Geocoder();

      const updateAddress = (lat, lng) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            setPickedLocation({
              latitude: lat,
              longitude: lng,
              address: results[0].formatted_address,
            });
          }
        });
      };

      map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        marker.setPosition({ lat, lng });
        updateAddress(lat, lng);
      });

      marker.addListener("dragend", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        updateAddress(lat, lng);
      });

      const searchInput = mapAutocompleteRef.current;
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInput
      );
      autocomplete.bindTo("bounds", map);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        map.setCenter({ lat, lng });
        map.setZoom(16);
        marker.setPosition({ lat, lng });
        setPickedLocation({
          latitude: lat,
          longitude: lng,
          address: place.formatted_address,
        });
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddAddressModalOpen]);

  // ================= FORM SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.category) return toast.error("Category is required");
    if (!formData.subCategories || formData.subCategories.length === 0)
      return toast.error("Please select at least one sub-category");
    if (!formData.googleAddress.trim())
      return toast.error("Address is required");
    if (!formData.description.trim())
      return toast.error("Description is required");
    if (formData.description.trim().length < 20)
      return toast.error("Description must be at least 20 characters long");
    if (formData.description.trim().length > 250)
      return toast.error("Description cannot exceed 250 characters");
    if (!formData.cost || isNaN(formData.cost)) {
      return toast.error("Valid cost is required");
    }

    if ((formData.cost * 10) / 100 <= platformFee) {
      return toast.error("Minimum cost is 2300");
    }
    if (!formData.deadline) return toast.error("Deadline is required");
    else if (isNaN(new Date(formData.deadline).getTime()))
      return toast.error("Please provide a valid deadline date");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category_id", formData.category);
      data.append("sub_category_ids", formData.subCategories.join(","));
      data.append("address", formData.googleAddress);
      data.append("google_address", formData.googleAddress);
      data.append("description", formData.description);
      data.append("cost", formData.cost);
      data.append("deadline", formData.deadline);
      formData.images.forEach((file) => data.append("images", file));

      const res = await fetch(
        "https://api.thebharatworks.com/api/bidding-order/create",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );
      const resData = await res.json();
      if (res.ok) {
        toast.success("Bidding Task posted successfully");
        setTimeout(
          () => navigate("/bidding/order-detail/" + resData.order._id),
          2000
        );
      } else toast.error(resData.message || "Something went wrong");
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again later");
    }
  };

  // ================= SAVE NEW ADDRESS API =================
  const handleSaveNewAddress = async () => {
    if (!newTitle || !newHouseNo || !newPincode || !pickedLocation.address) {
      return Swal.fire(
        "Required",
        "Please fill all required fields and pick a location on the map",
        "warning"
      );
    }

    const newAddress = {
      title: newTitle,
      houseno: newHouseNo,
      street: newStreet || "",
      area: newArea || "",
      pincode: newPincode,
      landmark: newLandmark || "",
      address: pickedLocation.address,
      latitude: pickedLocation.latitude,
      longitude: pickedLocation.longitude,
    };

    const body = {
      location: {
        latitude: pickedLocation.latitude,
        longitude: pickedLocation.longitude,
        address: pickedLocation.address,
      },
      full_address: [...(profile.full_address || []), newAddress],
    };

    try {
      if (!token) throw new Error("Not authenticated");

      const res = await axios.post(`${BASE_URL}/user/updateUserProfile`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire("Success", "Address added successfully!", "success");

      setIsAddAddressModalOpen(false);

      // save new address in UI
      setSelectedAddress(newAddress.address);

      // refresh redux
      dispatch(fetchUserProfile());
    } catch (err) {
      console.log("API Error Response:", err.response?.data);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save new address",
        "error"
      );
    }
  };

  useEffect(() => {
    if (profile?.location?.address) {
      setSelectedAddress(profile.location.address);
      // ensure formData.googleAddress stays in sync with profile location
      setFormData((prev) => ({
        ...prev,
        googleAddress: profile.location.address,
      }));
    }
  }, [profile?.location?.address]);

  // slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto px-4 py-4 mt-20">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold cursor-pointer"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="back" />
          Back
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start bg-white px-3 gap-6 py-4">
        {/* Left Image */}
        <div className="w-full sm:w-[350px] md:w-[420px] lg:w-[480px] xl:w-[520px] object-contain rounded-xl shadow-md mt-20 md:mt-24 lg:mt-28 mb-6 mr-0 lg:mr-20 xl:mr-28">
          <img
            src={PostNewTask3}
            alt="Task Banner"
            className="w-full h-auto object-contain rounded-2xl shadow-lg"
          />
        </div>

        {/* Right Form Section - Height kam, compact but fully visible */}
        <div className="bg-white rounded-xl p-4 w-full lg:w-[380px] shadow-md max-h-screen overflow-y-auto">
          <h2 className="text-[26px] font-bold text-center text-[#191A1D] mb-3">
            Post New Task
          </h2>

          <form
            onSubmit={handleSubmit}
            className="w-full space-y-3 text-left text-sm"
          >
            {/* Title */}
            <div>
              <label className="block text-xs mb-1 font-bold">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter title of work"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-green-500 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs mb-1 font-bold">Category</label>
              <Select
                options={categories}
                value={categories.find((c) => c.value === formData.category)}
                onChange={handleCategoryChange}
                placeholder="Select category"
                isClearable
                className="text-sm border border-green-500"
                styles={{ control: (base) => ({ ...base, minHeight: 36 }) }}
              />
            </div>

            {/* Subcategories */}
            <div>
              <label className="block text-xs mb-1 font-bold">
                Subcategories
              </label>
              <Select
                options={subcategories}
                value={subcategories.filter((s) =>
                  formData.subCategories.includes(s.value)
                )}
                onChange={handleSubcategoryChange}
                isMulti
                placeholder="Select subcategory"
                isDisabled={!formData.category}
                className="text-sm border border-green-500"
                styles={{ control: (base) => ({ ...base, minHeight: 36 }) }}
              />
            </div>

            {/* Address Selection */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-600">
                  Address
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(true)}
                  className="text-xs text-[#228B22] font-semibold underline cursor-pointer"
                >
                  + Add New Address
                </button>
              </div>
              <input
                type="text"
                placeholder="Click to select location"
                value={selectedAddress}
                readOnly
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full border border-green-500 rounded-md px-3 py-2 text-sm cursor-pointer pr-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 absolute right-3 top-9 text-gray-500 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>

              {showDropdown && (
                <ul className="absolute z-10 bg-white border rounded-lg shadow-md w-full mt-1 max-h-44 overflow-y-auto text-sm">
                  <li className="px-3 py-2 bg-gray-100">
                    <h3 className="text-sm font-semibold text-[#191A1D]">
                      Select an Address
                    </h3>
                  </li>
                  {profile?.full_address?.length > 0 ? (
                    profile.full_address.map((addr, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-start text-xs"
                        onClick={() => handleSelect(addr, index)}
                      >
                        <input
                          type="radio"
                          name="addressSelect"
                          checked={selectedAddress === addr.address}
                          onChange={() => handleSelect(addr, index)}
                          className="mr-2 mt-1"
                        />
                        <p className="flex-1">
                          <span className="font-medium  block">
                            {addr.title}
                          </span>
                          <span className="text-gray-600  block">
                            {addr.landmark}
                          </span>
                          <span className="text-gray-500  block text-xs">
                            {addr.address}
                          </span>
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500 text-xs">
                      No saved addresses
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Add Address Modal - Bilkul same, no change */}
            {isAddAddressModalOpen && (
              <div className="h-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Address</h3>
                    <button
                      onClick={() => setIsAddAddressModalOpen(false)}
                      className="text-red-600 font-semibold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    <div className="flex flex-col gap-3 overflow-auto pr-2">
                      <label className="block">
                        <span className="text-sm font-medium">Title *</span>
                        <input
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Home / Office"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium">House No. *</span>
                        <input
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                          value={newHouseNo}
                          onChange={(e) => setNewHouseNo(e.target.value)}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium">Street</span>
                        <input
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium">Area</span>
                        <input
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                          value={newArea}
                          onChange={(e) => setNewArea(e.target.value)}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium">Pincode *</span>
                        <input
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium">Landmark</span>
                        <input
                          className="w-full border  rounded-lg px-3 py-2 mt-1"
                          value={newLandmark}
                          onChange={(e) => setNewLandmark(e.target.value)}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium">
                          Selected Address (from map) *
                        </span>
                        <input
                          readOnly
                          className="w-full border border-green-500 rounded-lg px-3 py-2 mt-1 bg-gray-100"
                          value={pickedLocation.address || ""}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Pick location on map or search using box on right.
                        </p>
                      </label>
                      <div className="flex gap-3 mt-auto">
                        <button
                          type="button"
                          onClick={() => setIsAddAddressModalOpen(false)}
                          className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveNewAddress}
                          className="px-4 py-2 bg-[#228B22] text-white rounded-lg cursor-pointer"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col h-full">
                      <input
                        ref={mapAutocompleteRef}
                        id="add-map-autocomplete"
                        type="text"
                        placeholder="Search for an address"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-3"
                      />
                      <div
                        ref={mapRef}
                        className="w-full h-full rounded-lg border border-gray-300"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        You can drag the marker or click on the map to pick
                        location. The selected address will be auto-filled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs mb-1  font-bold">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your task"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-green-500 rounded-md px-3 py-2 text-sm resize-none"
              />
            </div>

            {/* Cost */}
            <div>
              <label className="block text-xs mb-1 font-bold">Cost (₹)</label>
              <input
                type="number"
                name="cost"
                placeholder="Enter cost in INR"
                value={formData.cost}
                onChange={handleChange}
                className="w-full border border-green-500 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs mb-1 font-bold">Deadline</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={Calender} alt="" className="w-4 h-4" />
                </div>
                <ReactDatePicker
                  selected={
                    formData.deadline ? new Date(formData.deadline) : null
                  }
                  onChange={(date) =>
                    setFormData({ ...formData, deadline: date.toISOString() })
                  }
                  showTimeSelect
                  dateFormat="dd MMM yyyy, hh:mm aa"
                  placeholderText="Select deadline"
                  minDate={new Date()}
                  className="w-full border border-green-500 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="border border border-green-500 rounded-lg p-3 text-center">
              <label className="cursor-pointer block">
                <svg
                  className="w-7 h-7 text-[#228B22] mx-auto mb-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3"
                  />
                </svg>
                <span className="text-xs text-gray-700">
                  Upload Photos (Optional)
                </span>
                <input
                  type="file"
                  className="hidden border border-green-500"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const uniqueFiles = files.filter(
                      (file) =>
                        !formData.images.some(
                          (f) => f.name === file.name && f.size === file.size
                        )
                    );
                    if (formData.images.length + uniqueFiles.length > 5) {
                      toast.error("You can upload max 5 photos");
                      e.target.value = "";
                      return;
                    }
                    setFormData({
                      ...formData,
                      images: [...formData.images, ...uniqueFiles],
                    });
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('input[type="file"]').click();
                  }}
                  className="block mx-auto mt-1 px-3 py-1 text-xs border border-[#228B22] text-[#228B22] rounded-md"
                >
                  Choose Files
                </button>
              </label>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-14 h-14 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            images: formData.images.filter(
                              (_, i) => i !== index
                            ),
                          })
                        }
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-green-600 mt-1">
                Max 5 photos (.jpg, .png)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-[#228B22] hover:bg-green-700 text-white cursor-pointer font-semibold py-3 rounded-lg text-base shadow-md transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* BANNER SLIDER */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-8">
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
                  className="w-full h-[400px] object-cover"
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

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
