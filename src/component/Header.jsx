import { useState, useEffect, useRef, useCallback } from "react";
import Logo from "../assets/logo.svg";
import Dropdown from "../assets/dropdown.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, clearUserProfile } from "../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "../assets/notifications.svg";
import { FaBriefcase, FaGavel, FaTrophy, FaUserTie } from "react-icons/fa";
import Profile from "../assets/profile.svg";
import Logout from "../assets/logout.svg";
import Account from "../assets/account.svg";
import axios from "axios";
import { AiFillCloseCircle } from "react-icons/ai";
import Biding from "../assets/Homepage/bidding.svg";
import Emergency from "../assets/Homepage/emergency.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function Header() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    title: "",
    landmark: "",
    address: "",
    latitude: 51.505,
    longitude: -0.09,
    houseno: "",
    street: "",
    area: "",
    pincode: "",
    _id: null,
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(
    localStorage.getItem("selectedAddressId") || null
  );
  const [editingAddress, setEditingAddress] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(
    localStorage.getItem("selectedAddressTitle") || "Location"
  );
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const addressDropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null); // NEW: Ref for notification dropdown
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  const isLoggedIn = !!localStorage.getItem("bharat_token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);
  const { notifications: reduxNotifications } = useSelector(
    (state) => state.emergency
  );
  const location = useLocation();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isPostATastDropdown, setPostATaskDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const role = localStorage.getItem("role");
  const role = profile?.role || "service_provider";

  // let homeLink = "/";
  // if (isLoggedIn) {
  //   homeLink = role === "service_provider" ? "/homeservice" : "/homeuser";
  // }

  let homeLink = "/";

  if (isLoggedIn) {
    if (role === "both" || role === "service_provider") {
      homeLink = "/homeservice";
    } else if (role === "user") {
      homeLink = "/homeuser";
    }
  }

  const handleUnauthorized = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem("bharat_token");
      localStorage.removeItem("isProfileComplete");
      localStorage.removeItem("role");
      localStorage.removeItem("otp");
      localStorage.removeItem("selectedAddressId");
      localStorage.removeItem("selectedAddressTitle");
      dispatch(clearUserProfile());
      toast.error("Session expired, please log in again");
      navigate("/login");
    }
  };

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, isMenuOpen]);

  // Outside click handler for dropdowns (FIXED)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const outsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(event.target);
      const outsideAddress =
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target);
      const outsideNotif =
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target);

      if (outsideDropdown && outsideAddress && outsideNotif) {
        setIsOpen(false);
        setIsNotifOpen(false);
        setIsAddressDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", initializeMap);
        document.head.appendChild(script);
        return () => {
          document.head.removeChild(script);
        };
      } else {
        initializeMap();
      }
    };

    if (isModalOpen) {
      loadGoogleMapsScript();
    }
  }, [isModalOpen]);

  // Initialize Google Map and Autocomplete
  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: currentAddress.latitude, lng: currentAddress.longitude },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
    });

    const marker = new window.google.maps.Marker({
      position: { lat: currentAddress.latitude, lng: currentAddress.longitude },
      map: map,
      draggable: true,
    });

    markerRef.current = marker;

    window.google.maps.event.addListener(marker, "dragend", () => {
      const position = marker.getPosition();
      setCurrentAddress((prev) => ({
        ...prev,
        latitude: position.lat(),
        longitude: position.lng(),
      }));
      reverseGeocode(position.lat(), position.lng());
    });

    map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      setCurrentAddress((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      reverseGeocode(lat, lng);
    });

    const input = document.getElementById("address");
    if (input) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        input,
        {
          fields: ["formatted_address", "geometry", "address_components"],
          types: ["address"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          marker.setPosition({ lat, lng });
          map.setCenter({ lat, lng });
          setCurrentAddress((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            address: place.formatted_address,
            pincode:
              place.address_components.find((c) =>
                c.types.includes("postal_code")
              )?.long_name || prev.pincode,
            houseno:
              place.address_components.find((c) =>
                c.types.includes("street_number")
              )?.long_name || prev.houseno,
            street:
              place.address_components.find((c) => c.types.includes("route"))
                ?.long_name || prev.street,
            area:
              place.address_components.find(
                (c) =>
                  c.types.includes("sublocality") ||
                  c.types.includes("locality")
              )?.long_name || prev.area,
          }));
        } else {
          toast.error("Please select a valid address from the suggestions.");
        }
      });
    }
  };

  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const addressComponents = results[0].address_components;
        setCurrentAddress((prev) => ({
          ...prev,
          address: results[0].formatted_address,
          pincode:
            addressComponents.find((c) => c.types.includes("postal_code"))
              ?.long_name || prev.pincode,
          houseno:
            addressComponents.find((c) => c.types.includes("street_number"))
              ?.long_name || prev.houseno,
          street:
            addressComponents.find((c) => c.types.includes("route"))
              ?.long_name || prev.street,
          area:
            addressComponents.find(
              (c) =>
                c.types.includes("sublocality") || c.types.includes("locality")
            )?.long_name || prev.area,
        }));
      } else {
        toast.error("Failed to fetch address details.");
        setCurrentAddress((prev) => ({ ...prev, address: "" }));
      }
    });
  };

  useEffect(() => {
    if (isLoggedIn && !profile && !loading && !error) {
      dispatch(fetchUserProfile()).then((result) => {
        if (fetchUserProfile.fulfilled.match(result)) {
          if (result.payload?.full_address) {
            setSavedAddresses(result.payload.full_address);
          }
          if (result.payload?.location) {
            const addressTitle =
              result.payload.full_address?.[0]?.address ||
              result.payload.full_address?.[0]?.address ||
              "Location";
            setSelectedAddress(addressTitle);
            localStorage.setItem("selectedAddressTitle", addressTitle);
            if (result.payload.full_address?.length > 0) {
              const firstAddressId = result.payload.full_address[0]._id;

              setSelectedAddressId(firstAddressId);
              localStorage.setItem("selectedAddressId", firstAddressId);
            }
          }
        } else if (fetchUserProfile.rejected.match(result)) {
          toast.error(result.payload || "Failed to fetch user profile");
          if (result.payload === "Session expired, please log in again") {
            handleUnauthorized();
          }
        }
      });
    } else if (profile?.location) {
      const addressTitle =
        profile.location.title || profile.location.address || "Location";
      setSelectedAddress(addressTitle);
      setSavedAddresses(profile.full_address || []);
      localStorage.setItem("selectedAddressTitle", addressTitle);
      if (profile.location._id) {
        setSelectedAddressId(profile.location._id);
        localStorage.setItem("selectedAddressId", profile.location._id);
      }
    }
  }, [dispatch, isLoggedIn, profile, loading, error]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsNotifLoading(true);
        const token = localStorage.getItem("bharat_token");
        if (!token) {
          setNotifError("User not logged in");
          toast.error("Please log in to view notifications");
          return;
        }

        if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
          handleUnauthorized();
          return;
        }

        //   const res = await fetch(`${BASE_URL}/user/getAllNotification`, {
        //     method: "GET",
        //     headers: { Authorization: `Bearer ${token}` },
        //   });
        //   const data = await res.json();

        //   if (res.ok && data.success) {
        //     const combinedNotifications = [
        //       ...reduxNotifications,
        //       ...(data.notifications || []),
        //     ];
        //     setNotifications(combinedNotifications);

        //     const count = combinedNotifications.filter((notif) => !notif.isRead);
        //     setNotificationCount(count.length);
        //   } else {
        //     if (res.status === 401) {
        //       handleUnauthorized();
        //       return;
        //     }
        //     setNotifError(data.message || "Failed to fetch notifications");
        //     toast.error(data.message || "Failed to fetch notifications");
        //   }
        // } catch (err) {
        //   setNotifError("Something went wrong while fetching notifications");
        // } finally {
        //   setIsNotifLoading(false);
        // }
        const res = await fetch(`${BASE_URL}/user/getAllNotification`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          const combinedNotifications = [
            ...reduxNotifications,
            ...(data.notifications || []),
          ];
          setNotifications(combinedNotifications);

          const count = combinedNotifications.filter((notif) => !notif.isRead);
          setNotificationCount(count.length);
        } else {
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }

       
          if (
            data?.status === false &&
            data?.message === "Admin has disabled your account."
          ) {
            localStorage.removeItem("bharat_token");
            localStorage.removeItem("isProfileComplete");
            localStorage.removeItem("otp");
            localStorage.removeItem("role");
            toast.error("Admin has disabled your account.");

            return;
          }

          setNotifError(data.message || "Failed to fetch notifications");
          toast.error(data.message || "Failed to fetch notifications");
        }
      } catch (err) {
        setNotifError("Something went wrong while fetching notifications");
      } finally {
        setIsNotifLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
    } else {
      setNotifications(reduxNotifications);
      setNotificationCount(reduxNotifications.length);
    }
  }, [isLoggedIn, reduxNotifications, refreshNotifications]);

  const handleNotificationClick = async () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);

    if (nextState) {
      try {
        const token = localStorage.getItem("bharat_token");
        await axios.put(
          `${BASE_URL}/user/markNotificationAsRead`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRefreshNotifications((prev) => !prev);
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  useEffect(() => {
    if (isModalOpen && navigator.geolocation && editingAddress === null) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentAddress((prev) => ({ ...prev, latitude, longitude }));
          setMapError(null);
          reverseGeocode(latitude, longitude);
        },
        (err) => {
          setMapError("Unable to fetch your location. Please select manually.");
          toast.error("Unable to fetch your location. Please select manually.");
        }
      );
    }
  }, [isModalOpen, editingAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveLocation = async () => {
    if (
      !currentAddress.title.trim() ||
      !currentAddress.landmark.trim() ||
      !currentAddress.address.trim() ||
      !currentAddress.latitude ||
      !currentAddress.longitude
    ) {
      toast.error(
        "Please fill in required fields: Title, Landmark, and Address."
      );
      return;
    }
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        handleUnauthorized();
        return;
      }
      const newAddress = {
        title: currentAddress.title,
        landmark: currentAddress.landmark,
        address: currentAddress.address,
        latitude: currentAddress.latitude,
        longitude: currentAddress.longitude,
        houseno: currentAddress.houseno || null,
        street: currentAddress.street || null,
        area: currentAddress.area || null,
        pincode: currentAddress.pincode || null,
        ...(editingAddress !== null && currentAddress._id
          ? { _id: currentAddress._id }
          : {}),
      };
      let updatedAddresses;
      if (editingAddress !== null) {
        updatedAddresses = savedAddresses.map((addr, idx) =>
          idx === editingAddress ? newAddress : addr
        );
      } else {
        updatedAddresses = [...savedAddresses, newAddress];
      }
      const response = await fetch(`${BASE_URL}/user/updateUserProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_address: updatedAddresses,
          location: {
            latitude: newAddress.latitude,
            longitude: newAddress.longitude,
            address: newAddress.address,
          },
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Location updated successfully!");
        setSavedAddresses(updatedAddresses);
        const newIndex =
          editingAddress !== null
            ? editingAddress
            : updatedAddresses.length - 1;
        setSelectedAddressId(newAddress._id || newIndex);
        setSelectedAddress(newAddress.title || newAddress.address);
        localStorage.setItem("selectedAddressId", newAddress._id || newIndex);
        localStorage.setItem(
          "selectedAddressTitle",
          newAddress.title || newAddress.address
        );
        setEditingAddress(null);
        dispatch(fetchUserProfile());
      } else {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        toast.error(data.message || "Failed to update location");
      }
    } catch (err) {
      toast.error("Network error while updating location");
    }
    setIsModalOpen(false);
    setCurrentAddress({
      title: "",
      landmark: "",
      address: "",
      latitude: 51.505,
      longitude: -0.09,
      houseno: "",
      street: "",
      area: "",
      pincode: "",
      _id: null,
    });
  };

  const handleDeleteAddress = async (index, addressId) => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        handleUnauthorized();
        return;
      }
      const response = await fetch(
        `${BASE_URL}/user/deleteAddress/${addressId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Address deleted successfully!");
        const updatedAddresses = savedAddresses.filter(
          (_, idx) => idx !== index
        );
        setSavedAddresses(updatedAddresses);
        let newLocation = profile.location;
        if (selectedAddressId === addressId) {
          newLocation = updatedAddresses[0] || null;
          const newSelectedAddress = newLocation
            ? newLocation.title || newLocation.address
            : "Location";
          setSelectedAddressId(newLocation?._id || null);
          setSelectedAddress(newSelectedAddress);
          localStorage.setItem("selectedAddressId", newLocation?._id || "");
          localStorage.setItem("selectedAddressTitle", newSelectedAddress);
        }
        const updateResponse = await fetch(
          `${BASE_URL}/user/updateUserProfile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              full_address: updatedAddresses,
              location: newLocation
                ? {
                    latitude: newLocation.latitude,
                    longitude: newLocation.longitude,
                    address: newLocation.address,
                  }
                : null,
            }),
          }
        );
        const updateData = await updateResponse.json();
        if (!updateResponse.ok) {
          if (updateResponse.status === 401) {
            handleUnauthorized();
            return;
          }
          toast.error(
            updateData.message || "Failed to update profile after deletion"
          );
        }
        dispatch(fetchUserProfile());
      } else {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        toast.error(data.message || "Failed to delete address");
      }
    } catch (err) {
      toast.error("Network error while deleting address");
    }
    setIsAddressDropdownOpen(false);
  };

  const handleEditAddress = (index, addressId) => {
    setEditingAddress(index);
    setCurrentAddress({
      ...savedAddresses[index],
      _id: addressId,
    });
    setIsModalOpen(true);
    setIsAddressDropdownOpen(false);
  };

  const handleSelectAddress = async (index, addressId) => {
    const selectedAddr = savedAddresses[index];
    setSelectedAddressId(addressId);
    const addressTitle = selectedAddr.title || selectedAddr.address;
    setSelectedAddress(addressTitle);
    localStorage.setItem("selectedAddressId", addressId);
    localStorage.setItem("selectedAddressTitle", addressTitle);

    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        handleUnauthorized();
        return;
      }
      const response = await fetch(`${BASE_URL}/user/updateLocation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: selectedAddr.latitude,
          longitude: selectedAddr.longitude,
          address: selectedAddr.address,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Address selected successfully!");
        setIsAddressDropdownOpen(false);
        dispatch(fetchUserProfile());
      } else {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        toast.error(data.message || "Failed to update selected address");
      }
    } catch (err) {
      toast.error("Network error while updating address");
    }
  };

  let fullName = profile?.full_name || null;
  if (!isLoggedIn) fullName = null;

  const logoutdestroy = () => {
    handleUnauthorized();
  };

  const groupedNotifications = notifications.reduce((acc, notif) => {
    const date = new Date(notif.createdAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const today = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
    let section = date;
    if (date === today) section = "Today";
    else if (date === yesterday) section = "Yesterday";
    if (!acc[section]) acc[section] = [];
    acc[section].push(notif);
    return acc;
  }, {});

  const notificationSections = Object.keys(groupedNotifications).map(
    (section) => ({
      section,
      items: groupedNotifications[section].map((notif) => ({
        ...notif,
        title: notif.title || "Notification",
        message: notif.message || "No message available",
      })),
    })
  );

  // FIXED: Notification click handler
  const handleRedirectNotification = (notif) => {
    console.log("Notification clicked:", notif);
    let orderId = notif.orderId;
    // let userId = notif.userId
    if (notif.userType === "user") {
      if (notif.orderType === "direct") {
        window.location.href = `/my-hire/order-detail/${orderId}`;
      } else if (notif.orderType === "bidding") {
        window.location.href = `/bidding/order-detail/${orderId}`;
      } else {
        window.location.href = `/emergency/order-detail/${orderId}`;
      }
    } else if (notif.userType === "service_provider") {
      if (notif.orderType === "direct") {
        window.location.href = `/hire/worker/order-detail/${orderId}`;
      } else if (notif.orderType === "bidding") {
        window.location.href = `/bidding/worker/order-detail/${orderId}`;
      } else {
        window.location.href = `/emergency/worker/order-detail/${orderId}`;
      }
    } else {
      window.location.href = `/disputes`;
    }
  };

  return (
    <header className="w-full bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] fixed top-0 z-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Section - Logo */}
        <div className="flex-shrink-0">
          <img
            src={Logo}
            alt="Logo"
            className="h-10 w-auto cursor-pointer sm:h-12"
            onClick={() => navigate(homeLink)}
          />
        </div>

        {/* Center Section - Location Input and Navigation */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          {isLoggedIn && (
            <div className="relative" ref={addressDropdownRef}>
              <div className="flex items-center gap-2 bg-[#EBEBEB] rounded-lg px-3 py-2 cursor-pointer w-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-[#334247] flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder={selectedAddress}
                  className="bg-transparent focus:outline-none text-sm text-gray-700 w-full truncate"
                  aria-label="Location input"
                  onClick={() =>
                    setIsAddressDropdownOpen(!isAddressDropdownOpen)
                  }
                  readOnly
                />
              </div>
              {isAddressDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                  {savedAddresses.length === 0 ? (
                    <p className="text-sm text-gray-600">No saved addresses</p>
                  ) : (
                    savedAddresses.map((address, index) => (
                      <div
                        key={address._id || index}
                        className="flex items-center justify-between py-2 gap-2"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === address._id}
                            onChange={() =>
                              handleSelectAddress(index, address._id)
                            }
                            className="form-radio h-4 w-4 text-[#228B22] flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {address.title || address.address}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {address.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() =>
                              handleEditAddress(index, address._id)
                            }
                            className="text-sm text-[#228B22] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAddress(index, address._id)
                            }
                            className="text-sm text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setCurrentAddress({
                        title: "",
                        landmark: "",
                        address: "",
                        latitude: 51.505,
                        longitude: -0.09,
                        houseno: "",
                        street: "",
                        area: "",
                        pincode: "",
                        _id: null,
                      });
                      setIsModalOpen(true);
                      setIsAddressDropdownOpen(false);
                    }}
                    className="w-full mt-2 bg-[#228B22] text-white py-2 rounded-lg hover:bg-green-800"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>
          )}
          <nav className="hidden lg:flex items-center gap-6 text-[#969696] text-base font-medium">
            <Link to={homeLink} className="hover:text-black">
              Home
            </Link>
            <Link to="/aboutus" className="hover:text-black">
              About
            </Link>
            <Link to="/ourservices" className="hover:text-black">
              Services
            </Link>
            {isLoggedIn && (
              <Link to="/chats" className="hover:text-black">
                Chats
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {!isLoggedIn && (
            <Link
              to="/login"
              className="flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow text-sm font-medium gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Login/Signup
              <img src={Dropdown} alt="Dropdown" className="w-5 h-5" />
            </Link>
          )}
          {/* {isLoggedIn && (
            <Link to="/bidding/newtask" className="hidden lg:block">
              <button className="bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow">
                + Post a Task
              </button>
            </Link>
          )} */}
          {isLoggedIn && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setPostATaskDropdown(!isPostATastDropdown)}
                className="bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow"
              >
                + Post a Task
              </button>
              {isPostATastDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] py-2 z-50 border border-gray-100 animate-fadeIn">
                  <Link
                    to="/bidding/newtask"
                    className="flex items-center gap-2 font-bold  px-4 py-3 hover:bg-gray-50 transition-all rounded-lg"
                    onClick={() => setPostATaskDropdown(false)}
                  >
                    <img
                      src={Biding}
                      alt=""
                      className="w-6 h-6 text-gray-700"
                    />
                    <span>Bidding Task</span>
                  </Link>

                  <div className="w-full h-px bg-gray-200 my-1"></div>

                  <Link
                    to="/emergency/userpost"
                    className="flex items-center font-bold gap-2 px-4 py-3 hover:bg-gray-50 transition-all rounded-lg"
                    onClick={() => setPostATaskDropdown(false)}
                  >
                    <img
                      src={Emergency}
                      alt=""
                      className="w-6 h-6 text-gray-700"
                    />

                    <span>Emergency Task</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {isLoggedIn && (
            <>
              {/* Desktop Notification */}
              <div className="relative lg:flex hidden">
                <button
                  className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={handleNotificationClick}
                >
                  <img
                    src={Notification}
                    alt="Notification"
                    className="w-6 h-6 text-gray-700"
                  />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {isNotifOpen && (
                  <div
                    ref={notifDropdownRef}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
                  >
                    {isNotifLoading ? (
                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#228B22]"></div>
                          <p className="text-gray-600 text-sm">Loading...</p>
                        </div>
                      </div>
                    ) : notifError ? (
                      <div className="p-4 text-center text-red-500 text-sm">
                        {notifError}
                      </div>
                    ) : notificationSections.length === 0 ? (
                      <div className="p-4 text-center text-gray-600 text-sm">
                        No recent update
                      </div>
                    ) : (
                      <>
                        {notificationSections.map((section, i) => (
                          <div key={i}>
                            <div className="p-3 text-sm font-medium text-gray-700 border-b">
                              {section.section}
                            </div>
                            {section.items.map((notif, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                  handleRedirectNotification(notif)
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={Logo}
                                    alt="coin"
                                    className="w-10 h-10"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">
                                      {notif.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {notif.message}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-gray-400 text-xs font-medium">
                                  {section.section}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                        {/*<div className="border-t p-3 flex justify-center">
                          <button
                            onClick={() => {
                              setIsNotifOpen(false);
                              navigate("/notifications");
                            }}
                            className="text-sm font-medium text-[#228B22] hover:underline"
                          >
                            See all messages
                          </button>
                        </div>*/}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative lg:flex hidden" ref={dropdownRef}>
                {fullName ? (
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow text-sm font-medium gap-2"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-[150px]">
                      {fullName}
                    </span>
                    <img
                      src={Dropdown}
                      alt="Dropdown"
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow text-sm font-medium gap-2"
                  >
                    Login / Signup
                    <img src={Dropdown} alt="Dropdown" className="w-5 h-5" />
                  </Link>
                )}
                {isOpen && fullName && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={Account} alt="Account" className="w-5 h-5" />{" "}
                      Account
                    </Link>
                    <Link
                      to="/details"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={Profile} alt="Profile" className="w-5 h-5" />{" "}
                      Profile
                    </Link>
                    <Link
                      to="/user/work-list/My Hire"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserTie className="w-5 h-5" /> My Hire
                    </Link>
                    <Link
                      to="/worker/work-list/My Hire"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaBriefcase className="w-5 h-5" /> My Work
                    </Link>

                    {(role === "service_provider" || role === "both") && (
                      <Link
                        to="/worker/rejected-work"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <AiFillCloseCircle className="w-5 h-5" /> Rejected Task
                        
                      </Link>
                      
                      
                      
                    )}
                 
                       {(role === "service_provider" || role === "both") && (
                      <Link
                        to="/worker/emergency/rejected-work"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <AiFillCloseCircle className="w-5 h-5" /> Emergency Work
                      </Link>
                      
                      
                      
                    )}


                    <Link
                      to="/disputes"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaGavel className="w-5 h-5" /> Disputes
                    </Link>
                    <Link
                      to="/promotion"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTrophy className="w-5 h-5" /> Promotion
                    </Link>
                    <button
                      onClick={logoutdestroy}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-black font-semibold hover:bg-gray-100"
                    >
                      <img src={Logout} alt="Logout" className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {/*<button
            className="lg:hidden p-2 rounded-md border border-gray-300 bg-[#228B22]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button> */}
          {!(
            location.pathname === "/service-provider-list" && isLargeScreen
          ) && (
            <button
              className="lg:hidden p-2 rounded-md border border-gray-300 bg-[#228B22]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg fixed top-[60px] left-0 w-full z-40">
          <div className="px-4 py-4 space-y-3 text-[#969696] font-medium flex flex-col items-center text-center">
            <Link
              to={homeLink}
              className="hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/aboutus"
              className="hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/ourservices"
              className="hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            {isLoggedIn && (
              <Link
                to="/chats"
                className="hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Chats
              </Link>
            )}
            {isLoggedIn && (
              <div className="relative lg:hidden">
                <button
                  onClick={() => setPostATaskDropdown(!isPostATastDropdown)}
                  className="bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow"
                >
                  + Post a Task
                </button>
                {isPostATastDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.1)] py-2 z-50 border border-gray-100 animate-fadeIn">
                    <Link
                      to="/bidding/newtask"
                      className="flex items-center gap-2 font-bold  px-4 py-3 hover:bg-gray-50 transition-all rounded-lg"
                      onClick={() => setPostATaskDropdown(false)}
                    >
                      <img
                        src={Biding}
                        alt=""
                        className="w-6 h-6 text-gray-700"
                      />
                      <span>Bidding Task</span>
                    </Link>

                    <div className="w-full h-px bg-gray-200 my-1"></div>

                    <Link
                      to="/emergency/userpost"
                      className="flex items-center font-bold gap-2 px-4 py-3 hover:bg-gray-50 transition-all rounded-lg"
                      onClick={() => setPostATaskDropdown(false)}
                    >
                      <img
                        src={Emergency}
                        alt=""
                        className="w-6 h-6 text-gray-700"
                      />

                      <span>Emergency Task</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
            {isLoggedIn && (
              <>
                {/* Mobile Notification */}
                <div className="relative lg:hidden">
                  <button
                    className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100"
                    onClick={handleNotificationClick}
                  >
                    <img
                      src={Notification}
                      alt="Notification"
                      className="w-6 h-6 text-gray-700"
                    />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  {isNotifOpen && (
                    <div
                      ref={notifDropdownRef}
                      className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
                    >
                      {isNotifLoading ? (
                        <div className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#228B22]"></div>
                            <p className="text-gray-600 text-sm">Loading...</p>
                          </div>
                        </div>
                      ) : notifError ? (
                        <div className="p-4 text-center text-red-500 text-sm">
                          {notifError}
                        </div>
                      ) : notificationSections.length === 0 ? (
                        <div className="p-4 text-center text-gray-600 text-sm">
                          No recent update
                        </div>
                      ) : (
                        <>
                          {notificationSections.map((section, i) => (
                            <div key={i}>
                              <div className="p-3 text-sm font-medium text-gray-700 border-b">
                                {section.section}
                              </div>
                              {section.items.map((notif, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                  onClick={() =>
                                    handleRedirectNotification(notif)
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={Logo}
                                      alt="coin"
                                      className="w-10 h-10"
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">
                                        {notif.title}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {notif.message}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-gray-400 text-xs font-medium">
                                    {section.section}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                          {/*<div className="border-t p-3 flex justify-center">
                            <button
                              onClick={() => {
                                setIsNotifOpen(false);
                                navigate("/notifications");
                              }}
                              className="text-sm font-medium text-[#228B22] hover:underline"
                            >
                              See all messages
                            </button>
                          </div>*/}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Profile Dropdown */}
                <div className="relative lg:hidden" ref={dropdownRef}>
                  {fullName ? (
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow text-sm font-medium gap-2"
                    >
                      <span className="truncate max-w-[120px] sm:max-w-[150px]">
                        {fullName}
                      </span>
                      <img
                        src={Dropdown}
                        alt="Dropdown"
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow text-sm font-medium gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login / Signup
                      <img src={Dropdown} alt="Dropdown" className="w-5 h-5" />
                    </Link>
                  )}
                  {isOpen && fullName && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                      <Link
                        to="/account"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <img src={Account} alt="Account" className="w-5 h-5" />{" "}
                        Account
                      </Link>
                      <Link
                        to="/details"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <img src={Profile} alt="Profile" className="w-5 h-5" />{" "}
                        Profile
                      </Link>
                      <Link
                        to="/user/work-list/My Hire"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUserTie className="w-5 h-5" /> My Hire
                      </Link>
                      <Link
                        to="/worker/work-list/My Hire"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaBriefcase className="w-5 h-5" /> My Work
                      </Link>
                        
                    
                        {(role === "service_provider" || role === "both") && (
                      <Link
                        to="/worker/rejected-work"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <AiFillCloseCircle className="w-5 h-5" />Rejected Task
                      </Link>                   
                      
                      
                    )}
                       {(role === "service_provider" || role === "both") && (
                      <Link
                        to="/worker/emergency/rejected-work"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <AiFillCloseCircle className="w-5 h-5" /> Emergency Work
                      </Link>
                      
                      
                      
                    )}
                      <Link
                        to="/disputes"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaGavel className="w-5 h-5" /> Disputes
                      </Link>
                      <Link
                        to="/promotion"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaTrophy className="w-5 h-5" /> Promotion
                      </Link>
                      <button
                        onClick={logoutdestroy}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      >
                        <img src={Logout} alt="Logout" className="w-5 h-5" />{" "}
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Address Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingAddress !== null ? "Edit Address" : "Add New Address"}
            </h2>
            {mapError && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
                {mapError}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={currentAddress.title}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter a title (e.g., Home, Office)"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="landmark"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Landmark *
              </label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={currentAddress.landmark}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter a landmark (e.g., Near City Mall)"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={currentAddress.address}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter or select address"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="houseno"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                House No
              </label>
              <input
                type="text"
                id="houseno"
                name="houseno"
                value={currentAddress.houseno}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter house number"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={currentAddress.street}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter street name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Area
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={currentAddress.area}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter area"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={currentAddress.pincode}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter pincode"
              />
            </div>
            <div className="h-64 mb-4 rounded-lg overflow-hidden shadow-md border border-gray-200">
              <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#228B22] text-white rounded-lg hover:bg-green-800"
                onClick={handleSaveLocation}
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
