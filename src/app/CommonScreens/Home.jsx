import React, { useState, useRef, useEffect } from "react";
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
import { Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();


  // 🔹 1. If user is already logged in, redirect to home (or dashboard)
  useEffect(() => {
    const token = localStorage.getItem("bharat_token"); // change key as per your login storage
    if (token) {
      const role = localStorage.getItem("role");
      if (role == "user") {
        navigate("/homeuser");
      } else {
        navigate("/homeservice");
      }
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
  const visibleServices = showAll ? servicesData : servicesData.slice(0, 6); // Reduced to 6 for better mobile display

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

  const handleClick = (e) => {
    const img = e.target;
    const clickX = e.nativeEvent.offsetX;
    const imgWidth = img.offsetWidth;

    if (clickX < imgWidth / 3) {
      // Left 1/3
      navigate("/ourservices");
    } else if (clickX < (2 / 3) * imgWidth) {
      // Middle 1/3
      navigate("/bidding/newtask");
    } else {
      // Right 1/3
      navigate("/emergency/userpost");
    }
  };

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
      <div className="container mx-auto px-4 py-8 md:py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-6">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Transform Your Space <br />
            with Our Expert Service <br />
            Provider
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Welcome to a World of Immaculate Services and Freshness! Our expert
            services are designed to transform your space into a pristine haven.
          </p>
          <button
            onClick={() => {
              const isLoggedIn = !!localStorage.getItem("bharat_token");
              if (isLoggedIn) {
                navigate("/ourservices");
              } else {
                navigate("/login");
              }
            }}
            className="bg-[#228B22] hover:bg-green-800 text-white text-base sm:text-lg font-semibold px-6 sm:px-10 py-2 sm:py-3 rounded-md transition"
          >
            Book Now
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src={Banner}
            alt="Service Provider"
            className="w-full max-w-[652px] h-auto object-cover rounded-bl-[100px] sm:rounded-bl-[168px] rounded-tr-[50px] sm:rounded-tr-[72px] shadow-lg"
          />
        </div>
      </div>

      {/* Overlay Section */}
      <div className="relative w-full h-48 sm:h-64 md:h-[252px] mt-5">
        <img
          src={Mask}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#382C28] opacity-75"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 md:gap-[100px] text-center text-white">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                9,168+
              </h2>
              <p className="text-sm sm:text-lg mt-2">Project Completed</p>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                4,573+
              </h2>
              <p className="text-sm sm:text-lg mt-2">Happy Customers</p>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                500+
              </h2>
              <p className="text-sm sm:text-lg mt-2">Dedicated Cleaners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="w-full flex justify-center items-center mt-8 md:mt-12">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black text-center px-4">
          Comprehensive Services to <br /> Your Needs
        </h2>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 text-center">
          {visibleServices.map((service) => (
            <div
              key={service.id}
              className="p-4 md:p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-[#008000]">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 md:mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#008000] font-semibold text-base md:text-lg hover:underline"
          >
            {showAll ? "Show Less" : "See All"}
          </button>
        </div>
      </div>

      {/* Center Image Section */}
      <div className="flex justify-center items-center mt-8 md:mt-12">
        <img
          src={Image}
          alt="Centered"
          onClick={handleClick}
          className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[1200px] h-auto object-contain cursor-pointer"
        />
      </div>

      {/* Recent Posted Work & Feature Workers */}
      <div className="bg-[#EDFFF3] py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8 text-left">
            Recent Posted Work
          </h2>
          <div
            ref={sliderRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide cursor-grab select-none snap-x snap-mandatory"
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
                className="bg-white rounded-lg shadow-md min-w-[240px] sm:min-w-[280px] max-w-[240px] sm:max-w-[280px] flex-shrink-0 snap-center"
              >
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-32 sm:h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-base sm:text-lg">
                      {work.title}
                    </h3>
                    <span className="text-green-600 font-bold text-sm sm:text-base">
                      Rs: {work.price}/-
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                    {work.description}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-700">
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
        <div className="container mx-auto px-4 mt-6 md:mt-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8 text-left">
            Feature Workers
          </h2>
          <div
            ref={workerSliderRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide cursor-grab select-none snap-x snap-mandatory"
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
                className="min-w-[180px] sm:min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex-shrink-0 snap-center"
              >
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base sm:text-lg font-semibold">
                      {pro.name}
                    </h3>
                    <div className="flex items-center text-green-600 font-medium text-sm sm:text-base">
                      <img
                        src={Star}
                        alt="star"
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                      />
                      {pro.rating}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm">{pro.role}</p>
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
      </div>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-8">
          <div className="flex justify-center">
            <img
              src={Choose}
              alt="Team collaboration"
              className="rounded-xl shadow-lg w-full max-w-[300px] sm:max-w-[400px] h-auto object-cover"
            />
          </div>
          <div className="mt-6 md:mt-0">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 text-center md:text-left">
              Why Should You Choose?
            </h2>
            <div className="space-y-6 md:space-y-8 mt-6 md:mt-10">
              <div className="flex items-start">
                <div className="bg-[#382C28] text-white rounded-full w-15 h-8 flex items-center justify-center font-bold mr-4 text-base">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#228B22]">
                    Exceptional Expertise
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                    Choose us because of our extensive experience and expertise
                    in the cleaning industry. Our dedicated team is highly
                    skilled and trained to deliver top-notch services that meet
                    your exact needs.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#382C28] text-white rounded-full w-19 h-8 flex items-center justify-center font-bold mr-4 text-base">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#228B22]">
                    High-Quality Standards
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                    When you choose us, you opt for the highest standards of
                    cleanliness and hygiene. We maintain strict quality control
                    procedures, using industry-leading equipment and
                    eco-friendly products to ensure exceptional results every
                    time.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#382C28] text-white rounded-full w-25 h-8 flex items-center justify-center font-bold mr-4 text-base">
                  3
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#228B22]">
                    Customer-Centric Approach
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                    We prioritize our customers’ satisfaction and convenience.
                    Our friendly and responsive customer support team is always
                    ready to address your concerns, making your experience with
                    us smooth and hassle-free. Your feedback and preferences are
                    valued, allowing us to continuously improve our services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Easy Steps Section */}
      <div className="w-full flex justify-center items-center mt-8 md:mt-12">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black text-center px-4">
          Getting Our Services in Three <br /> Easy Steps
        </h2>
      </div>
      <div className="relative flex items-center justify-center w-full mt-8 md:mt-10">
        <svg
          viewBox="0 0 1000 120"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-full max-w-[1000px] h-24 md:h-28 z-0"
        >
          <path
            d="M0 80 C300 10, 700 150, 1000 40"
            stroke="#808080"
            strokeWidth="2"
            strokeDasharray="6,6"
            fill="none"
          />
          <circle cx="0" cy="80" r="5" fill="#808080" />
          <circle cx="1000" cy="40" r="5" fill="#808080" />
        </svg>
        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-[850px] z-10 px-4">
          <div className="flex flex-col items-center mb-6 sm:mb-0">
            <div className="relative w-32 sm:w-40 h-32 sm:h-40">
              <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                <img
                  src={one}
                  alt="Step 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 right-4 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                1
              </div>
            </div>
            <p className="mt-3 font-bold text-sm sm:text-base">
              Book Service Online
            </p>
          </div>
          <div className="flex flex-col items-center mb-6 sm:mb-0 sm:translate-y-8">
            <div className="relative w-32 sm:w-40 h-32 sm:h-40">
              <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                <img
                  src={two}
                  alt="Step 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-2 -right-1 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                2
              </div>
            </div>
            <p className="mt-3 font-bold text-sm sm:text-base">
              Wait till Completion
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-32 sm:w-40 h-32 sm:h-40">
              <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                <img
                  src={three}
                  alt="Step 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 right-3 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                3
              </div>
            </div>
            <p className="mt-3 font-bold text-sm sm:text-base">
              Enjoy the Services
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="w-full bg-[#382C28] py-8 md:py-16 px-4 text-center mt-15">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Transparent & Flexible Pricing <br />
          to Match Your Needs & Budget
        </h2>
        <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row md:justify-center md:gap-5 max-w-[90%] lg:max-w-[70%]">
          {[
            {
              title: "₹999",
              price: "(₹333/month)",
              features: [
                "Affordable rates suitable for routine cleaning needs.",
                "Includes basic cleaning tasks such as dusting, vacuuming, and bathroom cleaning.",
                "Ideal for maintaining a clean and tidy living or workspace.",
              ],
            },
            {
              title: "₹2499",
              price: "(₹416/month)",
              features: [
                "Competitive pricing for a more thorough and comprehensive clean.",
                "Covers deep cleaning tasks like baseboard cleaning, appliance detailing, and interior window cleaning.",
                "Perfect for periodic deep cleaning or before special occasions.",
              ],
            },
            {
              title: "₹4499",
              price: "(₹374/month)",
              features: [
                "Tailored pricing based on your unique cleaning requirements.",
                "Allows you to select specific services and create a cleaning package that suits your preferences.",
                "Provides the flexibility to address your individual needs and budget constraints.",
              ],
            },
          ].map((plan, index) => (
            <div
              key={index}
              className="group bg-white p-2 sm:p-6 rounded-lg shadow-lg text-center transition-all duration-300 flex flex-col justify-between mb-6 md:mb-0 flex-1"
            >
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#382C28] group-hover:text-[#228B22] mb-4 transition">
                  {plan.title}
                </h3>
                <p className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#382C28] group-hover:text-[#228B22] mt-6 md:mt-10 transition">
                  {plan.price}
                  <span className="text-sm sm:text-base md:text-xl font-medium">
                    /yr.
                  </span>
                </p>
                <ul className="mt-6 md:mt-10 space-y-2 flex flex-col items-start w-full text-left px-2 sm:px-4">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex text-xs sm:text-sm md:text-base text-[#000000] font-semibold max-w-[90%]"
                    >
                      <span className="w-5 sm:w-7 h-5 sm:h-7 flex items-center justify-center bg-[#382C28] group-hover:bg-[#228B22] rounded-full mr-2 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 sm:w-5 h-3 sm:h-5 text-white"
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
              <Link to="/subscription">
                <button className="bg-gray-200 text-[#382C28] group-hover:bg-[#228B22] group-hover:text-white font-semibold py-2 sm:py-3 px-5 sm:px-7 rounded transition mt-6">
                  BOOK NOW
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full max-w-[90%] mx-auto py-8 md:py-16 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#382C28] mb-8 md:mb-12">
          Hear What Our Satisfied Customers <br /> Have to Say
        </h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            {
              name: "Randy Septimus",
              image: man1,
              text: "We've been using their services for over a year now, and we're consistently impressed with the attention to detail and the friendly, professional team. Our home has never been cleaner.",
            },
            {
              name: "Dulce Passaquindici Arcand",
              image: man2,
              text: "These guys have been a lifesaver for our busy office. Their reliability and trustworthiness in maintaining a clean workspace are unparalleled. Highly recommended.",
            },
            {
              name: "Cooper Septimus",
              image: man3,
              text: "The deep cleaning they did before our family reunion was exceptional. They went above and beyond our expectations, leaving our home spotless and ready to welcome guests.",
            },
            {
              name: "Corey Mango",
              image: man4,
              text: "We love the customized cleaning package they offer. It's great to choose the specific services we need, and the team always delivers a thorough and detailed cleaning. Couldn't be happier!",
            },
          ].map((testimonial, index) => (
            <div key={index} className="text-center">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full mb-4 object-cover"
              />
              <p className="text-[#808080] text-xs sm:text-sm md:text-base mb-4">
                {testimonial.text}
              </p>
              <h3 className="font-bold text-[#382C28] text-base sm:text-lg">
                {testimonial.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Image Section */}
      <div className="relative w-full flex justify-center items-center mt-8 md:mt-12">
        <img
          src={footer}
          alt="Service Illustration"
          className="w-full max-w-[90%] h-auto max-h-[400px] sm:max-h-[536px] object-cover rounded-lg shadow-lg"
        />
        <div className="absolute bg-[#228B22] w-[90%] sm:w-[82%] h-[60%] rounded-lg flex flex-col items-center justify-center">
          <p className="text-white text-xl sm:text-2xl md:text-4xl font-bold text-center px-4">
            Click here to post your project and get <br /> started!
          </p>
          <Link to="/bidding/newtask">
            <button className="mt-4 sm:mt-6 bg-white text-[#228B22] font-semibold px-6 sm:px-9 py-2 sm:py-3 rounded-sm shadow hover:bg-gray-100">
              Post Work
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-8 md:mt-10">
        <Footer />
      </div>
    </>
  );
}
