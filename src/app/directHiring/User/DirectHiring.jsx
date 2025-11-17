import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import Header from "../../../component/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchUserProfile } from "../../../redux/userSlice";

// 🔹 Load Google Maps script
const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&libraries=places`;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
  return () => document.body.removeChild(script);
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("bharat_token");

const DirectHiring = () => {
  const navigate = useNavigate();
	const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const [showOptions, setShowOptions] = useState(false);
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState();
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState([]);
  const [isShopVisited, setIsShopVisited] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false); // existing map modal
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false); // new address modal
  const [platformFee, setPlatformFee] = useState("");
  const mapRef = useRef(null);
  const mapAutocompleteRef = useRef(null); // Ref for modal autocomplete input
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const [modalMapInitialized, setModalMapInitialized] = useState(false);

  // New address form fields
  const [newTitle, setNewTitle] = useState("");
  const [newHouseNo, setNewHouseNo] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newLandmark, setNewLandmark] = useState("");
  const [pickedLocation, setPickedLocation] = useState({
    latitude: profile?.location?.latitude || 30.6139,
    longitude: profile?.location?.longitude || 70.209,
    address: profile?.location?.address || "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get-fee/direct`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fee = res.data.data?.fee;
        setPlatformFee(fee ?? 200);
      } catch (error) {
        console.error("Error fetching platform fee:", error);
        setPlatformFee(200);
      }
    };

    fetchPlatformFee();
  }, []);

  // Load Razorpay (unchanged)
  useEffect(() => {
    const razorpayScript = document.createElement("script");
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    razorpayScript.async = true;
    document.body.appendChild(razorpayScript);
    return () => {
      document.body.removeChild(razorpayScript);
    };
  }, [isMapModalOpen]);

  // handle image uploads (unchanged)
  const handleImageUpload = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const invalidFiles = selectedFiles.filter(
      (file) => !validTypes.includes(file.type) || file.size > maxSize
    );

    if (invalidFiles.length > 0) {
      setErrors({ images: "Only JPEG/PNG images up to 5MB are allowed." });
      return;
    }

    if (images.length + selectedFiles.length > 5) {
      setErrors({ images: "You can only upload up to 5 images." });
      return;
    }

    setErrors((prev) => ({ ...prev, images: "" }));
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required.";
    else if (title.length < 3) newErrors.title = "Min 3 characters are required for title.";
    else if (title.length > 30) newErrors.title = "Title cannot exceed 30 characters.";
    if (!description) newErrors.description = "Description is required.";
    else if (description?.length < 20) newErrors.description = "Min 20 character description is required.";
    else if (description.length > 250) newErrors.description = "Description cannot exceed 250 characters.";
    if (!deadline) newErrors.deadline = "Deadline is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    if (!validate()) {
      setIsSubmitting(false);
      return;
    }
    if (!id) {
      setErrors({ general: "Something went wrong with the provider ID." });
      setIsSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("first_provider_id", id);
      formData.append("title", title);
      formData.append("address", address || profile?.location?.address);
      formData.append("description", description);
      formData.append("deadline", deadline);
      formData.append("isShopVisited", isShopVisited);
      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await axios.post(`${BASE_URL}/direct-order/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { razorpay_order } = res.data;
      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
        amount: razorpay_order.amount,
        currency: "INR",
        name: "Bharat App",
        description: "Direct Hiring Payment",
        order_id: razorpay_order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${BASE_URL}/direct-order/verify-platform-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (verifyRes.status === 200) {
              navigate(`/my-hire/order-detail/${verifyRes.data?.order?._id}`);
            } else {
              setErrors({ general: "Payment verification failed." });
            }
          } catch (err) {
            setErrors({ general: "Error verifying payment." });
          }
        },
        theme: { color: "#228B22" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Failed to submit the form.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate(-1);

  const openMapModal = () => setIsMapModalOpen(true);
  const closeMapModal = () => setIsMapModalOpen(false);

  // When selecting an existing address from dropdown: update main location with that address
  const updateAddress = async (locationObj) => {
    try {
      const body = {
        location: {
          latitude: locationObj.latitude,
          longitude: locationObj.longitude,
          address: locationObj.address,
        },
        // not sending full_address here because we only want to update main location
      };
      await axios.post(`${BASE_URL}/user/updateUserProfile`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Set in UI immediately
      setAddress(locationObj.address);
      Swal.fire("Success", "Location updated", "success");
      // refresh to get latest full_address list from server (or you can dispatch redux action)
      window.location.reload();
    } catch (err) {
      console.error("Error updating location", err);
      Swal.fire("Error", "Failed to update location", "error");
    }
  };

  // Initialize modal map when add address modal opens
  useEffect(() => {
    if (!isAddAddressModalOpen) return;
    // reset if opening
    setModalMapInitialized(false);

    loadGoogleMapsScript(() => {
      try {
        // center map at profile location or default
        const defaultLat = profile?.location?.latitude ?? pickedLocation.latitude ?? 30.6139;
        const defaultLng = profile?.location?.longitude ?? pickedLocation.longitude ?? 70.2090;
        const center = new window.google.maps.LatLng(defaultLat, defaultLng);

        // create map
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
        });

        // geocoder
        geocoderRef.current = new window.google.maps.Geocoder();

        // marker
        markerRef.current = new window.google.maps.Marker({
          position: center,
          map,
          draggable: true,
        });

        // autocomplete for search input in modal
        const input = mapAutocompleteRef.current;
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          fields: ["geometry", "formatted_address"],
        });

        // when user selects from autocomplete
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;
          const loc = place.geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          const addr = place.formatted_address;
          markerRef.current.setPosition({ lat, lng });
          map.panTo({ lat, lng });
          setPickedLocation({ latitude: lat, longitude: lng, address: addr });
        });

        // when marker is dragged, reverse geocode to get address
        markerRef.current.addListener("dragend", async () => {
          const pos = markerRef.current.getPosition();
          if (!pos) return;
          const lat = pos.lat();
          const lng = pos.lng();
          const result = await geocodeLatLng(lat, lng);
          setPickedLocation({ latitude: lat, longitude: lng, address: result || "" });
        });

        // when map clicked, move marker & reverse geocode
        map.addListener("click", async (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          markerRef.current.setPosition({ lat, lng });
          const result = await geocodeLatLng(lat, lng);
          setPickedLocation({ latitude: lat, longitude: lng, address: result || "" });
        });

        setModalMapInitialized(true);
      } catch (err) {
        console.error("Google maps init error", err);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddAddressModalOpen]);

  const geocodeLatLng = (lat, lng) => {
    return new Promise((resolve) => {
      if (!geocoderRef.current) {
        geocoderRef.current = new window.google.maps.Geocoder();
      }
      geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve("");
        }
      });
    });
  };

  // Save new address (post to updateUserProfile; server should push into full_address and set location)
 const handleSaveNewAddress = async () => {
  if (!newTitle || !newHouseNo || !newPincode || !pickedLocation.address) {
    return Swal.fire(
      "Required",
      "Please fill required fields and pick a location on map",
      "warning"
    );
  }

  const newAddress = {
    latitude: pickedLocation.latitude,
    longitude: pickedLocation.longitude,
    address: pickedLocation.address,
    landmark: newLandmark || "",
    title: newTitle,
    houseno: newHouseNo,
    street: newStreet || "",
    area: newArea || "",
    pincode: newPincode,
  };

  const body = {
    location: {
      latitude: pickedLocation.latitude,
      longitude: pickedLocation.longitude,
      address: pickedLocation.address,
    },
    full_address: [newAddress], // backend will append
  };

  try {
    const res = await axios.post(`${BASE_URL}/user/updateUserProfile`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const allAddresses = res.data?.full_address || [];

    // 🔥 pick the last address -> newly added one
    const savedAddress = allAddresses[allAddresses.length - 1];

    if (savedAddress?._id) {
      // 🔥 Save in localStorage for header
      localStorage.setItem("selectedAddressId", savedAddress._id);
      localStorage.setItem("selectedAddressTitle", savedAddress.address);
    }

    Swal.fire("Success", "Address added and location updated", "success");
    setIsAddAddressModalOpen(false);

    // Reset modal inputs
    setNewTitle("");
    setNewHouseNo("");
    setNewStreet("");
    setNewArea("");
    setNewPincode("");
    setNewLandmark("");

    // UI instant update
    setAddress(newAddress.address);

    // Refresh profile globally
    dispatch(fetchUserProfile());

  } catch (err) {
    console.error("Error saving new address", err);
    Swal.fire("Error", "Failed to save address", "error");
  }
};



  return (
    <>
      <Header />
      <div className="w-full max-w-6xl mx-auto flex justify-start mt-4 mt-20 px-4">
        <button onClick={handleBack} className="text-[#228B22] text-sm hover:underline">
          &lt; Back
        </button>
      </div>

      <div className="min-h-screen flex justify-center py-10 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8 space-y-6" noValidate>
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Direct Hiring</h2>
          {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Title</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Title of work"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
              aria-invalid={errors.title ? "true" : "false"} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Description</span>
            <textarea rows={4} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base" aria-invalid={errors.description ? "true" : "false"} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </label>

          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Address</span>
              <button type="button" onClick={() => setIsAddAddressModalOpen(true)} className="text-sm text-[#228B22] underline">+ Add New Address</button>
            </div>

            <div className="relative">
              <input id="address-input" type="text" readOnly value={address || profile?.location?.address || ""} placeholder="Enter or select address"
                className="mt-1 block w-full rounded-lg border border-gray-300 pr-9 pl-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22]"
                aria-invalid={errors.address ? "true" : "false"} onClick={() => setShowOptions(!showOptions)} />

              <button type="button" onClick={() => setShowOptions(!showOptions)} className="absolute right-3 top-2 px-2 py-1 text-sm rounded-lg border bg-gray-100 hover:bg-gray-200">
                {showOptions ? "▲" : "▼"}
              </button>

              {showOptions && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg p-3 z-50 max-h-72 overflow-auto">
                  {profile?.full_address?.length ? (
                    profile.full_address.map((loc) => (
                      <label key={`${loc.latitude}-${loc.longitude}-${loc.address}`} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                        <input type="radio" name="address" value={loc.address}
                          checked={address ? address === loc.address : profile?.location?.address === loc.address}
                          onClick={() => {
                            setAddress(loc.address);
                            setShowOptions(false);
                            updateAddress(loc);
                          }} />

                        <div className="flex flex-col bg-gray-50 rounded-lg p-2 w-full">
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                            <div>
                              <span className="block font-semibold text-xs">Title</span>
                              <span className="text-[12px] text-gray-800">{loc.title}</span>
                            </div>

                            <div>
                              <span className="block font-semibold text-xs">House No</span>
                              <span className="text-gray-700 text-[12px]">{loc.houseno || "N/A"}</span>
                            </div>

                            <div>
                              <span className="block font-semibold text-xs">Area</span>
                              <span className="text-gray-700 text-[12px]">{loc.area || "N/A"}</span>
                            </div>

                            <div>
                              <span className="block font-semibold text-xs">Pincode</span>
                              <span className="text-gray-700 text-[12px]">{loc.pincode || "N/A"}</span>
                            </div>

                            <div className="col-span-2">
                              <span className="block font-semibold text-xs">Full Address</span>
                              <span className="text-gray-600 text-[12px]">{loc.address}</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No saved addresses. Add new address.</p>
                  )}
                </div>
              )}
            </div>

            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </label>

          <div className="block">
            <span className="text-sm font-medium text-gray-600">Do you want to go to shop?</span>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="isShopVisited" checked={isShopVisited === true} onChange={() => setIsShopVisited(true)} className="mr-2" />
                Yes
              </label>
              <label className="flex items-center">
                <input type="radio" name="isShopVisited" checked={isShopVisited === false} onChange={() => setIsShopVisited(false)} className="mr-2" />
                No
              </label>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Add Completion time</span>
            <div className="relative">
              <input id="deadline-input" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-base focus:border-[#228B22] focus:ring-[#228B22] cursor-pointer"
                aria-invalid={errors.deadline ? "true" : "false"} min={new Date().toISOString().slice(0, 16)}
                onClick={(e) => { e.preventDefault(); document.getElementById("deadline-input").showPicker?.(); }} />
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById("deadline-input").showPicker?.(); }} />
            </div>
            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
          </label>

          <div>
            <span className="text-sm font-medium text-gray-600">Upload Images (Optional, 5 Max)</span>
            <div className="border border-gray-300 rounded-lg p-6 text-center mb-4 bg-gray-50">
              <label className="cursor-pointer text-[#228B22] text-sm font-medium">Upload Image
                <input type="file" accept="image/jpeg,image/png,image/jpg" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-4 justify-start">
                {images.map((file, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(file)} alt={`Uploaded image ${index + 1}`} className="w-20 h-20 object-cover rounded-md border" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm" aria-label={`Remove image ${index + 1}`}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className={`w-full bg-[#228B22] text-white font-semibold py-3 rounded-lg text-lg transition-all shadow-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1e7a1e]"}`}>
            {isSubmitting ? "Submitting..." : "Hire"}
          </button>
        </form>
      </div>

      {/* Add Address Modal */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Address</h3>
              <button onClick={() => setIsAddAddressModalOpen(false)} className="text-red-600 font-semibold">Close</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* Left: Form */}
              <div className="flex flex-col gap-3 overflow-auto">
                <label className="block">
                  <span className="text-sm font-medium">Title *</span>
                  <input className="w-full border rounded-lg px-3 py-2 mt-1" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Home / Office" />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">House No. *</span>
                  <input className="w-full border rounded-lg px-3 py-2 mt-1" value={newHouseNo} onChange={(e) => setNewHouseNo(e.target.value)} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Street</span>
                  <input className="w-full border rounded-lg px-3 py-2 mt-1" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Area</span>
                  <input className="w-full border rounded-lg px-3 py-2 mt-1" value={newArea} onChange={(e) => setNewArea(e.target.value)} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Pincode *</span>
                  <input className="w-full border rounded-lg px-3 py-2 mt-1" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Landmark</span>
                  <input className="w-full border rounded-lg px-3 py-2 mt-1" value={newLandmark} onChange={(e) => setNewLandmark(e.target.value)} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Selected Address (from map) *</span>
                  <input readOnly className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100" value={pickedLocation.address || ""} />
                  <p className="text-xs text-gray-500 mt-1">Pick location on map or search using the box on right.</p>
                </label>

                <div className="flex gap-3 mt-auto">
                  <button onClick={() => setIsAddAddressModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                  <button onClick={handleSaveNewAddress} className="px-4 py-2 bg-[#228B22] text-white rounded-lg">Save Address</button>
                </div>
              </div>

              {/* Right: Map */}
              <div className="flex flex-col h-full">
                <input ref={mapAutocompleteRef} id="add-map-autocomplete" type="text" placeholder="Search for an address" className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-3" />
                <div ref={mapRef} className="w-full h-full rounded-lg border border-gray-300" />
                <p className="text-xs text-gray-500 mt-2">You can drag the marker or click on the map to pick location. The selected address will be reverse-geocoded automatically.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* (Optional) existing small map modal you had earlier */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Address on Map</h3>
              <button onClick={closeMapModal} className="text-red-600 font-semibold">Close</button>
            </div>
            <input id="map-autocomplete-input" type="text" placeholder="Search for an address" className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-4" />
            <div ref={mapRef} className="w-full h-full rounded-lg border border-gray-300" />
            <button onClick={closeMapModal} className="mt-4 bg-[#228B22] text-white font-semibold py-2 rounded-lg">Confirm Address</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DirectHiring;
