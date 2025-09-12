import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import banner from "../../assets/profile/banner.png";
import { useNavigate } from "react-router-dom";

export default function OurServices() {
  const navigate = useNavigate();

  // Navigate to subcategories with the full service object
  const handleServicecategoryClick = (service) => {
  setTimeout(() => {
    navigate("/subcategories", { state: { service } });
  }, 150); // 150ms delay
};
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [services, setServices] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("bharat_token");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/work-category`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.status) {
          setServices(data.data || []);
        } else {
          console.error("Failed to fetch services:", data.message);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, []);

  return (
    <>
      <Header />

      <div className="py-10 px-4 sm:px-10 md:px-20">
        <h2 className="text-[37px] font-bold text-center mb-2">Our Services</h2>
        <p className="text-[20px] font-[500] text-center text-[#000000] mb-10">
          Categories
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-[60px]">
          {services.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No services found.
            </p>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                onClick={() => handleServicecategoryClick(service)}
                className="bg-white rounded-[30px] p-6 
                           shadow-[0px_5px_29px_0px_#64646F26] 
                           hover:shadow-[0px_10px_50px_0px_#64646F50] 
                           hover:scale-105 
                           transition-transform duration-300 ease-in-out
                           cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-15 h-15 flex items-center justify-center rounded-full bg-[#D3E8D3]">
                    <img
                      src={
                        service.image
                          ? service.image
                          : "/src/assets/workcategory/default.png"
                      }
                      alt={service.name}
                      className="w-[39px] h-[39px]"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(36%) sepia(100%) saturate(500%) hue-rotate(85deg)",
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-[23px] font-[500] text-center mb-2 text-[#000000]">
                  {service.name}
                </h3>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={banner}
          alt="Gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
