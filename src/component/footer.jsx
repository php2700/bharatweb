/* eslint-disable react/no-unescaped-entities */
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";

// import social icons (make sure these are SVGs or PNGs)
import Whatsapp from "../assets/whatsapp.svg";
import Facebook from "../assets/facebook.svg";
import Instagram from "../assets/instagram.svg";
import Twitter from "../assets/twitter.svg";

export default function Footer() {
  const navigate=useNavigate();
  const role = localStorage.getItem("role");

  // Decide route based on role
  let homeLink;
  if (role === "service_provider") {
    homeLink = "/homeservice";
  } else if (role === "user") {
    homeLink = "/homeuser";
  }

  return (
    <footer className="bg-[#1B1514] text-white py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
        grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 sm:gap-12 md:gap-1 lg:gap-20 
        items-start"
      >
        {/* Logo Section */}
        <div className="md:flex justify-center md:justify-start">
          <div className="bg-white w-[120px] h-[60px] sm:w-[140px] sm:h-[70px] md:w-[160px] md:h-[75px] lg:w-[185px] lg:h-[90px] flex items-center justify-center mx-auto md:mx-0">
            <img onClick={()=>{
navigate('/homeuser')
            }}
              src={Logo}
              alt="The Bharat Works"
              className="w-[100px] h-[32px] sm:w-[120px] sm:h-[38px] md:w-[140px] md:h-[44px] lg:w-[150px] lg:h-[48px] object-contain"
            />
          </div>
        </div>

        {/* Right Side */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_4fr] 
          gap-6 sm:gap-8 md:gap-5 lg:gap-9"
        >
          {/* Navigation */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-sm sm:text-base md:text-lg">
              Navigation
            </h3>
            <ul className="space-y-2 text-[13px] sm:text-[14px] text-gray-300">
              <li>
                <Link to={homeLink} className="font-bold hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className="font-bold hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/ourservices" className="font-bold hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="font-bold hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/customer-care" className="font-bold hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-sm sm:text-base md:text-lg">
              Help
            </h3>
            <ul className="space-y-2 text-[13px] sm:text-[14px] text-gray-300">
              <li>
                <Link to="/help-faq" className="font-bold hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/term-condition" className="font-bold hover:text-white">
                  Terms of Services
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="font-bold hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-sm sm:text-base md:text-lg">
              Social
            </h3>
            <ul className="space-y-2 text-[13px] sm:text-[14px] text-gray-300 font-bold">
              <li>
                <Link to="#" className="hover:text-white">
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Twitter
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Whatsapp
                </Link>
              </li>
            </ul>
          </div>

          {/* ✅ Replaced Newsletter with social icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-20">
            {[
              { src: Facebook, alt: "Facebook" },
              { src: Twitter, alt: "Twitter" },
              { src: Instagram, alt: "Instagram" },
              { src: Whatsapp, alt: "Whatsapp" },
            ].map((icon, idx) => (
              <div
                key={idx}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-700 transition duration-300 hover:bg-[#228B22]"
              >
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className="w-6 h-6 filter brightness-0 invert transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
