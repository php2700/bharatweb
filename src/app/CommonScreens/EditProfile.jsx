import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Arrow from "../../assets/profile/arrow_back.svg";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const libraries = ["places"];

export default function EditProfile() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const location = useLocation();
  const { activeTab } = location.state || { activeTab: "user" };
  const fileInputRef = useRef(null);
  const autoCompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: [],
    about: "",
    documents: [], // Changed to array to store multiple documents
    age: '',
    gender: '',
    // willingToVisit: "", // For user tab
    // willingToCallCustomer: "", // For worker tab
    // shopAddress: { title: "", landmark: "", address: "", latitude: null, longitude: null },
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState([]); // Changed to array for multiple previews
  const [profilePic, setProfilePic] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [shopAddressModalOpen, setShopAddressModalOpen] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4",
    libraries,
  });

  // Fetch profile initially
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Prefill formData and document previews when profile loads
  useEffect(() => {
    if (profile && profile.data) {
      setFormData((prev) => ({
        ...prev,
        name: profile.data.full_name || "",
        about: profile.data.skill || "",
        category: profile.data.category_id || "",
        subcategory: profile.data.subcategory_ids || [],
        age: profile.data.age || '',
        gender: profile.data.gender || '',
        // willingToVisit: profile.data.willing_to_visit || "",
        // willingToCallCustomer: profile.data.willing_to_call_customer || "",
        // shopAddress: profile.data.shop_address || { title: "", landmark: "", address: "", latitude: null, longitude: null },
        documents: [], // Initialize as empty; server documents handled below
      }));

      // Document previews (multiple documents)
      if (profile.data.documents) {
        const docs = Array.isArray(profile.data.documents) 
          ? profile.data.documents.map(doc => doc.url).filter(url => url) 
          : [profile.data.documents].filter(url => url);
        setDocumentPreviews(docs);
      }

      // Profile picture
      if (profile.data.profilePic) {
        setProfilePic(profile.data.profilePic);
      }

      // Fetch subcategories for prefill
      if (profile.data.category_id) {
        const fetchSubcategories = async () => {
          try {
            const token = localStorage.getItem("bharat_token");
            const res = await fetch(
              `${BASE_URL}/subcategories/${profile.data.category_id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (res.ok) {
              setSubcategories(
                (data.data || []).map((sub) => ({
                  value: sub._id,
                  label: sub.name,
                }))
              );
            }
          } catch (error) {
            console.error("Error fetching subcategories:", error);
          }
        };
        fetchSubcategories();
      }
    }
  }, [profile]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
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
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle category change
  const handleCategoryChange = async (selected) => {
    const selectedCatId = selected?.value || "";
    setFormData({ ...formData, category: selectedCatId, subcategory: [] });

    if (!selectedCatId) return setSubcategories([]);

    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/subcategories/${selectedCatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSubcategories(
          (data.data || []).map((sub) => ({ value: sub._id, label: sub.name }))
        );
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      subcategory: selectedOptions ? selectedOptions.map((s) => s.value) : [],
    });
  };

  const getAddressFromLatLng = (lat, lng) => {
    if (!isLoaded) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        setFormData((prev) => ({
          ...prev,
          shopAddress: { ...prev.shopAddress, address, latitude: lat, longitude: lng },
        }));
        setMarkerLocation({ lat, lng });
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentLocation(loc);
          setMarkerLocation(loc);
          getAddressFromLatLng(loc.lat, loc.lng);
          if (map) map.panTo(loc);
        },
        () => toast.error("Unable to fetch current location")
      );
    } else {
      toast.error("Geolocation not supported by browser");
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
        setMarkerLocation(loc);
        getAddressFromLatLng(lat, lng);
        if (map) map.panTo(loc);
      }
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerLocation({ lat, lng });
    getAddressFromLatLng(lat, lng);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "documents" && files) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/avif",
        "image/gif",
      ];
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(file => allowedTypes.includes(file.type));
      
      if (newFiles.length > 5 || (formData.documents.length + newFiles.length) > 5) {
        toast.error("You can upload a maximum of 5 documents!");
        return;
      }

      if (newFiles.length !== validFiles.length) {
        toast.error("Only PDF or image files are allowed!");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...validFiles],
      }));
      setDocumentPreviews((prev) => [
        ...prev,
        ...validFiles.map(file => URL.createObjectURL(file)),
      ]);
      return;
    }

    if (name.startsWith("shopAddress.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        shopAddress: { ...prev.shopAddress, [field]: value },
      }));
      return;
    }

    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // Trigger hidden file input for profile pic
  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  // Update profile picture
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG/PNG images are allowed for profile picture!");
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      const fd = new FormData();
      fd.append("profilePic", file);

      const res = await fetch(`${BASE_URL}/user/updateProfilePic`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update profile pic.");
        return;
      }

      setProfilePic(URL.createObjectURL(file)); // Update preview
      toast.success("Profile picture updated successfully!");
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error("Error updating profile pic:", error);
      toast.error("Something went wrong!");
    }
  };
   console.log("form", formData);
  // Remove document
  const handleRemoveDocument = async (index, url) => {
    // If document is a new upload (not yet saved to server)
    if (url.startsWith('blob:')) {
      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.filter((_, i) => i !== index),
      }));
      setDocumentPreviews((prev) => prev.filter((_, i) => i !== index));
      toast.success("Document removed successfully!");
      return;
    }

    // If document is from server, call API to remove
    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/user/deleteHisworkImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imagePath: url }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to remove document.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.filter((_, i) => i !== index),
      }));
      setDocumentPreviews((prev) => prev.filter((_, i) => i !== index));
      toast.success("Document removed successfully!");
      dispatch(fetchUserProfile()); // Refresh profile data
    } catch (error) {
      console.error("Error removing document:", error);
      toast.error("Something went wrong while removing the document!");
    }
  };

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Name is required!");
    // if (!formData.about.trim() && activeTab !== "user")
    //   return toast.error("Skill is required!");
    // if (activeTab === "user" && !formData.willingToVisit)
    //   return toast.error("Please select if you are willing to visit the service provider's shop!");
    // if (activeTab === "worker" && !formData.willingToCallCustomer)
    //   return toast.error("Please select if you are willing to call the customer to your shop!");
    // if (activeTab === "worker" && formData.willingToCallCustomer === "yes" && !formData.shopAddress.address)
    //   return toast.error("Shop address is required!");

    try {
      const token = localStorage.getItem("bharat_token");

      if (activeTab === "worker") {
        if (!formData.category) return toast.error("Category is required!");
        if (!formData.subcategory.length)
          return toast.error("Select at least one subcategory!");
        if (!formData.age) return toast.error("Age is required!");
        const fd = new FormData();
        formData.documents.forEach((doc, index) => {
          fd.append(`document`, doc);
        });
        fd.append("category_id", formData.category);
        fd.append("subcategory_ids", JSON.stringify(formData.subcategory));
        fd.append("skill", formData.about);
        fd.append("age", formData.age);
        fd.append("gender", formData.gender);
        // fd.append("willing_to_call_customer", formData.willingToCallCustomer);
        // if (formData.willingToCallCustomer === "yes") {
        //   fd.append("shop_address", JSON.stringify(formData.shopAddress));
        // }

        const res = await fetch(`${BASE_URL}/user/updateUserDetails`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const data = await res.json();
        if (!res.ok)
          return toast.error(data.message || "Failed to update worker profile.");

        // Update name
        const payload = { full_name: formData.name };
        const resName = await fetch(`${BASE_URL}/user/updateUserProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const dataName = await resName.json();
        if (!resName.ok)
          return toast.error(dataName.message || "Failed to update name.");

        toast.success("Worker profile updated successfully!");
        setTimeout(() => {
          navigate("/details");
        }, 2000);
      }

      if (activeTab === "user") {
        const payload = {
          full_name: formData.name,
          skill: formData.about,
          // willing_to_visit: formData.willingToVisit,
        };
        const res = await fetch(`${BASE_URL}/user/updateUserProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok)
          return toast.error(data.message || "Failed to update user profile.");

        toast.success("User profile updated successfully!");
        setTimeout(() => {
          navigate("/details");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  const defaultCenter = markerLocation || currentLocation || { lat: 28.6139, lng: 77.209 };

  return (
    <>
      <Header />
      <div className="mt-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-700 mb-4 hover:underline"
        >
          <img src={Arrow} className="w-6 h-6 ml-10" alt="Back arrow" />
          Back
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-[50rem] mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {activeTab === "worker" ? "Get your profile verified" : "Update User Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              onInput={(e) => {
                if (e.target.value.length > 2) {
                  e.target.value = e.target.value.slice(0, 2); // max 2 digits
                }
              }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Willing to Visit (User Tab Only) */}
          {activeTab === "user" && (
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Are you willing to go to the service provider's shop?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="willingToVisit"
                    value="yes"
                    checked={formData.willingToVisit === "yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="willingToVisit"
                    value="no"
                    checked={formData.willingToVisit === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          )}

          {/* Worker Fields */}
          {activeTab === "worker" && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Are you willing to call the customer to your shop?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="willingToCallCustomer"
                      value="yes"
                      checked={formData.willingToCallCustomer === "yes"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="willingToCallCustomer"
                      value="no"
                      checked={formData.willingToCallCustomer === "no"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.willingToCallCustomer === "yes" && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Shop Address
                  </label>
                  <input
                    type="text"
                    placeholder="Click to enter shop address"
                    value={formData.shopAddress.address}
                    readOnly
                    onClick={() => setShopAddressModalOpen(true)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Category
                </label>
                <Select
                  options={categories}
                  value={categories.find((c) => c.value === formData.category)}
                  onChange={handleCategoryChange}
                  placeholder="Search or select category..."
                  isClearable
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Subcategory
                </label>
                <Select
                  options={subcategories}
                  value={subcategories.filter((s) =>
                    formData.subcategory.includes(s.value)
                  )}
                  onChange={handleSubcategoryChange}
                  isMulti
                  placeholder="Search or select subcategories..."
                  isDisabled={!formData.category}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Upload Documents (Up to 5)
                </label>
                <label className="w-full flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                  <span className="text-gray-700">
                    {formData.documents.length > 0 
                      ? `${formData.documents.length} file(s) selected`
                      : "Choose files"}
                  </span>
                  <input
                    type="file"
                    name="documents"
                    onChange={handleChange}
                    className="hidden"
                    multiple
                    accept="application/pdf,image/jpeg,image/png,image/avif,image/gif"
                  />
                </label>
                <p className="text-base font-medium text-gray-700 mt-1">
                  (Allowed Documents: Driving License, PAN Card, Aadhaar, Passport, or
                  any Govt. ID (PDF / Image). Max 5 files.)
                </p>

                {/* Document previews */}
                {documentPreviews.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Document Previews
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 mt-2">
                      {documentPreviews.map((preview, index) => (
                        <div key={index} className="relative w-32 h-32">
                          <img
                            src={preview}
                            alt={`Document Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(index, preview)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                            aria-label={`Remove document ${index + 1}`}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* About Skill */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              About My Skill
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Describe your skill..."
              maxLength={500}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
              rows="4"
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              {formData.about.length}/500 characters
            </p>
          </div>

          <button
            type="submit"
            className="w-64 lg:w-72 mx-auto bg-[#228b22] text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition shadow-md hover:shadow-lg block"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Shop Address Modal */}
      {shopAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Enter Shop Address Details</h2>
            <input
              type="text"
              placeholder="Title"
              name="shopAddress.title"
              value={formData.shopAddress.title}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3"
            />
            <input
              type="text"
              placeholder="Landmark"
              name="shopAddress.landmark"
              value={formData.shopAddress.landmark}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3"
            />
            <input
              type="text"
              placeholder="Click to select on map"
              name="shopAddress.address"
              value={formData.shopAddress.address}
              readOnly
              onClick={() => setIsMapOpen(true)}
              className="w-full border-2 border-gray-300 rounded-lg p-2 mb-3 cursor-pointer"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShopAddressModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setShopAddressModalOpen(false)}
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
                Select Shop Address
              </h1>
              <button onClick={() => setIsMapOpen(false)} className="text-red-500 font-bold">
                X
              </button>
            </div>

            <p className="text-center mb-2 text-sm text-gray-600">
              {formData.shopAddress.address || "Not selected"}
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
              {markerLocation && <Marker position={markerLocation} />}
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

      <Footer />
    </>
  );
}