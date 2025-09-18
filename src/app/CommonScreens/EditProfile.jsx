import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, clearUserProfile } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Arrow from "../../assets/profile/arrow_back.svg";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";

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
  const role = localStorage.getItem("role");
  const fileInputRef = useRef(null);
  const autoCompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: [],
    about: "",
    documents: [], // Array of { documentName: string, images: [File or URL] }
    age: "",
    gender: "",
    address: "",
    full_address: [],
    customDocName: "",
    willingToVisitShop: "", // For user role
    hasShop: "", // For worker role
    shopAddress: "", // For worker role when hasShop is "yes"
    shopFullAddress: [], // For worker role to store shop address details
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapFor, setMapFor] = useState("address"); // "address" or "shopAddress"
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markerLocationAddress, setMarkerLocationAddress] = useState(null);
  const [markerLocationShop, setMarkerLocationShop] = useState(null);
  const [map, setMap] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    title: "",
    landmark: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [selectedDocType, setSelectedDocType] = useState("");
  const [showCustomDocInput, setShowCustomDocInput] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4",
    libraries,
  });

  const docTypeOptions = [
    { value: "aadharCard", label: "Aadhaar Card" },
    { value: "panCard", label: "PAN Card" },
    { value: "passport", label: "Passport" },
    { value: "drivingLicense", label: "Driving License" },
    { value: "other", label: "Any Other Government ID Proof" },
  ];

  const handleUnauthorized = () => {
    console.log("handleUnauthorized: Clearing localStorage and redirecting to login");
    localStorage.removeItem("bharat_token");
    localStorage.removeItem("isProfileComplete");
    localStorage.removeItem("role");
    localStorage.removeItem("otp");
    localStorage.removeItem("selectedAddressId");
    dispatch(clearUserProfile());
    toast.error("Session expired, please log in again", { toastId: "unauthorized" });
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("bharat_token");
    if (token && token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
      dispatch(fetchUserProfile()).then((result) => {
        if (fetchUserProfile.rejected.match(result)) {
          toast.error(result.payload || "Failed to fetch user profile", { toastId: "fetchProfileError" });
          if (result.payload === "Session expired, please log in again") {
            handleUnauthorized();
          }
        }
      });
    } else {
      console.log("useEffect: No valid token, redirecting to login");
      handleUnauthorized();
    }
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const selectedAddressIndex = parseInt(localStorage.getItem("selectedAddressId")) || 0;
      const selectedAddress = profile.full_address?.[selectedAddressIndex] || {};

      // Process documents: Extract URLs from profile.documents[i].images and documentNames
      const validDocuments = [];
      const validPreviews = [];
      (profile.documents || []).forEach((doc) => {
        if (doc && Array.isArray(doc.images)) {
          doc.images.forEach((image) => {
            if (typeof image === "string" && image.trim() && !["null", "undefined"].includes(image.toLowerCase())) {
              validDocuments.push({ documentName: doc.documentName || "unknown", images: [image] });
              validPreviews.push(image);
            }
          });
        }
      });

      console.log("Profile documents:", profile.documents);

      // Map isShop to hasShop and businessAddress to shopAddress/shopFullAddress
      const hasShop = profile.isShop ? "yes" : "no";
      const shopAddress = profile.businessAddress?.address || "";
      const shopFullAddress = profile.businessAddress?.address
        ? [{
            title: "Shop",
            landmark: "",
            address: profile.businessAddress.address,
            latitude: profile.businessAddress.latitude,
            longitude: profile.businessAddress.longitude,
          }]
        : [];

      setFormData((prev) => ({
        ...prev,
        name: profile.full_name || "",
        about: profile.skill || "",
        category: profile.category_id || "",
        subcategory: profile.subcategory_ids || [],
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        address: selectedAddress.address || "",
        full_address: profile.full_address || [],
        documents: validDocuments,
        willingToVisitShop: profile.willingToVisitShop || "",
        hasShop,
        shopAddress,
        shopFullAddress,
      }));
      console.log("form",formData);
      // Set document previews
      setDocumentPreviews(validPreviews);

      if (profile.profilePic) {
        setProfilePic(profile.profilePic);
      }

      if (profile.category_id) {
        const fetchSubcategories = async () => {
          try {
            const token = localStorage.getItem("bharat_token");
            if (!token) {
              console.log("fetchSubcategories: No token, redirecting to login");
              handleUnauthorized();
              return;
            }
            const res = await fetch(`${BASE_URL}/subcategories/${profile.category_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
              setSubcategories(
                (data.data || []).map((sub) => ({
                  value: sub._id,
                  label: sub.name,
                }))
              );
            } else if (res.status === 401) {
              console.log("fetchSubcategories: 401 Unauthorized, redirecting to login");
              handleUnauthorized();
            }
          } catch (error) {
            console.error("Error fetching subcategories:", error);
            toast.error("Failed to fetch subcategories", { toastId: "fetchSubcategoriesError" });
          }
        };
        fetchSubcategories();
      }
    }
  }, [profile]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) {
          console.log("fetchCategories: No token, redirecting to login");
          handleUnauthorized();
          return;
        }
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
        } else if (res.status === 401) {
          console.log("fetchCategories: 401 Unauthorized, redirecting to login");
          handleUnauthorized();
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories", { toastId: "fetchCategoriesError" });
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (selected) => {
    const selectedCatId = selected?.value || "";
    setFormData({ ...formData, category: selectedCatId, subcategory: [] });

    if (!selectedCatId) return setSubcategories([]);

    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        console.log("handleCategoryChange: No token, redirecting to login");
        handleUnauthorized();
        return;
      }
      const res = await fetch(`${BASE_URL}/subcategories/${selectedCatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSubcategories(
          (data.data || []).map((sub) => ({ value: sub._id, label: sub.name }))
        );
      } else if (res.status === 401) {
        console.log("handleCategoryChange: 401 Unauthorized, redirecting to login");
        handleUnauthorized();
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories", { toastId: "fetchSubcategoriesError" });
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
        if (mapFor === "address") {
          setFormData((prev) => ({ ...prev, address }));
          setTempAddress((prev) => ({
            ...prev,
            address,
            latitude: lat,
            longitude: lng,
          }));
          setMarkerLocationAddress({ lat, lng });
        } else if (mapFor === "shopAddress") {
          setFormData((prev) => ({ ...prev, shopAddress: address }));
          setTempAddress((prev) => ({
            ...prev,
            address,
            latitude: lat,
            longitude: lng,
          }));
          setMarkerLocationShop({ lat, lng });
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
          if (mapFor === "address") setMarkerLocationAddress(loc);
          else if (mapFor === "shopAddress") setMarkerLocationShop(loc);
          getAddressFromLatLng(loc.lat, loc.lng);
          if (map) map.panTo(loc);
        },
        () => toast.error("Unable to fetch current location", { toastId: "geolocationError" })
      );
    } else {
      toast.error("Geolocation not supported by browser", { toastId: "geolocationSupportError" });
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
        if (mapFor === "address") setMarkerLocationAddress(loc);
        else if (mapFor === "shopAddress") setMarkerLocationShop(loc);
        getAddressFromLatLng(lat, lng);
        if (map) map.panTo(loc);
      }
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    if (mapFor === "address") setMarkerLocationAddress({ lat, lng });
    else if (mapFor === "shopAddress") setMarkerLocationShop({ lat, lng });
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
      const validFiles = newFiles.filter((file) => allowedTypes.includes(file.type));

      if (newFiles.length > 5 || formData.documents.length + newFiles.length > 5) {
        toast.error("You can upload a maximum of 5 documents!", { toastId: "maxDocumentsError" });
        return;
      }

      if (newFiles.length !== validFiles.length) {
        toast.error("Only PDF or image files are allowed!", { toastId: "fileTypeError" });
        return;
      }

      if (!selectedDocType) {
        toast.error("Please select a document type before uploading!", { toastId: "docTypeError" });
        return;
      }

      if (selectedDocType === "other" && !formData.customDocName.trim()) {
        toast.error("Please enter the name of the government ID!", { toastId: "customDocNameError" });
        return;
      }

      const docType = selectedDocType === "other" ? formData.customDocName : selectedDocType;

      // Structure documents as [{ documentName, images: [File] }]
      const newDocs = validFiles.map((file) => ({
        documentName: docType,
        images: [file],
      }));

      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newDocs],
      }));
      setDocumentPreviews((prev) => [
        ...prev,
        ...validFiles.map((file) => URL.createObjectURL(file)),
      ]);
      setSelectedDocType("");
      setShowCustomDocInput(false);
      setFormData((prev) => ({ ...prev, customDocName: "" }));
      return;
    }

    if (name === "customDocName") {
      setFormData({ ...formData, customDocName: value });
      return;
    }

    if (name === "hasShop" && value === "no") {
      setFormData((prev) => ({
        ...prev,
        hasShop: value,
        shopAddress: "",
        shopFullAddress: [],
      }));
      return;
    }

    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleDocTypeChange = (selected) => {
    const docType = selected?.value || "";
    setSelectedDocType(docType);
    setShowCustomDocInput(docType === "other");
    if (docType !== "other") {
      setFormData((prev) => ({ ...prev, customDocName: "" }));
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG/PNG images are allowed for profile picture!", { toastId: "profilePicTypeError" });
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        console.log("handleProfilePicChange: No token, redirecting to login");
        handleUnauthorized();
        return;
      }
      const formData = new FormData();
      formData.append("profilePic", file);
      const res = await fetch(`${BASE_URL}/user/updateProfilePic`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          console.log("handleProfilePicChange: 401 Unauthorized, redirecting to login");
          handleUnauthorized();
          return;
        }
        toast.error(data.message || "Failed to update profile pic.", { toastId: "updateProfilePicError" });
        return;
      }

      setProfilePic(URL.createObjectURL(file));
      toast.success("Profile picture updated successfully!", { toastId: "updateProfilePicSuccess" });
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error("Error updating profile pic:", error);
      toast.error("Something went wrong!", { toastId: "updateProfilePicGeneralError" });
    }
  };

  const handleRemoveDocument = async (index, url) => {
    try {
      console.log("handleRemoveDocument: Attempting to remove document at index", index, "with URL:", url);

      // Validate index and URL
      if (index < 0 || index >= formData.documents.length || index >= documentPreviews.length) {
        console.error("Invalid index:", index, "Documents length:", formData.documents.length, "Previews length:", documentPreviews.length);
        toast.error("Invalid document index!", { toastId: "invalidIndexError" });
        return;
      }

      if (!url || typeof url !== "string") {
        console.error("Invalid URL:", url);
        // Remove invalid document from all arrays
        const updatedDocs = formData.documents.filter((_, i) => i !== index);
        const updatedPreviews = documentPreviews.filter((_, i) => i !== index);

        setFormData((prev) => ({
          ...prev,
          documents: updatedDocs,
        }));
        setDocumentPreviews(updatedPreviews);

        toast.error("Removed invalid document!", { toastId: "invalidDocumentRemoved" });
        return;
      }

      let updatedDocs = [...formData.documents];
      let updatedPreviews = [...documentPreviews];

      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
        updatedDocs = updatedDocs.filter((_, i) => i !== index);
        updatedPreviews = updatedPreviews.filter((_, i) => i !== index);
      } else {
        const token = localStorage.getItem("bharat_token");
        if (!token) {
          console.log("handleRemoveDocument: No token, redirecting to login");
          handleUnauthorized();
          return;
        }

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
          if (res.status === 401) {
            console.log("handleRemoveDocument: 401 Unauthorized, redirecting to login");
            handleUnauthorized();
            return;
          }
          console.error("Server error removing document:", data.message);
          toast.error(data.message || "Failed to remove document.", { toastId: "removeDocumentError" });
          return;
        }

        updatedDocs = updatedDocs.filter((_, i) => i !== index);
        updatedPreviews = updatedPreviews.filter((_, i) => i !== index);
      }

      setFormData((prev) => ({
        ...prev,
        documents: updatedDocs,
      }));
      setDocumentPreviews(updatedPreviews);

      toast.success("Document removed successfully!", { toastId: "removeDocumentSuccess" });
    } catch (error) {
      console.error("Error removing document:", error);
      toast.error("Something went wrong while removing the document!", { toastId: "removeDocumentGeneralError" });
    }
  };

  const handleSaveAddress = () => {
    if (
      !tempAddress.title.trim() ||
      !tempAddress.landmark.trim() ||
      !tempAddress.address.trim()
    ) {
      toast.error("Please fill in all address fields: Title, Landmark, and Address.", { toastId: "saveAddressError" });
      return;
    }

    if (mapFor === "address") {
      setFormData((prev) => ({
        ...prev,
        address: tempAddress.address,
        full_address: [
          ...prev.full_address,
          {
            title: tempAddress.title,
            landmark: tempAddress.landmark,
            address: tempAddress.address,
            latitude: tempAddress.latitude,
            longitude: tempAddress.longitude,
          },
        ],
      }));
    } else if (mapFor === "shopAddress") {
      setFormData((prev) => ({
        ...prev,
        shopAddress: tempAddress.address,
        shopFullAddress: [
          {
            title: tempAddress.title,
            landmark: tempAddress.landmark,
            address: tempAddress.address,
            latitude: tempAddress.latitude,
            longitude: tempAddress.longitude,
          },
        ],
      }));
    }
    setAddressModalOpen(false);
    setTempAddress({
      title: "",
      landmark: "",
      address: "",
      latitude: null,
      longitude: null,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate required fields
  if (!formData.name.trim()) return toast.error("Name is required!", { toastId: "nameRequiredError" });
  if (!formData.age) return toast.error("Age is required!", { toastId: "ageRequiredError" });
  if (!formData.gender) return toast.error("Gender is required!", { toastId: "genderRequiredError" });
  if (!formData.address.trim()) return toast.error("Address is required!", { toastId: "addressRequiredError" });
  if (activeTab === "user" && !formData.willingToVisitShop) {
    return toast.error("Please select if you are willing to visit the shop!", { toastId: "willingToVisitShopError" });
  }
  if (activeTab === "worker") {
    if (!formData.category) return toast.error("Category is required!", { toastId: "categoryRequiredError" });
    if (!formData.subcategory.length) return toast.error("Select at least one subcategory!", { toastId: "subcategoryRequiredError" });
    if (!formData.documents.length) return toast.error("At least one document is required for worker profile!", { toastId: "documentsRequiredError" });
    if (!formData.hasShop) return toast.error("Please select if you have a shop!", { toastId: "hasShopError" });
    if (formData.hasShop === "yes" && !formData.shopAddress.trim()) {
      return toast.error("Shop address is required if you have a shop!", { toastId: "shopAddressError" });
    }
  }

  try {
    const token = localStorage.getItem("bharat_token");
    if (!token) {
      console.log("handleSubmit: No token, redirecting to login");
      handleUnauthorized();
      return;
    }

    if (activeTab === "worker") {
      const fd = new FormData();

      console.log("FormData before submission:", {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        skill: formData.about,
        age: formData.age,
        gender: formData.gender,
        full_address: formData.full_address,
        documents: formData.documents,
        isShop: formData.hasShop === "yes",
        businessAddress: formData.shopFullAddress[0] || {},
      });

      // Send all documents (new files and existing URLs)
      const existingDocs = [];
      formData.documents.forEach((doc, index) => {
        console.log(`Processing document ${index}:`, { documentName: doc.documentName, image: doc.images[0] });
        if (doc.images[0] instanceof File) {
          fd.append("documents", doc.images[0]);
          fd.append("documentTypes[]", doc.documentName || "unknown");
        } else if (typeof doc.images[0] === "string" && doc.images[0].trim()) {
          existingDocs.push({
            documentName: doc.documentName || "unknown",
            image: doc.images[0],
          });
        }
      });

      // Append existing documents as JSON
      if (existingDocs.length > 0) {
        fd.append("existingDocuments", JSON.stringify(existingDocs));
      }

      fd.append("category_id", formData.category);
      fd.append("subcategory_ids", JSON.stringify(formData.subcategory));
      fd.append("skill", formData.about);
      fd.append("age", formData.age);
      fd.append("gender", formData.gender);
      fd.append("full_address", JSON.stringify(formData.full_address));
      fd.append("isShop", formData.hasShop === "yes");
      if (formData.hasShop === "yes" && formData.shopFullAddress.length > 0) {
        fd.append("businessAddress", JSON.stringify(formData.shopFullAddress[0]));
      }

      for (let [key, value] of fd.entries()) {
        console.log(`FormData entry: ${key}=${value}`);
      }

      const res = await fetch(`${BASE_URL}/user/updateUserDetails`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      console.log("Server response (updateUserDetails):", data);

      if (!res.ok) {
        if (res.status === 401) {
          console.log("handleSubmit: 401 Unauthorized, redirecting to login");
          handleUnauthorized();
          return;
        }
        return toast.error(data.message || "Failed to update worker profile.", { toastId: "updateUserDetailsError" });
      }

      // Refresh profile data after successful submission
      await dispatch(fetchUserProfile());

      const payload = {
        full_name: formData.name,
        full_address: formData.full_address,
      };
      const resName = await fetch(`${BASE_URL}/user/updateUserProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const dataName = await resName.json();
      console.log("Server response (updateUserProfile):", dataName);

      if (!resName.ok) {
        if (resName.status === 401) {
          console.log("handleSubmit: 401 Unauthorized, redirecting to login");
          handleUnauthorized();
          return;
        }
        return toast.error(dataName.message || "Failed to update name.", { toastId: "updateUserProfileError" });
      }

      toast.success("Worker profile updated successfully!", {
        toastId: "updateWorkerSuccess",
        onClose: () => setTimeout(() => navigate("/details"), 500),
      });
    }

    if (activeTab === "user") {
      const payload = {
        full_name: formData.name,
        skill: formData.about,
        age: formData.age,
        gender: formData.gender,
        full_address: formData.full_address,
        willingToVisitShop: formData.willingToVisitShop,
      };

      console.log("User profile payload:", payload);

      const res = await fetch(`${BASE_URL}/user/updateUserProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response (user profile):", data);

      if (!res.ok) {
        if (res.status === 401) {
          console.log("handleSubmit: 401 Unauthorized, redirecting to login");
          handleUnauthorized();
          return;
        }
        return toast.error(data.message || "Failed to update user profile.", { toastId: "updateUserProfileError" });
      }

      // Refresh profile data after successful submission
      await dispatch(fetchUserProfile());

      toast.success("User profile updated successfully!", {
        toastId: "updateUserSuccess",
        onClose: () => setTimeout(() => navigate("/details"), 500),
      });
    }
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    toast.error("Something went wrong!", { toastId: "submitGeneralError" });
  }
};

  const defaultCenter = markerLocationAddress || markerLocationShop || currentLocation || { lat: 28.6139, lng: 77.209 };

  return (
    <>
      <Header />
      <div className="mt-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-green-700 mb-4 hover:underline ml-10"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back arrow" />
          Back
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="max-w-[50rem] mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {activeTab === "worker" ? "Get your profile verified" : "Update User Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Age</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                setFormData({ ...formData, age: value });
              }}
              placeholder="Enter your age"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Full Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              readOnly
              onClick={() => {
                setMapFor("address");
                setAddressModalOpen(true);
              }}
              placeholder="Click to enter address"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {activeTab === "user" && (
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Are you willing to go to the shop of the service provider?
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="willingToVisitShop"
                    value="yes"
                    checked={formData.willingToVisitShop === "yes"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="willingToVisitShop"
                    value="no"
                    checked={formData.willingToVisitShop === "no"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          )}

          {activeTab === "worker" && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Category</label>
                <Select
                  options={categories}
                  value={categories.find((c) => c.value === formData.category)}
                  onChange={handleCategoryChange}
                  placeholder="Search or select category..."
                  isClearable
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Subcategory</label>
                <Select
                  options={subcategories}
                  value={subcategories.filter((s) => formData.subcategory.includes(s.value))}
                  onChange={handleSubcategoryChange}
                  isMulti
                  placeholder="Search or select subcategories..."
                  isDisabled={!formData.category}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Upload Documents (Up to 5)</label>
                <div className="space-y-3">
                  <Select
                    options={docTypeOptions}
                    value={docTypeOptions.find((d) => d.value === selectedDocType)}
                    onChange={handleDocTypeChange}
                    placeholder="Select document type..."
                    isClearable
                    className="mb-2"
                  />
                  {showCustomDocInput && (
                    <input
                      type="text"
                      name="customDocName"
                      value={formData.customDocName}
                      onChange={handleChange}
                      placeholder="Enter government ID name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    />
                  )}
                  {selectedDocType && (
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
                  )}
                </div>

                {documentPreviews.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">Document Previews</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 mt-2">
                      {documentPreviews.map((preview, index) => (
                        <div key={index} className="relative w-32 h-32">
                          {/\.pdf$/i.test(preview) ? (
                            <a
                              href={preview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg shadow-md text-gray-700"
                            >
                              View PDF
                            </a>
                          ) : (
                            <img
                              src={preview}
                              alt={`Document Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg shadow-md"
                              onError={(e) => {
                                console.error(`Error loading preview for document ${index + 1}, URL:`, preview);
                                handleRemoveDocument(index, preview);
                              }}
                            />
                          )}
                          <div className="absolute top-0 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-br-lg">
                            {formData.documents[index]?.documentName || "Unknown"}
                          </div>
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

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Do you have a shop?
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasShop"
                      value="yes"
                      checked={formData.hasShop === "yes"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasShop"
                      value="no"
                      checked={formData.hasShop === "no"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.hasShop === "yes" && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Shop Address</label>
                  <input
                    type="text"
                    name="shopAddress"
                    value={formData.shopAddress}
                    readOnly
                    onClick={() => {
                      setMapFor("shopAddress");
                      setAddressModalOpen(true);
                    }}
                    placeholder="Click to enter shop address"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">About My Skill</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Describe your skill..."
              maxLength={500}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
              rows="4"
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">{formData.about.length}/500 characters</p>
          </div>

          <button
            type="submit"
            className="w-64 lg:w-72 mx-auto bg-[#228b22] text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition shadow-md hover:shadow-lg block"
          >
            Submit
          </button>
        </form>
      </div>

      {addressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {mapFor === "address" ? "Enter Address Details" : "Enter Shop Address Details"}
            </h2>
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
              onClick={() => setIsMapOpen(true)}
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
                onClick={handleSaveAddress}
                className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      {isMapOpen && isLoaded && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-2xl shadow-lg w-[90%] max-w-lg">
            <div className="flex justify-between mb-2">
              <h1 className="text-black text-[20px] font-semibold">
                {mapFor === "address" ? "Select Address" : "Select Shop Address"}
              </h1>
              <button
                onClick={() => setIsMapOpen(false)}
                className="text-red-500 font-bold"
              >
                X
              </button>
            </div>

            <p className="text-center mb-2 text-sm text-gray-600">
              {mapFor === "address" ? formData.address : formData.shopAddress || "Not selected"}
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
              {mapFor === "address" && markerLocationAddress && <Marker position={markerLocationAddress} />}
              {mapFor === "shopAddress" && markerLocationShop && <Marker position={markerLocationShop} />}
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