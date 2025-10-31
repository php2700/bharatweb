import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, clearUserProfile } from "../../redux/userSlice";
import Swal from "sweetalert2";
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

  const fileInputRef = useRef(null);
  const autoCompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    subcategory: [],
    emergencysubcategory: [],
    aboutUs: "",
    skill: "",
    age: "",
    gender: "",
    address: "",
    full_address: [],
    hasShop: "",
    shopAddress: "",
    shopFullAddress: [],
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [emergencysubcategories, setEmergencysubcategories] = useState([]);

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

  const [documents, setDocuments] = useState({
    aadhaarFront: { preview: null, file: null, path: null },
    aadhaarBack: { preview: null, file: null, path: null },
    panFront: { preview: null, file: null, path: null },
    panBack: { preview: null, file: null, path: null },
    selfie: { preview: null, file: null, path: null },
  });

  const [businessImage, setBusinessImage] = useState({
    preview: null,
    file: null,
    path: null,
  });

  const [errors, setErrors] = useState({});

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBU6oBwyKGYp3YY-4M_dtgigaVDvbW55f4",
    libraries,
  });

  const allowedTypes = ["image/jpeg", "image/png", "image/avif", "image/gif"];

  // ------------------------------------------------------------------------
  // Helper functions
  // ------------------------------------------------------------------------
  const getDocumentName = (type) => {
    if (type.includes("aadhaar")) return "AadharCard";
    if (type.includes("pan")) return "PanCard";
    if (type === "selfie") return "selfAttached";
    return "unknown";
  };

  const getPathFromUrl = (url) => {
    const base = BASE_URL.replace(/\/$/, "");
    if (url.startsWith(base)) {
      return url.slice(base.length).replace(/^\//, "");
    }
    return url.replace(/^\//, "");
  };

  // STRICT MANDATORY VALIDATION: Aadhaar + PAN + Selfie
  const getDocErrors = () => {
    const errs = {};

    if (activeTab === "worker") {
      // Aadhaar: both required
      const hasAadhaar = documents.aadhaarFront.preview && documents.aadhaarBack.preview;
      const partialAadhaar =
        (documents.aadhaarFront.preview || documents.aadhaarBack.preview) && !hasAadhaar;

      if (!hasAadhaar) {
        errs.aadhaar = partialAadhaar
          ? "Upload both sides of Aadhaar Card."
          : "Aadhaar Card (front & back) is required.";
      }

      // PAN: both required
      const hasPan = documents.panFront.preview && documents.panBack.preview;
      const partialPan =
        (documents.panFront.preview || documents.panBack.preview) && !hasPan;

      if (!hasPan) {
        errs.pan = partialPan
          ? "Upload both sides of PAN Card."
          : "PAN Card (front & back) is required.";
      }

      // Selfie: required
      if (!documents.selfie.preview) {
        errs.selfie = "Selfie is required.";
      }
    }

    return errs;
  };

  // Real-time validation
  useEffect(() => {
    const docErrors = getDocErrors();
    setErrors((prev) => ({
      ...prev,
      aadhaar: docErrors.aadhaar || undefined,
      pan: docErrors.pan || undefined,
      selfie: docErrors.selfie || undefined,
    }));
  }, [documents, activeTab]);

  // ------------------------------------------------------------------------
  // Auth & URL validation
  // ------------------------------------------------------------------------
  const handleUnauthorized = () => {
    localStorage.removeItem("bharat_token");
    localStorage.removeItem("isProfileComplete");
    localStorage.removeItem("role");
    localStorage.removeItem("otp");
    localStorage.removeItem("selectedAddressId");
    dispatch(clearUserProfile());
    Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Please log in again.",
      confirmButtonColor: "#d33",
    }).then(() => navigate("/login"));
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
    } catch {
      return false;
    }
  };

  // ------------------------------------------------------------------------
  // Document Upload / Delete
  // ------------------------------------------------------------------------
  const handleDocUpload = async (e, type) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Only JPEG, PNG, AVIF, or GIF images are allowed.",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "File size must be under 20 MB.",
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setDocuments((prev) => ({
      ...prev,
      [type]: { preview, file, path: null },
    }));
  };

  const handleBusinessUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Only JPEG, PNG, AVIF, or GIF images are allowed.",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "File size must be under 20 MB.",
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setBusinessImage({ preview, file, path: null });
  };

  const handleDocDelete = async (type) => {
    const current = documents[type];
    if (!current.preview) return;

    if (!current.path) {
      if (current.file) URL.revokeObjectURL(current.preview);
      setDocuments((prev) => ({
        ...prev,
        [type]: { preview: null, file: null, path: null },
      }));
      return;
    }

    let imagePath = current.path;
    if (imagePath.startsWith("http")) {
      const baseURL = `${window.location.origin}/`;
      imagePath = imagePath.replace(baseURL, "");
    }
    if (imagePath.includes("uploads/")) {
      imagePath = imagePath.substring(imagePath.indexOf("uploads/"));
    }

    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/user/deleteDocumentImage`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userID: profile._id,
        },
        body: JSON.stringify({
          documentName: getDocumentName(type),
          imagePath,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) return handleUnauthorized();
        throw new Error(data.message || "Delete failed");
      }

      if (current.file) URL.revokeObjectURL(current.preview);
      setDocuments((prev) => ({
        ...prev,
        [type]: { preview: null, file: null, path: null },
      }));

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.message || "Could not delete image",
      });
    }
  };

  // ------------------------------------------------------------------------
  // Profile Fetch & Populate
  // ------------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("bharat_token");
    if (
      token &&
      token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
    ) {
      dispatch(fetchUserProfile()).then((result) => {
        if (fetchUserProfile.rejected.match(result)) {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: result.payload || "Failed to fetch profile",
          }).then(() => {
            if (result.payload === "Session expired, please log in again") {
              handleUnauthorized();
            }
          });
        }
      });
    } else {
      handleUnauthorized();
    }
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const selectedAddressIndex =
        parseInt(localStorage.getItem("selectedAddressId")) || 0;
      const selectedAddress =
        profile.full_address?.[selectedAddressIndex] || {};

      const processDocuments = async () => {
        const tempDocs = {
          aadhaarFront: { preview: null, file: null, path: null },
          aadhaarBack: { preview: null, file: null, path: null },
          panFront: { preview: null, file: null, path: null },
          panBack: { preview: null, file: null, path: null },
          selfie: { preview: null, file: null, path: null },
        };
        let businessObj = { preview: null, file: null, path: null };
        const seenUrls = new Set();
        const inaccessible = [];

        for (const doc of profile.documents || []) {
          if (doc && Array.isArray(doc.images) && doc.images.length) {
            for (const img of doc.images) {
              if (typeof img === "string" && img.trim() && !seenUrls.has(img)) {
                const ok = await isValidUrl(img);
                if (ok) {
                  seenUrls.add(img);
                  const path = getPathFromUrl(img);
                  if (doc.documentName === "businessImage") {
                    if (!businessObj.preview) businessObj = { preview: img, file: null, path };
                  } else {
                    if (doc.documentName === "AadharCard") {
                      if (!tempDocs.aadhaarFront.preview) tempDocs.aadhaarFront = { preview: img, file: null, path };
                      else if (!tempDocs.aadhaarBack.preview) tempDocs.aadhaarBack = { preview: img, file: null, path };
                    } else if (doc.documentName === "PanCard") {
                      if (!tempDocs.panFront.preview) tempDocs.panFront = { preview: img, file: null, path };
                      else if (!tempDocs.panBack.preview) tempDocs.panBack = { preview: img, file: null, path };
                    } else if (doc.documentName === "selfAttached") {
                      if (!tempDocs.selfie.preview) tempDocs.selfie = { preview: img, file: null, path };
                    }
                  }
                } else {
                  inaccessible.push({ docName: doc.documentName || "unknown", url: img });
                }
              }
            }
          }
        }

        if (Array.isArray(profile.businessImage)) {
          for (const img of profile.businessImage) {
            if (typeof img === "string" && img.trim() && !seenUrls.has(img)) {
              const ok = await isValidUrl(img);
              if (ok && !businessObj.preview) {
                const path = getPathFromUrl(img);
                businessObj = { preview: img, file: null, path };
                seenUrls.add(img);
              } else if (!ok) {
                inaccessible.push({ docName: "businessImage", url: img });
              }
            }
          }
        }

        if (inaccessible.length) {
          Swal.fire({
            icon: "warning",
            title: "Image Load Failed",
            text: `Some images could not be loaded. Please re-upload: ${[
              ...new Set(inaccessible.map((i) => i.docName)),
            ].join(", ")}`,
          });
        }

        setDocuments(tempDocs);
        setBusinessImage(businessObj);

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
          category: profile.category_id || "",
        }));

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
        age: "",
        gender: "",
        address: "",
        full_address: [],
        hasShop: "",
        shopAddress: "",
        shopFullAddress: [],
        category: "",
      });
      setSubcategories([]);
      setEmergencysubcategories([]);
      setDocuments({
        aadhaarFront: { preview: null, file: null, path: null },
        aadhaarBack: { preview: null, file: null, path: null },
        panFront: { preview: null, file: null, path: null },
        panBack: { preview: null, file: null, path: null },
        selfie: { preview: null, file: null, path: null },
      });
      setBusinessImage({ preview: null, file: null, path: null });
      setProfilePic(null);
    }
  }, [profile, activeTab]);

  // ------------------------------------------------------------------------
  // Categories & Subcategories
  // ------------------------------------------------------------------------
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
        } else if (res.status === 401) {
          handleUnauthorized();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Failed to fetch categories",
        });
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (selected) => {
    const catId = selected?.value || "";
    setFormData((prev) => ({
      ...prev,
      category: catId,
      subcategory: catId !== prev.category ? [] : prev.subcategory,
      emergencysubcategory:
        catId !== prev.category ? [] : prev.emergencysubcategory,
    }));
    setErrors((prev) => ({
      ...prev,
      category: catId ? undefined : "Category is required.",
    }));

    if (!catId) return;

    try {
      const token = localStorage.getItem("bharat_token");
      const subRes = await fetch(`${BASE_URL}/subcategories/${catId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const subData = await subRes.json();
      if (subRes.ok) {
        const fetched = (subData.data || []).map((s) => ({
          value: s._id,
          label: s.name,
        }));
        setSubcategories(fetched);
      }

      const emerRes = await fetch(
        `${BASE_URL}/emergency/subcategories/${catId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const emerData = await emerRes.json();
      if (emerRes.ok) {
        const fetched = (emerData.data || []).map((e) => ({
          value: e._id,
          label: e.name,
        }));
        setEmergencysubcategories(fetched);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to fetch sub-categories",
      });
    }
  };

  // ------------------------------------------------------------------------
  // Form Change Handlers
  // ------------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "name") {
      const clean = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData((prev) => ({ ...prev, name: clean }));
      const err =
        !clean.trim()
          ? "Name is required."
          : clean.trim().length < 3
          ? "Name must be at least 3 characters."
          : !/^[a-zA-Z\s]+$/.test(clean.trim())
          ? "Only letters and spaces allowed."
          : null;
      setErrors((prev) => ({ ...prev, name: err }));
      if (value !== clean) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Input",
          text: "Name can only contain letters and spaces!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      return;
    }

    if (name === "age") {
      const num = value.replace(/[^0-9]/g, "").slice(0, 2);
      setFormData((prev) => ({ ...prev, age: num }));
      const err =
        !num
          ? "Age is required."
          : parseInt(num, 10) < 18 || parseInt(num, 10) > 99
          ? "Age must be 18–99."
          : null;
      setErrors((prev) => ({ ...prev, age: err }));
      return;
    }

    if (name === "hasShop") {
      if (value === "no") {
        setFormData((prev) => ({
          ...prev,
          hasShop: value,
          shopAddress: "",
          shopFullAddress: [],
        }));
        setMarkerLocationShop(null);
      } else {
        setFormData((prev) => ({ ...prev, hasShop: value }));
      }
      const err = !value ? "Please select an option." : null;
      setErrors((prev) => ({ ...prev, hasShop: err }));
      return;
    }

    if (name === "aboutUs") {
      if (value.length > 500) {
        Swal.fire({
          icon: "warning",
          title: "Limit Exceeded",
          text: "Maximum 500 characters allowed.",
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
      const field = activeTab === "worker" ? "skill" : "aboutUs";
      setFormData((prev) => ({ ...prev, [field]: value }));
      const err =
        !value.trim()
          ? `${activeTab === "worker" ? "Skill" : "About Us"} is required.`
          : value.trim().length < 10
          ? "Minimum 10 characters."
          : null;
      setErrors((prev) => ({ ...prev, aboutUs: err }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ------------------------------------------------------------------------
  // Map & Address
  // ------------------------------------------------------------------------
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
        () => Swal.fire({
          icon: "error",
          title: "Location Error",
          text: "Unable to fetch your location.",
        })
      );
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

  const handleOpenAddressModal = (type) => {
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

  const handleSaveAddress = () => {
    if (
      !tempAddress.title.trim() ||
      !tempAddress.landmark.trim() ||
      !tempAddress.address.trim()
    ) {
      Swal.fire({
        icon: "error",
        title: "Incomplete",
        text: "Title, Landmark and Address are required.",
      });
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
      setErrors((prev) => ({ ...prev, address: undefined }));
    } else {
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
      setErrors((prev) => ({ ...prev, shopAddress: undefined }));
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

  // ------------------------------------------------------------------------
  // Final Validation
  // ------------------------------------------------------------------------
  const validateAll = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = "Name is required.";
    else if (formData.name.trim().length < 3) errs.name = "Name must be >= 3 chars.";
    else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim()))
      errs.name = "Only letters and spaces.";

    if (!formData.age) errs.age = "Age is required.";
    else if (parseInt(formData.age, 10) < 18 || parseInt(formData.age, 10) > 99)
      errs.age = "Age 18–99.";

    if (!formData.gender) errs.gender = "Gender is required.";

    if (!formData.address.trim()) errs.address = "Address is required.";

    const aboutVal = activeTab === "worker" ? formData.skill : formData.aboutUs;
    if (!aboutVal.trim())
      errs.aboutUs = `${activeTab === "worker" ? "Skill" : "About Us"} required.`;
    else if (aboutVal.trim().length < 10) errs.aboutUs = "Minimum 10 characters.";

    if (activeTab === "worker") {
      if (!formData.category) errs.category = "Category required.";
      if (!formData.subcategory.length) errs.subcategory = "Select at least one subcategory.";
      if (!formData.emergencysubcategory.length)
        errs.emergencysubcategory = "Select at least one emergency subcategory.";
      if (!formData.hasShop) errs.hasShop = "Select shop option.";
      if (formData.hasShop === "yes" && !formData.shopAddress.trim())
        errs.shopAddress = "Shop address required.";
    }

    return errs;
  };

  // ------------------------------------------------------------------------
  // Submit Handler
  // ------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = validateAll();
    const docErrors = getDocErrors();
    const allErrors = { ...fieldErrors, ...docErrors };

    if (Object.keys(allErrors).length) {
      setErrors(allErrors);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix all required fields.",
        confirmButtonColor: "#d33",
      });
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

        Object.keys(documents).forEach((key) => {
          const slot = documents[key];
          if (slot.file) {
            fd.append("documents", slot.file);
            fd.append("documentName", getDocumentName(key));
          }
        });

        if (businessImage.file) {
          fd.append("businessImage", businessImage.file);
        }

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

        if (formData.hasShop === "yes" && formData.shopFullAddress.length) {
          const addr = {
            address: formData.shopFullAddress[0].address,
            latitude: formData.shopFullAddress[0].latitude,
            longitude: formData.shopFullAddress[0].longitude,
          };
          fd.append("businessAddress", JSON.stringify(addr));
        }

        const res = await fetch(`${BASE_URL}/user/updateUserDetails`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: data.message || "Something went wrong.",
            confirmButtonColor: "#d33",
          });
          return;
        }

        if (profile?.role === "user" || profile?.verificationStatus === "rejected") {
          const upRes = await fetch(`${BASE_URL}/user/request-role-upgrade`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!upRes.ok) {
            const upData = await upRes.json();
            Swal.fire({
              icon: "warning",
              title: "Role Upgrade",
              text: upData.message || "Could not send request.",
              confirmButtonColor: "#f59e0b",
            });
          } else {
            Swal.fire({
              icon: "info",
              title: "Request Sent",
              text: "Your role upgrade request has been sent!",
              confirmButtonColor: "#10b981",
            });
          }
        }

        dispatch(fetchUserProfile());
        await Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          confirmButtonColor: "#22c55e",
        });
        navigate("/details");
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
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: data.message || "Something went wrong.",
            confirmButtonColor: "#d33",
          });
          return;
        }

        dispatch(fetchUserProfile());
        await Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          confirmButtonColor: "#22c55e",
        });
        navigate("/details");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please check your connection.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // ------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------
  const defaultCenter =
    markerLocationAddress ||
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
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
          Back
        </button>
      </div>

      <div className="max-w-[50rem] mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {activeTab === "worker"
            ? "Get your profile verified"
            : "Update User Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Image */}
          {activeTab === "worker" && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <label className="block mb-4 font-semibold text-gray-700">
                Business Image (optional)
              </label>
              <div className="max-w-sm mx-auto space-y-4">
                <label className="block cursor-pointer">
                  <div className="flex flex-col items-center justify-center px-6 py-10 bg-white border-2 border-dashed border-green-500 rounded-xl hover:bg-green-50 transition">
                    <svg
                      className="w-12 h-12 text-green-500 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-center text-gray-600">
                      {businessImage.preview ? "Change Image" : "Upload Image"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/avif,image/gif"
                    onChange={handleBusinessUpload}
                  />
                </label>

                {businessImage.preview && (
                  <div className="relative">
                    <img
                      src={businessImage.preview}
                      alt="Business"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Age</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="18–99"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.age ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } bg-white focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Address</label>
            <input
              type="text"
              value={formData.address}
              readOnly
              onClick={() => handleOpenAddressModal("address")}
              placeholder="Click to select address"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Worker Fields */}
          {activeTab === "worker" && (
            <>
              {/* Category */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Category
                </label>
                <Select
                  options={categories}
                  value={categories.find((c) => c.value === formData.category) || null}
                  onChange={(sel) => {
                    const id = sel?.value || "";
                    setFormData((prev) => ({
                      ...prev,
                      category: id,
                      subcategory: id !== prev.category ? [] : prev.subcategory,
                      emergencysubcategory:
                        id !== prev.category ? [] : prev.emergencysubcategory,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      category: id ? undefined : "Category required.",
                    }));
                    if (id) handleCategoryChange(sel);
                  }}
                  placeholder="Search or select..."
                  isClearable
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Subcategory
                </label>
                <Select
                  options={subcategories}
                  value={subcategories.filter((s) =>
                    formData.subcategory.includes(s.value)
                  )}
                  onChange={(opts) => {
                    const ids = opts ? opts.map((o) => o.value) : [];
                    setFormData((prev) => ({ ...prev, subcategory: ids }));
                    setErrors((prev) => ({
                      ...prev,
                      subcategory: ids.length ? undefined : "Select at least one.",
                    }));
                  }}
                  isMulti
                  isDisabled={!formData.category}
                  placeholder="Search or select..."
                />
                {errors.subcategory && (
                  <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>
                )}
              </div>

              {/* Emergency Subcategory */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Emergency Subcategory
                </label>
                <Select
                  options={emergencysubcategories}
                  value={emergencysubcategories.filter((e) =>
                    formData.emergencysubcategory.includes(e.value)
                  )}
                  onChange={(opts) => {
                    const ids = opts ? opts.map((o) => o.value) : [];
                    setFormData((prev) => ({
                      ...prev,
                      emergencysubcategory: ids,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      emergencysubcategory: ids.length
                        ? undefined
                        : "Select at least one.",
                    }));
                  }}
                  isMulti
                  isDisabled={!formData.category}
                  placeholder="Search or select..."
                />
                {errors.emergencysubcategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.emergencysubcategory}
                  </p>
                )}
              </div>

              {/* === DOCUMENTS === */}
              <div className="space-y-8">
                {/* Aadhaar */}
                <div className={`bg-gray-50 p-6 rounded-xl ${errors.aadhaar ? 'ring-2 ring-red-500' : ''}`}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Aadhaar Card <span className="text-red-600">*</span>
                  </h3>
                  {errors.aadhaar && (
                    <p className="text-red-500 text-sm -mt-2 mb-2">{errors.aadhaar}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Front */}
                    <div className="space-y-4">
                      <label className="font-medium text-gray-700">Front Side</label>
                      <label className="block cursor-pointer">
                        <div className="flex flex-col items-center justify-center px-6 py-10 bg-white border-2 border-dashed rounded-xl hover:bg-gray-50 transition">
                          <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-center text-gray-600">
                            {documents.aadhaarFront.preview ? "Change Front" : "Upload Front"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/avif,image/gif"
                          onChange={(e) => handleDocUpload(e, "aadhaarFront")}
                        />
                      </label>
                      {documents.aadhaarFront.preview && (
                        <div className="relative max-w-xs mx-auto">
                          <img src={documents.aadhaarFront.preview} alt="Aadhaar Front" className="w-full rounded-lg shadow-md" />
                          <button
                            type="button"
                            onClick={() => handleDocDelete("aadhaarFront")}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Back */}
                    <div className="space-y-4">
                      <label className="font-medium text-gray-700">Back Side</label>
                      <label className="block cursor-pointer">
                        <div className="flex flex-col items-center justify-center px-6 py-10 bg-white border-2 border-dashed rounded-xl hover:bg-gray-50 transition">
                          <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-center text-gray-600">
                            {documents.aadhaarBack.preview ? "Change Back" : "Upload Back"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/avif,image/gif"
                          onChange={(e) => handleDocUpload(e, "aadhaarBack")}
                        />
                      </label>
                      {documents.aadhaarBack.preview && (
                        <div className="relative max-w-xs mx-auto">
                          <img src={documents.aadhaarBack.preview} alt="Aadhaar Back" className="w-full rounded-lg shadow-md" />
                          <button
                            type="button"
                            onClick={() => handleDocDelete("aadhaarBack")}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PAN */}
                <div className={`bg-gray-50 p-6 rounded-xl ${errors.pan ? 'ring-2 ring-red-500' : ''}`}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    PAN Card <span className="text-red-600">*</span>
                  </h3>
                  {errors.pan && (
                    <p className="text-red-500 text-sm -mt-2 mb-2">{errors.pan}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="font-medium text-gray-700">Front Side</label>
                      <label className="block cursor-pointer">
                        <div className="flex flex-col items-center justify-center px-6 py-10 bg-white border-2 border-dashed rounded-xl hover:bg-gray-50 transition">
                          <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-center text-gray-600">
                            {documents.panFront.preview ? "Change Front" : "Upload Front"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/avif,image/gif"
                          onChange={(e) => handleDocUpload(e, "panFront")}
                        />
                      </label>
                      {documents.panFront.preview && (
                        <div className="relative max-w-xs mx-auto">
                          <img src={documents.panFront.preview} alt="PAN Front" className="w-full rounded-lg shadow-md" />
                          <button
                            type="button"
                            onClick={() => handleDocDelete("panFront")}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="font-medium text-gray-700">Back Side</label>
                      <label className="block cursor-pointer">
                        <div className="flex flex-col items-center justify-center px-6 py-10 bg-white border-2 border-dashed rounded-xl hover:bg-gray-50 transition">
                          <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-center text-gray-600">
                            {documents.panBack.preview ? "Change Back" : "Upload Back"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/avif,image/gif"
                          onChange={(e) => handleDocUpload(e, "panBack")}
                        />
                      </label>
                      {documents.panBack.preview && (
                        <div className="relative max-w-xs mx-auto">
                          <img src={documents.panBack.preview} alt="PAN Back" className="w-full rounded-lg shadow-md" />
                          <button
                            type="button"
                            onClick={() => handleDocDelete("panBack")}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selfie */}
                <div className={`bg-gray-50 p-6 rounded-xl ${errors.selfie ? 'ring-2 ring-red-500' : ''}`}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Selfie <span className="text-red-600">*</span>
                  </h3>
                  {errors.selfie && (
                    <p className="text-red-500 text-sm -mt-2 mb-2">{errors.selfie}</p>
                  )}
                  <div className="max-w-sm mx-auto space-y-4">
                    <label className="block cursor-pointer">
                      <div className="flex flex-col items-center justify-center px-6 py-10 bg-white border-2 border-dashed border-green-500 rounded-xl hover:bg-green-50 transition">
                        <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-center text-gray-600">
                          {documents.selfie.preview ? "Change Selfie" : "Upload Selfie"}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/avif,image/gif"
                        onChange={(e) => handleDocUpload(e, "selfie")}
                      />
                    </label>

                    {documents.selfie.preview && (
                      <div className="relative">
                        <img
                          src={documents.selfie.preview}
                          alt="Selfie"
                          className="w-full max-w-xs mx-auto rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleDocDelete("selfie")}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Has Shop */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Do you have a shop?
                </label>
                <div className="flex items-center space-x-6">
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
                {errors.hasShop && (
                  <p className="text-red-500 text-sm mt-2">{errors.hasShop}</p>
                )}
              </div>

              {/* Shop Address */}
              {formData.hasShop === "yes" && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Shop Address
                  </label>
                  <input
                    type="text"
                    value={formData.shopAddress}
                    readOnly
                    onClick={() => handleOpenAddressModal("shopAddress")}
                    placeholder="Click to select shop address"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.shopAddress ? "border-red-500" : "border-gray-300"
                    } cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                  />
                  {errors.shopAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.shopAddress}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* About / Skill */}
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
                  ? "Describe your skill (min 10 chars)..."
                  : "Tell us about yourself (min 10 chars)..."
              }
              maxLength={500}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.aboutUs ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none`}
            />
            <p className="text-sm text-gray-500 mt-1">
              {(activeTab === "worker" ? formData.skill : formData.aboutUs).length}
              /500
            </p>
            {errors.aboutUs && (
              <p className="text-red-500 text-sm mt-1">{errors.aboutUs}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-64 lg:w-72 mx-auto block bg-[#228b22] text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition shadow-md hover:shadow-lg"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {mapFor === "address" ? "Enter Address Details" : "Enter Shop Address Details"}
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

      {/* Map Modal */}
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
              onLoad={(m) => setMap(m)}
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
