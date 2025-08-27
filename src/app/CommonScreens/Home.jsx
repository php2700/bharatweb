import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Banner from "../../assets/Homepage/banner.png";
import Mask from "../../assets/Homepage/Mask.png";
import Plumber from "../../assets/Homepage/Plumber.svg";
import Electrician from "../../assets/Homepage/Electrician.svg";
import Technician from "../../assets/Homepage/Technician.svg";
import Image from "../../assets/Homepage/Images.png";
import Recent from "../../assets/Homepage/Recent.png";
import Worker from "../../assets/Homepage/worker.png";
import Star from "../../assets/Homepage/Star.svg";
import Choose from "../../assets/Homepage/choose.png";
import one from "../../assets/Homepage/one.jpg";
import two from "../../assets/Homepage/two.jpg";
import three from "../../assets/Homepage/three.jpg";
import man1 from "../../assets/Homepage/man1.jpg";
import man2 from "../../assets/Homepage/man2.jpg";
import man3 from "../../assets/Homepage/man3.jpg";
import man4 from "../../assets/Homepage/man4.jpg";
import footer from "../../assets/Homepage/footer.svg";

export default function Home() {
  const navigate = useNavigate();

  const servicesData = [
    {
      id: 1,
      icon: Plumber,
      title: "Plumber",
      description:
        "These services are designed for homeowners and apartment dwellers, offering regular cleaning and maintenance of living spaces, including dusting, vacuuming, and sanitizing bathrooms and kitchens.",
    },
    {
      id: 2,
      icon: Electrician,
      title: "Electrician",
      description:
        "Geared towards businesses and offices, commercial cleaning services focus on maintaining a clean and hygienic work environment, ensuring a professional and healthy workspace for employees and clients.",
    },
    {
      id: 3,
      icon: Technician,
      title: "Technician",
      description:
        "Deep cleaning goes beyond regular cleaning routines, tackling hard-to-reach or neglected areas. It involves detailed and thorough cleaning of every nook and cranny, from baseboards to appliances, to eliminate deep-seated dirt and grime.",
    },
    {
      id: 4,
      icon: Plumber,
      title: "Plumber",
      description:
        "These services are designed for homeowners and apartment dwellers, offering regular cleaning and maintenance of living spaces, including dusting, vacuuming, and sanitizing bathrooms and kitchens.",
    },
    {
      id: 5,
      icon: Electrician,
      title: "Electrician",
      description:
        "Geared towards businesses and offices, commercial cleaning services focus on maintaining a clean and hygienic work environment, ensuring a professional and healthy workspace for employees and clients.",
    },
    {
      id: 6,
      icon: Technician,
      title: "Technician",
      description:
        "Deep cleaning goes beyond regular cleaning routines, tackling hard-to-reach or neglected areas. It involves detailed and thorough cleaning of every nook and cranny, from baseboards to appliances, to eliminate deep-seated dirt and grime.",
    },
    {
      id: 7,
      icon: Plumber,
      title: "Plumber",
      description:
        "These services are designed for homeowners and apartment dwellers, offering regular cleaning and maintenance of living spaces, including dusting, vacuuming, and sanitizing bathrooms and kitchens.",
    },
    {
      id: 8,
      icon: Electrician,
      title: "Electrician",
      description:
        "Geared towards businesses and offices, commercial cleaning services focus on maintaining a clean and hygienic work environment, ensuring a professional and healthy workspace for employees and clients.",
    },
    {
      id: 9,
      icon: Technician,
      title: "Technician",
      description:
        "Deep cleaning goes beyond regular cleaning routines, tackling hard-to-reach or neglected areas. It involves detailed and thorough cleaning of every nook and cranny, from baseboards to appliances, to eliminate deep-seated dirt and grime.",
    },
  ];
  const [showAll, setShowAll] = useState(false);
  const visibleServices = showAll ? servicesData : servicesData.slice(0, 9);

  const professionals = [
    {
      id: 1,
      name: "Mohan Sharma",
      role: "Plumber",
      rating: 4.7,
      image: Worker,
    },
    {
      id: 2,
      name: "Mohan Sharma",
      role: "Plumber",
      rating: 4.7,
      image: Worker,
    },
    {
      id: 3,
      name: "Mohan Sharma",
      role: "Plumber",
      rating: 4.7,
      image: Worker,
    },
    {
      id: 4,
      name: "Mohan Sharma",
      role: "Plumber",
      rating: 4.7,
      image: Worker,
    },
    {
      id: 5,
      name: "Mohan Sharma",
      role: "Plumber",
      rating: 4.7,
      image: Worker,
    },
    {
      id: 6,
      name: "Mohan Sharma",
      role: "Plumber",
      rating: 4.7,
      image: Worker,
    },
    {
      id: 7,
      name: "Mohan Sharma",
      role: "Plumber",
      rating: 4.7,
      image: Worker,
    },
  ];

  const works = [
    {
      id: 1,
      title: "Furniture",
      price: "1200",
      description: "Make Chair Make Chair....Make Chair....Make Chair....",
      date: "12/02/25",
      image: Recent,
    },
    {
      id: 2,
      title: "Furniture",
      price: "800",
      description: "Make Chair Make Chair....Make Chair....Make Chair....",
      date: "15/02/25",
      image: Recent,
    },
    {
      id: 3,
      title: "Furniture",
      price: "1500",
      description: "Make Chair Make Chair....Make Chair....Make Chair....",
      date: "20/02/25",
      image: Recent,
    },
    {
      id: 4,
      title: "Furniture",
      price: "1500",
      description: "Make Chair Make Chair....Make Chair....Make Chair....",
      date: "20/02/25",
      image: Recent,
    },
    {
      id: 5,
      title: "Furniture",
      price: "1500",
      description: "Make Chair Make Chair....Make Chair....Make Chair....",
      date: "20/02/25",
      image: Recent,
    },
    {
      id: 6,
      title: "Furniture",
      price: "1500",
      description: "Make Chair Make Chair....Make Chair....Make Chair....",
      date: "20/02/25",
      image: Recent,
    },
  ];

  // Slider state and refs for Recent Posted Work
  const sliderRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Slider state and refs for Feature Workers
  const workerSliderRef = useRef(null);
  const [isWorkerDown, setIsWorkerDown] = useState(false);
  const [workerStartX, setWorkerStartX] = useState(0);
  const [workerScrollLeft, setWorkerScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    sliderRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    sliderRef.current.style.cursor = "grab";
  };

  const handleMouseUp = () => {
    setIsDown(false);
    sliderRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust drag speed
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWorkerMouseDown = (e) => {
    setIsWorkerDown(true);
    setWorkerStartX(e.pageX - workerSliderRef.current.offsetLeft);
    setWorkerScrollLeft(workerSliderRef.current.scrollLeft);
    workerSliderRef.current.style.cursor = "grabbing";
  };

  const handleWorkerMouseLeave = () => {
    setIsWorkerDown(false);
    workerSliderRef.current.style.cursor = "grab";
  };

  const handleWorkerMouseUp = () => {
    setIsWorkerDown(false);
    workerSliderRef.current.style.cursor = "grab";
  };

  const handleWorkerMouseMove = (e) => {
    if (!isWorkerDown) return;
    e.preventDefault();
    const x = e.pageX - workerSliderRef.current.offsetLeft;
    const walk = (x - workerStartX) * 2; // Adjust drag speed
    workerSliderRef.current.scrollLeft = workerScrollLeft - walk;
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4 ml-10">
            Transform Your Space <br />
            with Our Expert Service <br />
            Provider
          </h1>
          <p className="text-gray-600 mb-6 ml-10">
            Welcome to a World of Immaculate Services and Freshness! Our expert
            services are
            <br /> designed to transform your space into a pristine haven.
          </p>
          <button
            onClick={() => navigate("/book")}
            className="bg-[#228B22] hover:bg-green-800 text-white text-lg font-semibold px-10 py-3 rounded-md transition ml-10 mt-10"
          >
            Book Now
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center mt-5">
          <img
            src={Banner}
            alt="Service Provider"
            className="shadow-lg w-full md:w-[652px] md:h-[600px] object-cover rounded-bl-[168px] rounded-tr-[72px]"
          />
        </div>
      </div>
      {/* Overlay Section */}
      <div className="relative w-full h-[252px] mt-5">
        {/* Background Image */}
        <img
          src={Mask}
          alt="Background"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#382C28] opacity-75"></div>

        {/* Stats Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[100px] text-center text-white">
            {/* Stat 1 */}
            <div>
              <h2 className="text-4xl font-bold">9,168+</h2>
              <p className="text-lg mt-2">Project Completed</p>
            </div>

            {/* Stat 2 */}
            <div>
              <h2 className="text-4xl font-bold">4,573+</h2>
              <p className="text-lg mt-2">Happy Customers</p>
            </div>

            {/* Stat 3 */}
            <div>
              <h2 className="text-4xl font-bold">500+</h2>
              <p className="text-lg mt-2">Dedicated Cleaners</p>
            </div>
          </div>
        </div>
      </div>
      {/* Heading Section */}
      <div className="w-full flex justify-center items-center mt-12">
        <h2 className="text-3xl md:text-5xl font-bold text-black text-center">
          Comprehensive Services to <br /> Your Needs
        </h2>
      </div>
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
          {servicesData.map((service) => (
            <div key={service.id} className="p-6 hover:shadow-lg transition">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#008000]">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
        {/* See All Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#008000] font-semibold text-lg hover:underline"
          >
            {showAll ? "Show Less" : "See All"}
          </button>
        </div>
      </div>
      {/* Center Image Section */}
      <div className="flex justify-center items-center mt-12">
        <img
          src={Image}
          alt="Centered"
          className="w-[300px] md:w-[90%] object-contain"
        />
      </div>

      <div className="bg-[#EDFFF3] py-16 mt-12">
        <div className="container mx-auto px-6">
          {/* Heading */}
          <h2 className="text-2xl md:text-2xl font-bold text-black mb-8 text-left">
            Recent Posted Work
          </h2>
          {/* Card Slider */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-scroll scrollbar-hide cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {works.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-lg shadow-md min-w-[280px] max-w-[280px] flex-shrink-0"
              >
                {/* Image */}
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{work.title}</h3>
                    <span className="text-green-600 font-bold">
                      Rs: {work.price}/-
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {work.description}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    Completion Date: {work.date}
                  </p>
                </div>
              </div>
            ))}
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-5">
          {/* Heading */}
          <h2 className="text-2xl md:text-2xl font-bold text-black mb-8 text-left">
            Feature Workers
          </h2>
          {/* Card Slider */}
          <div
            ref={workerSliderRef}
            className="flex gap-6 overflow-x-scroll scrollbar-hide cursor-grab select-none"
            onMouseDown={handleWorkerMouseDown}
            onMouseLeave={handleWorkerMouseLeave}
            onMouseUp={handleWorkerMouseUp}
            onMouseMove={handleWorkerMouseMove}
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {professionals.map((pro) => (
              <div
                key={pro.id}
                className="min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex-shrink-0"
              >
                {/* Image */}
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />

                {/* Info */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{pro.name}</h3>
                    <div className="flex items-center text-green-600 font-medium">
                      <img src={Star} alt="star" className="w-4 h-4 mr-1" />
                      {pro.rating}
                    </div>
                  </div>
                  <p className="text-gray-500">{pro.role}</p>
                </div>
              </div>
            ))}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        </div>
      </div>
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-x-1">
          {/* Left Image */}
          <div className="flex justify-center">
            <img
              src={Choose}
              alt="Team collaboration"
              className="rounded-xl shadow-lg w-[400px] h-[550px] object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="mr-20">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 md:mt-[-40px] mt-">
              Why Should You Choose ?
            </h2>

            {/* Item 1 */}
            <div className="flex items-start mt-[100px]">
              <div className="bg-[#382C28] text-white rounded-full w-27 h-12 flex items-center justify-center font-bold mr-4 text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#228B22]">
                  Exceptional Expertise
                </h3>
                <p className="text-gray-600 mt-1 tracking-tight text-base">
                  Choose us because of our extensive experience and expertise in
                  the cleaning industry. Our dedicated team is highly skilled
                  and trained to deliver top-notch services that meet your exact
                  needs.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start mb-6">
              <div className="bg-[#382C28] text-white rounded-full w-33 h-12 flex items-center justify-center font-bold mr-4 text-lg mt-2">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#228B22] mt-3">
                  High-Quality Standards
                </h3>
                <p className="text-gray-600 mt-1 tracking-tight text-base">
                  When you choose us, you opt for the highest standards of
                  cleanliness and hygiene. We maintain strict quality control
                  procedures, using industry-leading equipment and eco-friendly
                  products to ensure exceptional results every time.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start">
              <div className="bg-[#382C28] text-white rounded-full w-42 h-12 flex items-center justify-center font-bold mr-4 -mt-4 text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#228B22] -mt-4">
                  Customer-Centric Approach
                </h3>
                <p className="text-gray-600 mt-1 tracking-tight text-base">
                  We prioritize our customers’ satisfaction and convenience. Our
                  friendly and responsive customer support team is always ready
                  to address your concerns, making your experience with us
                  smooth and hassle-free. Your feedback and preferences are
                  valued, allowing us to continuously improve our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full flex justify-center items-center mt-12">
        <h2 className="text-3xl md:text-5xl font-bold text-black text-center">
          Getting Our Services in Three <br />
          Easy Steps
        </h2>
      </div>

      <div className="relative flex items-center justify-center w-full mt-10">
        {/* Wave Line Behind */}
        <svg
          viewBox="0 0 1000 120"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-[1000px] h-28 z-0"
        >
          {/* Wave Path */}
          <path
            d="M0 80 C300 10, 700 150, 1000 40"
            stroke="#808080"
            strokeWidth="2"
            strokeDasharray="6,6"
            fill="none"
          />

          {/* Left Dot */}
          <circle cx="0" cy="80" r="5" fill="#808080" />

          {/* Right Dot */}
          <circle cx="1000" cy="40" r="5" fill="#808080" />
        </svg>

        {/* Steps - perfectly centered on wave */}
        <div className="flex justify-between items-center w-[850px] z-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center -translate-y-2">
            <div className="relative w-40 h-40">
              {/* Circular Image */}
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg">
                <img
                  src={one}
                  alt="Step 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Number Badge */}
              <div className="absolute -bottom-1 right-4 w-8 h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-sm shadow-md">
                1
              </div>
            </div>
            <p className="mt-3 font-bold">Book Service Online</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center translate-y-8">
            <div className="relative w-40 h-40">
              {/* Circular Image */}
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg">
                <img
                  src={two}
                  alt="Step 2"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Number Badge */}
              <div className="absolute top-2 -right-1 w-8 h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-sm shadow-md">
                2
              </div>
            </div>
            <p className="mt-3 font-bold">Wait till Completion</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center -translate-y-2">
            <div className="relative w-40 h-40">
              {/* Circular Image */}
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg">
                <img
                  src={three}
                  alt="Step 3"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Number Badge */}
              <div className="absolute -bottom-1 right-3 w-8 h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-sm shadow-md">
                3
              </div>
            </div>
            <p className="mt-3 font-bold">Enjoy the Services</p>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#382C28] py-16 px-6 text-center mt-[100px]">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Transparent & Flexible Pricing <br />
          to Match Your Needs & Budget
        </h2>

        <div className="container mx-auto px-2 py-16 flex flex-col md:flex-row md:justify-center md:gap-5 max-w-[70%]">
  {[
    {
      title: "Standard",
      price: "$10",
      features: [
        "Affordable rates suitable for routine cleaning needs.",
        "Includes basic cleaning tasks such as dusting, vacuuming, and bathroom cleaning.",
        "Ideal for maintaining a clean and tidy living or workspace.",
      ],
    },
    {
      title: "Premium",
      price: "$25",
      features: [
        "Competitive pricing for a more thorough and comprehensive clean.",
        "Covers deep cleaning tasks like baseboard cleaning, appliance detailing, and interior window cleaning.",
        "Perfect for periodic deep cleaning or before special occasions.",
      ],
    },
    {
      title: "Customized",
      price: "$$",
      features: [
        "Tailored pricing based on your unique cleaning requirements.",
        "Allows you to select specific services and create a cleaning package that suits your preferences.",
        "Provides the flexibility to address your individual needs and budget constraints.",
      ],
    },
  ].map((plan, index) => (
    <div
      key={index}
      className="group bg-white p-6 rounded-lg shadow-lg text-center transition-all duration-300 flex flex-col justify-between flex-1"
    >
      {/* Wrap content and button separately */}
      <div>
        {/* Title */}
        <h3 className="text-3xl font-bold text-[#382C28] group-hover:text-[#228B22] mb-4 transition">
          {plan.title}
        </h3>

        {/* Price */}
        <p className="text-5xl font-bold text-[#382C28] group-hover:text-[#228B22] mt-[50px] transition">
          {plan.price}
          <span className="text-lg font-medium">/yr.</span>
        </p>

        {/* Features */}
        <ul className="mt-[70px] space-y-2 flex flex-col items-start w-full">
          {plan.features.map((feature, i) => (
            <li
              key={i}
              className="flex text-left text-[#000000] font-semibold max-w-[300px]"
            >
              <span className="w-7 h-7 aspect-square flex items-center justify-center bg-[#382C28] group-hover:bg-[#228B22] rounded-full mr-2 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Button (always bottom) */}
      <button className="bg-gray-200 text-[#382C28] group-hover:bg-[#228B22] group-hover:text-white font-semibold py-3 px-7 rounded transition mt-6">
        BOOK NOW
      </button>
    </div>
  ))}
</div>





      </div>
      <div className="w-[80%] py-16 px-6 text-center justify-center mt-[50px] mx-auto">
  <h2 className="text-3xl md:text-5xl font-bold text-[#382C28] mb-12">
    Hear What Our Satisfied Customers <br />
    Have to Say
  </h2>

  <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Testimonial 1 */}
    <div className="text-center max-w-2xl mx-auto">
            <img
              src={man1}
              alt="Customer 1"
              className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
            />
            <p className="text-[#808080] mb-4 ">
              We've been using their services for over a year now, and we're
              consistently impressed with the attention to detail and the
              friendly, professional team. Our home has never been cleaner.
            </p>
            <h3 className="font-bold text-[#382C28] text-lg">Randy Septimus</h3>
          </div>

          {/* Testimonial 2 */}
          <div className="text-center">
            <img
              src={man2}
              alt="Customer 2"
              className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
            />
            <p className="text-[#808080] mb-4">
              These guys have been a lifesaver for our busy office. Their
              reliability and trustworthiness in maintaining a clean workspace
              are unparalleled. Highly recommended.
            </p>
            <h3 className="font-bold text-[#382C28] text-lg">
              Dulce Passaquindici Arcand
            </h3>
          </div>

          {/* Testimonial 3 */}
          <div className="text-center">
            <img
              src={man3}
              alt="Customer 3"
              className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
            />
            <p className="text-[#808080] mb-4">
              The deep cleaning they did before our family reunion was
              exceptional. They went above and beyond our expectations, leaving
              our home spotless and ready to welcome guests.
            </p>
            <h3 className="font-bold text-[#382C28] text-lg">
              Cooper Septimus
            </h3>
          </div>

          {/* Testimonial 4 */}
          <div className="text-center">
            <img
              src={man4}
              alt="Customer 4"
              className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
            />
            <p className="text-[#808080] mb-4">
              We love the customized cleaning package they offer. It's great to
              choose the specific services we need, and the team always delivers
              a thorough and detailed cleaning. Couldn't be happier!
            </p>
            <h3 className="font-bold text-[#382C28] text-lg">Corey Mango</h3>
          </div>
        </div>
      </div>
      {/* Image Section */}
      <div className="relative w-full flex justify-center items-center mt-12">
        {/* Background Image */}
        <img
          src={footer}
          alt="Service Illustration"
          className="shadow-lg w-full h-[536px] object-cover rounded-lg"
        />

        {/* Green Overlay Div */}
        <div className="absolute bg-[#228B22] w-[82%] h-[60%] rounded-lg flex flex-col items-center justify-center">
          <p className="text-white text-4xl font-bold text-center">
            Click here to post your project and get <br /> started!
          </p>

          {/* Post Work Button */}
          <button className="mt-6 bg-white text-[#228B22] font-semibold px-9 py-3 rounded-sm shadow hover:bg-gray-100">
            Post Work
          </button>
        </div>
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}
