import { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo.svg";
import Dropdown from "../assets/dropdown.svg";
import { Link, useNavigate } from "react-router-dom";
import AddressIcon from "../assets/location.svg";
import Profile from "../assets/profile.svg";
import Logout from "../assets/logout.svg";
import Account from "../assets/account.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, clearUserProfile } from "../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "../assets/notifications.svg";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaBriefcase, FaGavel, FaTrophy, FaUserTie } from "react-icons/fa";

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Component to handle map centering on location change
function MapController({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
}

export default function Header() {
  const role = localStorage.getItem("role");
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
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(
    parseInt(localStorage.getItem("selectedAddressId")) || 0
  );
  const [editingAddress, setEditingAddress] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(
    localStorage.getItem("selectedAddressTitle") || "Location"
  );
  const markerRef = useRef(null);
  const addressDropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("bharat_token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.user);
  const { notifications: reduxNotifications } = useSelector(
    (state) => state.emergency
  );

  let homeLink = "/";
  if (isLoggedIn) {
    homeLink = role === "service_provider" ? "/homeservice" : "/homeuser";
  }

  // Handle unauthorized access (401)
  const handleUnauthorized = () => {
    localStorage.removeItem("bharat_token");
    localStorage.removeItem("isProfileComplete");
    localStorage.removeItem("role");
    localStorage.removeItem("otp");
    localStorage.removeItem("selectedAddressId");
    localStorage.removeItem("selectedAddressTitle");
    dispatch(clearUserProfile());
    toast.error("Session expired, please log in again");
    navigate("/login");
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

  // Outside click handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setIsNotifOpen(false);
        setIsAddressDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user profile and sync selected address
  useEffect(() => {
    if (isLoggedIn && !profile && !loading && !error) {
      dispatch(fetchUserProfile()).then((result) => {
        if (fetchUserProfile.fulfilled.match(result)) {
          if (result.payload?.full_address) {
            setSavedAddresses(result.payload.full_address);
            const savedIndex =
              parseInt(localStorage.getItem("selectedAddressId")) || 0;
            if (result.payload.full_address.length > 0) {
              const defaultAddress =
                result.payload.full_address[savedIndex] ||
                result.payload.full_address[0];
              const addressTitle =
                defaultAddress.title || defaultAddress.address;
              setSelectedAddress(addressTitle);
              setSelectedAddressId(savedIndex);
              localStorage.setItem("selectedAddressTitle", addressTitle);
            }
          }
        } else if (fetchUserProfile.rejected.match(result)) {
          toast.error(result.payload || "Failed to fetch user profile");
          if (result.payload === "Session expired, please log in again") {
            handleUnauthorized();
          }
        }
      });
    } else if (profile?.full_address) {
      // Sync state with profile data when available
      setSavedAddresses(profile.full_address);
      const savedIndex =
        parseInt(localStorage.getItem("selectedAddressId")) || 0;
      if (profile.full_address.length > 0) {
        const defaultAddress =
          profile.full_address[savedIndex] || profile.full_address[0];
        const addressTitle = defaultAddress.title || defaultAddress.address;
        setSelectedAddress(addressTitle);
        setSelectedAddressId(savedIndex);
        localStorage.setItem("selectedAddressTitle", addressTitle);
      }
    }
  }, [dispatch, isLoggedIn, profile, loading, error]);

  // Fetch notifications
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
        const res = await fetch(`${BASE_URL}/user/getAllNotification`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const combinedNotifications = [
            ...reduxNotifications,
            ...(data.data || []),
          ];
          setNotifications(combinedNotifications);
          setNotificationCount(combinedNotifications.length);
        } else {
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }
          setNotifError(data.message || "Failed to fetch notifications");
          toast.error(data.message || "Failed to fetch notifications");
        }
      } catch (err) {
        setNotifError("Something went wrong while fetching notifications");
        toast.error("Something went wrong while fetching notifications");
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
  }, [isLoggedIn, reduxNotifications]);

  // Fetch user's current location
  useEffect(() => {
    if (isModalOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentAddress((prev) => ({ ...prev, latitude, longitude }));
          setMapError(null);
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data && data.address) {
              const addressParts = [];
              if (data.address.road) addressParts.push(data.address.road);
              if (data.address.suburb) addressParts.push(data.address.suburb);
              if (data.address.city) addressParts.push(data.address.city);
              const address = addressParts.join(", ") || "Current Location";
              setCurrentAddress((prev) => ({ ...prev, address }));
            } else {
              setCurrentAddress((prev) => ({ ...prev, address: "" }));
            }
          } catch (err) {
            setCurrentAddress((prev) => ({ ...prev, address: "" }));
            toast.error("Failed to fetch address details.");
          }
        },
        (err) => {
          setMapError("Unable to fetch your location. Please select manually.");
          toast.error("Unable to fetch your location. Please select manually.");
        }
      );
    }
  }, [isModalOpen]);

  // Handle map click
  const handleMapClick = async (e) => {
    const newPosition = [e.latlng.lat, e.latlng.lng];
    setCurrentAddress((prev) => ({
      ...prev,
      latitude: newPosition[0],
      longitude: newPosition[1],
    }));
    setMapError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition[0]}&lon=${newPosition[1]}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.address) {
        const addressParts = [];
        if (data.address.road) addressParts.push(data.address.road);
        if (data.address.suburb) addressParts.push(data.address.suburb);
        if (data.address.city) addressParts.push(data.address.city);
        const address = addressParts.join(", ") || "Selected Location";
        setCurrentAddress((prev) => ({ ...prev, address }));
      } else {
        setCurrentAddress((prev) => ({ ...prev, address: "" }));
      }
    } catch (err) {
      setCurrentAddress((prev) => ({ ...prev, address: "" }));
      toast.error("Failed to fetch address details.");
    }
  };

  // Handle marker drag
  const handleMarkerDrag = async (e) => {
    const marker = e.target;
    const newPosition = marker.getLatLng();
    setCurrentAddress((prev) => ({
      ...prev,
      latitude: newPosition.lat,
      longitude: newPosition.lng,
    }));
    setMapError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.address) {
        const addressParts = [];
        if (data.address.road) addressParts.push(data.address.road);
        if (data.address.suburb) addressParts.push(data.address.suburb);
        if (data.address.city) addressParts.push(data.address.city);
        const address = addressParts.join(", ") || "Selected Location";
        setCurrentAddress((prev) => ({ ...prev, address }));
      } else {
        setCurrentAddress((prev) => ({ ...prev, address: "" }));
      }
    } catch (err) {
      setCurrentAddress((prev) => ({ ...prev, address: "" }));
      toast.error("Failed to fetch address details.");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save location
  const handleSaveLocation = async () => {
    if (
      !currentAddress.title.trim() ||
      !currentAddress.landmark.trim() ||
      !currentAddress.address.trim() ||
      !currentAddress.latitude ||
      !currentAddress.longitude
    ) {
      toast.error("Please fill in all fields: Title, Landmark, and Address.");
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
          location: newAddress,
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
        setSelectedAddressId(newIndex);
        setSelectedAddress(newAddress.title || newAddress.address);
        localStorage.setItem("selectedAddressId", newIndex);
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
    });
  };

  // Handle delete address
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Address deleted successfully!");
        window.location.reload();
        const updatedAddresses = savedAddresses.filter(
          (_, idx) => idx !== index
        );
        setSavedAddresses(updatedAddresses);
        if (updatedAddresses.length === 0) {
          setSelectedAddressId(0);
          setSelectedAddress("Location");
          localStorage.setItem("selectedAddressId", 0);
          localStorage.setItem("selectedAddressTitle", "Location");
        } else {
          const newIndex =
            selectedAddressId === index
              ? 0
              : selectedAddressId > index
              ? selectedAddressId - 1
              : selectedAddressId;
          setSelectedAddressId(newIndex);
          const newSelectedAddress =
            updatedAddresses[newIndex]?.title ||
            updatedAddresses[newIndex]?.address ||
            "Location";
          setSelectedAddress(newSelectedAddress);
          localStorage.setItem("selectedAddressId", newIndex);
          localStorage.setItem("selectedAddressTitle", newSelectedAddress);
        }
        // Update profile after deletion
        const response = await fetch(`${BASE_URL}/user/updateUserProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_address: updatedAddresses,
            location: updatedAddresses[newIndex] || updatedAddresses[0],
          }),
        });
        const updateData = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
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

  // Handle edit address
  const handleEditAddress = (index) => {
    setEditingAddress(index);
    setCurrentAddress(savedAddresses[index]);
    setIsModalOpen(true);
    setIsAddressDropdownOpen(false);
  };

  // Handle select address
  const handleSelectAddress = async (index) => {
    setSelectedAddressId(index);
    const addressTitle =
      savedAddresses[index].title || savedAddresses[index].address;
    setSelectedAddress(addressTitle);
    localStorage.setItem("selectedAddressId", index);
    localStorage.setItem("selectedAddressTitle", addressTitle);

    // Call API to update selected address
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        handleUnauthorized();
        return;
      }
      const response = await fetch(`${BASE_URL}/user/updateUserProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_address: savedAddresses,
          location: savedAddresses[index] || savedAddresses[0],
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

  // Group notifications
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
        title: notif.title || "Notification",
        message: notif.message || "No message available",
      })),
    })
  );

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
                        key={index}
                        className="flex items-center justify-between py-2 gap-2"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === index}
                            onChange={() => handleSelectAddress(index)}
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
                            onClick={() => handleEditAddress(index)}
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
          {isLoggedIn && (
            <Link to="/bidding/newtask" className="hidden lg:block">
              <button className="bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow">
                + Post a Task
              </button>
            </Link>
          )}
          {/* Notification and User Dropdown - Rendered conditionally */}
          {isLoggedIn && (
            <>
              <div className="relative lg:flex hidden">
                <button
                  className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
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
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
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
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
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
                        <div className="border-t p-3 flex justify-center">
                          <button
                            onClick={() => {
                              setIsNotifOpen(false);
                              navigate("/notifications");
                            }}
                            className="text-sm font-medium text-[#228B22] hover:underline"
                          >
                            See all messages
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
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
                      <img src={Account} alt="Account" className="w-5 h-5" />
                      Account
                    </Link>
                    <Link
                      to="/details"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={Profile} alt="Profile" className="w-5 h-5" />
                      Profile
                    </Link>
                    <Link
                      to="/user/work-list/My Hire"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserTie className="w-5 h-5" />
                      My Hire
                    </Link>
                    <Link
                      to="/worker/work-list/My Hire"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaBriefcase className="w-5 h-5" />
                      My Work
                    </Link>
                    <Link
                      to="/disputes"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaGavel className="w-5 h-5" />
                      Disputes
                    </Link>
                    <Link
                      to="/promotion"
                      className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTrophy className="w-5 h-5" />
                      Promotion
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
              <Link to="/bidding/newtask" onClick={() => setIsMenuOpen(false)}>
                <button className="bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-6 py-2 rounded-xl shadow">
                  + Post a Task
                </button>
              </Link>
            )}
            {isLoggedIn && (
              <>
                <div className="relative lg:hidden">
                  <button
                    className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
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
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
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
                                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
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
                          <div className="border-t p-3 flex justify-center">
                            <button
                              onClick={() => {
                                setIsNotifOpen(false);
                                navigate("/notifications");
                              }}
                              className="text-sm font-medium text-[#228B22] hover:underline"
                            >
                              See all messages
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
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
                        <img src={Account} alt="Account" className="w-5 h-5" />
                        Account
                      </Link>
                      <Link
                        to="/details"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <img src={Profile} alt="Profile" className="w-5 h-5" />
                        Profile
                      </Link>
                      <Link
                        to="/user/work-list/My Hire"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUserTie className="w-5 h-5" />
                        My Hire
                      </Link>
                      <Link
                        to="/worker/work-list/My Hire"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaBriefcase className="w-5 h-5" />
                        My Work
                      </Link>
                      <Link
                        to="/disputes"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaGavel className="w-5 h-5" />
                        Disputes
                      </Link>
                      <Link
                        to="/promotion"
                        className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaTrophy className="w-5 h-5" />
                        Promotion
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
                Title
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
                Landmark
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
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={currentAddress.address}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Select location on map"
              />
            </div>
            <div className="h-64 mb-4 rounded-lg overflow-hidden shadow-md border border-gray-200">
              <MapContainer
                center={[currentAddress.latitude, currentAddress.longitude]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                onClick={handleMapClick}
              >
                <MapController
                  position={[currentAddress.latitude, currentAddress.longitude]}
                />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[currentAddress.latitude, currentAddress.longitude]}
                  draggable={true}
                  eventHandlers={{ dragend: handleMarkerDrag }}
                  ref={markerRef}
                >
                  <Popup>
                    Selected Location: {currentAddress.latitude.toFixed(4)},{" "}
                    {currentAddress.longitude.toFixed(4)}
                  </Popup>
                </Marker>
              </MapContainer>
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
