import { useState } from "react";
import Search from "../assets/search-normal.svg";
import Logo from "../assets/logo.svg";
import Dropdown from "../assets/dropdown.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-[0_6px_10px_-2px_rgba(0,0,0,0.3)]">
      <div className="max-w-[90%] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-shrink-0">
            <img src={Logo} alt="Logo" className="h-12 w-[180px]" />
          </div>

          {/* Search Bar - hidden on very small screens */}
          <div className="hidden sm:block w-full max-w-md">
            <div className="relative">
              <img
                src={Search}
                alt="Search"
                className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search for location"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#EBEBEB] text-sm focus:outline-none text-[#334247] placeholder:text-[#334247]"
              />
            </div>
          </div>
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="flex-1 hidden max-md:!hidden md:flex justify-center gap-8 text-[#969696] text-base font-medium">
          <a href="#" className="hover:text-black">
            Home
          </a>
          <a href="#" className="hover:text-black">
            Tasks
          </a>
          <a href="#" className="hover:text-black">
            Chats
          </a>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Post a Task Button (hide on very small screens) */}
          <button className="hidden sm:block bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow">
            + Post a Task
          </button>

          {/* Profile Dropdown - hide on very small screens */}
          <div className="hidden sm:flex bg-white border-transparent px-4 py-2 rounded-full shadow text-base font-medium items-center gap-2 cursor-pointer">
            Raj Sharma
            <img src={Dropdown} alt="Dropdown" className="w-6 h-6" />
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
            <a href="#" className="hover:text-black">
              Home
            </a>
            <a href="#" className="hover:text-black">
              Tasks
            </a>
            <a href="#" className="hover:text-black">
              Chats
            </a>

            <button className="bg-[#228B22] hover:bg-green-800 text-white text-sm font-medium px-7 py-2 rounded-xl shadow w-fit whitespace-nowrap mx-auto flex items-center justify-center">
              + Post a Task
            </button>

            <div className="bg-white px-4 py-2 rounded-lg shadow text-base font-medium flex items-center gap-2 cursor-pointer">
              Raj Sharma
              <img src={Dropdown} alt="Dropdown" className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}