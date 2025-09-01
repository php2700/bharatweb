import { Star } from "lucide-react";
import review1 from "../../assets/customer-review/customer-review.png";
import leftArrow from "../../assets/customer-review/back.png";
import banner from "../../assets/profile/banner.png";
import Footer from "../../component/footer";

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

export default function CustomerReview ()  {
  return (
    <>
    <Header />
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto  px-6">
        <div className="flex items-center gap-2">
          <img src={leftArrow} className="h-4 w-4" />
          <div className="text-[#008000]"> Back</div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl  flex flex-col items-center text-center"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-full h-full  object-cover"
              />
            </div>
          ))}
        </div>
        <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
          <img
            src={banner}
            alt="Gardening illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
    <Footer/>
    </>
  );
};