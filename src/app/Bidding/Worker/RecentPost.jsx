import { useState, useEffect } from "react";
import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import banner from "../../../assets/profile/banner.png";
import filterIcon from "../../../assets/directHiring/filter-square.png";
import { SearchIcon } from "lucide-react";
import image from "../../../assets/workcategory/image.png";
import Arrow from "../../../assets/profile/arrow_back.svg";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RecentPost() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/bidding-order/getAvailableBiddingOrders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch available orders");
        }

        const data = await res.json();

        // Map API response to expected structure
      // Assuming API returns { data: [...] }
const fetchedWorkers = (data.data || []).map((item) => ({
  project_id: item.project_id,
  _id: item._id,
  workName: item.title,
  location: item.google_address,
  status: item.status,
  image: item.image_url[0],
  amount: item.cost,
  date: item.createdAt ,
  completionDate: item.deadline,
  description: item.description,
}));


        setWorkers(fetchedWorkers);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch available bidding orders");
        setLoading(false);
      }
    };

    fetchAvailableOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
console.log(workers);
  return (
    <>
      <Header />
      <div className="min-h-screen py-4 sm:py-6 bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <button
            className="flex items-center text-green-600 hover:text-green-800 font-semibold"
            onClick={() => navigate(-1)}
          >
            <img src={Arrow} className="w-6 h-6 mr-2" alt="Back" />
            Back
          </button>
        </div>

        <div className="w-full mx-auto overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>

        <div className="container max-w-5xl p-10 my-10 mx-auto">
          <div>
            <div className="text-3xl font-bold my-4 text-[#191A1D]">
              Recent Posted Work
            </div>
            <div className="flex gap-4">
              <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for services"
                  className="w-full pl-9 pr-3 py-2 bg-[#F5F5F5] rounded-lg"
                />
              </div>
              <img src={filterIcon} alt="Filter" />
            </div>

            <div className="w-full rounded-xl my-4 space-y-4">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="grid grid-cols-12 items-center bg-white rounded-lg shadow-lg p-4 gap-8"
                >
                  <div className="relative col-span-12 md:col-span-4">
                    <img
                      src={worker.image}
                      alt={worker.workName}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <span className="absolute bottom-0 rounded-full left-0 w-full bg-black/80 text-white font-medium text-sm px-4 py-2 text-center">
                    {worker.project_id}
                    </span>
                  </div>

                  <div className="md:col-span-8 p-4 col-span-12 space-y-2">
                    <div className="flex justify-between">
                      <h2 className="text-base sm:text-base lg:text-base font-[600] text-gray-800">
                        {worker.workName}
                      </h2>
                      <div className="flex gap-1 items-center">
                        <div className="font-semibold">
                            Posted Date:{" "}
    {new Date(worker.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}
                        </div>
                      </div>
                    </div>

                    <div className="leading-tight text-base">{worker.description}</div>
                    <p className="text-sm font-semibold lg:text-[17px] text-[#008000] my-2">
                      &#8377;{worker.amount}
                    </p>
                    <div className="font-semibold text-lg text-gray-800">
                      Completion Date:{" "}
                      {new Date(worker.completionDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>

                    <div className="flex justify-between items-center my-4">
                      <div className="text-white bg-[#F27773] text-sm py-1 px-8 rounded-full">
                        {worker.location}
                      </div>
                      <div>
                        <Link to={`/bidding/bid/${worker._id}`} className="text-[#228B22] py-1 px-4 border rounded-lg">
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mx-auto my-6 px-4 py-2 bg-[#228B22] text-white font-semibold w-1/4 rounded-full">
              See All
            </div>
          </div>
        </div>

        <div className="w-full mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
