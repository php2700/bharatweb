import React, { useState,useEffect} from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";

const services = [
  { title: "Bandwala", desc: "Elevate your celebrations with the perfect musical experience. Our talented band ensures unforgettable melodies for weddings, events, and festive occasions.", icon: "/src/assets/workcategory/bandwala.png" },
  { title: "Event Organizer", desc: "Plan your events effortlessly with our expert organizers. From weddings to corporate gatherings, we ensure every detail is perfectly executed.", icon: "/src/assets/workcategory/event.png" },
  { title: "Halwai for Events", desc: "Delight your guests with authentic, delicious sweets and snacks. Our experienced Halwai ensures quality and taste for every occasion.", icon: "/src/assets/workcategory/halwai.png" },
  { title: "Barbers/Massage", desc: "Experience professional grooming and relaxation at your doorstep. Our barbers and massage experts provide top-notch services for your comfort.", icon: "/src/assets/workcategory/barber.png" },
  { title: "Makeup Artists", desc: "Look your best for any event with our skilled makeup artists. From weddings to parties, we enhance your beauty with precision.", icon: "/src/assets/workcategory/makeup.png" },
  { title: "Painter", desc: "Transform your space with vibrant colors and seamless finishes. Our professional painters deliver exceptional results for all projects.", icon: "/src/assets/workcategory/painter.png" },
  { title: "Plumber", desc: "Solve all your plumbing issues with our skilled professionals. From installations to leak repairs, we’ve got you covered.", icon: "/src/assets/workcategory/plumber.png" },
  { title: "Carpenter", desc: "Bring craftsmanship to your home with our expert carpenters. From custom furniture to repairs, quality is guaranteed.", icon: "/src/assets/workcategory/carpenter.png" },
  { title: "Electrician", desc: "Ensure your home or office is safe with our certified electricians. We handle repairs, installations, and maintenance with care.", icon: "/src/assets/workcategory/electrician.png" },
  { title: "Construction", desc: "Build with confidence with our skilled construction team. From foundation to finishing, we deliver durable and efficient solutions.", icon: "/src/assets/workcategory/construction.png" },
  { title: "Truckers", desc: "Reliable transportation for all your needs. Our truckers ensure timely and secure delivery of goods, locally or long-distance.", icon: "/src/assets/workcategory/truck.png" },
  { title: "Musician", desc: "Make your events unforgettable with our talented musicians. We bring life to every occasion with soulful tunes and lively performances.", icon: "/src/assets/workcategory/musician.png" },
  { title: "Painter", desc: "Transform your space with vibrant colors and seamless finishes. Our professional painters deliver exceptional results for all projects.", icon: "/src/assets/workcategory/painter.png" },
  { title: "Plumber", desc: "Solve all your plumbing issues with our skilled professionals. From installations to leak repairs, we’ve got you covered.", icon: "/src/assets/workcategory/plumber.png" },
  { title: "Carpenter", desc: "Bring craftsmanship to your home with our expert carpenters. From custom furniture to repairs, quality is guaranteed.", icon: "/src/assets/workcategory/carpenter.png" },
  { title: "Electrician", desc: "Ensure your home or office is safe with our certified electricians. We handle repairs, installations, and maintenance with care.", icon: "/src/assets/workcategory/electrician.png" },
  { title: "Construction", desc: "Build with confidence with our skilled construction team. From foundation to finishing, we deliver durable and efficient solutions.", icon: "/src/assets/workcategory/construction.png" },
  { title: "Truckers", desc: "Reliable transportation for all your needs. Our truckers ensure timely and secure delivery of goods, locally or long-distance.", icon: "/src/assets/workcategory/truck.png" },
  { title: "Musician", desc: "Make your events unforgettable with our talented musicians. We bring life to every occasion with soulful tunes and lively performances.", icon: "/src/assets/workcategory/musician.png" },
 

];

export default function OurSubCategories() {
  const [selectedIndexes, setSelectedIndexes] = useState([]); // store selected card indexes
useEffect(() => {
  const serviceId = localStorage.getItem("clickedServiceId");
  console.log("Clicked service id:", serviceId);
}, []);
  const toggleSelect = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  return (
    <>
                  <Header />
    <div className="py-10 px-4 sm:px-10 md:px-20">
      <h2 className="text-[37px] font-bold text-center mb-2">Our Sub-Categories</h2>
      <p className="text-[20px] font-[500] text-center text-[#000000] mb-10">Multiple choices</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-[60px]">
        {services.map((service, index) => {
          const isSelected = selectedIndexes.includes(index);

          return (
            <div
              key={index}
              onClick={() => toggleSelect(index)}
              className={`cursor-pointer bg-white rounded-[30px] p-6 
                         shadow-[0px_5px_29px_0px_#64646F26]
                         ${isSelected ? "border-2 border-[#000000]" : ""}`}
            >
              <div className="flex justify-center mb-4">
                <div className="w-15 h-15 flex items-center justify-center rounded-full bg-[#D3E8D3]">
                  <img src={service.icon} alt={service.title} className="w-[39px] h-[39px]" />
                </div>
              </div>
              <h3 className="text-[23px] font-[450] text-center mb-2 text-[#000000] font-[500]">
                {service.title}
              </h3>
              <p className="text-[#777777] text-[17px] text-center font-[450]">{service.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
    <div className="mt-[50px]">
                    <Footer />
                  </div>
            </>
  );
}
