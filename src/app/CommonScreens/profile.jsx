import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Arrow from "../../assets/profile/arrow_back.svg";
import RegistrationCompleted from "../../assets/registration_completed.png";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Move libraries outside the component to avoid reloading warning
const libraries = ["places"];

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    address: "",
    referral: "",
  });
  const [errors, setErrors] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapFor, setMapFor] = useState("location"); // "location" or "address"
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [markerLocationGPS, setMarkerLocationGPS] = useState(null);
  const [markerLocationAddress, setMarkerLocationAddress] = useState(null);
  const [tempAddress, setTempAddress] = useState({
    title: "",
    landmark: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  const autoCompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4",
    libraries,
  });

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Banner API response:", data); // Debug response

      if (res.ok) {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setBannerImages(data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = data.message || `HTTP error ${res.status}: ${res.statusText}`;
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

  const ProfileComplete = () => {
    localStorage.setItem('isProfileComplete', 'true');
    const role = localStorage.getItem("role");
    if (role === "service_provider") navigate("/homeservice");
    if (role === "user") navigate("/homeuser");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getAddressFromLatLng = (lat, lng) => {
    if (!isLoaded) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        if (mapFor === "location") {
          setFormData((prev) => ({ ...prev, location: address }));
          setMarkerLocationGPS({ lat, lng });
        } else {
          setFormData((prev) => ({ ...prev, address }));
          setTempAddress((prev) => ({
            ...prev,
            address,
            latitude: lat,
            longitude: lng,
          }));
          setMarkerLocationAddress({ lat, lng });
        }
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentLocation(loc);

          if (mapFor === "location") setMarkerLocationGPS(loc);
          else setMarkerLocationAddress(loc);

          getAddressFromLatLng(loc.lat, loc.lng);
          if (map) map.panTo(loc);
        },
        () => alert("Unable to fetch current location")
      );
    } else {
      alert("Geolocation not supported by browser");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

  const handlePlaceChanged = () => {
    if (autoCompleteRef.current) {
      const place = autoCompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const loc = { lat, lng };
        setCurrentLocation(loc);

        if (mapFor === "location") setMarkerLocationGPS(loc);
        else setMarkerLocationAddress(loc);

        getAddressFromLatLng(lat, lng);
        if (map) map.panTo(loc);
      }
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (mapFor === "location") setMarkerLocationGPS({ lat, lng });
    else setMarkerLocationAddress({ lat, lng });

    getAddressFromLatLng(lat, lng);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 3) newErrors.name = "Name must be at least 3 characters";
    if (!formData.age) newErrors.age = "Age is required";
    else if (isNaN(formData.age) || formData.age <= 0 || formData.age > 100)
      newErrors.age = "Enter a valid age between 1 and 100";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const role = localStorage.getItem("role");
      const payload = {
        full_name: formData.name,
        role,
        gender: formData.gender,
        age: Number(formData.age),
        location: {
          latitude: markerLocationAddress?.lat || 0,
          longitude: markerLocationAddress?.lng || 0,
          address: formData.address,
        },
        full_address: [
          {
            latitude: markerLocationAddress?.lat || 0,
            longitude: markerLocationAddress?.lng || 0,
            address: formData.address,
            landmark: tempAddress.landmark,
            title: tempAddress.title,
          },
        ],
        referral_code: formData.referral,
      };

      const token = localStorage.getItem("bharat_token");
      const response = await fetch(`${BASE_URL}/user/updateUserProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) setSuccessModal(true);
      else alert("Profile update failed");
    } catch {
      alert("Network error");
    }
  };

  const defaultCenter = markerLocationGPS || markerLocationAddress || currentLocation || { lat: 28.6139, lng: 77.209 };

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" /> Back
        </Link>
      </div>

      <div className="flex justify-center items-center bg-white px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-2xl shadow">
          <h2 className="text-center text-[24px] font-[700] mb-6">Complete Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="font-[700] block text-center">What's your Name?</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                  let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                  handleChange({ target: { name: "age", value } });
                }}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
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
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>

            {/* Full Address */}
            <div>
              <label className="font-[700] block text-center">Full Address</label>
              <input
                type="text"
                placeholder="Click to enter address"
                value={formData.address}
                readOnly
                onClick={() => setAddressModalOpen(true)}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] cursor-pointer placeholder:text-center"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            {/* Referral */}
            <div>
              <label className="font-[700] block text-center">Referral Code (Optional)</label>
              <input
                type="text"
                name="referral"
                placeholder="Enter Referral Code"
                value={formData.referral}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
              />
            </div>

            <button
              type="submit"
              className="w-40 bg-[#228B22] hover:bg-green-800 text-white py-2 rounded-[15px] font-medium shadow"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Enter Address Details</h2>
            <input
              type="text"
              placeholder="Title"
              value={tempAddress.title}
              onChange={(e) => setTempAddress({ ...tempAddress, title: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3"
            />
            <input
              type="text"
              placeholder="Landmark"
              value={tempAddress.landmark}
              onChange={(e) => setTempAddress({ ...tempAddress, landmark: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3"
            />
            <input
              type="text"
              placeholder="Click to select on map"
              value={tempAddress.address}
              readOnly
              onClick={() => {
                setMapFor("address");
                setIsMapOpen(true);
              }}
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3 cursor-pointer"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setAddressModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, address: tempAddress.address }));
                  setAddressModalOpen(false);
                }}
                className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapOpen && isLoaded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-2xl shadow-lg w-[90%] max-w-lg">
            <div className="flex justify-between mb-2">
              <h1 className="text-black text-[20px] font-semibold">
                {mapFor === "location" ? "GPS Location" : "Full Address"}
              </h1>
              <button onClick={() => setIsMapOpen(false)} className="text-red-500 font-bold">
                X
              </button>
            </div>

            <p className="text-center mb-2 text-sm text-gray-600">
              {mapFor === "location" ? formData.location : formData.address || "Not selected"}
            </p>

            <Autocomplete
              onLoad={(ref) => (autoCompleteRef.current = ref)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                placeholder="Search location"
                className="w-full border-2 border-gray-300 rounded-lg p-2 mb-2"
              />
            </Autocomplete>

            <GoogleMap
              mapContainerStyle={{ height: "350px", width: "100%" }}
              center={defaultCenter}
              zoom={15}
              onLoad={(map) => setMap(map)}
              onClick={handleMapClick}
            >
              {markerLocationGPS && <Marker position={markerLocationGPS} />}
              {markerLocationAddress && <Marker position={markerLocationAddress} />}
            </GoogleMap>

            <div className="flex mt-2 gap-2 justify-center">
              <button
                onClick={handleCurrentLocation}
                className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
              >
                Current Location
              </button>
              <button
                onClick={() => setIsMapOpen(false)}
                className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
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
              onClick={() => ProfileComplete()}
              className="bg-[#228B22] hover:bg-green-700 text-white px-16 py-2 rounded-[8px] font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Banner Slider */}
      <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
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
    </div>
  );
}