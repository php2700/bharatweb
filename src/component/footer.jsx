/* eslint-disable react/no-unescaped-entities */
export default function Footer() {
 return (
  <footer className="bg-[#1B1514] text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-12 sm:gap-16 md:gap-20 lg:gap-28">

      {/* Logo Section */}
      <div className="bg-white inline-block w-[120px] h-[60px] sm:w-[140px] sm:h-[70px] md:w-[160px] md:h-[75px] lg:w-[185px] lg:h-[90px] flex items-start justify-start mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        <img
          src="/logo.png"
          alt="The Bharat Works"
          className="w-[100px] h-[32px] sm:w-[120px] sm:h-[38px] md:w-[150px] md:h-[48px] lg:w-[150px] lg:h-[48px] object-contain mt-2 sm:mt-4 md:mt-5 lg:mt-5 ml-2 sm:ml-3 md:ml-3 lg:ml-3"
        />
      </div>

      {/* Right Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16">

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-4 text-sm sm:text-base md:text-lg">Navigation</h3>
          <ul className="space-y-2 text-[14px] text-gray-300">
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold mb-4 text-sm sm:text-base md:text-lg">Help</h3>
          <ul className="space-y-2 text-[14px] text-gray-300">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Terms of Services</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          <div>
            <h3 className="font-semibold mb-4 text-sm sm:text-base md:text-lg">Social</h3>
            <ul className="space-y-2 text-[14px] text-gray-300">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="mt-6 sm:mt-0">
            <h3 className="font-semibold mb-4 text-sm sm:text-base md:text-lg">Newsletter</h3>
            <p className="text-[14px] text-gray-400 mb-4">
              Subscribe for Exclusive Offers, Cleaning Tips, and More! Join our <br />
              community and stay updated with the latest news and special <br />promotions.
            </p>

            <div className="relative w-full sm:w-[320px] md:w-[380px] lg:w-[460px] h-[50px] sm:h-[55px] md:h-[60px] lg:h-[65px]">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-full border border-black rounded-[4px] pl-3 sm:pl-4 pr-24 sm:pr-32 text-gray-700 placeholder-gray-400 focus:outline-none text-[14px]"
                style={{ backgroundColor: "white" }}
              />
              <button
                className="absolute top-1/2 right-1 -translate-y-1/2 bg-green-600 w-[120px] sm:w-[140px] md:w-[150px] h-[40px] sm:h-[44px] md:h-[48px] rounded-[4px] font-cairo font-semibold hover:bg-green-700"
              >
                <span className="text-[14px]">SUBSCRIBE</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  </footer>
);


}
