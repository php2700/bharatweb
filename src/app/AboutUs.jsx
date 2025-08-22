import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";

export default function AboutUs() {
  return (
     <>
              <Header />
    <div className=" mx-auto px-4 sm:px-10 md:px-20 py-10">
      {/* About Us Title */}
      <h2 className="text-center text-[30px] font-bold mb-10">About Us</h2>

      {/* Two Columns Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 mt-[110px]">
        {/* Left Column */}
        <div className="space-y-6">
          <h3 className="text-[35px] font-[600] text-[#228B22]">Your One-Stop Solution for Home Services</h3>
          <p className="text-[20px] text-[#000000] font-[500]">
          Welcome to <span className="text-[#228B22] font-[500]">The Bharat Works</span>— Your trusted platform for home services! We simplify finding reliable professionals for your home tasks, whether it's plumbing, electrical work, cleaning, or major repairs. Our goal is to deliver quality, trust, and convenience while connecting you with skilled, verified workers.
          </p>
          <h4 className="text-[29px] font-semibold">Why Choose Us?</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li className="text-[18px] text-[#334247] font-[500]">Post tasks easily and get bids from experienced professionals.</li>
            <li className="text-[18px] text-[#334247] font-[500]">Find the right worker based on ratings, reviews, and pricing.</li>
            <li className="text-[18px] text-[#334247] font-[500]">Enjoy seamless service, transparent pricing, and timely.</li>
          </ul>
        </div>

        {/* Right Column */}
        <div>
          <img 
            src="/src/assets/aboutus/img1.png" 
            alt="Home Services" 
            className="rounded-[44px] w-full shadow-lg"
          />
        </div>
      </div>

      {/* Second Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 mt-[180px]">
        {/* Left Column */}
        <div>
          <img 
           src="/src/assets/aboutus/img2.png"
            alt="Effortless Services" 
            className="rounded-[44px] w-full shadow-lg"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <h3 className="text-[35px] font-[600] text-[#228B22]">Effortless Home Services at Your Fingertips</h3>
           <p className="text-[20px] text-[#000000] font-[500]">
          At <span className="text-[#228B22] font-[500]">The Bharat Works</span>—, we make finding professional home service experts effortless. From repairs to cleaning and everything in between, we connect you with skilled workers who get the job done. Our platform is built on trust, efficiency, and quality, ensuring you receive the best services every time.
          </p>
          <h4 className="text-[29px] font-semibold">What We Offer</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li className="text-[18px] text-[#334247] font-[500]">Easy task posting and quick bids from trusted workers.</li>
            <li className="text-[18px] text-[#334247] font-[500]">Verified professionals for all your home service needs.</li>
            <li className="text-[18px] text-[#334247] font-[500]">A seamless experience with clear communication and reliable.</li>
          </ul>
        </div>
      </div>

      {/* Track Record Section */}
      <div className="w-full bg-gradient-to-b from-white to-[#228B22] py-12 px-4 sm:px-6 lg:px-20 mt-[170px]">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
    
    {/* Left Side Image */}
    <div className="flex justify-center">
      <img
        src="/src/assets/aboutus/img3.png"
        alt="Painter"
        className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] object-contain"
      />
    </div>

    {/* Right Side Content */}
    <div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#228B22] mb-4 leading-snug">
        Our Track Record in Smart Home Repair and Service
      </h2>

      <p className="text-[#000000] font-[500] mb-8 leading-relaxed text-base sm:text-lg md:text-[17px]">
        At The Bharat Works, we take pride in our track record of delivering
        exceptional smart home repair and service. With years of experience in the
        industry, our team has accumulated an impressive set of stats and a wealth
        of expertise. Here's a glimpse into our accomplishments and experience:
      </p>

      {/* Stats */}
   <div className="max-w-md mx-auto lg:mx-0">
  <div className="grid grid-cols-2 gap-6 text-center">
    
    {/* Box 1 */}
    <div>
      <div className="bg-white shadow-md rounded-[20px] p-6">
        <h3 className="text-[#228B22] text-2xl sm:text-[32px] md:text-[40px] font-bold">
          240+
        </h3>
      </div>
      <p className="text-[#191A1D] text-sm sm:text-base lg:text-[18px] font-[500] mt-2">
        Successful Repairs
      </p>
    </div>

    {/* Box 2 */}
    <div>
      <div className="bg-white shadow-md rounded-[20px] p-6">
        <h3 className="text-[#228B22] text-2xl sm:text-[32px] md:text-[40px] font-bold">
          20+
        </h3>
      </div>
     <p className="text-[#191A1D] text-sm sm:text-base lg:text-[18px] font-[500] mt-2">
        Years Experience
      </p>
    </div>

    {/* Box 3 */}
    <div>
      <div className="bg-white shadow-md rounded-[20px] p-6">
        <h3 className="text-[#228B22] text-2xl sm:text-[32px] md:text-[40px] font-bold">
          99%
        </h3>
      </div>
      <p className="text-[#191A1D] text-sm sm:text-base lg:text-[18px] font-[500] mt-2">
        Customer Satisfaction
      </p>
    </div>

    {/* Box 4 */}
    <div>
      <div className="bg-white shadow-md rounded-[20px] p-6">
        <h3 className="text-[#228B22] text-2xl sm:text-[32px] md:text-[40px] font-bold">
          500+
        </h3>
      </div>
      <p className="text-[#191A1D] text-sm sm:text-base lg:text-[18px] font-[500] mt-2">
        Happy Houseowners
      </p>
    </div>
  </div>
</div>


    </div>
    
  </div>
</div>

    
    </div>
    <div className="mt-[50px]">
                <Footer />
              </div>
        </>
  );
}
