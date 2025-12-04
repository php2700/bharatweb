// import React, { useState, useEffect } from "react";
// import Header from "../../component/Header";
// import Footer from "../../component/footer";
// // import img1 from "../../assets/aboutus/img1.png";
// import about from "../../assets/aboutus/aboutus.png";


// import direct from "../../assets/aboutus/direct.png";
// import emg from "../../assets/aboutus/emegency1.png";

// import img3 from "../../assets/aboutus/bidding.png";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function AboutUs() {
//   const [aboutData, setAboutData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch API on mount
//   useEffect(() => {
//     window.scrollTo(0, 0); // 👈 ensures page opens at the top
//     fetch(`${BASE_URL}/CompanyDetails/getAboutUs`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setAboutData(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   // Conditional rendering for loading state
//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="mx-auto px-4 sm:px-10 md:px-20 py-10 text-center">
//           <p>Loading...</p>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Conditional rendering for error state
//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="mx-auto px-4 sm:px-10 md:px-20 py-10 text-center">
//           <p className="text-red-500">Error: {error}</p>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Conditional rendering for no data
//   if (!aboutData || !aboutData.content) {
//     return (
//       <>
//         <Header />
//         <div className="mx-auto px-4 sm:px-10 md:px-20 py-10 text-center">
//           <p>No data available</p>
//         </div>
//         <Footer />
//       </>
//     );
//   }



//   return (
//     <>
//       <Header />
//       <div className="mx-auto px-4 sm:px-10 md:px-20 py-10 mt-20">
//         {/* About Us Title */}
//         <h2 className="text-center text-[30px] font-bold mb-10">About Us</h2>

//         {/* Main Content Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 mt-[110px]">
//           {/* Left Column: API Content */}
//           <div className="space-y-6">
//             <div
//               className="text-[20px] text-[#000000] font-[500] whitespace-pre-line"
//               dangerouslySetInnerHTML={{ __html: aboutData.content }}
//             />
//           </div>

//           {/* Right Column: Image */}
//           <div>
//             <img
//               src={about}
//               alt="Home Services"
//               className="rounded-[44px] w-full shadow-lg"
//             />
//           </div>
//         </div>

//         {/* Second Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 mt-[180px]">
//           {/* Left Column: Image */}
//           <div>
//             <img
//               src={direct}
//               alt="Effortless Services"
//               className="rounded-[44px] w-full shadow-lg"
//             />
//           </div>

//           {/* Right Column: Repeated API Content for layout consistency */}
//           <div className="space-y-6 font-poppins">

//             <div className="text-[26px] text-[#000000] font-[600] leading-relaxed">
//               {/* Title ya aboutData content yaha aayega if needed */}
//             </div>

//             <p className="text-[18px] text-[#333333] leading-[1.7]">
//               <strong className="font-[600]">Direct Hiring</strong> allows users to instantly book a specific service provider of their choice for any required task. This option is ideal when you already know which professional you want to work with or when you prefer a fast and straightforward booking process without comparing multiple options.
//             </p>

//             <ul className="list-disc pl-6 space-y-3 text-[18px] text-[#333333] leading-[1.7]">
//               <li>
//                 <strong className="font-[600]">Choose your preferred provider:</strong>
//                 View profiles, ratings, experience, and customer reviews to select the provider you trust.
//               </li>
//               <li>
//                 <strong className="font-[600]">Book instantly without waiting:</strong>
//                 Send booking requests immediately without waiting for multiple bids or quotes.
//               </li>
//               <li>
//                 <strong className="font-[600]">Enjoy faster service confirmation:</strong>
//                 Providers receive your request instantly, ensuring quicker acceptance and task initiation.
//               </li>
//               <li>
//                 <strong className="font-[600]">Clarity and confidence:</strong>
//                 Know exactly who will handle your service, building trust and reducing uncertainty.
//               </li>
//               <li>
//                 <strong className="font-[600]">Save time:</strong>
//                 Direct Hiring makes the process simple, fast, and dependable.
//               </li>
//             </ul>

//           </div>

//         </div>

//         {/* Track Record Section */}
//         <div className="w-full bg-gradient-to-b from-white to-[#228B22] py-12 px-4 sm:px-6 lg:px-20 mt-[170px]">
//           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//             {/* Left Side Image */}
//             <div className="flex justify-center">
//               <img
//                 src={img3}
//                 alt="Painter"
//                 className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] object-contain"
//               />
//             </div>

