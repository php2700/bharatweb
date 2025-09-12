import hisWorkImg from "../../../assets/directHiring/his-work.png";
import { useEffect, useState } from "react";
import serviceProviderImg from "../../../assets/directHiring/service-provider.png";
import ratingImg from "../../../assets/directHiring/rating.png";
import aadharImg from "../../../assets/directHiring/aadhar.png";

export default function ServiceProviderHisWork() {
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
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % imagsArray.length);
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [imagsArray?.length]);
  return (
    <>
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

        <div>
          <h2 className="font-semibold text-lg mb-3">Rate & Reviews</h2>

          <div className="shadow-2xl rounded-lg p-4 mb-4  bg-white">
            <div className="flex text-yellow-500 mb-1">{"★★★★☆"}</div>
            <div className="font-medium">Made a computer table</div>
            <p className="text-sm text-gray-600 mb-2">
              It is a long established fact that a reader will be distracted by
              the readable
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
          <div className="shadow-2xl rounded-lg p-4 mb-4  bg-white">
            <div className="flex text-yellow-500 mb-1">{"★★★★☆"}</div>
            <div className="font-medium">Made a computer table</div>
            <p className="text-sm text-gray-600 mb-2">
              It is a long established fact that a reader will be distracted by
              the readable
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

        <div className="text-center">
          <button className=" font-medium hover:underline">
            See All Review
          </button>
        </div>

        <div className="text-center">
          <button className="bg-[#228B22]  text-white w-full px-10 py-3 rounded-md font-semibold">
            Hire
          </button>
        </div>
      </div>
    </>
  );
}
