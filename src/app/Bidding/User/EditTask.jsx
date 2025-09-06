import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Arrow from "../../../assets/profile/arrow_back.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calender from "../../../assets/bidding/calender.png";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";


const libraries = ["places"];

export default function BiddingEditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategories: [],
    location: "",
    googleAddress: "",
    description: "",
    cost: "",
    deadline: "",
    images: [], // For new uploads
    existingImages: [], // For already uploaded images
  });

  const [errors, setErrors] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapFor, setMapFor] = useState("location"); // "location" or "address"
  const [markerLocationGPS, setMarkerLocationGPS] = useState(null);
  const [markerLocationAddress, setMarkerLocationAddress] = useState(null);
  const [tempAddress, setTempAddress] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });
  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const autoCompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4",
    libraries,
  });

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        const res = await fetch(
          "https://api.thebharatworks.com/api/work-category",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) {
          setCategories(
            (data.data || []).map((cat) => ({ value: cat._id, label: cat.name }))
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
  }, []);

  // 🔹 Fetch task details by ID and autopopulate
 
  useEffect(() => {
    const fetchTaskById = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        const res = await fetch(
          `https://api.thebharatworks.com/api/bidding-order/getBiddingOrderById/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && data.status) {
          const task = data.data;
          

          // Set form fields
          setFormData((prev) => ({
            ...prev,
            title: task.title,
            category: task.category_id?._id || "",
            subCategories: task.sub_category_ids?.map((s) => s._id) || [],
            googleAddress: task.google_address || "",
            location: `${task.latitude || ""},${task.longitude || ""}`,
            description: task.description || "",
            cost: task.cost || "",
            deadline: task.deadline ? task.deadline.split("T")[0] : "",
            images:  [], // New uploads
            existingImages: task.image_url || [], // Existing uploaded images
          }));

          // Set map marker
          if (task.latitude && task.longitude) {
            const loc = { lat: task.latitude, lng: task.longitude };
            setMarkerLocationGPS(loc);
            setCurrentLocation(loc);
          }

          setTempAddress({
            address: task.google_address || "",
            latitude: task.latitude || null,
            longitude: task.longitude || null,
          });

          // Fetch subcategories for selected category
          if (task.category_id?._id) {
            const resSub = await fetch(
              `https://api.thebharatworks.com/api/subcategories/${task.category_id._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const subData = await resSub.json();
            if (resSub.ok) {
              setSubcategories(
                (subData.data || []).map((sub) => ({ value: sub._id, label: sub.name }))
              );
            }
          }
        } else {
          toast.error(data.message || "Failed to fetch task details");
        }
      } catch (error) {
        console.error(error);
        toast.error("Server error while fetching task details");
      }
    };
    fetchTaskById();
  }, [id]);

  const handleCategoryChange = async (selected) => {
    const selectedCatId = selected?.value || "";
    setFormData({ ...formData, category: selectedCatId, subCategories: [] });

    if (!selectedCatId) return setSubcategories([]);

    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(
        `https://api.thebharatworks.com/api/subcategories/${selectedCatId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const uniqueFiles = files.filter(
      (file) => !formData.images.some((f) => f.name === file.name && f.size === file.size)
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
  };

  const getAddressFromLatLng = (lat, lng) => {
    if (!isLoaded) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        setFormData((prev) => ({
          ...prev,
          googleAddress: address,
          location: `${lat},${lng}`,
        }));
        setTempAddress({ address, latitude: lat, longitude: lng });
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

  const defaultCenter =
    markerLocationGPS || markerLocationAddress || currentLocation || { lat: 28.6139, lng: 77.209 };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Frontend Validation
    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.category) return toast.error("Category is required");
    if (!formData.subCategories || formData.subCategories.length === 0)
      return toast.error("Please select at least one sub-category");
    if (!formData.googleAddress.trim()) return toast.error("Address is required");
    if (!formData.description.trim()) return toast.error("Description is required");
    if (!formData.cost || isNaN(formData.cost)) return toast.error("Valid cost is required");
    if (!formData.deadline) return toast.error("Deadline is required");
    else if (isNaN(new Date(formData.deadline).getTime()))
      return toast.error("Please provide a valid deadline date");

    try {
      const token = localStorage.getItem("bharat_token");
      const data = new FormData();
      
      data.append("title", formData.title);
      data.append("order_id",id);
      data.append("category_id", formData.category);
      data.append("sub_category_ids", formData.subCategories.join(","));
      data.append("address", formData.googleAddress);
      data.append("google_address", formData.googleAddress);
      data.append("description", formData.description);
      data.append("cost", formData.cost);
      data.append("deadline", formData.deadline);

      // Append new images
      formData.images.forEach((file) => {
        data.append("images", file);
      });

      // Append IDs of existing images to keep them
      data.append("existing_images", JSON.stringify(formData.existingImages));

      const res = await fetch(
        `https://api.thebharatworks.com/api/bidding-order/edit`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      const resData = await res.json();
      if (res.ok) {
        toast.success("Bidding Task updated successfully");
        setTimeout(() => {
          navigate("/bidding/myhire");
        }, 2000);
      } else {
        toast.error(resData.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again later");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-4">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold cursor-pointer"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="back" />
          Back
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        {/* ===== FORM START ===== */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-center w-full max-w-lg sm:max-w-xl lg:max-w-[72rem] shadow">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[51rem] p-8 space-y-6 ml-[155px]"
          >
            <h2 className="text-[30px] font-[700] text-center mb-6 text-[#191A1D]">
              Edit Task
            </h2>

            {/* Title */}
            <div>
              <label className="block text-[17px] font-[500] mb-1">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter title of work"
                value={formData.title}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-3 py-2"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Category</label>
              <Select
                options={categories}
                value={categories.find((c) => c.value === formData.category)}
                onChange={handleCategoryChange}
                placeholder="Search or select category..."
                isClearable
                className="border-2 rounded-lg"
              />
            </div>

            {/* Subcategories */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Subcategories</label>
              <Select
                options={subcategories}
                value={subcategories.filter((s) =>
                  formData.subCategories.includes(s.value)
                )}
                onChange={handleSubcategoryChange}
                isMulti
                placeholder="Search or select subcategories..."
                isDisabled={!formData.category}
                className="border-2 rounded-lg"
              />
            </div>

            {/* Google Address */}
            <div>
              <label className="block text-[17px] font-[500] mb-1">Google Address</label>
              <input
                type="text"
                placeholder="Click to select location"
                value={formData.googleAddress}
                readOnly
                onClick={() => setIsMapOpen(true)}
                className="w-full border-2 rounded-lg px-3 py-2 cursor-pointer"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[17px] font-[500] mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Describe your task"
                value={formData.description}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-3 py-2"
              />
            </div>

            {/* Cost */}
            <div>
              <label className="block text-[17px] font-[500] mb-1">Cost</label>
              <input
                type="number"
                name="cost"
                placeholder="Enter cost in INR"
                value={formData.cost}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-3 py-2"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-[17px] font-[500] text-[#191A1D] mb-1 text-left">
                Add Deadline
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src={Calender} alt="" className="w-5 h-5" />
                </div>

                <ReactDatePicker
                  selected={formData.deadline ? new Date(formData.deadline) : null}
                  onChange={(date) =>
                    setFormData({ ...formData, deadline: date.toISOString().split("T")[0] })
                  }
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select deadline"
                  className="w-[754px] border-2 border-[#777777] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-[#777777] rounded-xl p-6 text-center">
              <label className="cursor-pointer flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-[#228B22] mb-2"
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
                <span className="text-[#000000] font-medium">Upload Work Photo</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <button
                  className="p-[2px] border border-[#228B22] rounded-[10px] w-[93px] mt-[13px] text-[#228B22] font-[500]"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('input[type="file"]').click();
                  }}
                >
                  Upload
                </button>
              </label>

              {/* Preview Existing Images */}
              

              {/* Preview New Images */}
              
            </div>
{formData.existingImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {formData.existingImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            existingImages: formData.existingImages.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
               {formData.images.length > 0 && (
                
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                    <span className="text-center">New Images</span>
                  {formData.images.map((img, index) => (
                    
                    <div key={index} className="relative">
                        
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index),
                          });
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                className="bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition duration-200"
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
        {/* ===== FORM END ===== */}
      </div>

      {/* ===== MAP MODAL ===== */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div>
            <button
              onClick={() => setIsMapOpen(false)}
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
            >
              &times;
            </button>
            {isLoaded && (
              <div className="bg-white p-4 rounded-2xl shadow-lg w-[90%] max-w-lg">
            <div className="flex justify-between mb-2">
              <h1 className="text-black text-[20px] font-semibold">Select Location</h1>
              
              <button onClick={() => setIsMapOpen(false)} className="text-red-500 font-bold">
                X
              </button>
            </div>
{tempAddress.address && (
  <p className="mb-2 text-sm text-gray-700">
   <span className="font-semibold">{tempAddress.address}</span>
  </p>
)}

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
            )}
           
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