//             {/* Right Side Content: Repeated API Content */}
//             <div className="text-[#000000] font-poppins leading-relaxed text-[18px] sm:text-[19px] md:text-[20px] space-y-4">

//               <p className="font-semibold text-[22px]">Bidding Hiring</p>

//               <p>
//                 The Bidding Option allows users to post their service requirements and receive
//                 multiple offers from verified providers. This helps you choose the best professional
//                 based on price, experience, and reviews.
//               </p>

//               <ul className="list-disc pl-6 space-y-2">
//                 <li><strong>Post Your Task:</strong> Add details about the work you need.</li>
//                 <li><strong>Receive Multiple Bids:</strong> Providers submit offers with pricing and timelines.</li>
//                 <li><strong>Compare & Select:</strong> Review bids based on cost, ratings, and proposal quality.</li>
//                 <li><strong>Confirm & Hire:</strong> Choose the best offer and proceed with booking.</li>
//               </ul>

//               <p>
//                 Bidding gives you flexibility, transparency, and the chance to get the best value for your service.
//               </p>

//             </div>

//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 mt-[180px]">
//   {/* Left Column: Image */}
//   <div>
//     <img
//       src={emg}  // Change image if needed
//       alt="Emergency Services"
//       className="rounded-[44px] w-full shadow-lg"
//     />
//   </div>

//   {/* Right Column */}
//   <div className="space-y-6 font-poppins">

//     <div className="text-[26px] text-[#000000] font-[600] leading-relaxed">
//       Emergency Hiring
//     </div>

//     <p className="text-[18px] text-[#333333] leading-[1.7]">
//       <strong className="font-[600]">Emergency Hiring</strong> is designed for situations where immediate assistance is required. Whether it's a sudden plumbing leak, electrical issue, appliance breakdown, or any urgent household problem, this option connects you instantly with the nearest available professional.
//     </p>

//     <ul className="list-disc pl-6 space-y-3 text-[18px] text-[#333333] leading-[1.7]">
      
//       <li>
//         <strong className="font-[600]">Instant professional assignment:</strong>
//         The system quickly identifies and assigns the closest verified service provider who can reach your location immediately.
//       </li>

//       <li>
//         <strong className="font-[600]">Priority service response:</strong>
//         Emergency bookings are given top priority, ensuring faster acceptance and quick arrival of the professional.
//       </li>

//       <li>
//         <strong className="font-[600]">Verified and trained experts:</strong>
//         Only certified and experienced professionals handle emergency tasks to ensure safety, reliability, and quality.
//       </li>

//       <li>
//         <strong className="font-[600]">Real-time tracking:</strong>
//         Users can track the professional’s live location and estimated arrival time, keeping them updated throughout the urgent situation.
//       </li>

//       <li>
//         <strong className="font-[600]">Perfect for unexpected issues:</strong>
//         Ideal for sudden breakdowns, urgent repairs, or any situation where immediate action is required.
//       </li>

//     </ul>

//   </div>
// </div>

        
//       </div>
//       <div className="mt-[50px]">
//         <Footer />
//       </div>
//     </>
//   );
// }

// import React, { useState, useEffect } from "react";
// import Header from "../../component/Header";
// import Footer from "../../component/footer";
// import { motion } from "framer-motion";

// // --- Assets ---
// import aboutImage from "../../assets/aboutus/abouts.jpg";
// import directHiringImage from "../../assets/aboutus/directs.jpg";
// import biddingImage from "../../assets/aboutus/biddings.jpg";
// import emergencyHiringImage from "../../assets/aboutus/emergencys.jpg";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const fadeInUp = {
//   hidden: { opacity: 0, y: 60 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
// };

// const imgVariant = {
//   hidden: { opacity: 0, scale: 0.95 },
//   visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
// };

// const staggerContainer = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2,
//     },
//   },
// };

// // --- Reusable Components ---
// const FeatureSection = ({
//   imageUrl,
//   altText,
//   title,
//   description,
//   points,
//   imageSide = "right",
// }) => {
//   const ImageColumn = (
//     <motion.div className="flex justify-center items-center"
    
//     variants={imgVariant}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.3 }}
//       >
//       <img
//         src={imageUrl}
//         alt={altText}
//         className="rounded-3xl w-full sm:w-11/12 shadow-lg"
//       />
//     </motion.div>
//   );

