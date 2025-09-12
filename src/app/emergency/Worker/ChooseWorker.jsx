import React from "react";
import {useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../../component/Header";
import Footer from "../../../component/footer";
import Arrow from "../../../assets/profile/arrow_back.svg";
import banner from "../../../assets/profile/banner.png";
import Profile from "../../../assets/ViewProfile/Worker.png";
export const cardData = [
  {
    id: 1,
    name: "Dipak Sharma",
    location: "Indore, MP",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 2,
    name: "Dipak Sharma",
    location: "Mumbai, MH",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 3,
    name: "Dipak Sharma",
    location: "Delhi NCR",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 4,
    name: "Dipak Sharma",
    location: "Indore, MP",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 5,
    name: "Dipak Sharma",
    location: "Mumbai, MH",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 6,
    name: "Dipak Sharma",
    location: "Delhi NCR",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
  {
    id: 7,
    name: "Dipak Sharma",
    location: "Delhi NCR",
    verified: true,
    image: Profile,
    buttonText: "Add",
  },
];


export default function ChooseWorker() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();

  const handleAddWorker = (worker) => {
    navigate("/emergency/order-detail", {
      state: {
        assignedWorker: worker, // pass worker to order-detail
      },
    });
  };

  return (
    <>
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/emergency/order-detail"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold"
        >
          <img src={Arrow} className="w-6 h-6 mr-2" alt="Back to work list" />
          Back
        </Link>
      </div>

      {/* Full Page Container */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Cards Section */}
        <div className="bg-white w-full max-w-6xl shadow-2xl rounded-lg p-8">
          <h1 className="text-3xl font-bold ml-40">Worker List</h1>
          <div className="flex flex-col items-center space-y-6 mt-3">
            {cardData.map((card) => (
              <div
                key={card.id}
                className="bg-white shadow-lg rounded-xl p-5 flex items-center space-x-6 w-full max-w-3xl"
              >
                {/* Profile Image */}
                <div className="relative inline-block">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-52 h-52 object-cover rounded-lg"
                  />

                  {/* Verified Badge */}
                  {card.verified && (
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#6DEA6D] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md whitespace-nowrap">
                      Verified by Admin
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {card.name}
                  </h2>
                  <p className="text-gray-600">{card.location}</p>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleAddWorker(card)}
                  className="bg-[#228B22] text-white px-5 py-2 rounded-lg hover:bg-green-700"
                >
                  {card.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Banner Centered */}
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
