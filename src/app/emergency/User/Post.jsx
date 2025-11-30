import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Arrow from "../../../assets/profile/arrow_back.svg";
import axios from "axios";
import Swal from "sweetalert2";
import EmergencyTask from "../../../assets/emergTask.png";
import Logo from "../../../assets/logo.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import Select from "react-select";
import paymentConfirmationImage from "../../../assets/paymentconfirmation.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../../redux/userSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("bharat_token");

const Post = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const [showOptions, setShowOptions] = useState();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("selectedAddressTitle") || ""
      : ""
  );

  const [error, setError] = useState(null);
  const [platformFee, setPlatformFee] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    google_address: "",
    detailed_address: "",
    contact: "",
    deadline: "",
    images: [],
    coordinates: { lat: null, lng: null },
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const autocompleteRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
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



  let location = "";
  if (profile && profile.data) {
    location = profile.data.full_address || "";
  }

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = callback;
    script.onerror = () => console.error("Google Maps failed to load");

    document.head.appendChild(script);
  };

  useEffect(() => {
    if (!isAddAddressModalOpen) return;

    loadGoogleMapsScript(() => {
      if (!mapRef.current) return;

      const center = {
        lat: pickedLocation.latitude || 28.6139,
        lng: pickedLocation.longitude || 77.2090
      };

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 15,
      });

      const geocoder = new window.google.maps.Geocoder();

      let marker = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true,
      });

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

      // AUTOCOMPLETE FIX
      if (mapAutocompleteRef.current) {
        const auto = new window.google.maps.places.Autocomplete(
          mapAutocompleteRef.current
        );
        auto.addListener("place_changed", () => {
          const place = auto.getPlace();
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
      }
    });
  }, [isAddAddressModalOpen]);




  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch banner images
  const fetchBannerImages = async () => {
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

      // console.log("Banner API response:", response.data); // Debug response

      if (response.data?.success) {
        if (
          Array.isArray(response.data.images) &&
          response.data.images.length > 0
        ) {
          setBannerImages(response.data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage =
          response.data?.message || "Failed to fetch banner images";
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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

  // keep address in sync with profile and localStorage (mirror NewTask behavior)
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('selectedAddressTitle') : null;
    if (profile?.location?.address) {
      setAddress(profile.location.address);
      setSelectedAddress(profile.location.address);
    } else if (stored) {
      setAddress(stored);
      setSelectedAddress(stored);
    }
  }, [profile?.location?.address]);


  useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get-fee/emergency`, {
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
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/work-category`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response, "ggggggggg");
        setCategories(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch categories");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubcategories = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}/emergency/subcategories/${selectedCategory}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSubcategories(response.data.data || []);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch subcategories");
          setLoading(false);
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
      setSelectedSubcategories([]);
    }
  }, [selectedCategory]);

  // Handle map click
  // const handleMapClick = async (event) => {
  //   const lat = event.latLng.lat();
  //   const lng = event.latLng.lng();
  //   setFormData((prev) => ({
  //     ...prev,
  //     coordinates: { lat, lng },
  //   }));

  //   try {
  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4`
  //     );
  //     if (response.data.results.length > 0) {
  //       const address = response.data.results[0].formatted_address;
  //       setFormData((prev) => ({
  //         ...prev,
  //         google_address: address,
  //       }));
  //     } else {
  //       setError("Could not fetch address for the selected location");
  //     }
  //   } catch (err) {
  //     setError("Error fetching address");
  //   }
  // };

  // Handle place selection
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setFormData((prev) => ({
        ...prev,
        google_address: place.formatted_address,
        coordinates: { lat, lng },
      }));
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
      }
    } else {
      setError("Invalid address selected");
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategories([]);
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (selectedOptions) => {
    setSelectedSubcategories(selectedOptions || []);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    if (files.length > 5) {
      setError("You can only upload a maximum of 5 images.");
    } else {
      setError(null);
      setFormData((prev) => ({ ...prev, images: files }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!selectedCategory) errors.category_id = "Category is required.";
    if (selectedSubcategories.length === 0)
      errors.sub_category_ids = "At least one subcategory is required.";
    // if (!formData.google_address)
    //   errors.google_address = "Google address is required";
    // ✅ Title Validation
    if (!formData.title || formData.title.trim() === "") {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters long";
    } else if (formData.title.trim().length > 100) {
      errors.title = "Title cannot exceed 100 characters";
    } else if (!/^[A-Za-z0-9\s.,'-]+$/.test(formData.title.trim())) {
      errors.title = "Title contains invalid characters";
    }

    // ✅ Description Validation
    if (!formData.description || formData.description.trim() === "") {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters long";
    } else if (formData.description.trim().length > 250) {
      errors.description = "Description cannot exceed 250 characters";
    }
    if (!formData.contact) errors.contact = "Contact number is required.";
    else if (formData.contact.trim()?.length != 10)
      errors.contact = "Contact should be 10 digits.";
    if (!formData.deadline) errors.deadline = "Deadline is required.";
    // if (formData.images.length === 0)
    //   errors.images = "At least one image is required";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fill in all required fields.");
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields.",
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    const submissionData = new FormData();
    submissionData.append("category_id", selectedCategory);
    submissionData.append(
      "sub_category_ids",
      selectedSubcategories.map((option) => option.value).join(",")
    );
    submissionData.append(
      "google_address",
      address || profile?.location?.address
    );
    submissionData.append("title", formData.title);
    submissionData.append("description", formData.description);
    submissionData.append("address", address || profile?.location?.address);
    submissionData.append("detailed_address", formData.detailed_address);
    submissionData.append("contact", formData.contact);
    submissionData.append("deadline", formData.deadline);
    formData.images.forEach((image) => {
      submissionData.append("images", image);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/emergency-order/create`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // ✅ SweetAlert on success
        Swal.fire({
          icon: "success",
          title: "Order Created Successfully!",
          text: "Redirecting to order details...",
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect after small delay
        setTimeout(() => {
          navigate(`/emergency/order-detail/${response.data?.order?._id}`);
        }, 2000);
      } else {
        setError("Not add a post");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add a post. Please try again.",
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setError(
        "Failed to submit task: " + (err.response?.data?.message || err.message)
      );
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.response?.data?.message || err.message,
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };

  // Handle confirm from payment modal
  const handlePayConfirm = () => {
    setShowPaymentModal(false);
    if (razorpayOrder) {
      initiatePayment(razorpayOrder.id, razorpayOrder.amount * 100); // Convert back to paise
    }
  };

  // Handle payment with Razorpay
  const initiatePayment = (razorpayOrderId, amount) => {
    const options = {
      key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
      amount: amount,
      currency: "INR",
      name: "Your Company Name",
      description: "Emergency Task Platform Fee",
      order_id: razorpayOrderId,
      handler: async (response) => {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          };

          const verifyResponse = await axios.post(
            `${BASE_URL}/emergency-order/verify-platform-payment`,
            verifyData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (verifyResponse.status === 200) {
            navigate(`/user/work-list/Emergency Tasks`);
          } else {
            setError("Payment verification failed");
          }
        } catch (err) {
          setError("Error verifying payment: " + err.message);
          console.error(err);
        }
      },
      prefill: {
        contact: formData.contact,
      },
      theme: {
        color: "#10B981",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      setError(
        "Payment failed. Please try again: " + response.error.description
      );
      console.error(response.error);
    });
    rzp.open();
  };

  // Format subcategories for react-select
  const subcategoryOptions = subcategories.map((subcategory) => ({
    value: subcategory._id,
    label: subcategory.name,
  }));

  // Map container style
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  // Default center for the map
  const defaultCenter = {
    lat: 22.7196,
    lng: 75.8577,
  };

  // Slider settings for react-slick
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

  // Format deadline for display
  const formattedDate = formData.deadline
    ? new Date(formData.deadline).toLocaleDateString("en-GB")
    : "N/A";
  const formattedTime = formData.deadline
    ? new Date(formData.deadline).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    : "N/A";

  const updateAddress = async (location) => {
    try {
      const t = localStorage.getItem("bharat_token") || token;
      // Call the same endpoint and flow used in NewTask.jsx so header/profile updates correctly
      const res = await fetch(`${BASE_URL}/user/updatelocation`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: location?.latitude || 28.6139,
          longitude: location?.longitude || 77.2090,
          address: location?.address || "",
        }),
      });

      if (res.ok) {
        // update local UI state to reflect chosen address
        setAddress(location?.address || "");
        // persist a small hint for other parts of the app (same as NewTask)
        if (location?._id) localStorage.setItem("selectedAddressId", location._id);
        if (location?.address) localStorage.setItem("selectedAddressTitle", location.address);

        // refresh profile in redux so Header picks up the new location
        try {
          dispatch(fetchUserProfile());
        } catch (e) {
          console.warn("fetchUserProfile dispatch failed:", e);
        }
        // Show success modal like DirectHiring
        Swal.fire("Success", "Location updated", "success");
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("Failed to update location:", data);
      }
    } catch (error) {
      console.log(error, "gg");
    }
  };
  // Save New Address Function (Fix)
  // ================= SAVE NEW ADDRESS API =================
  const handleSaveNewAddress = async () => {
    if (!newTitle || !newHouseNo || !newPincode || !pickedLocation.address) {
      return Swal.fire("Required", "Please fill all required fields and pick a location on the map", "warning");
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
        address: pickedLocation.address
      },
      full_address: [...(profile.full_address || []), newAddress]
    };

    try {
      if (!token) throw new Error("Not authenticated");

      const res = await axios.post(
        `${BASE_URL}/user/updateUserProfile`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      Swal.fire("Success", "Address added successfully!", "success");

      setIsAddAddressModalOpen(false);

      // save new address in UI
      setSelectedAddress(newAddress.address);
      setAddress(newAddress.address);

      // persist for other pages too (only after API OK)
      if (res?.status === 200) {
        if (newAddress._id) localStorage.setItem("selectedAddressId", newAddress._id);
        if (newAddress.address) localStorage.setItem("selectedAddressTitle", newAddress.address);
      }

      // refresh redux
      dispatch(fetchUserProfile());

    } catch (err) {
      console.log("API Error Response:", err.response?.data);
      Swal.fire("Error", err.response?.data?.message || "Failed to save new address", "error");
    }
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-[1000px] mx-auto mt-20 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-700 mb-4 hover:underline"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
      </div>
      <div className="flex flex-col lg:flex-row justify-center items-start bg-white px-3 gap-6 py-6">

        {/* LEFT IMAGE BLOCK (same styling as first code) */}
        <div className="w-full sm:w-[350px] md:w-[420px] lg:w-[480px] xl:w-[520px] object-contain rounded-xl shadow-md mt-20 md:mt-24 lg:mt-28 mb-6 mr-0 lg:mr-20 xl:mr-28">
          <img
            src={EmergencyTask}
            alt="Task Banner"
            className="w-full h-auto object-contain rounded-2xl shadow-lg"
          />
        </div>

        {/* RIGHT FORM BLOCK (same compact card UI as first code) */}
        <div className="bg-white rounded-xl p-4 w-full lg:w-[380px] shadow-md max-h-screen overflow-y-auto">

          <h2 className="text-[26px] font-bold text-center text-[#191A1D] mb-3">
            Post Emergency Task
          </h2>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {loading && <p className="text-center">Loading...</p>}

          <form className="w-full space-y-3 text-left text-sm" onSubmit={handleSubmit}>

            {/* Title */}
            <div>
              <label className="block text-xs mb-1 font-bold">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter Title"
                className={`w-full border rounded-md px-3 py-2 text-sm ${validationErrors.title ? "border-red-500" : "border-green-500"
                  }`}
              />
              {validationErrors.title && (
                <p className="text-red-500 text-xs">{validationErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs mb-1 font-bold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={3}
                className={`w-full border rounded-md px-3 py-2 text-sm resize-none ${validationErrors.description ? "border-red-500" : "border-green-500"
                  }`}
              />
              {validationErrors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.description}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs mb-1 font-bold">Work Category</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className={`w-full border rounded-md px-3 py-2 text-sm ${validationErrors.category_id ? "border-red-500" : "border-green-500"
                  }`}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {validationErrors.category_id && (
                <p className="text-red-500 text-xs">{validationErrors.category_id}</p>
              )}
            </div>

            {/* Subcategories */}
            <div>
              <label className="block text-xs mb-1 font-bold">Emergency Subcategories</label>
              <Select
                isMulti
                options={subcategoryOptions}
                value={selectedSubcategories}
                onChange={handleSubcategoryChange}
                placeholder="Select Emergency Subcategories"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: validationErrors.sub_category_ids
                      ? "#EF4444"
                      : "#10B981",
                    minHeight: 36
                  }),
                }}
              />

              {validationErrors.sub_category_ids && (
                <p className="text-red-500 text-xs">{validationErrors.sub_category_ids}</p>
              )}
            </div>

            {/* Address Section (same UI as first code + Add New Address button added) */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-600">Address</label>

                {/* ADD NEW ADDRESS BUTTON (copied from first code) */}
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
                readOnly
                value={address}
                onClick={() => setShowOptions(!showOptions)}
                placeholder="Click to select location"
                className="w-full border border-green-500 rounded-md px-3 py-2 text-sm cursor-pointer pr-10"
              />

              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute right-3 top-9 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>

              {showOptions && (
                <ul className="absolute z-10 bg-white border rounded-lg shadow-md w-full mt-1 max-h-44 overflow-y-auto text-sm">
                  <li className="px-3 py-2 bg-gray-100">
                    <h3 className="text-sm font-semibold text-[#191A1D]">Select an Address</h3>
                  </li>

                  {profile?.full_address?.length > 0 ? (
                    profile.full_address.map((loc, i) => (
                      <li
                        key={i}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-start text-xs"
                        onClick={() => {
                          setAddress(loc.address);
                          updateAddress(loc);
                          setShowOptions(false);
                        }}
                      >
                        <input type="radio" className="mr-2 mt-1" checked={address === loc.address} />
                        <p className="flex-1">
                          <span className="font-medium block">{loc.title}</span>
                          <span className="text-gray-600 block">{loc.landmark}</span>
                          <span className="text-gray-500 block text-xs">{loc.address}</span>
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500 text-xs">No saved addresses</li>
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
                    <button onClick={() => setIsAddAddressModalOpen(false)} className="text-red-600 font-semibold cursor-pointer">Close</button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    <div className="flex flex-col gap-3 overflow-auto pr-2">
                      <label className="block"><span className="text-sm font-medium">Title *</span><input className="w-full border rounded-lg px-3 py-2 mt-1" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Home / Office" /></label>
                      <label className="block"><span className="text-sm font-medium">House No. *</span><input className="w-full border rounded-lg px-3 py-2 mt-1" value={newHouseNo} onChange={(e) => setNewHouseNo(e.target.value)} /></label>
                      <label className="block"><span className="text-sm font-medium">Street</span><input className="w-full border rounded-lg px-3 py-2 mt-1" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} /></label>
                      <label className="block"><span className="text-sm font-medium">Area</span><input className="w-full border rounded-lg px-3 py-2 mt-1" value={newArea} onChange={(e) => setNewArea(e.target.value)} /></label>
                      <label className="block"><span className="text-sm font-medium">Pincode *</span><input className="w-full border rounded-lg px-3 py-2 mt-1" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} /></label>
                      <label className="block"><span className="text-sm font-medium">Landmark</span><input className="w-full border rounded-lg px-3 py-2 mt-1" value={newLandmark} onChange={(e) => setNewLandmark(e.target.value)} /></label>
                      <label className="block"><span className="text-sm font-medium">Selected Address (from map) *</span><input readOnly className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100" value={pickedLocation.address || ""} /><p className="text-xs text-gray-500 mt-1">Pick location on map or search using box on right.</p></label>
                      <div className="flex gap-3 mt-auto">
                        <button type="button" onClick={() => setIsAddAddressModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer">
                          Cancel
                        </button>
                        <button type="button" onClick={handleSaveNewAddress} className="px-4 py-2 bg-[#228B22] text-white rounded-lg cursor-pointer">
                          Save Address
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col h-full">
                      <input ref={mapAutocompleteRef} id="add-map-autocomplete" type="text" placeholder="Search for an address" className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-3" />
                      <div ref={mapRef} className="w-full h-full rounded-lg border border-gray-300" />
                      <p className="text-xs text-gray-500 mt-2">You can drag the marker or click on the map to pick location. The selected address will be auto-filled.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            <div>
              <label className="block text-xs mb-1 font-bold">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  handleInputChange({ target: { name: "contact", value: onlyNums } });
                }}
                placeholder="Enter Contact Number"
                className={`w-full border rounded-md px-3 py-2 text-sm ${validationErrors.contact ? "border-red-500" : "border-green-500"
                  }`}
              />
              {validationErrors.contact && (
                <p className="text-red-500 text-xs">{validationErrors.contact}</p>
              )}
            </div>

            {/* Deadline */}
            {/* <div>
              <label className="block text-xs mb-1 font-bold">Add Completion Time</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                onClick={(e) => e.target.showPicker()}
                onFocus={(e) => e.target.showPicker()}
                className={`w-full border rounded-md px-3 py-2 text-sm ${validationErrors.deadline ? "border-red-500" : "border-green-500"
                  }`}
              />
              {validationErrors.deadline && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.deadline}</p>
              )}
            </div> */}
            {/* Deadline / Completion Time */}
            <div>
              <label className="block text-xs mb-1 font-bold">Add Completion Time</label>
              <div className="relative w-full">
                <DatePicker
                  selected={formData.deadline ? new Date(formData.deadline) : null}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, deadline: date.toISOString() }))
                  }
                  showTimeSelect
                  timeFormat="h:mm aa"
                  timeIntervals={15}
                  dateFormat="dd MMM yyyy, h:mm aa"  // Isse Date + AM/PM dikhega
                  placeholderText="Select Date & Time"
                  minDate={new Date()}
                  wrapperClassName="w-full"
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                    validationErrors.deadline ? "border-red-500" : "border-green-500"
                  }`}
                />
              </div>
              {validationErrors.deadline && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.deadline}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="border border-gray-300 rounded-lg p-3 text-center">
              <label className="cursor-pointer block">
                <svg className="w-7 h-7 text-[#228B22] mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-3 3m3-3l3 3" />
                </svg>
                <span className="text-xs text-gray-700">Upload Photos (Optional)</span>

                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />

                <button type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="block mx-auto mt-1 px-3 py-1 text-xs border border-[#228B22] text-[#228B22] rounded-md"
                >
                  Choose Files
                </button>
              </label>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(file)} className="w-14 h-14 object-cover rounded border" />
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-green-600 mt-1">Max 5 photos (.jpg, .png)</p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#228B22] hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-base shadow-md transition cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>


      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPaymentModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold text-center mb-4">
              Payment Confirmation
            </h3>
            <div className="flex justify-center mb-4">
              <img
                src={paymentConfirmationImage}
                alt="Payment"
                className="w-32"
              />
            </div>
            <p className="text-center mb-2">Date: {formattedDate}</p>
            <p className="text-center mb-2">Time: {formattedTime}</p>
            <p className="text-center mb-2">Amount: 0 INR</p>
            <p className="text-center mb-2">
              Platform Fees: {razorpayOrder ? razorpayOrder.amount : 200} INR
            </p>
            <hr className="my-2" />
            <p className="text-center font-bold mb-4">
              Total: {razorpayOrder ? razorpayOrder.amount : 200} INR
            </p>
            <div className="flex justify-around">
              <button
                onClick={handlePayConfirm}
                className="bg-[#008000] text-white py-2 px-4 rounded-md hover:bg-green-800"
              >
                Proceed
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Slider */}
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
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
                  src={banner || "/src/assets/profile/default.png"} // Fallback image
                  alt={`Banner ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.target.src = "/src/assets/profile/default.png"; // Fallback on image load error
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
    </>
  );
};

export default Post;
