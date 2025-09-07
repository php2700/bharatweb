import { useState,useRef } from "react";
import { useEffect } from "react";
import Logo from "../assets/logo.svg";
import Dropdown from "../assets/dropdown.svg";
import { Link } from "react-router-dom";
import profiles from '../assets/login/profile.webp'
import logout from '../assets/login/logout.png'
import membership from '../assets/login/membership.png'
import bank from '../assets/login/bank.png'
import account from '../assets/login/account.png'
import money from '../assets/login/money.png'

import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/userSlice";
import {  Navigate,useNavigate } from "react-router-dom";

export default function Header() {
  const role = localStorage.getItem("role");
const [isNotifOpen, setIsNotifOpen] = useState(false); 
  // Decide route based on role
  let homeLink;
  if (role === "service_provider") {
    homeLink = "/homeservice";
  } else if (role === "user") {
    homeLink = "/homeuser";
  }
  const navigate = useNavigate();



  const [isOpen, setIsOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dropdownRef = useRef(null);
 

  // Outside click handle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const dispatch = useDispatch();
 
  const { profile, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // ✅ Safe name check
 let fullName =
    profile && profile.data && profile.data.full_name
      ? profile.data.full_name
      : null;
      if(!localStorage.getItem('bharat_token')){
        fullName=null;
      }
const logoutdestroy = () => {
 localStorage.removeItem("bharat_token");

  // 🔹 Optional: remove other user-related data
  localStorage.removeItem("isProfileComplete");
  localStorage.removeItem("role");
  localStorage.removeItem("otp");
  navigate('/login');

  
  
};

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-[0_6px_10px_-2px_rgba(0,0,0,0.3)]">
      <div className="max-w-[90%] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-shrink-0">
            <img src={Logo} alt="Logo" className="h-12 w-[180px]" />
          </div>
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
  <button className="hidden sm:block bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow">
    + Post a Task
  </button>

  {/* 🔔 Notification Button */}
  <div className="relative">
  {/* 🔔 Notification Button */}
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

    {/* Notification Badge */}
    <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      3
    </span>
  </button>

  {/* 🔽 Dropdown Panel */}
  {isNotifOpen && (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
    
      <div className="p-3 text-sm font-semibold text-gray-700 border-b">Today</div>
      <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <img src={money} alt="coin" className="w-8 h-8" />
          <div>
            <p className="text-sm font-medium text-gray-800">Payment Confirmed</p>
            <p className="text-xs text-gray-500">Your payment of ₹500 has been confirmed.</p>
          </div>
        </div>
        <button className="text-green-600 text-xs font-medium hover:underline">View Details</button>
      </div>

      <div className="p-3 text-sm font-semibold text-gray-700 border-b">Yesterday</div>
      <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
        <div className="flex items-center gap-3">
         <img src={money} alt="coin" className="w-8 h-8" />
          <div>
            <p className="text-sm font-medium text-gray-800">Payment Confirmed</p>
            <p className="text-xs text-gray-500">Your payment of ₹500 has been confirmed.</p>
          </div>
        </div>
        <button className="text-green-600 text-xs font-medium hover:underline">View Details</button>
      </div>

      <div className="p-3 text-sm font-semibold text-gray-700 border-b">15 November 2024</div>
      <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <img src={money} alt="coin" className="w-8 h-8" />
          <div>
            <p className="text-sm font-medium text-gray-800">Payment Confirmed</p>
            <p className="text-xs text-gray-500">Your payment of ₹500 has been confirmed.</p>
          </div>
        </div>
        <button className="text-green-600 text-xs font-medium hover:underline">View Details</button>
      </div>
      <div className="border-t p-3 flex justify-center">
      <Link to="/notifications" className="text-sm font-medium text-[#228B22] hover:underline">
        See all messages
      </Link>
    </div>
    </div>
  )}
</div>


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

    {/* Dropdown menu */}
    {isOpen && fullName && (
      <div
        className={`absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-50 transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Profile Item */}
        <Link
          to="/account"
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsOpen(false)}
        >
          <img src={account} alt="Profile" className="w-5 h-5" />
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

        {/* Logout Item */}
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
    {/* Hamburger Icon (3 lines) */}
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
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            <Link to="/aboutus" className="hover:text-black">
              About
            </Link>
            <Link to href="/ourservices" className="hover:text-black">
              Services
            </Link>

            <button className="bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-7 py-2 rounded-xl shadow w-fit whitespace-nowrap mx-auto flex items-center justify-center">
              + Post a Task
            </button>

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