//   const TextColumn = (
//     <motion.div className="space-y-4">
//       <motion.h3 className="text-3xl font-bold text-gray-800"variants={fadeInUp}>{title}</motion.h3>
//       <motion.p className="text-lg text-gray-600 leading-relaxed"variants={fadeInUp}>{description}</motion.p>
//       {points && (
//         <motion.ul  variants={staggerContainer}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           className="list-disc pl-6 space-y-3 text-lg text-gray-600 leading-relaxed">
//           {points.map((point, index) => (
//             <motion.lili key={index} variants={fadeInUp}>
//               <strong className="font-semibold text-gray-700">{point.title}</strong>
//               {point.text}
//             </motion.lili>
//           ))}
//         </motion.ul>
//       )}
//     </motion.div>
//   );

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//       {imageSide === "left" ? (
//         <>
//           {ImageColumn}
//           <div className="md:order-last">{TextColumn}</div>
//         </>
//       ) : (
//         <>
//           <div className="md:order-last">{ImageColumn}</div>
//           {TextColumn}
//         </>
//       )}
//     </div>
//   );
// };

// // --- Main AboutUs Component ---
// export default function AboutUs() {
//   const [aboutData, setAboutData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     fetch(`${BASE_URL}/CompanyDetails/getAboutUs`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch data");
//         return res.json();
//       })
//       .then((data) => {
//         setAboutData(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   // --- Static Data for Sections ---
//   const directHiringData = {
//     title: "Direct Hiring",
//     description: "Direct Hiring allows users to instantly book a specific service provider of their choice for any required task. This option is ideal when you already know which professional you want to work with or when you prefer a fast and straightforward booking process without comparing multiple options.",
//     points: [
//       { title: "Choose your preferred provider: ", text: "View profiles, ratings, experience, and customer reviews to select the provider you trust." },
//       { title: "Book instantly without waiting: ", text: "Send booking requests immediately without waiting for multiple bids or quotes." },
//       { title: "Enjoy faster service confirmation: ", text: "Providers receive your request instantly, ensuring quicker acceptance and task initiation." },
//       { title: "Clarity and confidence: ", text: "Know exactly who will handle your service, building trust and reducing uncertainty." },
//       { title: "Save time: ", text: "Direct Hiring makes the process simple, fast, and dependable." }
//     ],
//     imageUrl: directHiringImage,
//     altText: "Effortless Services",
//     imageSide: "left",
//   };

//   const emergencyHiringData = {
//     title: "Emergency Hiring",
//     description: "Emergency Hiring is designed for situations where immediate assistance is required. Whether it's a sudden plumbing leak, electrical issue, or any urgent household problem, this option connects you instantly with the nearest available professional.",
//     points: [
//       { title: "Instant professional assignment: ", text: "The system quickly identifies and assigns the closest verified service provider who can reach your location immediately." },
//       { title: "Priority service response: ", text: "Emergency bookings are given top priority, ensuring faster acceptance and quick arrival of the professional." },
//       { title: "Verified and trained experts: ", text: "Only certified and experienced professionals handle emergency tasks to ensure safety, reliability, and quality." },
//       { title: "Real-time tracking: ", text: "Users can track the professional’s live location and estimated arrival time." },
//       { title: "Perfect for unexpected issues: ", text: "Ideal for sudden breakdowns, urgent repairs, or any situation where immediate action is required." }
//     ],
//     imageUrl: emergencyHiringImage,
//     altText: "Emergency Services",
//     imageSide: "left",
//   };

//   // --- Render Logic ---
//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="text-center py-40">Loading...</div>
//         <Footer />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Header />
//         <div className="text-center py-40 text-red-500">Error: {error}</div>
//         <Footer />
//       </>
//     );
//   }

//   if (!aboutData || !aboutData.content) {
//     return (
//       <>
//         <Header />
//         <div className="text-center py-40">No data available</div>
//         <Footer />
//       </>
//     );
//   }

//   // ---- YAHAN BADLAV KIYA GAYA HAI ----
//   // API से आए कंटेंट में मौजूद अतिरिक्त खाली लाइनों को हटा दिया गया है
//   const processedContent = aboutData.content.replace(/(\r\n|\n|\r){2,}/g, "$1");

//   return (
//     <>
//       <Header />
//       <div className="mx-auto px-4 sm:px-10 md:px-20 py-16 mt-20 font-poppins">
//         <motion.h2 initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center text-4xl md:text-5xl font-bold mb-16 text-gray-900 tracking-tight">About Us</motion.h2>

