import Header from "../../component/Header";
import banner from "../../assets/banner.png";
import Footer from "../../component/footer";
import serviceProviderImg from "../../assets/directHiring/service-provider.png";
import ratingImg from "../../assets/rating/ic_round-star.png";
import locationIcon from "../../assets/directHiring/location-icon.png";
import hisWorkImg from "../../assets/directHiring/his-work.png";
import { useEffect, useState } from "react";

export default function ServiceProviderDetail() {
  const imagsArray = [
    hisWorkImg,
    serviceProviderImg,
    hisWorkImg,
    serviceProviderImg,
    hisWorkImg,
    serviceProviderImg,
  ];
  const [imageIndex, setImageIndex] = useState(0);

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
      <Header />
      <div className="min-h-screen   bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-green-600 text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>

        <div className="container max-w-6xl mx-auto my-10">
          <div className="text-xl sm:text-2xl font-bold mb-6">
            Direct Hiring
          </div>

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
                <div className="flex items-center text-sm text-gray-700">
                  <span>(4.5</span>
                  <img className="h-5 w-5 mx-1" src={ratingImg} alt="Rating" />
                  <span>)</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm sm:text-base">
                <img
                  src={locationIcon}
                  alt="Location"
                  className="h-5  mr-2 text-green-500"
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

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 font-medium py-2 px-4 rounded-lg shadow hover:bg-green-200">
                  💬 Message
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 font-medium py-2 px-4 rounded-lg shadow hover:bg-green-200">
                  📞 Call
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 my-10">
            <button className="py-1 px-10 rounded-lg border text-green-500 cursor-pointer">
              His Work
            </button>
            <button className="py-1 px-6 rounded-lg border text-green-500 cursor-pointer">
              Customer Review
            </button>
          </div>
        </div>

        {/* his work */}
       <div className="bg-[#D3FFD3] h-90 flex items-center relative">
  <img className="h-80 w-1/2 mx-auto" src={imagsArray[imageIndex]} />
  
  {/* indicators */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
    {imagsArray?.map((ele, idx) => (
      <div key={idx}>O</div>
    ))}
  </div>
</div>

      </div>
      <Footer />
    </>
  );
}
