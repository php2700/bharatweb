import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import banner from "../../assets/profile/banner.png";
import Arrow from "../../assets/profile/arrow_back.svg";
import RegistrationCompleted from "../../assets/registration_completed.png";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

export default function Profile() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  /* ---------- FORM STATE ---------- */
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    address: "",
    referral: "",
  });

  const [errors, setErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  /* ---------- MAP STATE ---------- */
  const [map, setMap] = useState(null); // google.maps.Map
  const [markerLocationAddress, setMarkerLocationAddress] = useState(null);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 });

  const [tempAddress, setTempAddress] = useState({
    title: "",
    landmark: "",
    address: "",
    houseNo: "",
    street: "",
    area: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  /* ---------- HELPERS ---------- */
  const ProfileComplete = () => {
    localStorage.setItem("isProfileComplete", "true");
    const role = localStorage.getItem("role");
    if (role === "service_provider") window.location.href = "/homeservice";
    if (role === "user") window.location.href = "/homeuser";
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---------- REVERSE GEOCODE ---------- */
  const reverseGeocode = useCallback(
    (lat, lng) => {
      if (!isLoaded) return;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const formatted = results[0].formatted_address;
          setTempAddress((prev) => ({
            ...prev,
            address: formatted,
            latitude: lat,
            longitude: lng,
          }));
        }
      });
    },
    [isLoaded]
  );

  /* ---------- GET CURRENT LOCATION ---------- */
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const loc = { lat, lng };

        setCenter(loc);
        setMarkerLocationAddress(loc);
        reverseGeocode(lat, lng);

        // Pan map after it mounts
        setTimeout(() => {
          if (map) {
            map.panTo(loc);
            map.setZoom(17);
          }
        }, 200);

        setIsFetchingLocation(false);
      },
      (err) => {
        console.error(err);
        alert(
          "Could not get your location. Please allow location access and try again."
        );
        setIsFetchingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [map, reverseGeocode]);

  /* ---------- MAP INTERACTIONS ---------- */
  const onMapLoad = useCallback((m) => setMap(m), []);

  const onMapClick = useCallback(
    (e) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerLocationAddress({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  const onMarkerDragEnd = useCallback(
    (e) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerLocationAddress({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  /* ---------- VALIDATIONS ---------- */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";
    else if (!/^[A-Za-z\s]+$/.test(formData.name))
      newErrors.name = "Name must contain only alphabets";

    if (!formData.age) newErrors.age = "Age is required.";
    else if (isNaN(+formData.age) || +formData.age <= 0 || +formData.age > 100)
      newErrors.age = "Enter a valid age between 1 and 100.";
    else if (+formData.age < 18) newErrors.age = "Age must be 18 or older.";

    if (!formData.gender) newErrors.gender = "Gender is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddressStep = () => {
    const newErrors = {};

    if (!tempAddress.title.trim()) {
      newErrors.title = "Please provide a title (e.g., Home, Office)";
    } else if (tempAddress.title.length < 2) {
      newErrors.title = "Title should be at least 2 characters long";
    }

    // 📍 Landmark
    if (!tempAddress.landmark.trim()) {
      newErrors.landmark = "Landmark is required (e.g., near City Mall)";
    } else if (tempAddress.landmark.length < 3) {
      newErrors.landmark = "Landmark should be descriptive";
    }

    // 🏡 House No
    if (!tempAddress.houseNo.trim()) {
      newErrors.houseNo = "House / Flat number is required";
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(tempAddress.houseNo)) {
      newErrors.houseNo = "House No must contain only letters, numbers, or -";
    }

    // 🚧 Street
    if (!tempAddress.street.trim()) {
      newErrors.street = "Street name is required";
    } else if (tempAddress.street.length < 3) {
      newErrors.street = "Please enter a valid street name";
    }

    // 🏘️ Area
    if (!tempAddress.area.trim()) {
      newErrors.area = "Area or locality is required";
    } else if (tempAddress.area.length < 3) {
      newErrors.area = "Area name should be at least 3 characters long";
    }
    if (!tempAddress.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(tempAddress.pincode))
      newErrors.pincode = "Pincode must be 6 digits";

    if (!tempAddress.address)
      newErrors.address = "Please select address on map";
    if (!markerLocationAddress) newErrors.marker = "Please pin your location";

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- SUBMIT HANDLERS ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.referral.trim()) {
      try {
        const token = localStorage.getItem("bharat_token");
        const res = await fetch(`${BASE_URL}/user/checkReferralCode`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ referral_code: formData.referral }),
        });
        const data = await res.json();
        if (!data.status) {
          setErrors({ referral: "Invalid referral code" });
          return;
        }
      } catch {
        alert("Error checking referral code");
        return;
      }
    }

    setShowAddressFields(true);
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) {
      setShowAddressFields(false);
      return;
    }
    if (!validateAddressStep()) return;

    try {
      const role = localStorage.getItem("role");
      const payload = {
        full_name: formData.name,
        role,
        gender: formData.gender,
        age: Number(formData.age),
        location: {
          latitude: markerLocationAddress?.lat ?? 0,
          longitude: markerLocationAddress?.lng ?? 0,
          address: formData.address,
        },
        full_address: [
          {
            latitude: markerLocationAddress?.lat ?? 0,
            longitude: markerLocationAddress?.lng ?? 0,
            address: tempAddress.address,
            landmark: tempAddress.landmark,
            title: tempAddress.title,
            houseno: tempAddress.houseNo,
            street: tempAddress.street,
            area: tempAddress.area,
            pincode: tempAddress.pincode,
          },
        ],
        referral_code: formData.referral,
      };

      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/user/updateUserProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) setSuccessModal(true);
      else alert("Profile update failed");
    } catch {
      alert("Network error");
    }
  };

  /* ---------- EFFECTS ---------- */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ---------- RENDER ---------- */
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-4 mt-20">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" /> Back
        </Link>
      </div>

      <div className="flex justify-center items-center bg-white px-4 py-8 mt-20">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-2xl shadow">
          <h2 className="text-center text-[24px] font-[700] mb-6">
            Complete Profile
          </h2>

          {/* ---------------- STEP 1 ---------------- */}
          {!showAddressFields ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="font-[700] block text-center">
                  What's your Name?
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="font-[700] block text-center">Your Age</label>
                <input
                  type="text"
                  name="age"
                  placeholder="Enter Your Age"
                  value={formData.age}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                    handleChange({ target: { name: "age", value: v } });
                  }}
                  className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="font-[700] block text-center">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] text-center"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>

              {/* Referral */}
              <div>
                <label className="font-[700] block text-center">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  name="referral"
                  placeholder="Enter Referral Code"
                  value={formData.referral}
                  onChange={handleChange}
                  className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
                />
                {errors.referral && (
                  <p className="text-red-500 text-sm">{errors.referral}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-40 bg-[#228B22] hover:bg-green-800 text-white py-2 rounded-[15px] font-medium shadow"
              >
                Next
              </button>
            </form>
          ) : (
            /* ---------------- STEP 2 – ADDRESS ---------------- */
            <div className="space-y-4">
              {/* ---- MAP (ALWAYS VISIBLE) ---- */}
              {isLoaded ? (
                <div className="rounded-lg overflow-hidden shadow-md">
                  <GoogleMap
                    mapContainerStyle={{ height: "300px", width: "100%" }}
                    center={center}
                    zoom={15}
                    onLoad={onMapLoad}
                    onClick={onMapClick}
                  >
                    {markerLocationAddress && (
                      <Marker
                        position={markerLocationAddress}
                        draggable={true}
                        onDragEnd={onMarkerDragEnd}
                      />
                    )}
                  </GoogleMap>
                </div>
              ) : (
                <div className="h-[300px] bg-gray-200 flex items-center justify-center rounded-lg">
                  Loading map...
                </div>
              )}

              {/* ---- USE CURRENT LOCATION BUTTON ---- */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isFetchingLocation}
                  className={`px-4 py-2 rounded-md text-white font-medium shadow-sm ${
                    isFetchingLocation
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isFetchingLocation
                    ? "Getting location..."
                    : "Use My Location"}
                </button>
              </div>

              {/* ---- ADDRESS DISPLAY (READ-ONLY) ---- */}
              <div>
                <input
                  type="text"
                  placeholder="Your address will appear here"
                  value={tempAddress.address}
                  readOnly
                  className="w-full border-2 border-gray-300 rounded-lg p-2 bg-gray-50"
                />
                {addressErrors.address && (
                  <p className="text-red-500 text-xs text-left mt-1">
                    {addressErrors.address}
                  </p>
                )}
              </div>

              {/* ---- DETAILED ADDRESS FIELDS ---- */}
              {[
                ["title", "Title"],
                ["landmark", "Landmark"],
                ["houseNo", "House No"],
                ["street", "Street"],
                ["area", "Area"],
                ["pincode", "Pincode"],
              ].map(([key, label]) => (
                <div key={key}>
                  <input
                    type="text"
                    placeholder={label}
                    value={tempAddress[key]}
                    onChange={(e) =>
                      setTempAddress({ ...tempAddress, [key]: e.target.value })
                    }
                    className="w-full border-2 border-gray-300 rounded-lg p-2"
                  />
                  {addressErrors[key] && (
                    <p className="text-red-500 text-xs text-left mt-1">
                      {addressErrors[key]}
                    </p>
                  )}
                </div>
              ))}

              {/* ---- SUBMIT ---- */}
              <button
                onClick={handleFinalSubmit}
                className="w-40 bg-[#228B22] hover:bg-green-800 text-white py-2 rounded-[15px] font-medium shadow"
              >
                Submit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- SUCCESS MODAL ---------- */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-sm">
            <img
              src={RegistrationCompleted}
              alt="Registration completed"
              className="mx-auto mb-4 w-[244px] h-[185px]"
            />
            <p className="text-[22px] font-[400] text-[#363636] mb-4">
              You have successfully completed your registration!
            </p>
            <button
              onClick={ProfileComplete}
              className="bg-[#228B22] hover:bg-green-700 text-white px-16 py-2 rounded-[8px] font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ---------- BOTTOM BANNER ---------- */}
      <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={banner}
          alt="Gardening illustration"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
        />
      </div>
      <Footer />
    </div>
  );
}