//         {/* --- Main Content Section (from API) --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//           <motion.div initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.3 }}
//             variants={fadeInUp}>
//             <div
//               className="text-lg text-gray-700 leading-relaxed whitespace-pre-line"
//               dangerouslySetInnerHTML={{ __html: processedContent }}
//             />
//           </motion.div>
//           <motion.div className="flex justify-center items-center"
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.3 }}
//             variants={imgVariant}>
//             <img
//               src={aboutImage}
//               alt="Home Services"
//               className="rounded-3xl w-full sm:w-11/12 shadow-lg"
//             />
//           </motion.div>
//         </div>

//         {/* --- Sections Container --- */}
//         <div className="space-y-24 mt-24">
          
//           {/* Direct Hiring Section */}
//           <FeatureSection {...directHiringData} />

//           {/* Bidding Section */}
//           <motion.div  initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.2 }}
//             className="w-full bg-green-50 rounded-3xl py-16 px-4 sm:px-6 lg:px-20 shadow-sm">
//               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//                   <motion.div  variants={imgVariant}
//                     className="flex justify-center">
//                       <img
//                           src={biddingImage}
//                           alt="Bidding Process"
//                           className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] object-contain"
//                       />
//                   </motion.div>
//                   <motion.div className="space-y-4">
//                       <motion.h3 variants={fadeInUp} className="text-3xl font-bold text-gray-800">Bidding Hiring</motion.h3>
//                       <motion.p variants={fadeInUp} className="text-lg text-gray-600 leading-relaxed">
//                           The Bidding Option allows users to post their service requirements and receive
//                           multiple offers from verified providers. This helps you choose the best professional
//                           based on price, experience, and reviews.
//                       </motion.p>
//                       <motion.ul c  variants={staggerContainer}
//                         className="list-disc pl-6 space-y-3 text-lg text-gray-600 leading-relaxed">
//                               {[
//                             { t: "Post Your Task:", d: "Add details about the work you need." },
//                             { t: "Receive Multiple Bids:", d: "Providers submit offers with pricing and timelines." },
//                             { t: "Compare & Select:", d: "Review bids based on cost, ratings, and proposal quality." },
//                             { t: "Confirm & Hire:", d: "Choose the best offer and proceed with booking." }
//                           ].map((item, idx) => (
//                             <motion.li key={idx} variants={fadeInUp}>
//                               <strong className="font-semibold text-gray-700">{item.t}</strong> {item.d}
//                             </motion.li>
//                           ))}
//                       </motion.ul>
//                   </motion.div>
//               </div>
//           </motion.div>
          
//           {/* Emergency Hiring Section */}
//           <FeatureSection {...emergencyHiringData} />

//         </div>
//       </div>
//        <motion.div 
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ delay: 1, duration: 1 }}
//         // className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs"
//       >
//         {/* &copy; {new Date().getFullYear()} The Bharat Works. All Rights Reserved. */}
//       </motion.div>
//       <Footer />
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { motion } from "framer-motion";

