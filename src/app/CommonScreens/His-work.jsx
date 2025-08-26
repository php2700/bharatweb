import { Star } from "lucide-react";
import work from "../../assets/customer-review/his-work.png";
import leftArrow from "../../assets/customer-review/back.png";
import banner from "../../assets/banner.png";
import Footer from "../../component/footer";
import Header from "../../component/Header";

const testimonials = [
  {
    name: "Ramesh Kumar",
    role: "Business Owner",
    review:
      "Metal4craft did an excellent job with our fabrication needs. Very professional and reliable service.",
    image: work,
  },
  {
    name: "Sunita Sharma",
    role: "Architect",
    review:
      "Great experience! The team understood my requirements and delivered quality work on time.",
    image: work,
  },
  {
    name: "Ajay Verma",
    role: "Engineer",
    review:
      "I am impressed with the durability of the materials used. Highly recommend Metal4craft.",
    image: work,
  },
  {
    name: "Ramesh Kumar",
    role: "Business Owner",
    review:
      "Metal4craft did an excellent job with our fabrication needs. Very professional and reliable service.",
    image: work,
  },
  {
    name: "Sunita Sharma",
    role: "Architect",
    review:
      "Great experience! The team understood my requirements and delivered quality work on time.",
    image: work,
  },
  {
    name: "Ajay Verma",
    role: "Engineer",
    review:
      "I am impressed with the durability of the materials used. Highly recommend Metal4craft.",
    image: work,
  },
];

export default function Hiswork ()  {
  return (
    <>
      <Header />
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto  px-6">
          <div className="flex items-center gap-2">
            <img src={leftArrow} className="h-4 w-4" />
            <div className="text-[#008000]"> Back</div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-12">His Work</h2>

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
          <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
            <img
              src={banner}
              alt="Gardening"
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
