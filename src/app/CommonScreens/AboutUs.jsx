import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import img1 from "../../assets/aboutus/img1.png";
import img2 from "../../assets/aboutus/img2.png";
import img3 from "../../assets/aboutus/img3.png";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AboutUs() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API on mount
  useEffect(() => {
  window.scrollTo(0, 0); // 👈 ensures page opens at the top
  fetch(`${BASE_URL}/CompanyDetails/getAboutUs`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
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

  // Conditional rendering for loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="mx-auto px-4 sm:px-10 md:px-20 py-10 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Conditional rendering for error state
  if (error) {
    return (
      <>
        <Header />
        <div className="mx-auto px-4 sm:px-10 md:px-20 py-10 text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  // Conditional rendering for no data
  if (!aboutData || !aboutData.content) {
    return (
      <>
        <Header />
        <div className="mx-auto px-4 sm:px-10 md:px-20 py-10 text-center">
          <p>No data available</p>
        </div>
        <Footer />
      </>
    );
  }

  

  return (
    <>
      <Header />
      <div className="mx-auto px-4 sm:px-10 md:px-20 py-10">
        {/* About Us Title */}
        <h2 className="text-center text-[30px] font-bold mb-10">About Us</h2>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 mt-[110px]">
          {/* Left Column: API Content */}
          <div className="space-y-6">
            <div
              className="text-[20px] text-[#000000] font-[500]"
              dangerouslySetInnerHTML={{ __html: aboutData.content }}
            />
          </div>

          {/* Right Column: Image */}
          <div>
            <img
              src={img1}
              alt="Home Services"
              className="rounded-[44px] w-full shadow-lg"
            />
          </div>
        </div>

        {/* Second Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 mt-[180px]">
          {/* Left Column: Image */}
          <div>
            <img
              src={img2}
              alt="Effortless Services"
              className="rounded-[44px] w-full shadow-lg"
            />
          </div>

          {/* Right Column: Repeated API Content for layout consistency */}
          <div className="space-y-6">
            <div
              className="text-[20px] text-[#000000] font-[500]"
              dangerouslySetInnerHTML={{ __html: aboutData.content }}
            />
          </div>
        </div>

        {/* Track Record Section */}
        <div className="w-full bg-gradient-to-b from-white to-[#228B22] py-12 px-4 sm:px-6 lg:px-20 mt-[170px]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Side Image */}
            <div className="flex justify-center">
              <img
                src={img3}
                alt="Painter"
                className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] object-contain"
              />
            </div>

            {/* Right Side Content: Repeated API Content */}
            <div>
              <div
                className="text-[#000000] font-[500] mb-8 leading-relaxed text-base sm:text-lg md:text-[17px]"
                dangerouslySetInnerHTML={{ __html: aboutData.content }}
              />
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