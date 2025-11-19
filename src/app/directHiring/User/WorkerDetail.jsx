import React, { useState, useEffect } from "react";
import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import image from "../../../assets/workcategory/image.png";
import hisWorkImg from "../../../assets/directHiring/his-work.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function WorkerDetail() {
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);

  // Fetch banner images
  const fetchBannerImages = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await fetch(`${BASE_URL}/banner/getAllBannerImages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Banner API response:", data); // Debug response

      if (res.ok) {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setBannerImages(data.images);
        } else {
          setBannerImages([]);
          setBannerError("No banners available");
        }
      } else {
        const errorMessage = data.message || `HTTP error ${res.status}: ${res.statusText}`;
        console.error("Failed to fetch banner images:", errorMessage);
        setBannerError(errorMessage);
      }
    } catch (err) {
      console.error("Error fetching banner images:", err.message);
      setBannerError(err.message);
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBannerImages();
  }, []);

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6,
    arrows: true,
  };

  // const workers = [
  //   {
  //     id: 1,
  //     name: "Dipak Sharma",
  //     location: "Indore MP",
  //     status: "Add Feature",
  //     image: image,
  //     amount: "200",
  //     rating: 4.5,
  //     skills:
  //       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime",
  //   },
  //   {
  //     id: 2,
  //     name: "Dipak Sharma",
  //     location: "Indore MP",
  //     status: "Add Feature",
  //     image: image,
  //     amount: "200",
  //     rating: 4.5,
  //     skills:
  //       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
  //   },
  //   {
  //     id: 3,
  //     name: "Dipak Sharma",
  //     location: "Indore MP",
  //     status: "Add Feature",
  //     image: image,
  //     amount: "200",
  //     rating: 4.5,
  //     skills:
  //       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
  //   },
  //   {
  //     id: 4,
  //     name: "Dipak Sharma",
  //     location: "Indore MP",
  //     status: "Add Feature",
  //     image: image,
  //     amount: "200",
  //     rating: 4.5,
  //     skills:
  //       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
  //   },
  // ];

  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-[#228B22] text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="container max-w-5xl mx-auto my-10 p-8 bg-white shadow-lg rounded-3xl">
          <div className="text-2xl text-center font-bold mb-4">Work Detail</div>

          <div>
            <img src={hisWorkImg} className="h-80 w-full" />
          </div>
          <div className="py-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Chair Work</h2>
                <p className="text-lg font-semibold">Chhawani Usha Ganj</p>
                <span className="inline-block bg-red-500 text-white text-lg font-semibold px-3 rounded-full mt-2">
                  Indore M.P.
                </span>
              </div>
              <div className="text-right">
                <p className="bg-black text-white text-md px-4 rounded-full inline-block">
                  #asa1212
                </p>
                <p className="text-md mt-2">
                  <span className="font-semibold">Posted Date: 12/2/25</span>
                </p>
                <p className="text-md">
                  <span className="font-semibold">
                    Completion Date: 12/2/26
                  </span>
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold">Work Title</h3>

            <div className="border border-[#228B22] rounded-lg p-4 text-sm text-gray-700 space-y-3">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s...
              </p>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s...
              </p>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s...
              </p>
            </div>

            {/* default ui we show */}
            <div className="flex items-center justify-between border border-[#228B22] rounded-lg py-4 px-6">
              <div className="flex items-center gap-4">
                <img
                  src={image}
                  alt="Mohan Sharma"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">Mohan Sharma</h4>
                  <p className="text-sm text-gray-600">
                    Project Fees - <span className="font-medium">₹200/-</span>
                  </p>
                  <button className="bg-[#228B22] text-white px-6 py-1 rounded-lg text-sm mt-2">
                    View Profile
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="bg-green-200 text-green-800 px-2 md:px-6 py-2 rounded-lg font-medium">
                  Offer Sent
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium">
                  Cancel
                </button>
              </div>
            </div>

            {/* payment page */}
            {/* <Accepted /> */}
          </div>
        </div>

        {/* Banner Slider */}
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          {bannerLoading ? (
            <p className="absolute inset-0 flex items-center justify-center text-gray-500">
              Loading banners...
            </p>
          ) : bannerError ? (
            <p className="absolute inset-0 flex items-center justify-center text-red-500">
              Error: {bannerError}
            </p>
          ) : bannerImages.length > 0 ? (
            <Slider {...sliderSettings}>
              {bannerImages.map((banner, index) => (
                <div key={index}>
                  <img
                    src={banner || "/src/assets/profile/default.png"} // Fallback image
                    alt={`Banner ${index + 1}`}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/profile/default.png"; // Fallback on image load error
                    }}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="absolute inset-0 flex items-center justify-center text-gray-500">
              No banners available
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}