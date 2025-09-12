import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import banner from "../../../assets/profile/banner.png";
import ratingImg from "../../../assets/rating/ic_round-star.png";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ServiceProviderList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category_id, subcategory_ids } = location.state || {};
  console.log(category_id, subcategory_ids);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      if (!category_id || !subcategory_ids) {
        console.error("Missing category or subcategory ID");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("bharat_token");
        const response = await axios.post(
          `${BASE_URL}/user/getServiceProviders`,
          {
            category_id,
            subcategory_ids,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Workers response:", response.data);
        if (response.data?.status) {
          setWorkers(response.data.data || []);
        } else {
          console.error("Failed to fetch workers:", response.data?.message);
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [category_id, subcategory_ids]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleHire = (serviceProviderId) => {
    navigate(`/direct-hiring/${serviceProviderId}`);
  };

  console.log("workers", workers);

  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button
            onClick={handleBack}
            className="text-green-600 text-sm hover:underline"
          >
            &lt; Back
          </button>
        </div>

        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div className="container max-w-5xl mx-auto my-10">
          <div className="flex justify-between items-center p-3">
            <div className="text-2xl font-bold">Direct Hiring</div>
            <div>
              <input
                className="border rounded-lg p-2"
                type="search"
                placeholder="Search for services"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading workers...</p>
          ) : workers.length === 0 ? (
            <p className="text-center text-gray-500">No workers found.</p>
          ) : (
            <div className="w-full rounded-xl p-3 sm:p-4 space-y-4">
              {workers.map((worker) => (
                <div
                  key={worker.id || worker._id}
                  className="grid grid-cols-12 items-center bg-white rounded-lg shadow-lg p-4 gap-8"
                >
                  <div className="relative col-span-4">
                    <img
                      src={worker.profile_pic || "/default.png"}
                      alt={worker.full_name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <span className="absolute bottom-2 left-0 w-full bg-black/80 text-white font-medium text-sm px-4 py-2 text-center">
                      {worker?.status || "Available"}
                    </span>
                  </div>

                  <div className="col-span-8 p-4">
                    <div className="flex justify-between">
                      <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                        {worker.full_name}
                      </h2>
                      <div className="flex gap-1 items-center">
                        <img className="h-6 w-6" src={ratingImg} />
                        <div>{worker?.averageRating || "N/A"}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-lg text-gray-800">
                      About My Skill
                    </div>
                    <div className="leading-tight break-words whitespace-normal">{worker?.skill}</div>

                    <div className="flex justify-between items-center my-4">
                      <div className="text-white bg-[#f27773] text-sm px-8 rounded-full">
                        {worker?.location.address || "Unknown"}
                      </div>
                      <div className="flex gap-4">
                        <Link to={`/profile-details/${worker._id}`}> {/* Fixed: Use worker._id */}
                          <button className="text-[#228B22] py-1 px-4 border rounded-lg">
                            View Profile
                          </button>
                        </Link>
                        <button
                          onClick={() => handleHire(worker._id)}
                          className="text-white bg-[#228B22] py-1 px-10 rounded-lg"
                        >
                          Hire
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center my-8">
            <div className="py-2 px-2 text-white rounded-full w-1/2 text-center bg-[#228B22]">
              See All
            </div>
          </div>
        </div>

        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}