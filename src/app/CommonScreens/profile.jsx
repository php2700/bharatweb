import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header2 from "../../component/Header2";
import Footer from "../../component/footer";
import Gardening from "../../assets/profile/profile image.png";
import Arrow from "../../assets/profile/arrow_back.svg";
import RegistrationCompleted from "../../assets/registration_completed.png"; // Import the success modal image
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";

export default function Profile() {
  const navigate = useNavigate();
  const ProfileComplete=()=>{
    const role=localStorage.getItem('role');
    if(role === "service_provider"){
        navigate('/homeservice');
    }
    if(role==='user'){
      navigate('/homeuser');
    }
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    address: "",
    referral: "",
  });

  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false); // Location Modal
  const [addressModalOpen, setAddressModalOpen] = useState(false); // Address Modal
  const [successModal, setSuccessModal] = useState(false); // Success Modal
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);
  const autoCompleteRef = useRef(null);

  const [tempAddress, setTempAddress] = useState({
    title: "",
    landmark: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  // Load Google Maps JS API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4", // Replace with your actual Google Maps API key
    libraries: ["places"],
  });

  // Fetch current location when modal opens
  useEffect(() => {
    if (isOpen && navigator.geolocation && isLoaded) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentLocation(loc);
          if (map) map.panTo(loc);
        },
        (err) => {
          console.error(err);
          alert("Unable to fetch location");
        }
      );
    }
  }, [isOpen, map, isLoaded]);

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert lat/lng → address
  const getAddressFromLatLng = (lat, lng) => {
    if (!isLoaded) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setFormData((prev) => ({
          ...prev,
          location: results[0].formatted_address,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          location: `${lat}, ${lng}`, // Fallback
        }));
      }
    });
  };

  // Save selected location
  const handleSelectLocation = () => {
    if (currentLocation) {
      getAddressFromLatLng(currentLocation.lat, currentLocation.lng);
      setIsOpen(false);
    }
  };

  // Handle place search
  const handlePlaceChanged = () => {
    if (autoCompleteRef.current) {
      const place = autoCompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const loc = { lat, lng };
        setCurrentLocation(loc);
        if (map) map.panTo(loc);
        getAddressFromLatLng(lat, lng);
      }
    }
  };

  // Validation Function
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!formData.age) newErrors.age = "Age is required";
    else if (isNaN(formData.age) || formData.age <= 0 || formData.age > 100)
      newErrors.age = "Enter a valid age between 1 and 100";

    if (!formData.gender.trim()) newErrors.gender = "Gender is required";

    if (!formData.location.trim())
      newErrors.location = "Please select your location";

    if (!formData.address.trim())
      newErrors.address = "Address is required";
    else if (formData.address.length < 5)
      newErrors.address = "Address must be at least 5 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Form Submit with API call
 // Form Submit with API call
 const role=localStorage.getItem('role');
const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      const payload = {
        full_name: formData.name,
        role: role,
        gender: formData.gender,
        age: Number(formData.age),
        location: {
          latitude: currentLocation?.lat || 0,
          longitude: currentLocation?.lng || 0,
          address: formData.location,
        },
        full_address: [
          {
            latitude: tempAddress.latitude || currentLocation?.lat || 0,
            longitude: tempAddress.longitude || currentLocation?.lng || 0,
            address: tempAddress.address,
            landmark: tempAddress.landmark,
            title: tempAddress.title,
          },
        ],
        referral_code: formData.referral,
      };

      // Get token from localStorage
      const token = localStorage.getItem("token"); // <- यहाँ आपका token key

      const response = await fetch(
        `${BASE_URL}/user/updateUserProfile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // <- Bearer token
          },
          body: JSON.stringify(payload),
        }
      );
 const data = await response.json()
      if (response.ok) {
        localStorage.setItem('isProfileComplete',data.user.isProfileComplete);
        setSuccessModal(true);
      } else {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData);
        alert("Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection.");
    }
  }
  
};


  return (
    <div className="flex flex-col min-h-screen">
      <Header2 />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
          aria-label="Back to home"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      {/* Main Form */}
      <div className="flex justify-center items-center bg-white px-4 py-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <h2 className="text-center text-[24px] font-[700] text-[#000000] mb-6">
            Complete Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-[18px] font-[700] mb-1 block text-center">
                What's your Name?
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
                aria-required="true"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="text-[18px] font-[700] mb-1 block text-center">
                Your Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="Enter Your Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
                aria-required="true"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age}</p>
              )}
            </div>

                {/* Gender */}
                <div>
                  <label className="text-[18px] font-[700] mb-1 block text-center">
                    Gender
                  </label>
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

            {/* Location */}
            <div>
              <label className="text-[18px] font-[700] mb-1 block text-center">
                Location (GPS)
              </label>
              <input
                type="text"
                name="location"
                placeholder="Click to select location"
                value={formData.location}
                readOnly
                onClick={() => setIsOpen(true)}
                className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] cursor-pointer placeholder:text-center"
                aria-required="true"
              />
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
            </div>

                {/* Full Address */}
                <div>
                  <label className="text-[18px] font-[700] mb-1 block text-center">
                    Full Address (Landmark)
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Click to enter address"
                    value={formData.address}
                    readOnly
                    onClick={() => setAddressModalOpen(true)}
                    className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] cursor-pointer placeholder:text-center"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>

            {/* Referral */}
            <div>
              <label className="text-[18px] font-[700] mb-1 block text-center">
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
            </div>

            <button
              type="submit"
              className="w-40 bg-[#228B22] hover:bg-green-800 text-white py-2 rounded-[15px] font-medium shadow"
              aria-label="Submit profile form"
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
              onChange={(e) =>
                setTempAddress({ ...tempAddress, title: e.target.value })
              }
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3"
            />
            <input
              type="text"
              placeholder="Landmark"
              value={tempAddress.landmark}
              onChange={(e) =>
                setTempAddress({ ...tempAddress, landmark: e.target.value })
              }
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3"
            />
            <textarea
              placeholder="Address"
              value={tempAddress.address}
              onChange={(e) =>
                setTempAddress({ ...tempAddress, address: e.target.value })
              }
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3"
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
                  setFormData((prev) => ({
                    ...prev,
                    address: tempAddress.address,
                  }));
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

      {/* Location Modal */}
      {isOpen && isLoaded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-lg">
            <h2 className="text-lg font-bold mb-4">Select Location</h2>

            <Autocomplete
              onLoad={(ref) => (autoCompleteRef.current = ref)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                placeholder="Search location"
                className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3"
              />
            </Autocomplete>

            <GoogleMap
              mapContainerStyle={{ height: "350px", width: "100%" }}
              center={currentLocation || { lat: 28.6139, lng: 77.209 }}
              zoom={15}
              onLoad={(map) => setMap(map)}
              onClick={(e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                setCurrentLocation({ lat, lng });
                getAddressFromLatLng(lat, lng);
              }}
            >
              {currentLocation && <Marker position={currentLocation} />}
            </GoogleMap>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectLocation}
                className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
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
              Registration has been completed.
            </p>
            <hr className="text-[#228B2296]" />
            <br />
            <button
              onClick={() => ProfileComplete()}
              className="bg-[#228B22] hover:bg-green-700 text-white px-16 py-2 rounded-[8px] font-semibold"
              aria-label="Close success modal"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Gardening Image Section */}
      <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={Gardening}
          alt="Gardening illustration"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
        />
      </div>
<div className="mt-10">
      <Footer />
      </div>

      <div className="mt-[50px]">
        <Footer />
      </div>
    </div>
  );
}