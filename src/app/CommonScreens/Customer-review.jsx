import { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import review1 from "../../assets/customer-review/customer-review.png";
import leftArrow from "../../assets/customer-review/back.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const testimonials = [
  {
    name: "Ramesh Kumar",
    role: "Business Owner",
    review:
      "Metal4craft did an excellent job with our fabrication needs. Very professional and reliable service.",
    image: review1,
  },
  {
    name: "Sunita Sharma",
    role: "Architect",
    review:
      "Great experience! The team understood my requirements and delivered quality work on time.",
    image: review1,
  },
  {
    name: "Ajay Verma",
    role: "Engineer",
    review:
      "I am impressed with the durability of the materials used. Highly recommend Metal4craft.",
    image: review1,
  },
  {
    name: "Ramesh Kumar",
    role: "Business Owner",
    review:
      "Metal4craft did an excellent job with our fabrication needs. Very professional and reliable service.",
    image: review1,
  },
  {
    name: "Sunita Sharma",
    role: "Architect",
    review:
      "Great experience! The team understood my requirements and delivered quality work on time.",
    image: review1,
  },
  {
    name: "Ajay Verma",
    role: "Engineer",
    review:
      "I am impressed with the durability of the materials used. Highly recommend Metal4craft.",
    image: review1,
  },
];

export default function CustomerReview() {
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
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <>
      <Header />
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2">
            <img src={leftArrow} className="h-4 w-4" alt="Back arrow" />
            <div className="text-[#008000]">Back</div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-12">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-10">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl flex flex-col items-center text-center"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.role}</p>
                  <p className="text-sm text-gray-600 mt-2">{t.review}</p>
                </div>
              </div>
            ))}
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
                      src={banner || "/src/assets/customer-review/default.png"} // Fallback image
                      alt={`Banner ${index + 1}`}
                      className="w-full h-[400px] object-cover"
                      onError={(e) => {
                        e.target.src = "/src/assets/customer-review/default.png"; // Fallback on image load error
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
      </section>
      <Footer />
    </>
  );
}