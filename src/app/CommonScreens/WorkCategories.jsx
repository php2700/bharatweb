import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import images from "../../assets/workcategory/image.png";
import banner1 from "../../assets/workcategory/banner1.png";
import hire1 from "../../assets/workcategory/hire1.png";
import hire2 from "../../assets/workcategory/hire2.png";
import banner from "../../assets/profile/banner.png";
import hire3 from "../../assets/workcategory/hire3.png";
import { useNavigate } from "react-router-dom";

export default function WorkCategories() {
  const selectedRoles = useSelector((state) => state.role.selectedRoles);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ API Call
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("bharat_token"); // ya sessionStorage
      const res = await fetch(`${BASE_URL}/work-category`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.status) {
        setCategories(data.data || []);
      } else {
        console.error("Failed to fetch categories:", data.message);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const SeeAll = () => {
    navigate("/ourservices");
  };

  const OurSubCategories = (service) => {
    navigate("/subcategories", { state: { service } });
  };

  const viewProfile = () => {
    navigate("/details");
  };

  const directHiring = () => {
    navigate("/service-provider-list");
  };
  
  const WorkerList = () => {
    navigate("/service-provider-list");
  };

  const hireWorker = (workerDetail) => {
    navigate(`/direct-hiring/${workerDetail?._id}`);
  };


  const postWork=()=>{
    navigate('/bidding/newtask')
  }

  const handleBidding=()=>{
    navigate('/bidding/myhire')
  }

  const postEmergencyWork=()=>{
    navigate('/emergency/userpost')
  }

  
  return (
    <>
      <Header />
      <div className="font-sans text-gray-800 mt-20">
        {/* Hero Section */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>


        {/* Categories */}
        <div className="mx-auto px-4 py-10 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center lg:text-left lg:ml-[55px]">
            Work Categories
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 justify-items-center gap-4">
              {categories.slice(0, 15).map((cat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 sm:p-6 rounded-lg w-28 sm:w-32 
             transition transform hover:scale-120 hover:shadow-lg cursor-pointer"
                  onClick={() => OurSubCategories(cat._id)}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D3E8D3]">
                    <img
                      src={
                        cat.image
                          ? cat.image
                          : "/src/assets/workcategory/default.png"
                      }
                      alt={cat.name}
                      className="w-[27px] filter brightness-0 sepia saturate-100 hue-rotate-100"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(36%) sepia(100%) saturate(500%) hue-rotate(85deg)",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[13px] sm:text-[15px] text-[#191A1D] font-[500] ml-[21px]">
                    {cat.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* See All Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={SeeAll}
              className="w-[200px] sm:w-[222px] h-[46px] bg-[#228B22] text-white rounded-[15px] hover:scale-105 transition-all duration-300"
            >
              See All
            </button>
          </div>
        </div>

        {/* Direct Hiring Section */}
        <div className="w-full bg-[#EDFFF3] py-10">
          <div className="mx-auto px-4 sm:px-10">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="font-bold text-[19px] sm:text-[22px] text-[#303030]">
                Direct Hiring
              </h2>
              <button
                onClick={() => {
                  WorkerList();
                }}
                type="button"
                className="font-bold text-[19px] sm:text-[22px] text-[#303030] mt-2 sm:mt-0"
              >
                See All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-[42px] shadow p-4 relative"
                >
                  <div className="relative">
                    <img
                      src={images}
                      alt="Profile"
                      className="w-full h-48 sm:h-50 object-cover rounded-2xl"
                    />
                    <button
                      className="absolute bottom-3 right-3 w-[140px] sm:w-[160px] h-[32px] bg-[#372E27] text-white text-[14px] sm:text-[16px] rounded-full 
                               transition-all duration-300 ease-in-out 
                               hover:bg-[#4a3e34] hover:shadow-lg hover:scale-105"
                    >
                      Add Feature
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] sm:text-[24px] text-[#191A1D] font-semibold">
                        Dipak Sharma
                      </h3>
                      <div className="flex items-center text-yellow-500 text-[14px] sm:text-[15px] font-semibold">
                        <span className="text-[20px] sm:text-[25px]">★</span>
                        <span className="ml-1 text-[16px] sm:text-[21px] text-black font-bold">
                          4.5
                        </span>
                      </div>
                    </div>

                    <p className="text-[12px] sm:text-sm text-white mt-2 px-3 py-1 bg-[#F27773] rounded-full inline-block w-[140px] sm:w-[160px] text-center float-right">
                      Indore M.P.
                    </p>

                    <p className="text-gray-700 font-semibold mt-2 text-sm sm:text-base">
                      ₹200.00
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 sm:mt-6">
                    <button
                      onClick={() => {
                        viewProfile(item);
                      }}
                      className="flex-1 border border-[#228B22] py-2 rounded font-semibold text-[#228B22] hover:bg-[#228B22] hover:text-white hover:shadow-md hover:scale-105 transition-all duration-300"
                    >
                      View Profile
                    </button>
                    <button  onClick={() => {
                        hireWorker(item);
                      }} className="flex-1 bg-[#228B22] text-white py-2 rounded font-semibold text-center hover:bg-[#1a6b1a] hover:shadow-lg hover:scale-105 transition-all duration-300">
                      Hire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mx-auto px-4 sm:px-10 py-10 grid md:grid-cols-2 gap-6 items-center lg:pl-0">
          <img src={banner1} alt="Worker" className="rounded-lg w-full" />
          <div>
            <h2 className="text-[22px] sm:text-[24px] text-[#228B22] font-bold mb-4">
              Post Work with bidder
            </h2>
            <p className="text-[16px] sm:text-[18px] font-bold text-[#838383] leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and <br />
              typesetting industry. Lorem Ipsum has been the industry's <br />
              standard dummy text ever since the 1500s...
            </p>
            <button  onClick={postWork} className="mt-8 sm:mt-20 w-[143px] bg-[#228B22] text-white px-6 py-2 rounded-[33px] shadow-[0px_1px_1px_1px_#7e7e7e] border border-[#aba8a8] hover:bg-[#1a6b1a] hover:shadow-lg hover:scale-105 transition-all duration-300">
              Post Work
            </button>
          </div>
        </div>

        {/* Emergency Section */}
        <div className="bg-white-50 py-10">
          <div className="mx-auto px-4 sm:px-10 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-[22px] sm:text-[24px] text-[#228B22] font-bold mb-4">
                Post Work with bidder
              </h2>
              <p className="text-[16px] sm:text-[18px] font-bold text-[#838383] leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and <br />
                typesetting industry. Lorem Ipsum has been the industry's...
              </p>
              <button onClick={postEmergencyWork} className="mt-8 sm:mt-20 w-[143px] bg-[#228B22] text-white px-6 py-2 rounded-[33px] shadow-[0px_1px_1px_1px_#7e7e7e] border border-[#aba8a8] hover:bg-[#1a6b1a] hover:shadow-lg hover:scale-105 transition-all duration-300">
                Post Work
              </button>
            </div>
            <img src={banner1} alt="Emergency" className="rounded-lg w-full" />
          </div>
        </div>

        {/* Blog Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 sm:p-6">
          {/* Card 1 - Direct Hiring */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-full relative h-[322px] sm:h-[383px]">
            <img
              src={hire1}
              alt="Direct Hiring"
              className="w-full h-[322px] sm:h-[383px] object-cover"
            />
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => {
                  directHiring();
                }}
                className="w-[200px] sm:w-[227px] h-[53px] bg-[#228B22] border-2 border-white text-[14px] sm:text-[15px] text-white font-semibold rounded-full hover:bg-[#1a6f1a] hover:scale-105 transition-all duration-300"
              >
                Direct Hiring
              </button>
            </div>
          </div>

          {/* Card 2 - Bidding */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-full relative h-[322px] sm:h-[383px]">
            <img
              src={hire2}
              alt="Bidding"
              className="w-full h-[322px] sm:h-[383px] object-cover"
            />
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
              <button onClick={handleBidding} className="w-[200px] sm:w-[227px] h-[53px] bg-[#228B22] border-2 border-white text-[14px] sm:text-[15px] text-white font-semibold rounded-full hover:bg-[#1a6f1a] hover:scale-105 transition-all duration-300">
                Bidding
              </button>
            </div>
          </div>

          {/* Card 3 - Emergency */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-full relative h-[322px] sm:h-[383px]">
            <img
              src={hire3}
              alt="Emergency"
              className="w-full h-[322px] sm:h-[383px] object-cover"
            />
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
              <button className="w-[200px] sm:w-[227px] h-[53px] bg-[#228B22] border-2 border-white text-[14px] sm:text-[15px] text-white font-semibold rounded-full hover:bg-[#1a6f1a] hover:scale-105 transition-all duration-300" onClick={() => navigate('/emergency/userPost')}>
                Emergency
              </button>
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
