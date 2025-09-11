import { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo.svg";
import Dropdown from "../assets/dropdown.svg";
import { Link } from "react-router-dom";
import profiles from "../assets/login/profile.webp";
import logout from "../assets/login/logout.png";
import membership from "../assets/login/membership.png";
import bank from "../assets/login/bank.png";
import account from "../assets/login/account.png";
import money from "../assets/login/money.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Header() {
  const role = localStorage.getItem("role");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);

  // Decide route based on role
  let homeLink;
  if (role === "service_provider") {
    homeLink = "/homeservice";
  } else if (role === "user") {
    homeLink = "/homeuser";
  }
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("bharat_token");

  // Fetch Redux notifications
  const { notifications: reduxNotifications } = useSelector((state) => state.emergency);

  // Outside click handle for profile and notification dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);

  // Fetch user profile
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isLoggedIn]);

  // Fetch notifications from API and combine with Redux notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsNotifLoading(true);
        const token = localStorage.getItem("bharat_token");
        if (!token) return;

        const res = await fetch(`${BASE_URL}/user/getAllNotification`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // Combine API notifications with Redux notifications
          const combinedNotifications = [
            ...reduxNotifications,
            ...(data.data || []),
          ];
          setNotifications(combinedNotifications);
          setNotificationCount(combinedNotifications.length);
        } else {
          setNotifError(data.message || "Failed to fetch notifications");
          toast.error(data.message || "Failed to fetch notifications");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifError("Something went wrong while fetching notifications");
        toast.error("Something went wrong while fetching notifications");
      } finally {
        setIsNotifLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
    } else {
      // If not logged in, only use Redux notifications (if any)
      setNotifications(reduxNotifications);
      setNotificationCount(reduxNotifications.length);
    }
  }, [isLoggedIn, reduxNotifications]);

  // Safe name check
  let fullName =
    profile && profile.data && profile.data.full_name
      ? profile.data.full_name
      : null;
  if (!isLoggedIn) {
    fullName = null;
  }

  const logoutdestroy = () => {
    localStorage.removeItem("bharat_token");
    localStorage.removeItem("isProfileComplete");
    localStorage.removeItem("role");
    localStorage.removeItem("otp");
    navigate("/login");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Group notifications by date
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

  // Convert grouped notifications to array format for rendering
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
            <Link to="/">
              <img src={Logo} alt="Logo" className="h-12 w-[180px]" />
            </Link>
          </div>
          {/* Location Input - Shown only if user is logged in */}
          {isLoggedIn && (
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Location"
                className="px-4 py-2 rounded-lg bg-[#EBEBEB] focus:outline-none focus:ring-2 focus:ring-[#228B22] text-sm text-gray-700 w-48 sm:w-64 placeholder:text-[#334247] placeholder:font-semibold"
                aria-label="Location input"
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
            </div>
          )}
        </div>

        {/* Desktop Navigation - hidden on mobile */}
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
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Post a Task Button (hide on very small screens) */}
          {isLoggedIn && (
            <Link to="/bidding/newtask">
              <button className="hidden sm:block bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow">
                + Post a Task
              </button>
            </Link>
          )}

          {/* Notification Button - Shown only if user is logged in */}
          {isLoggedIn && (
            <div className="relative">
              <button
                className="relative hidden sm:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-21 h-8 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 18.75a1.5 1.5 0 01-3 0m7.5-4.5V9a6 6 0 10-12 0v5.25M4.5 14.25h15"
                  />
                </svg>
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
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
                          <div className="p-3 text-sm font-semibold text-gray-700 border-b">
                            {section.section}
                          </div>
                          {section.items.map((notif, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={money}
                                  alt="coin"
                                  className="w-8 h-8"
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
                              <Link to="/notifications">
                                <button className="text-green-600 text-xs font-medium hover:underline">
                                  View Details
                                </button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      ))}
                      <div className="border-t p-3 flex justify-center">
                        <Link
                          to="/notifications"
                          className="text-sm font-medium text-[#228B22] hover:underline"
                          onClick={() => setIsNotifOpen(false)}
                        >
                          See all messages
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Profile Dropdown - hide on very small screens */}
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

            {/* Profile Dropdown menu */}
            {isOpen && fullName && (
              <div
                className={`absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-50 transition-all duration-300 transform ${
                  isOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <img src={account} alt="Account" className="w-5 h-5" />
                  Account
                </Link>
                <Link
                  to="/details"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <img src={profiles} alt="Profile" className="w-5 h-5" />
                  Profile
                </Link>
                <button
                  onClick={() => logoutdestroy()}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <img
                    src={logout}
                    alt="Logout"
                    className="w-5 h-5"
                    style={{ color: "black" }}
                  />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Icon - only on mobile */}
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

      {/* Mobile Menu - only shown when hamburger is clicked */}
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
    </header>
  );
}