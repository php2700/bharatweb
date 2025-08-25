import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header2 from "../component/Header2";
import Footer from "../component/footer";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";

export default function Profile() {
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
  const [successModal, setSuccessModal] = useState(false); // Success Modal
  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null);
  const autoCompleteRef = useRef(null);

  // Load Google Maps JS API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4",
    libraries: ["places"],
  });

  // Fetch current location when modal opens
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentLocation(loc);
          if (map) {
            map.panTo(loc);
          }
        },
        (err) => {
          console.error(err);
          alert("Unable to fetch location");
        }
      );
    }
  }, [isOpen, map]);

  // Input change handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Convert lat/lng → address
  const getAddressFromLatLng = (lat, lng) => {
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
          location: `${lat}, ${lng}`, // fallback
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

  // ✅ Validation Function
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age <= 0 || formData.age > 100) {
      newErrors.age = "Enter a valid age between 1 and 100";
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Please select your location";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data:", formData);
      setSuccessModal(true); // ✅ Show success modal
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header2 />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src="/profile/arrow_back.svg" className="w-6 h-6 mr-2" />
          Back
        </Link>
      </div>

      {/* Main Form */}
      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <main className="flex-grow container mx-auto px-4 flex justify-center items-center">
            <div className="p-6 w-full max-w-md ">
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
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm">{errors.location}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="text-[18px] font-[700] mb-1 block text-center">
                    Full Address (Landmark)
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Full Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border-2 border-[#C6C6C6] rounded-[15px] p-[15px] placeholder:text-center"
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
                >
                  Submit
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
       <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
      {/* Foreground image */}
      <img
        src="src/assets/banner.png" // apna image path yahan lagao
        alt="Gardening"
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
      />
    </div>
    <div className="mt-[50px]">
                    <Footer />
                  </div>
{/* ✅ Location Modal */}
{isOpen && isLoaded && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-lg">
      <h2 className="text-lg font-bold mb-4">Select Location</h2>

      {/* Search Box */}
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

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={{ height: "350px", width: "100%" }}
        center={currentLocation || { lat: 28.6139, lng: 77.209 }} // fallback to Delhi
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

      {/* ✅ Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-sm h-[462px]">
            <img
              src="/src/assets/registration_completed.png"
              alt="Success"
              className="mx-auto mb-4 w-[244px] h-[185px]"
            />
            <p className="text-[22px] font-[400] text-[#363636] mb-4">
              Registration have been completed.
            </p>
            <br />
            <hr className="text-[#228B2296]" />
            <br />
            <br />
            <button
              onClick={() => setSuccessModal(false)}
              className="bg-[#228B22] hover:bg-green-700 text-white px-16 py-2 rounded-[8px] font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
