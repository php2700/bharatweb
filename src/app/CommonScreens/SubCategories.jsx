import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import banner from '../../assets/banner.png';
import { useLocation } from "react-router-dom";

export default function OurSubCategories() {
  const location = useLocation();
  const { service } = location.state || {};
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("bharat_token");

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  // Toggle selection for multiple choices
  const toggleSelect = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  // Fetch subcategories for given service._id
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!service) return;

      try {
        const res = await fetch(`${BASE_URL}/subcategories/${service}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
            
        if (res.ok && data.status) {
          setSubcategories(data.data || []);
        } else {
          console.error("Failed to fetch subcategories:", data.message);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [service, BASE_URL, token]);

  if (!service) {
    return (
      <>
        <Header />
        <p className="text-center mt-20 text-red-500">No service selected!</p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="py-10 px-4 sm:px-10 md:px-20">
        <h2 className="text-[37px] font-bold text-center mb-2">
          {service.name} Sub-Categories
        </h2>
        <p className="text-[20px] font-[500] text-center text-[#000000] mb-10">
          Multiple choices
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading subcategories...</p>
        ) : subcategories.length === 0 ? (
          <p className="text-center text-gray-500">No subcategories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-[60px]">
            {subcategories.map((sub, index) => {
              const isSelected = selectedIndexes.includes(index);

              return (
                <div
                  key={sub._id}
                  onClick={() => toggleSelect(index)}
                  className={`cursor-pointer bg-white rounded-[30px] p-6 shadow-[0px_5px_29px_0px_#64646F26]
                    ${isSelected ? "border-2 border-[#000000]" : ""}`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-15 h-15 flex items-center justify-center rounded-full bg-[#D3E8D3]">
                                          <img
  src={sub.image ? sub.image : "/src/assets/workcategory/default.png"}
  alt={sub.name}
  className="w-[39px] h-[39px] filter brightness-0 sepia saturate-100 hue-rotate-100"
  style={{
    filter:
      "brightness(0) saturate(100%) invert(36%) sepia(100%) saturate(500%) hue-rotate(85deg)",
  }}
/>
                    </div>
                  </div>
                  <h3 className="text-[23px] font-[500] text-center mb-2 text-[#000000]">
                    {sub.name}
                  </h3>
                  <p className="text-[#777777] text-[17px] text-center">{sub.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="w-full max-w-[77rem] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
            {/* Foreground image */}
            <img
              src= {banner}// apna image path yahan lagao
              alt="Gardening"
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
            />
          </div>
      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
