import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import Banner from "../../assets/Homepage/banner.png";
import Mask from "../../assets/Homepage/Mask.png";
import Plumber from "../../assets/Homepage/Plumber.svg";
import Electrician from "../../assets/Homepage/Electrician.svg";
import Technician from "../../assets/Homepage/Technician.svg";
import Image from "../../assets/Homepage/Images.png";
import Choose from "../../assets/Homepage/choose.png";
import one from "../../assets/Homepage/one.jpg";
import two from "../../assets/Homepage/two.jpg";
import three from "../../assets/Homepage/three.jpg";
import man1 from "../../assets/Homepage/man1.jpg";
import man2 from "../../assets/Homepage/man2.jpg";
import man3 from "../../assets/Homepage/man3.jpg";
import man4 from "../../assets/Homepage/man4.jpg";
import footer from  "../../assets/Homepage/footer.svg";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useSelector } from "react-redux";

export default function Home() {
  const [bidding, setBidding] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  console.log("profile role:", profile?.role);
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

  // call API for silder data

  // call API for bidding silder data
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/bidding-order/getAllPostedBiddingOrders`
        );
        console.log("bedding works response:", response.data);

        // FIX: use response.data.data
        setBidding(response.data.data || []);
      } catch (error) {
        console.error("Error fetching recent works:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  // Api call for Emergency Tasks slider data
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/emergency-order/getAllPostedEmergencyOrders`
        );
        console.log("bedding works response:", response.data);

        // FIX: use response.data.data
        setEmergency(response.data.data || []);
      } catch (error) {
        console.error("Error fetching recent works:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  //Api call for Feature Workers slider data
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/getAllUsersSortedByPlan`
        );
        console.log("bedding works response:", response.data);

        // FIX: use response.data.data
        setUser(response.data.data || []);
      } catch (error) {
        console.error("Error fetching recent works:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  // Render rest of page while loading; show loading/empty messages
  // inside the Bidding Posted Work section so the whole page remains visible.


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

  const navigateWithAuth = (path) => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const handleClick = (e) => {
    const img = e.target;
    const clickX = e.nativeEvent.offsetX;
    const imgWidth = img.offsetWidth;

    if (clickX < imgWidth / 3) {
      // Left 1/3
      navigateWithAuth("/ourservices");
    } else if (clickX < (2 / 3) * imgWidth) {
      // Middle 1/3
      navigateWithAuth("/bidding/newtask");
    } else {
      // Right 1/3
      navigateWithAuth("/emergency/userpost");
    }
  };



  const handlePostWorkClick = () => {
    const isLoggedIn = !!localStorage.getItem("bharat_token");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/bidding/newtask");
    }
  };
  const handleBookNowClick = () => {
    const isLoggedIn = !!localStorage.getItem("bharat_token");
    if (isLoggedIn) {
      navigate("/subscription");
    } else {
      navigate("/login");
    }
  };
  const slideVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.12 },
    }),
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto mt-20 px-4 py-8 md:py-16 grid grid-cols-1 md:grid-cols-2 items-center gap-6">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-center md:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4"
          >
            Transform Your Space <br />
            with Our Expert Service <br />
            Provider
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeInOut" }}
            className="text-gray-600 mb-6 text-sm sm:text-base"
          >
            Welcome to a World of Immaculate Services and Freshness! Our expert
            services are designed to transform your space into a pristine haven.
          </motion.p>

          <motion.button
            onClick={() => {
              const isLoggedIn = !!localStorage.getItem("bharat_token");
              if (isLoggedIn) {
                navigate("/ourservices");
              } else {
                navigate("/login");
              }
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[#228B22] hover:bg-green-800 text-white text-base sm:text-lg font-semibold px-6 sm:px-10 py-2 sm:py-3 rounded-md transition cursor-pointer"
          >
            Book Now
          </motion.button>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="flex justify-center"
        >
          <motion.img
            src={Banner}
            alt="Service Provider"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full max-w-[652px] h-auto object-cover rounded-bl-[100px] sm:rounded-bl-[168px] rounded-tr-[50px] sm:rounded-tr-[72px] shadow-lg"
          />
        </motion.div>

      </div>


      {/* Overlay Section */}
      <div className="relative w-full h-auto py-8 sm:py-12 md:py-16 mt-5">

        {/* BACKGROUND IMAGE */}
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          src={Mask}
          alt="Background"
          className="w-full h-full object-cover absolute inset-0"
        />

        {/* DARK OVERLAY */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.75 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 bg-[#382C28]"
        ></motion.div>

        {/* CENTER CONTENT */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-20 text-center text-white px-4">

            {/* Stat 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <CountUp start={0} end={9168} duration={4.5} separator="," />+
              </h2>
              <p className="text-sm sm:text-lg mt-2">Project Completed</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <CountUp start={0} end={4573} duration={4.5} separator="," />+
              </h2>
              <p className="text-sm sm:text-lg mt-2">Happy Customers</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <CountUp start={0} end={547} duration={4.5} separator="," />+
              </h2>
              <p className="text-sm sm:text-lg mt-2">Dedicated Cleaners</p>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Services Section */}
      <div className="w-full flex justify-center items-center mt-8 md:mt-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-black text-center px-4"
        >
          Comprehensive Services to <br /> Your Needs
        </motion.h2>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 text-center">
          {visibleServices.map((service) => (
            <motion.div
              key={service.id}

              // Animation Only ↓↓↓
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}

              whileHover={{ scale: 1.05 }}

              className="p-4 md:p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-[#008000]"

                  whileHover={{ scale: 1.12 }}
                >
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-6 h-6 md:w-8 md:h-8"
                  />
                </motion.div>
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-xl font-bold text-gray-900 mb-2"
              >
                {service.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-gray-600 text-xs sm:text-sm"
              >
                {service.description}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Button (No Logic Changed) */}
        <div className="flex justify-center mt-6 md:mt-10">
          <motion.button
            onClick={() => setShowAll(!showAll)}

            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}

            className="text-[#008000] font-semibold text-base md:text-lg hover:underline"
          >
            {showAll ? "Show Less" : "See All"}
          </motion.button>
        </div>

      </div>

      {/* Center Image Section */}
      <div className="flex justify-center items-center mt-8 md:mt-12">
        <motion.img
          src={Image}
          alt="Centered"
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ scale: 1.03 }}
          className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[1200px] h-auto object-contain cursor-pointer rounded-xl shadow-lg"
        />
      </div>

      {/* Bidding Posted Work */}
      <div className="bg-[#EDFFF3] py-8 md:py-1">

        {/* ====================== BIDDING POSTED WORK ====================== */}
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8"
          >
            Bidding Posted Work
          </motion.h2>

          <div className="overflow-hidden relative w-full">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-nowrap animate-slide"
            >
              {bidding.concat(bidding).map((bidding, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.07 }}
                  className="flex-shrink-0 w-[240px] h-[260px] bg-white p-3 rounded-xl shadow hover:shadow-xl transition mr-5 overflow-hidden flex flex-col"
                >
                  <img
                    src={bidding.imageUrl || "https://images.unsplash.com/photo-1763321402439-41eb2a0c7e7b?q=80&w=696&auto=format&fit=crop"}
                    className="w-full h-[120px] object-cover rounded-md"
                  />

                  <div className="flex-1 mt-2">
                    <h3 className="text-sm font-bold text-gray-900 break-words">
                      {bidding.title}
                    </h3>
                    <p className="text-xs text-gray-600 break-words">
                      {bidding.description}
                    </p>
                    <p className="text-xs font-semibold text-gray-800 break-words">
                      {bidding.address}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ====================== EMERGENCY TASKS ====================== */}
        <div className="bg-[#EDFFF3] py-8 md:py-10 -mt-4">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8"
            >
              Emergency Tasks
            </motion.h2>

            <div className="overflow-hidden relative w-full">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex flex-nowrap animate-slide"
              >
                {emergency.concat(emergency).map((emergency, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.07 }}
                    className="flex-shrink-0 w-[240px] h-[260px] bg-white p-3 rounded-xl shadow hover:shadow-xl transition mr-5 overflow-hidden flex flex-col"
                  >
                    <img
                      src={ "https://plus.unsplash.com/premium_photo-1686750875768-59660514f05d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                      className="w-full h-[120px] object-cover rounded-md"
                    />

                    <div className="flex-1 mt-2">
                      <h3 className="text-sm font-bold text-gray-900 break-words">
                        {emergency.title}
                      </h3>
                      <p className="text-xs text-gray-700 break-words">
                        {emergency.description}
                      </p>
                      <p className="text-xs font-semibold text-gray-900 break-words">
                        {emergency.google_address}
                      </p>
                      <p className="text-xs font-bold text-gray-900 break-words">
                        {emergency.contact}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ====================== FEATURE WORKERS ====================== */}
        <div className="container mx-auto px-4 mt-6 md:mt-8">
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 md:mb-8"
          >
            Feature Workers
          </motion.h2>

          <div className="overflow-hidden relative w-full">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-nowrap animate-slide"
            >
              {user.concat(user).map((worker, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.08 }}
                  className="flex-shrink-0 w-[200px] h-[200px] bg-white p-4 rounded-xl shadow hover:shadow-xl transition mr-5 flex flex-col justify-center text-center"
                >
                    <h3 className="text-base font-bold text-gray-900 break-words">
                      Name: {worker.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 break-words">
                      Phone: {worker.phone}
                    </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* SLIDER ANIMATION CSS */}
        <style>
          {`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-slide {
            animation: slide 25s linear infinite;
          }
        `}
        </style>
      </div>


      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-8">

          {/* Left Image Animated */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <img
              src={Choose}
              alt="Team collaboration"
              className="rounded-xl shadow-lg w-full max-w-[300px] sm:max-w-[400px] h-auto object-cover"
            />
          </motion.div>

          {/* Right Text Area Animated */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 text-center md:text-left">
              Why Should You Choose?
            </h2>

            <div className="space-y-6 md:space-y-8 mt-6 md:mt-10">

              {/* Item 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <div className="bg-[#382C28] text-white rounded-full w-15 h-8 flex items-center justify-center font-bold mr-4 text-base">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#228B22]">Exceptional Expertise</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                    Choose us because of our extensive experience and expertise in the cleaning industry.
                    Our dedicated team is highly skilled and trained to deliver top-notch services that
                    meet your exact needs.
                  </p>
                </div>
              </motion.div>

              {/* Item 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <div className="bg-[#382C28] text-white rounded-full w-19 h-8 flex items-center justify-center font-bold mr-4 text-base">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#228B22]">High-Quality Standards</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                    When you choose us, you opt for the highest standards of cleanliness and hygiene.
                    We maintain strict quality control procedures, using industry-leading equipment
                    and eco-friendly products.
                  </p>
                </div>
              </motion.div>

              {/* Item 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start"
              >
                <div className="bg-[#382C28] text-white rounded-full w-25 h-8 flex items-center justify-center font-bold mr-4 text-base">
                  3
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#228B22]">Customer-Centric Approach</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-1">
                    We prioritize our customers’ satisfaction and convenience.
                    Our friendly and responsive support team ensures a smooth
                    and hassle-free experience.
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>


      {/* Three Easy Steps Section */}
      <motion.div
        className="w-full flex justify-center items-center mt-8 md:mt-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black text-center px-4">
          Getting Our Services in Three <br /> Easy Steps
        </h2>
      </motion.div>

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

          {/* Step 1 */}
          <motion.div
            className="flex flex-col items-center mb-6 sm:mb-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-32 sm:w-40 h-32 sm:h-40">
              <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                <img src={one} alt="Step 1" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 right-4 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                1
              </div>
            </div>
            <p className="mt-3 font-bold text-sm sm:text-base">Book Service Online</p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="flex flex-col items-center mb-6 sm:mb-0 sm:translate-y-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative w-32 sm:w-40 h-32 sm:h-40">
              <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                <img src={two} alt="Step 2" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-2 -right-1 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                2
              </div>
            </div>
            <p className="mt-3 font-bold text-sm sm:text-base">Wait till Completion</p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative w-32 sm:w-40 h-32 sm:h-40">
              <div className="w-full h-full rounded-full overflow-hidden shadow-lg">
                <img src={three} alt="Step 3" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 right-3 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-[#228B22] flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                3
              </div>
            </div>
            <p className="mt-3 font-bold text-sm sm:text-base">Enjoy the Services</p>
          </motion.div>

        </div>
      </div>


      {/* Pricing Section */}
      <div className="w-full bg-[#382C28] py-8 md:py-16 px-4 text-center mt-15">

        {/* Heading Animation */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
        >
          Transparent & Flexible Pricing <br />
          to Match Your Needs & Budget
        </motion.h2>

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.25 }}
              viewport={{ once: true }}
              className="group bg-white p-2 sm:p-6 rounded-lg shadow-lg text-center transition-all duration-300 flex flex-col justify-between mb-6 md:mb-0 flex-1"
              whileHover={{ scale: 1.03 }}
            >
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#382C28] group-hover:text-[#228B22] mb-4 transition">
                  {plan.title}
                </h3>

                <p className="text-3xl sm:text-3xl md:text-4xl font-bold text-[#382C28] group-hover:text-[#228B22] mt-6 md:mt-10 transition">
                  {plan.price}
                  <span className="text-sm sm:text-base md:text-xl font-medium">/yr.</span>
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleBookNowClick}
                className="bg-gray-200 text-[#382C28] group-hover:bg-[#228B22] group-hover:text-white font-semibold py-2 sm:py-3 px-5 sm:px-7 rounded transition mt-6 cursor-pointer"
              >
                BOOK NOW
              </button>

            </motion.div>
          ))}

        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full max-w-[90%] mx-auto py-8 md:py-16 px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#382C28] mb-8 md:mb-12"
        >
          Hear What Our Satisfied Customers <br /> Have to Say
        </motion.h2>

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Image Section */}
      {/* Mobile Layout (Image top, Green box below) */}
      <div className="flex flex-col items-center justify-center mt-8 md:hidden w-full">

        {/* Image */}
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          src={footer}
          alt="Service Illustration"
          className="w-full max-w-[95%] h-auto 
      max-h-[260px] object-cover rounded-lg shadow-lg"
        />

        {/* Green Box (Below) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-[#228B22] w-[90%] mt-4 rounded-lg flex flex-col 
        items-center justify-center py-6 px-3"
        >
          <p className="text-white text-xl font-bold text-center px-2">
            Click here to post your project <br /> and get started!
          </p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={handlePostWorkClick}
            className="mt-4 bg-white text-[#228B22] font-semibold 
        px-6 py-2 rounded-sm shadow hover:bg-gray-100 cursor-pointer"
          >
            Post Work
          </motion.button>
        </motion.div>
      </div>

      {/* Desktop / Tablet Layout (Same as your original) */}
      <div className="relative w-full justify-center items-center mt-8 md:mt-12 hidden md:flex">

        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          src={footer}
          alt="Service Illustration"
          className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] h-auto 
        max-h-[300px] sm:max-h-[380px] md:max-h-[450px] lg:max-h-[520px]
        object-cover rounded-lg shadow-lg"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute bg-[#228B22] w-[90%] sm:w-[82%] lg:w-[70%]
        h-[55%] sm:h-[60%] md:h-[65%]
        rounded-lg flex flex-col items-center justify-center
        px-2 sm:px-4"
        >
          <p className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center px-2 sm:px-4">
            Click here to post your project and get <br /> started!
          </p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={handlePostWorkClick}
            className="mt-4 sm:mt-6 bg-white text-[#228B22] font-semibold 
        px-5 sm:px-9 py-2 sm:py-3 rounded-sm shadow 
        hover:bg-gray-100 cursor-pointer"
          >
            Post Work
          </motion.button>
        </motion.div>

      </div>



      <div className="mt-8 md:mt-10">
        <Footer />
      </div>
    </>
  );
}
