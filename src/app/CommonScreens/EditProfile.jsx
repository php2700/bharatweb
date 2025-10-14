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
  const role = profile?.role;
  const verificationStatus = profile?.verificationStatus;
  const fileInputRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    subcategory: [],
    emergencysubcategory: [],
    aboutUs: "",
    skill: "",
    documents: [],
    businessImage: [],
    age: "",
    gender: "",
    address: "",
    full_address: [],
    customDocName: "",
    hasShop: "",
    shopAddress: "",
    shopFullAddress: [],
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [emergencysubcategories, setEmergencysubcategories] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [businessImagePreviews, setBusinessImagePreviews] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapFor, setMapFor] = useState("address");
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
    { value: "AadharCard", label: "Aadhaar Card" },
    { value: "PanCard", label: "PAN Card" },
    { value: "Passport", label: "Passport" },
    { value: "DrivingLicense", label: "Driving License" },
    { value: "Other", label: "Any Other Government ID Proof" },
  ];

  const handleUnauthorized = () => {
    localStorage.removeItem("bharat_token");
    localStorage.removeItem("isProfileComplete");
    localStorage.removeItem("role");
    localStorage.removeItem("otp");
    localStorage.removeItem("selectedAddressId");
    dispatch(clearUserProfile());
    toast.error("Session expired, please log in again", {
      toastId: "unauthorized",
    });
    navigate("/login");
  };

  const isValidUrl = async (url) => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return true;
    }
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.error(`Failed to validate URL ${url}:`, error);
      return false;
    }
  };

  const handleDeleteDocument = async (index, preview) => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        handleUnauthorized();
        return;
      }

      const doc = formData.documents[index];
      console.log(
        "Deleting document:",
        doc,
        "at index:",
        index,
        "with preview:",
        preview
      );

      if (!(doc.images[0] instanceof File)) {
        const res = await fetch(`${BASE_URL}/user/deleteDocumentImage`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            documentName: doc.documentName,
            imagePath: doc.images[0]?.replace(
              "http://api.thebharatworks.com/",
              ""
            ),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }
          throw new Error(data.message || "Failed to delete document");
        }
      }

      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.filter((_, i) => i !== index),
      }));
      setDocumentPreviews((prev) => prev.filter((_, i) => i !== index));
      toast.success("Document deleted successfully!", {
        toastId: `deleteDocumentSuccess-${index}`,
      });
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(error.message || "Failed to delete document", {
        toastId: `deleteDocumentError-${index}`,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("bharat_token");
    if (
      token &&
      token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
    ) {
      dispatch(fetchUserProfile()).then((result) => {
        if (fetchUserProfile.rejected.match(result)) {
          toast.error(result.payload || "Failed to fetch user profile", {
            toastId: "fetchProfileError",
          });
          if (result.payload === "Session expired, please log in again") {
            handleUnauthorized();
          }
        }
      });
    } else {
      handleUnauthorized();
    }
  }, [dispatch]);

  console.log("EditProfile Rendered: ", profile);

  useEffect(() => {
    if (profile) {
      const selectedAddressIndex =
        parseInt(localStorage.getItem("selectedAddressId")) || 0;
      const selectedAddress =
        profile.full_address?.[selectedAddressIndex] || {};

      const tempSubcategories =
        Array.isArray(profile.subcategory_ids) &&
        Array.isArray(profile.subcategory_names)
          ? profile.subcategory_ids.map((id, index) => ({
              value: id,
              label: profile.subcategory_names[index] || "Unknown",
            }))
          : [];

      const tempEmergencysubcategories =
        Array.isArray(profile.emergencysubcategory_ids) &&
        Array.isArray(profile.emergencySubcategory_names)
          ? profile.emergencysubcategory_ids.map((id, index) => ({
              value: id,
              label: profile.emergencySubcategory_names[index] || "Unknown",
            }))
          : [];

      const processDocuments = async () => {
        const validDocuments = [];
        const validPreviews = [];
        const validBusinessImages = [];
        const validBusinessImagePreviews = [];
        const seenUrls = new Set();
        const inaccessibleDocs = [];

        // Process documents from profile.documents
        for (const [index, doc] of (profile.documents || []).entries()) {
          if (doc && Array.isArray(doc.images) && doc.images.length > 0) {
            for (const image of doc.images) {
              if (
                typeof image === "string" &&
                image.trim() &&
                !["null", "undefined"].includes(image.toLowerCase()) &&
                !seenUrls.has(image)
              ) {
                const isAccessible = await isValidUrl(image);
                if (isAccessible) {
                  if (doc.documentName === "businessImage") {
                    validBusinessImages.push({
                      documentName: "businessImage",
                      images: [image],
                    });
                    validBusinessImagePreviews.push(image);
                  } else {
                    validDocuments.push({
                      documentName: doc.documentName || "unknown",
                      images: [image],
                    });
                    validPreviews.push(image);
                  }
                  seenUrls.add(image);
                } else {
                  console.warn(`Skipping inaccessible URL: ${image}`);
                  inaccessibleDocs.push({
                    docName: doc.documentName || "unknown",
                    url: image,
                  });
                }
              } else {
                console.warn(
                  `Invalid or duplicate image in document ${index}:`,
                  image
                );
              }
            }
          } else {
            console.warn(`Profile document ${index} is invalid or empty:`, doc);
          }
        }

        // Process businessImage from profile.businessImage
        if (Array.isArray(profile.businessImage)) {
          for (const image of profile.businessImage) {
            if (
              typeof image === "string" &&
              image.trim() &&
              !["null", "undefined"].includes(image.toLowerCase()) &&
              !seenUrls.has(image)
            ) {
              const isAccessible = await isValidUrl(image);
              if (isAccessible) {
                validBusinessImages.push({
                  documentName: "businessImage",
                  images: [image],
                });
                validBusinessImagePreviews.push(image);
                seenUrls.add(image);
              } else {
                console.warn(
                  `Skipping inaccessible business image URL: ${image}`
                );
                inaccessibleDocs.push({
                  docName: "businessImage",
                  url: image,
                });
              }
            } else {
              console.warn(`Invalid or duplicate business image:`, image);
            }
          }
        }

        if (inaccessibleDocs.length > 0) {
          toast.error(
            `The following documents are inaccessible and will not be displayed: ${inaccessibleDocs
              .map((d) => d.docName)
              .join(", ")}. Please re-upload them.`,
            { toastId: "inaccessibleDocumentsError" }
          );
        }

        setFormData((prev) => ({
          ...prev,
          name: profile.full_name || "",
          aboutUs: activeTab === "user" ? profile?.aboutUs || "" : "",
          skill: activeTab === "worker" ? profile?.skill || "" : "",
          subcategory: Array.isArray(profile.subcategory_ids)
            ? profile.subcategory_ids
            : [],
          emergencysubcategory: Array.isArray(profile.emergencysubcategory_ids)
            ? profile.emergencysubcategory_ids
            : [],
          age: profile.age ? profile.age.toString() : "",
          gender: profile.gender || "",
          address: selectedAddress.address || profile.location?.address || "",
          full_address: Array.isArray(profile.full_address)
            ? profile.full_address
            : [],
          documents: validDocuments,
          businessImage: validBusinessImages,
          hasShop: profile.isShop ? "yes" : "no",
          shopAddress: profile.businessAddress?.address || "",
          shopFullAddress: profile.businessAddress?.address
            ? [
                {
                  title: "Shop",
                  landmark: profile.businessAddress.landmark || "",
                  address: profile.businessAddress.address,
                  latitude: profile.businessAddress.latitude,
                  longitude: profile.businessAddress.longitude,
                },
              ]
            : [],
        }));

        setDocumentPreviews(validPreviews);
        setBusinessImagePreviews(validBusinessImagePreviews);
        setProfilePic(profile.profilePic || null);

        if (profile.category_id) {
          handleCategoryChange({ value: profile.category_id });
        }
      };

      processDocuments();
    } else {
      setFormData({
        name: "",
        subcategory: [],
        emergencysubcategory: [],
        aboutUs: "",
        skill: "",
        documents: [],
        businessImage: [],
        age: "",
        gender: "",
        address: "",
        full_address: [],
        customDocName: "",
        hasShop: "",
        shopAddress: "",
        shopFullAddress: [],
      });
      setSubcategories([]);
      setEmergencysubcategories([]);
      setDocumentPreviews([]);
      setBusinessImagePreviews([]);
      setProfilePic(null);
    }
  }, [profile, activeTab]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) {
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
          handleUnauthorized();
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories", {
          toastId: "fetchCategoriesError",
        });
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (selected) => {
    const selectedCatId = selected?.value || "";

    if (selectedCatId !== formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: selectedCatId,
        subcategory: [],
        emergencysubcategory: [],
      }));
      setSubcategories([]);
      setEmergencysubcategories([]);
    } else {
      setFormData((prev) => ({ ...prev, category: selectedCatId }));
    }

    if (!selectedCatId) {
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        handleUnauthorized();
        return;
      }

      const subRes = await fetch(`${BASE_URL}/subcategories/${selectedCatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subData = await subRes.json();
      if (subRes.ok) {
        let fetchedSubcategories = (subData.data || []).map((sub) => ({
          value: sub._id,
          label: sub.name,
        }));

        const profileSubcategoryIds = Array.isArray(profile?.subcategory_ids)
          ? profile.subcategory_ids
          : [];
        const profileSubcategoryNames = Array.isArray(
          profile?.subcategory_names
        )
          ? profile.subcategory_names
          : [];
        const mergedSubcategories = fetchedSubcategories.map((sub) => {
          const profileIndex = profileSubcategoryIds.indexOf(sub.value);
          return profileIndex !== -1
            ? {
                value: sub.value,
                label: profileSubcategoryNames[profileIndex] || sub.label,
              }
            : sub;
        });

        profileSubcategoryIds.forEach((id, index) => {
          if (!mergedSubcategories.some((s) => s.value === id)) {
            mergedSubcategories.push({
              value: id,
              label: profileSubcategoryNames[index] || "Unknown",
            });
          }
        });

        setSubcategories(mergedSubcategories);

        if (
          profileSubcategoryIds.length > 0 &&
          selectedCatId === profile?.category_id
        ) {
          setFormData((prev) => ({
            ...prev,
            subcategory: profileSubcategoryIds,
          }));
        }
      } else if (subRes.status === 401) {
        handleUnauthorized();
        return;
      }

      const emerRes = await fetch(
        `${BASE_URL}/emergency/subcategories/${selectedCatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const emerData = await emerRes.json();
      if (emerRes.ok) {
        let fetchedEmergencysubcategories = (emerData.data || []).map(
          (emer) => ({
            value: emer._id,
            label: emer.name,
          })
        );

        const profileEmergencySubcategoryIds = Array.isArray(
          profile?.emergencysubcategory_ids
        )
          ? profile.emergencysubcategory_ids
          : [];
        const profileEmergencySubcategoryNames = Array.isArray(
          profile?.emergencySubcategory_names
        )
          ? profile.emergencySubcategory_names
          : [];
        const mergedEmergencysubcategories = fetchedEmergencysubcategories.map(
          (emer) => {
            const profileIndex = profileEmergencySubcategoryIds.indexOf(
              emer.value
            );
            return profileIndex !== -1
              ? {
                  value: emer.value,
                  label:
                    profileEmergencySubcategoryNames[profileIndex] ||
                    emer.label,
                }
              : emer;
          }
        );

        profileEmergencySubcategoryIds.forEach((id, index) => {
          if (!mergedEmergencysubcategories.some((e) => e.value === id)) {
            mergedEmergencysubcategories.push({
              value: id,
              label: profileEmergencySubcategoryNames[index] || "Unknown",
            });
          }
        });

        setEmergencysubcategories(mergedEmergencysubcategories);

        if (
          profileEmergencySubcategoryIds.length > 0 &&
          selectedCatId === profile?.category_id
        ) {
          setFormData((prev) => ({
            ...prev,
            emergencysubcategory: profileEmergencySubcategoryIds,
          }));
        }
      } else if (emerRes.status === 401) {
        handleUnauthorized();
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch subcategories or emergency subcategories", {
        toastId: "fetchCategoriesError",
      });
    }
  };

  const handleSubcategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      subcategory: selectedOptions ? selectedOptions.map((s) => s.value) : [],
    });
  };

  const handleEmergencysubcategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      emergencysubcategory: selectedOptions
        ? selectedOptions.map((s) => s.value)
        : [],
    });
  };

  const getAddressFromLatLng = (lat, lng) => {
    if (!isLoaded) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        console.log(
          `Geocoded address for lat: ${lat}, lng: ${lng} -> ${address}`
        );
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
      } else {
        console.error("Geocoding failed:", status);
        toast.error("Failed to fetch address from location", {
          toastId: "geocodeError",
        });
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          console.log("Current location fetched:", loc);
          setCurrentLocation(loc);
          if (mapFor === "address") setMarkerLocationAddress(loc);
          else if (mapFor === "shopAddress") setMarkerLocationShop(loc);
          getAddressFromLatLng(loc.lat, loc.lng);
          if (map) map.panTo(loc);
        },
        () =>
          toast.error("Unable to fetch current location", {
            toastId: "geolocationError",
          })
      );
    } else {
      toast.error("Geolocation not supported by browser", {
        toastId: "geolocationSupportError",
      });
    }
  };

  const handlePlaceChanged = () => {
    if (autoCompleteRef.current) {
      const place = autoCompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const loc = { lat, lng };
        console.log("Place selected:", place.formatted_address, loc);
        setCurrentLocation(loc);
        if (mapFor === "address") setMarkerLocationAddress(loc);
        else if (mapFor === "shopAddress") setMarkerLocationShop(loc);
        getAddressFromLatLng(lat, lng);
        if (map) map.panTo(loc);
      } else {
        console.error("No geometry available for selected place");
        toast.error("Invalid place selected", { toastId: "invalidPlaceError" });
      }
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    console.log(`Map clicked at lat: ${lat}, lng: ${lng}`);
    if (mapFor === "address") setMarkerLocationAddress({ lat, lng });
    else if (mapFor === "shopAddress") setMarkerLocationShop({ lat, lng });
    getAddressFromLatLng(lat, lng);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log(`handleChange: name=${name}, value=${value}, files=`, files);

    if (name === "name") {
      const validName = value.replace(/[^a-zA-Z\s]/g, "");
      if (value !== validName) {
        toast.error("Name can only contain letters and spaces!", {
          toastId: "nameFormatError",
        });
      }
      setFormData({ ...formData, name: validName });
      return;
    }

    if (name === "age") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 2);
      setFormData({ ...formData, age: numericValue });
      return;
    }

    if (name === "documents" && files) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/avif",
        "image/gif",
      ];
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter((file) =>
        allowedTypes.includes(file.type)
      );

      const maxFileSize = 20 * 1024 * 1024; // 20MB
      if (validFiles.some((file) => file.size > maxFileSize)) {
        toast.error("File size exceeds 20MB limit!", {
          toastId: "fileSizeError",
        });
        return;
      }

      if (newFiles.length !== 2) {
        toast.error("Exactly 2 images are required for documents!", {
          toastId: "documentCountError",
        });
        return;
      }

      if (validFiles.length !== newFiles.length) {
        toast.error("Only image files (JPEG, PNG, AVIF, GIF) are allowed!", {
          toastId: "fileTypeError",
        });
        return;
      }

      if (!selectedDocType) {
        toast.error("Please select a document type before uploading!", {
          toastId: "docTypeError",
        });
        return;
      }

      if (selectedDocType === "other" && !formData.customDocName.trim()) {
        toast.error("Please enter the name of the government ID!", {
          toastId: "customDocNameError",
        });
        return;
      }

      if (formData.documents.length + validFiles.length > 2) {
        toast.error("Total documents cannot exceed 2!", {
          toastId: "maxDocumentsError",
        });
        return;
      }

      const docType =
        selectedDocType === "other" ? formData.customDocName : selectedDocType;

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

    if (name === "businessImage" && files) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/avif",
        "image/gif",
      ];
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter((file) =>
        allowedTypes.includes(file.type)
      );

      const maxFileSize = 20 * 1024 * 1024; // 20MB
      if (validFiles.some((file) => file.size > maxFileSize)) {
        toast.error("File size exceeds 20MB limit!", {
          toastId: "fileSizeError",
        });
        return;
      }

      if (newFiles.length < 1 || newFiles.length > 5) {
        toast.error(
          "Please upload between 1 and 5 business images at a time!",
          {
            toastId: "businessImageCountError",
          }
        );
        return;
      }

      if (validFiles.length !== newFiles.length) {
        toast.error("Only image files are allowed for business images!", {
          toastId: "businessImageTypeError",
        });
        return;
      }
      const totalBusinessImagesAfterUpload =
        formData.businessImage.length + validFiles.length;
      if (totalBusinessImagesAfterUpload > 5) {
        toast.error("Total business images cannot exceed 5!", {
          toastId: "maxBusinessImagesError",
        });
        return;
      }

      const newBusinessImages = validFiles.map((file) => ({
        documentName: "businessImage",
        images: [file],
      }));

      setFormData((prev) => ({
        ...prev,
        businessImage: [...prev.businessImage, ...newBusinessImages],
      }));
      setBusinessImagePreviews((prev) => [
        ...prev,
        ...validFiles.map((file) => URL.createObjectURL(file)),
      ]);
      return;
    }

    if (name === "customDocName") {
      const validCustomDocName = value.replace(/[^a-zA-Z\s]/g, "");
      if (value !== validCustomDocName) {
        toast.error("Document name can only contain letters and spaces!", {
          toastId: "customDocNameFormatError",
        });
      }
      setFormData({ ...formData, customDocName: validCustomDocName });
      return;
    }

    if (name === "hasShop") {
      console.log(`hasShop changed to: ${value}`);
      if (value === "no") {
        setFormData((prev) => ({
          ...prev,
          hasShop: value,
          shopAddress: "",
          shopFullAddress: [],
        }));
        setMarkerLocationShop(null);
      } else {
        setFormData((prev) => ({
          ...prev,
          hasShop: value,
        }));
      }
      return;
    }

    if (name === "aboutUs") {
      if (value.length > 500) {
        toast.error("About Us/Skill cannot exceed 500 characters!", {
          toastId: "aboutUsLengthError",
        });
        return;
      }
      setFormData({
        ...formData,
        [activeTab === "worker" ? "skill" : "aboutUs"]: value,
      });
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
    setFormData((prev) => ({ ...prev, documents: [] }));
    setDocumentPreviews([]);
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG/PNG images are allowed for profile picture!", {
        toastId: "profilePicTypeError",
      });
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
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
          handleUnauthorized();
          return;
        }
        toast.error(data.message || "Failed to update profile pic.", {
          toastId: "updateProfilePicError",
        });
        return;
      }

      setProfilePic(URL.createObjectURL(file));
      toast.success("Profile picture updated successfully!", {
        toastId: "updateProfilePicSuccess",
      });
      dispatch(fetchUserProfile());
    } catch (error) {
      console.error("Error updating profile pic:", error);
      toast.error("Something went wrong!", {
        toastId: "updateProfilePicGeneralError",
      });
    }
  };

  const handleSaveAddress = () => {
    if (
      !tempAddress.title.trim() ||
      !tempAddress.landmark.trim() ||
      !tempAddress.address.trim()
    ) {
      toast.error(
        "Please fill in all address fields: Title, Landmark, and Address.",
        { toastId: "saveAddressError" }
      );
      return;
    }

    console.log(`Saving address for ${mapFor}:`, tempAddress);
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
    setIsMapOpen(false);
  };

  const handleOpenAddressModal = (type) => {
    console.log(`Opening address modal for: ${type}`);
    setMapFor(type);
    setTempAddress({
      title: "",
      landmark: "",
      address: type === "address" ? formData.address : formData.shopAddress,
      latitude: null,
      longitude: null,
    });
    setAddressModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hard validation
    if (!formData.name.trim()) {
      toast.error("Name is required!", { toastId: "nameRequiredError" });
      return;
    }
    if (formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters long!", {
        toastId: "nameLengthError",
      });
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      toast.error("Name can only contain letters and spaces!", {
        toastId: "nameFormatError",
      });
      return;
    }

    if (!formData.age) {
      toast.error("Age is required!", { toastId: "ageRequiredError" });
      return;
    }
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
      toast.error("Age must be a number between 18 and 99!", {
        toastId: "ageRangeError",
      });
      return;
    }

    if (!formData.gender) {
      toast.error("Gender is required!", { toastId: "genderRequiredError" });
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required!", { toastId: "addressRequiredError" });
      return;
    }

    if (activeTab === "worker") {
      if (!formData.category) {
        toast.error("Category is required!", {
          toastId: "categoryRequiredError",
        });
        return;
      }
      if (!formData.subcategory.length) {
        toast.error("Select at least one subcategory!", {
          toastId: "subcategoryRequiredError",
        });
        return;
      }
      if (!formData.emergencysubcategory.length) {
        toast.error("Select at least one emergency subcategory!", {
          toastId: "emergencysubcategoryRequiredError",
        });
        return;
      }
      if (formData.documents.length !== 2) {
        toast.error("Exactly 2 document images are required!", {
          toastId: "documentsRequiredError",
        });
        return;
      }
      if (!formData.hasShop) {
        toast.error("Please select if you have a shop!", {
          toastId: "hasShopError",
        });
        return;
      }
      if (formData.hasShop === "yes" && !formData.shopAddress.trim()) {
        toast.error("Shop address is required if you have a shop!", {
          toastId: "shopAddressError",
        });
        return;
      }
    }

    const aboutField =
      activeTab === "worker" ? formData.skill : formData.aboutUs;
    if (!aboutField.trim()) {
      toast.error(
        activeTab === "worker"
          ? "Skill description is required!"
          : "About Us is required!",
        { toastId: "aboutRequiredError" }
      );
      return;
    }
    if (aboutField.trim().length < 10) {
      toast.error(
        activeTab === "worker"
          ? "Skill description must be at least 10 characters!"
          : "About Us must be at least 10 characters!",
        { toastId: "aboutLengthError" }
      );
      return;
    }

    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        handleUnauthorized();
        return;
      }

      if (activeTab === "worker") {
        const fd = new FormData();

        formData.documents.forEach((doc) => {
          if (doc.images[0] instanceof File) {
            fd.append("documents", doc.images[0]);
          }
        });
        if (formData.documents.length > 0) {
          fd.append(
            "documentName",
            formData.documents[0]?.documentName || "unknown"
          );
        }

        formData.businessImage.forEach((img) => {
          if (img.images[0] instanceof File) {
            fd.append("businessImage", img.images[0]);
          }
        });

        fd.append("full_name", formData.name);
        fd.append("category_id", formData.category);
        fd.append("subcategory_ids", JSON.stringify(formData.subcategory));
        fd.append(
          "emergencySubcategory_ids",
          JSON.stringify(formData.emergencysubcategory)
        );
        fd.append("skill", formData.skill);
        fd.append("age", formData.age);
        fd.append("gender", formData.gender);
        fd.append("isShop", formData.hasShop === "yes" ? "true" : "false");
        if (formData.hasShop === "yes" && formData.shopFullAddress.length > 0) {
          const businessAddress = {
            address: formData.shopFullAddress[0].address,
            latitude: formData.shopFullAddress[0].latitude,
            longitude: formData.shopFullAddress[0].longitude,
          };
          if (
            !businessAddress.address ||
            businessAddress.latitude == null ||
            businessAddress.longitude == null
          ) {
            return toast.error("Invalid shop address data!", {
              toastId: "invalidShopAddressError",
            });
          }
          fd.append("businessAddress", JSON.stringify(businessAddress));
        }

        const res = await fetch(`${BASE_URL}/user/updateUserDetails`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }
          return toast.error(
            data.message || "Failed to update worker profile.",
            { toastId: "updateUserDetailsError" }
          );
        }

        if (role === "user" || verificationStatus === "rejected") {
          const upgradeRes = await fetch(
            `${BASE_URL}/user/request-role-upgrade`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const upgradeData = await upgradeRes.json();
          if (!upgradeRes.ok) {
            if (upgradeRes.status === 401) {
              handleUnauthorized();
              return;
            }
            toast.error(
              upgradeData.message || "Failed to request role upgrade.",
              { toastId: "roleUpgradeError" }
            );
          } else {
            toast.success("Role upgrade request sent successfully!", {
              toastId: "roleUpgradeSuccess",
            });
          }
        }

        await dispatch(fetchUserProfile());

        toast.success("Worker profile updated successfully!", {
          toastId: "updateWorkerSuccess",
          onClose: () => setTimeout(() => navigate("/details"), 500),
        });
      }

      if (activeTab === "user") {
        const payload = {
          full_name: formData.name,
          aboutUs: formData.aboutUs,
          age: formData.age,
          gender: formData.gender,
          full_address: formData.full_address,
          category_id: formData.category,
          subcategory_ids: formData.subcategory,
          emergencysubcategory_ids: formData.emergencysubcategory,
        };

        const res = await fetch(`${BASE_URL}/user/updateUserDetails`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }
          return toast.error(data.message || "Failed to update user profile.", {
            toastId: "updateUserProfileError",
          });
        }

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

  const defaultCenter = markerLocationAddress ||
    markerLocationShop ||
    currentLocation || { lat: 28.6139, lng: 77.209 };

  return (
    <>
      <Header />
      <div className="mt-20">
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
          {activeTab === "worker"
            ? "Get your profile verified"
            : "Update User Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Name
            </label>
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
            <label className="block mb-2 font-semibold text-gray-700">
              Age
            </label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age (18-99)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              readOnly
              onClick={() => handleOpenAddressModal("address")}
              placeholder="Click to enter address"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>*/}

          {activeTab === "worker" && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Category
                </label>
                <Select
                  options={categories}
                  value={
                    categories.find((c) => c.value === formData.category) ||
                    null
                  }
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
                  Emergency Subcategory
                </label>
                <Select
                  options={emergencysubcategories}
                  value={emergencysubcategories.filter((e) =>
                    formData.emergencysubcategory.includes(e.value)
                  )}
                  onChange={handleEmergencysubcategoryChange}
                  isMulti
                  placeholder="Search or select emergency subcategories..."
                  isDisabled={!formData.category}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Upload Documents (Exactly 2 images)
                </label>
                <div className="space-y-3">
                  <Select
                    options={docTypeOptions}
                    value={docTypeOptions.find(
                      (d) => d.value === selectedDocType
                    )}
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
                    <label className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#228b22] to-[#32cd32] text-white font-semibold rounded-lg cursor-pointer hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>
                        {formData.documents.length > 0
                          ? `${formData.documents.length} image(s) selected`
                          : "Upload exactly 2 images"}
                      </span>
                      <input
                        type="file"
                        name="documents"
                        onChange={handleChange}
                        className="hidden"
                        multiple
                        accept="image/jpeg,image/png,image/avif,image/gif"
                      />
                    </label>
                  )}
                </div>

                {documentPreviews.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Document Previews
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 mt-2 gap-4">
                      {documentPreviews.map((preview, index) => (
                        <div
                          key={`${preview}-${index}`}
                          className="relative w-32 h-32 group"
                        >
                          <img
                            src={preview}
                            alt={`Document Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              console.error(
                                `Error loading preview for document ${
                                  index + 1
                                }, URL:`,
                                preview
                              );
                            }}
                          />
                          <div className="absolute top-0 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-br-lg">
                            {formData?.documents[index]?.documentName ||
                              "Unknown"}
                          </div>
                          <button
                            onClick={() => handleDeleteDocument(index, preview)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5  transition-opacity bg-red-700"
                            title="Delete document"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Upload Business Images (1-5 at a time, max 5 total)
                </label>
                <div className="space-y-3">
                  <label className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#228b22] to-[#32cd32] text-white font-semibold rounded-lg cursor-pointer hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span>
                      {formData.businessImage.length > 0
                        ? `${formData.businessImage.length} image(s) selected`
                        : "Choose images (1-5)"}
                    </span>
                    <input
                      type="file"
                      name="businessImage"
                      onChange={handleChange}
                      className="hidden"
                      multiple
                      accept="image/jpeg,image/png,image/avif,image/gif"
                    />
                  </label>
                </div>

                {businessImagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Business Image Previews
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 mt-2 gap-4">
                      {businessImagePreviews.map((preview, index) => (
                        <div
                          key={`${preview}-${index}`}
                          className="relative w-32 h-32"
                        >
                          <img
                            src={preview}
                            alt={`Business Image Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              console.error(
                                `Error loading preview for business image ${
                                  index + 1
                                }, URL:`,
                                preview
                              );
                              toast.error(
                                `Failed to load business image ${
                                  index + 1
                                }. Please re-upload.`,
                                {
                                  toastId: `businessImagePreviewError-${index}`,
                                }
                              );
                            }}
                          />
                          <div className="absolute top-0 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-br-lg">
                            Business Image
                          </div>
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
                  <label className="block mb-2 font-semibold text-gray-700">
                    Shop Address
                  </label>
                  <input
                    type="text"
                    name="shopAddress"
                    value={formData.shopAddress}
                    readOnly
                    onClick={() => handleOpenAddressModal("shopAddress")}
                    placeholder="Click to enter shop address"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              {activeTab === "worker" ? "About My Skill" : "About Us"}
            </label>
            <textarea
              name="aboutUs"
              value={activeTab === "worker" ? formData.skill : formData.aboutUs}
              onChange={handleChange}
              placeholder={
                activeTab === "worker"
                  ? "Describe your skill (min 10 characters)..."
                  : "Tell us about yourself (min 10 characters)..."
              }
              maxLength={500}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
              rows="4"
              required
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              {
                (activeTab === "worker" ? formData.skill : formData.aboutUs)
                  .length
              }
              /500 characters
            </p>
          </div>

          <button
            type="submit"
            className="w-64 lg:w-72 mx-auto bg-[#228b22] text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition shadow-md hover:shadow-lg block"
          >
            Submit
          </button>
        </form>
      </div>

      {addressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {mapFor === "address"
                ? "Enter Address Details"
                : "Enter Shop Address Details"}
            </h2>
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
                onClick={() => {
                  setAddressModalOpen(false);
                  setTempAddress({
                    title: "",
                    landmark: "",
                    address: "",
                    latitude: null,
                    longitude: null,
                  });
                }}
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
                {mapFor === "address"
                  ? "Select Address"
                  : "Select Shop Address"}
              </h1>
              <button
                onClick={() => setIsMapOpen(false)}
                className="text-red-500 font-bold"
              >
                X
              </button>
            </div>

            <p className="text-center mb-2 text-sm text-gray-600">
              {mapFor === "address"
                ? formData.address
                : formData.shopAddress || "Not selected"}
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
              {mapFor === "address" && markerLocationAddress && (
                <Marker position={markerLocationAddress} />
              )}
              {mapFor === "shopAddress" && markerLocationShop && (
                <Marker position={markerLocationShop} />
              )}
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