// --- Assets ---
import aboutImage from "../../assets/aboutus/BHARAT4.jpg";
import directHiringImage from "../../assets/aboutus/BHARAT2.jpg";
import biddingImage from "../../assets/aboutus/BHARAT3.jpg";
import emergencyHiringImage from "../../assets/aboutus/BHARAT1.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const imgVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// --- Reusable Components ---
const FeatureSection = ({
  imageUrl,
  altText,
  title,
  description,
  points,
  imageSide = "right",
}) => {
  const ImageColumn = (
    <motion.div 
      className="flex justify-center items-center"
      variants={imgVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <img
        src={imageUrl}
        alt={altText}
        className="rounded-3xl w-full sm:w-11/12 shadow-lg"
      />
    </motion.div>
  );

  const TextColumn = (
    <motion.div className="space-y-4">
      <motion.h3 className="text-3xl font-bold text-gray-800" variants={fadeInUp}>{title}</motion.h3>
      <motion.p className="text-lg text-gray-600 leading-relaxed" variants={fadeInUp}>{description}</motion.p>
      {points && (
        <motion.ul 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="list-disc pl-6 space-y-3 text-lg text-gray-600 leading-relaxed"
        >
          {points.map((point, index) => (
            <motion.li key={index} variants={fadeInUp}>
              <strong className="font-semibold text-gray-700">{point.title}</strong>
              {point.text}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {imageSide === "left" ? (
        <>
          {ImageColumn}
          <div className="md:order-last">{TextColumn}</div>
        </>
      ) : (
        <>
          {/* ImageSide Right Logic: Text First, Image Last (visually right on desktop) */}
          <div className="md:order-last">{ImageColumn}</div>
          {TextColumn}
        </>
      )}
    </div>
  );
};

// --- Main AboutUs Component ---
export default function AboutUs() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${BASE_URL}/CompanyDetails/getAboutUs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setAboutData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // --- Static Data for Sections ---
  const directHiringData = {
    title: "Direct Hiring",
    description: "Direct Hiring allows users to instantly book a specific service provider of their choice for any required task. This option is ideal when you already know which professional you want to work with or when you prefer a fast and straightforward booking process without comparing multiple options.",
    points: [
      { title: "Choose your preferred provider: ", text: "View profiles, ratings, experience, and customer reviews to select the provider you trust." },
      { title: "Book instantly without waiting: ", text: "Send booking requests immediately without waiting for multiple bids or quotes." },
      { title: "Enjoy faster service confirmation: ", text: "Providers receive your request instantly, ensuring quicker acceptance and task initiation." },
      { title: "Clarity and confidence: ", text: "Know exactly who will handle your service, building trust and reducing uncertainty." },
      { title: "Save time: ", text: "Direct Hiring makes the process simple, fast, and dependable." }
    ],
    imageUrl: directHiringImage,
    altText: "Effortless Services",
    imageSide: "left",
  };

  // ✅ NEW: Bidding Data Object created for cleaner code
  const biddingHiringData = {
    title: "Bidding Hiring",
    description: "The Bidding Option allows users to post their service requirements and receive multiple offers from verified providers. This helps you choose the best professional based on price, experience, and reviews.",
    points: [
      { title: "Post Your Task: ", text: "Add details about the work you need." },
      { title: "Receive Multiple Bids: ", text: "Providers submit offers with pricing and timelines." },
      { title: "Compare & Select: ", text: "Review bids based on cost, ratings, and proposal quality." },
      { title: "Confirm & Hire: ", text: "Choose the best offer and proceed with booking." }
    ],
    imageUrl: biddingImage,
    altText: "Bidding Process",
    imageSide: "right", // ✅ Content Left, Image Right
  };

  const emergencyHiringData = {
    title: "Emergency Hiring",
    description: "Emergency Hiring is designed for situations where immediate assistance is required. Whether it's a sudden plumbing leak, electrical issue, or any urgent household problem, this option connects you instantly with the nearest available professional.",
    points: [
      { title: "Instant professional assignment: ", text: "The system quickly identifies and assigns the closest verified service provider who can reach your location immediately." },
      { title: "Priority service response: ", text: "Emergency bookings are given top priority, ensuring faster acceptance and quick arrival of the professional." },
      { title: "Verified and trained experts: ", text: "Only certified and experienced professionals handle emergency tasks to ensure safety, reliability, and quality." },
      { title: "Real-time tracking: ", text: "Users can track the professional’s live location and estimated arrival time." },
      { title: "Perfect for unexpected issues: ", text: "Ideal for sudden breakdowns, urgent repairs, or any situation where immediate action is required." }
    ],
    imageUrl: emergencyHiringImage,
    altText: "Emergency Services",
    imageSide: "left",
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-40">Loading...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center py-40 text-red-500">Error: {error}</div>
        <Footer />
      </>
    );
  }

  if (!aboutData || !aboutData.content) {
    return (
      <>
        <Header />
        <div className="text-center py-40">No data available</div>
        <Footer />
      </>
    );
  }

  const processedContent = aboutData.content.replace(/(\r\n|\n|\r){2,}/g, "$1");

  return (
    <>
      <Header />
      <div className="mx-auto px-4 sm:px-10 md:px-20 py-6 mt-20 font-poppins">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight"
        >
          About Us
        </motion.h2>

        {/* --- Main Content Section (from API) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div
              className="text-lg text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </motion.div>
          <motion.div 
            className="flex justify-center items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={imgVariant}
          >
            <img
              src={aboutImage}
              alt="Home Services"
              className="rounded-3xl w-full sm:w-11/12 shadow-lg"
            />
          </motion.div>
        </div>

        {/* --- Sections Container --- */}
        <div className="space-y-24 mt-24">
          
          {/* Direct Hiring Section */}
          <FeatureSection {...directHiringData} />

          {/* Bidding Section - Updated to match style */}
          <FeatureSection {...biddingHiringData} />
          
          {/* Emergency Hiring Section */}
          <FeatureSection {...emergencyHiringData} />

        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {/* Footer animation placeholder */}
      </motion.div>
      <Footer />
    </>
  );
}