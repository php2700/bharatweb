import Header from "../../../component/Header";
import banner from "../../../assets/banner.png";
import Footer from "../../../component/footer";
import serviceProviderImg from "../../../assets/directHiring/service-provider.png";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import locationIcon from "../../../assets/directHiring/location-icon.png";
import hisWorkImg from "../../../assets/directHiring/his-work.png";
import ratingImgages from "../../../assets/directHiring/rating.png";
import aadharImg from "../../../assets/directHiring/aadhar.png";

import { useEffect, useState } from "react";

export default function HireDetail() {
  const [offer, setOffer] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false); // ✅ Offer/Negotiate toggle

  const imagsArray = [
    hisWorkImg,
    serviceProviderImg,
    hisWorkImg,
    serviceProviderImg,
    hisWorkImg,
    serviceProviderImg,
  ];
  const ratingArr = [ratingImg, ratingImg, ratingImg, ratingImg, ratingImg];
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % imagsArray.length);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [imagsArray.length]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-green-600 text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="w-full mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>

        <div className="container max-w-6xl mx-auto my-10">
          <div className="text-xl sm:text-2xl font-bold mb-6">Direct Hiring</div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <img
                src={serviceProviderImg}
                alt="Service Provider"
                className="rounded-xl shadow-lg"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-lg sm:text-xl font-semibold text-gray-800">
                  Mohan Sharma
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="font-semibold">(4.5</span>
                    <img className="h-5 w-5 mx-1" src={ratingImg} alt="Rating" />
                    <span className="font-semibold">)</span>
                  </div>
                  <div className="text-[#228B22] underline font-semibold">
                    150 Reviews
                  </div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <img
                  src={locationIcon}
                  alt="Location"
                  className="h-5 mr-2 text-green-500"
                />
                Indore M.P. INDIA
              </div>

              <div className="text-gray-700">
                <p>
                  <span className="font-semibold text-green-600">
                    Category-{" "}
                  </span>
                  Plumber, Carpenter
                </p>
                <p>
                  <span className="font-semibold text-green-600">
                    Sub-Categories-{" "}
                  </span>
                  Plumber, Carpenter
                </p>
              </div>

              <div className="bg-gray-50 shadow-2xl rounded-lg p-4 text-sm text-gray-600">
                <div className="font-semibold text-xl text-gray-800 mb-2">
                  About My Skill
                </div>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button className="border border-[#228B22] text-[#228B22] font-medium py-2 px-4 rounded-lg">
                  💬 Message
                </button>
                <button className="border border-[#228B22] text-[#228B22] font-medium py-2 px-8 rounded-lg">
                  📞 Call
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 my-10">
            <button className="py-1 px-10 bg-[#D3FFD3] rounded-lg border text-[#008000] cursor-pointer">
              His Work
            </button>
            <button className="py-1 px-6 rounded-lg border text-[#008000] cursor-pointer">
              Customer Review
            </button>
          </div>
        </div>

        <div className="bg-[#D3FFD3] h-90 flex items-center relative">
          <img className="h-80 w-1/2 mx-auto" src={imagsArray[imageIndex]} />

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {imagsArray?.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300
                ${idx === imageIndex ? "bg-green-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        <div className="container max-w-2xl mx-auto my-10 space-y-6">
          {/* Document Section */}
          <div className="shadow-2xl rounded-lg py-4 px-10">
            <h2 className="font-semibold text-lg mb-2">Document</h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 p-2 rounded">📄</span>
                <span className="font-medium">Aadhar card</span>
              </div>
              <div className="bg-[#A9FFB3] h-24 w-40 flex justify-center">
                <img
                  src={aadharImg}
                  alt="Document"
                  className="h-20 rounded-md border"
                />
              </div>
            </div>
          </div>

          {/* Rate & Reviews Section */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Rate & Reviews</h2>

            <div className="shadow-2xl rounded-lg p-4 mb-4 bg-white">
              <div className="flex text-yellow-500 mb-1">{"★★★★☆"}</div>
              <div className="font-medium">Made a computer table</div>
              <p className="text-sm text-gray-600 mb-2">
                It is a long established fact that a reader will be distracted
                by the readable
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>1 Aug, 2023</span>
              </div>
              <div className="flex gap-2 mt-2">
                {ratingArr?.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt="Review"
                    className="h-12 w-12 rounded-md object-cover"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ✅ Offer Section */}
          <div className="flex flex-col items-center  p-6 ">
            {/* Top Buttons */}
            <div className="flex space-x-4 mb-12 bg-[#EDEDED] rounded-[50px] p-[12px]">
              <button
                onClick={() => setIsOfferActive(true)}
                className={`px-16 py-2 rounded-full font-medium shadow-sm ${
                  isOfferActive
                    ? "bg-[#228B22] text-white border border-green-600"
                    : "border border-green-600 text-green-600"
                }`}
              >
                Offer Price (120)
              </button>
              <button
                onClick={() => setIsOfferActive(false)}
                className={`px-16 py-2 rounded-full font-medium shadow-md ${
                  !isOfferActive
                    ? "bg-[#228B22] text-white hover:bg-[#228B22]"
                    : "border border-green-600 text-green-600"
                }`}
              >
                Negotiate
              </button>
            </div>

            {/* Input Field → Only show when Negotiate is active */}
            {!isOfferActive && (
            <input
  type="number"
  placeholder="Enter your offer amount"
  value={offer}
  onChange={(e) => setOffer(e.target.value)}
  className="w-[531px] px-4 py-2 border-2 border-[#dce1dc] rounded-md text-center text-[#453e3f] placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-[#d1d1d1]"
/>

            )}
          </div>

          {/* ✅ Send/Accept Request Button */}
          <div className="text-center">
            <button className="bg-[#228B22] text-white w-full px-10 py-3 rounded-md font-semibold">
              {isOfferActive ? "Accept Request" : "Send Request"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
