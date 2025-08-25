/* eslint-disable react/no-unescaped-entities */
import Logo from "../assets/logo.svg"

export default function Footer() {
  return (
    <footer className="bg-[#1B1514] text-white py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
        grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 sm:gap-12 md:gap-1 lg:gap-20 
        items-start">
        
        {/* Logo Section */}
        <div className="md:flex justify-center md:justify-start">
          <div className="bg-white w-[120px] h-[60px] sm:w-[140px] sm:h-[70px] md:w-[160px] md:h-[75px] lg:w-[185px] lg:h-[90px] flex items-center justify-center mx-auto md:mx-0">
            <img
              src={Logo}
              alt="The Bharat Works"
              className="w-[100px] h-[32px] sm:w-[120px] sm:h-[38px] md:w-[140px] md:h-[44px] lg:w-[150px] lg:h-[48px] object-contain"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_4fr] 
          gap-6 sm:gap-8 md:gap-5 lg:gap-9">
          
          {/* Navigation */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-sm sm:text-base md:text-lg">Navigation</h3>
            <ul className="space-y-2 text-[13px] sm:text-[14px] text-gray-300">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Services</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          {/* Help */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-sm sm:text-base md:text-lg">Help</h3>
            <ul className="space-y-2 text-[13px] sm:text-[14px] text-gray-300">
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Terms of Services</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-sm sm:text-base md:text-lg">Social</h3>
            <ul className="space-y-2 text-[13px] sm:text-[14px] text-gray-300">
              <li><a href="#" className="hover:text-white">Facebook</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">YouTube</a></li>
            </ul>
          </div>

          {/* Newsletter Text */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3 text-sm sm:text-base md:text-lg">Newsletter</h3>
            <p className="text-[13px] sm:text-[14px] text-gray-400 mb-4 max-w-lg mx-auto md:mx-0">
              Subscribe for Exclusive Offers, Cleaning Tips, and More! Join our
              community and stay updated with the latest news and special promotions.
            </p>
            {/* Newsletter Input + Button */}
            <div className="mt-4 relative w-full max-w-sm sm:max-w-md md:max-w-full mx-auto md:mx-0">
              <input
              id="emailInput"
                type="email"
                placeholder="Email Address"
                className="w-full h-[48px] sm:h-[52px] border border-gray-300 rounded-[4px] pl-3 pr-[110px] text-gray-700 placeholder-gray-400 focus:outline-none text-[13px] sm:text-[14px] bg-white"
              />
              <button id="footerbutton" className="absolute top-1 right-1 h-[44px] w-[100px] sm:w-[120px] bg-[#008000] rounded-r-[4px] font-cairo font-semibold hover:bg-green-700 text-[13px] sm:text-[14px] text-white">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Responsiveness */}
      <style jsx>{`
        @media (max-width: 768px) {
          footer .grid {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            text-align: center;
          }

          /* Logo centered */
          .md\\:flex {
            display: flex;
            justify-content: center;
          }

          /* Navigation and Help in flex side by side */
          .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-\\[1fr_1fr_1fr_4fr\\] {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            grid-template-columns: none;
          }

          /* Navigation and Help take 50% width each */
          .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-\\[1fr_1fr_1fr_4fr\\] > div:nth-child(1),
          .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-\\[1fr_1fr_1fr_4fr\\] > div:nth-child(2) {
            flex: 1 1 45%;
            min-width: 150px;
          }

          /* Social and Newsletter full width and centered */
          .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-\\[1fr_1fr_1fr_4fr\\] > div:nth-child(3),
          .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-\\[1fr_1fr_1fr_4fr\\] > div:nth-child(4) {
            flex: 1 1 100%;
            max-width: 100%;
          }

          .max-w-sm.sm\\:max-w-md.md\\:max-w-full {
            max-width: 100%;
          }

           #emailInput {
            padding-right: 130px;
          }

          #footerbutton {
            right: 0.5rem;
          }
        }

        @media (max-width: 640px) {
          .grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-\\[1fr_1fr_1fr_4fr\\] {
            gap: 1rem;
          }

          .text-center.md\\:text-left {
            text-align: center;
          }

           #emailInput {
            height: 44px;
            font-size: 12px;
          }

          #footerbutton {
            height: 40px;
            width: 100px;
            font-size: 12px;
          }
        }
      `}</style>
    </footer>
  );
}