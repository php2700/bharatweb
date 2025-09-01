import { useState,useRef } from "react";
import { useEffect } from "react";
import Logo from "../assets/logo.svg";
import Dropdown from "../assets/dropdown.svg";
import { Link } from "react-router-dom";
import profiles from '../assets/login/profile.webp'
import logout from '../assets/login/logout.png'

import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/userSlice";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
 const fullName =
    profile && profile.data && profile.data.full_name
      ? profile.data.full_name
      : null;


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
          <Link to="/" className="hover:text-black">
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
          <img
            src={Dropdown}
            alt="Dropdown"
            className="w-6 h-6"
          />
        </Link>
      )}

      {/* Dropdown menu */}
      {isOpen && fullName && (
      <div
  className={`absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-50 transition-all duration-300 transform ${
    isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
  }`}
>
  {/* Profile Item */}
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
   
    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
  >
    <img src={logout} alt="Logout" className="w-5 h-5" style={{color:'black'}} />
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
