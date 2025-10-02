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
  const [selectedAddress, setSelectedAddress] = useState("Location");
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
    console.log(
      "handleUnauthorized: Clearing localStorage and redirecting to login"
    );
    localStorage.removeItem("bharat_token");
    localStorage.removeItem("isProfileComplete");
    localStorage.removeItem("role");
    localStorage.removeItem("otp");
    localStorage.removeItem("selectedAddressId");
    dispatch(clearUserProfile());
    toast.error("Session expired, please log in again");
    navigate("/login");
  };

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

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

  // Fetch user profile only if logged in and profile is not already loaded
  useEffect(() => {
    if (isLoggedIn && !profile && !loading && !error) {
      const token = localStorage.getItem("bharat_token");
      console.log(
        "useEffect: fetchUserProfile triggered, token:",
        token ? token.slice(0, 10) + "..." : "null"
      );
      dispatch(fetchUserProfile()).then((result) => {
        if (fetchUserProfile.fulfilled.match(result)) {
          console.log("useEffect: fetchUserProfile succeeded");
          if (result.payload?.full_address) {
            setSavedAddresses(result.payload.full_address);
            const savedIndex =
              parseInt(localStorage.getItem("selectedAddressId")) || 0;
            if (result.payload.full_address.length > 0) {
              const defaultAddress =
                result.payload.full_address[savedIndex] ||
                result.payload.full_address[0];
              setSelectedAddress(
                defaultAddress.title || defaultAddress.address
              );
              setSelectedAddressId(savedIndex);
            }
          }
        } else if (fetchUserProfile.rejected.match(result)) {
          console.log("useEffect: fetchUserProfile failed:", result.payload);
          toast.error(result.payload || "Failed to fetch user profile");
          if (result.payload === "Session expired, please log in again") {
            handleUnauthorized();
          }
        }
      });
    }
  }, [dispatch, isLoggedIn, profile, loading, error]);

  // Fetch notifications only if logged in
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsNotifLoading(true);
        const token = localStorage.getItem("bharat_token");
        if (!token) {
          console.log("fetchNotifications: No token found, skipping API call");
          setNotifError("User not logged in");
          toast.error("Please log in to view notifications");
          return;
        }

        // Basic token format validation (e.g., expecting JWT-like structure)
        if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
          console.log(
            "fetchNotifications: Invalid token format, clearing token"
          );
          handleUnauthorized();
          return;
        }

        console.log(
          "fetchNotifications: Attempting API call with token:",
          token.slice(0, 10) + "..."
        );
        const res = await fetch(`${BASE_URL}/user/getAllNotification`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          console.log("fetchNotifications: Success, data received");
          const combinedNotifications = [
            ...reduxNotifications,
            ...(data.data || []),
          ];
          setNotifications(combinedNotifications);
          setNotificationCount(combinedNotifications.length);
        } else {
          console.log(
            "fetchNotifications: Failed with status",
            res.status,
            data?.message
          );
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }
          setNotifError(data.message || "Failed to fetch notifications");
          toast.error(data.message || "Failed to fetch notifications");
        }
      } catch (err) {
        console.error("fetchNotifications: Error:", err.message);
        setNotifError("Something went wrong while fetching notifications");
        toast.error("Something went wrong while fetching notifications");
      } finally {
        setIsNotifLoading(false);
      }
    };

    if (isLoggedIn) {
      console.log("useEffect: fetchNotifications triggered");
      fetchNotifications();
    } else {
      console.log("useEffect: Not logged in, using reduxNotifications");
      setNotifications(reduxNotifications);
      setNotificationCount(reduxNotifications.length);
    }
  }, [isLoggedIn, reduxNotifications]);

  // Fetch user's current location when modal opens
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
        console.log("handleSaveLocation: No token found, redirecting to login");
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
        setEditingAddress(null);
        dispatch(fetchUserProfile());
      } else {
        if (response.status === 401) {
          console.log(
            "handleSaveLocation: 401 Unauthorized, redirecting to login"
          );
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

  // Handle edit address
  const handleEditAddress = (index) => {
    setEditingAddress(index);
    setCurrentAddress(savedAddresses[index]);
    setIsModalOpen(true);
    setIsAddressDropdownOpen(false);
  };

  // Handle select address
  const handleSelectAddress = (index) => {
    setSelectedAddressId(index);
    setSelectedAddress(
      savedAddresses[index].title || savedAddresses[index].address
    );
    localStorage.setItem("selectedAddressId", index);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        console.log("handleSaveChanges: No token found, redirecting to login");
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
          location: savedAddresses[selectedAddressId] || savedAddresses[0],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsAddressDropdownOpen(false);
        dispatch(fetchUserProfile());
      } else {
        if (response.status === 401) {
          console.log(
            "handleSaveChanges: 401 Unauthorized, redirecting to login"
          );
          handleUnauthorized();
          return;
        }
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Network error while updating profile");
    }
  };

  let fullName = profile?.full_name || null;
  if (!isLoggedIn) fullName = null;

  const logoutdestroy = () => {
    console.log("logoutdestroy: Logging out and clearing localStorage");
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
      { day: "numeric", month: "long", year: "numeric" }
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
    <header className="w-full bg-white shadow-[0_6px_10px_-2px_rgba(0,0,0,0.3)]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-[90%] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section - Logo and Location Input */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-shrink-0">
            <img
              src={Logo}
              alt="Logo"
              className="h-12 w-[180px] cursor-pointer"
              onClick={() => navigate(homeLink)}
            />
          </div>
          {isLoggedIn && (
            <div
              className="relative flex items-center"
              ref={addressDropdownRef}
            >
              <input
                type="text"
                placeholder={selectedAddress}
                className="px-4 py-2 rounded-lg bg-[#EBEBEB] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-48 sm:w-64 placeholder:text-[#334247] placeholder:font-semibold cursor-pointer"
                aria-label="Location input"
                onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
                readOnly
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 text-[#334247] font-semibold absolute right-3"
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
              {isAddressDropdownOpen && (
                <div className="absolute top-12 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                  {savedAddresses.length === 0 ? (
                    <p className="text-sm text-gray-600">No saved addresses</p>
                  ) : (
                    savedAddresses.map((address, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === index}
                            onChange={() => handleSelectAddress(index)}
                            className="form-radio h-4 w-4 text-[#228B22]"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {address.title || address.address}
                            </p>
                            <p className="text-xs text-gray-500">
                              {address.address}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditAddress(index)}
                          className="text-sm text-[#228B22] hover:underline"
                        >
                          Edit
                        </button>
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
                  {savedAddresses.length > 0 && (
                    <button
                      onClick={handleSaveChanges}
                      className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 hidden max-md:!hidden md:flex justify-center gap-8 text-[#969696] text-base font-medium">
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

        {/* Right Section */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {isLoggedIn && (
            <Link to="/bidding/newtask">
              <button className="hidden sm:block bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow">
                + Post a Task
              </button>
            </Link>
          )}
          {isLoggedIn && (
            <div className="relative">
              <button
                className="relative hidden sm:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <img
                  src={Notification}
                  alt="Notification"
                  className="w-6 h-6 text-gray-700"
                />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
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
          )}
          <div className="relative" ref={dropdownRef}>
            {fullName ? (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden sm:flex bg-white border-transparent px-4 py-2 rounded-full shadow text-base font-medium items-center gap-2 cursor-pointer"
              >
                {fullName}
                <img
                  src={Dropdown}
                  alt="Dropdown"
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex bg-white border-transparent px-4 py-2 rounded-full shadow text-base font-medium items-center gap-2 cursor-pointer"
              >
                Login / Signup
                <img src={Dropdown} alt="Dropdown" className="w-6 h-6" />
              </Link>
            )}
            {isOpen && fullName && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-50 transition-all duration-300 transform">
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <img src={Account} alt="Account" className="w-5 h-5" />
                  Account
                </Link>
                <Link
                  to="/details"
                  className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <img src={Profile} alt="Profile" className="w-5 h-5" />
                  Profile
                </Link>
                <Link
                  to="/user/work-list/My Hire"
                  className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <div>
                    <FaUserTie
                      className="w-5 h-5 text-black-500"
                      title="Hiring"
                    />
                  </div>
                  My Hire
                </Link>
                <Link
                  to="/worker/work-list/My Hire"
                  className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <div>
                    <FaBriefcase
                      className="w-5 h-5 text-black-500"
                      title="Work"
                    />
                  </div>
                  My Work
                </Link>
                <Link
                  to="/disputes"
                  className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                   <div>
                    <FaGavel
                      className="w-5 h-5 text-black-500"
                      title="Hiring"
                    />
                  </div>
                  Disputes
                </Link>
                <Link
                  to="/promotion"
                  className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                   <div>
                    <FaTrophy
                      className="w-5 h-5 text-black-500"
                      title="Hiring"
                    />
                  </div>
                  Promotion
                </Link>
                <button
                  onClick={logoutdestroy}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-black font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  <img src={Logout} alt="Logout" className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
          <button
            className="md:hidden flex items-center justify-center p-0 rounded-md border border-gray-300 bg-[#228B22]"
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

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-3 space-y-4 text-[#969696] font-medium flex flex-col items-center justify-center text-center">
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
            {isLoggedIn && (
              <Link to="/bidding/newtask">
                <button className="bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-7 py-2 rounded-xl shadow w-fit whitespace-nowrap mx-auto flex items-center justify-center">
                  + Post a Task
                </button>
              </Link>
            )}
            <Link
              to="/login"
              className="bg-white px-4 py-2 rounded-lg shadow text-base font-medium flex items-center gap-2 cursor-pointer"
            >
              Login/Signup
              <img src={Dropdown} alt="Dropdown" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingAddress !== null ? "Edit Address" : "Add New Address"}
            </h2>

            {mapError && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
                {mapError}
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={currentAddress.title}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter a title (e.g., Home, Office)"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="landmark"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Landmark
              </label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={currentAddress.landmark}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Enter a landmark (e.g., Near City Mall)"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={currentAddress.address}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-lg bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-full border border-gray-300"
                placeholder="Select location on map"
              />
            </div>

            <div
              className="h-[400px] mb-6 rounded-lg overflow-hidden shadow-md border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
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

            <div className="flex justify-end gap-3">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-[#228B22] text-white rounded-lg hover:bg-green-800 transition-colors"
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
