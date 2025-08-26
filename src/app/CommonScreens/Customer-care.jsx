import Footer from "../../component/footer";
import Header from "../../component/Header";
import CustomercareImg from "../../assets/customer-care/customer-care.png";
import { ContactEmail } from "./Contact-email";
import { useState } from "react";
import { ContactCall } from "./Contact-call";

export default function CustomerCare ()  {
  const [isContactOpen, setIsContactOpen] = useState(true);

  const handleContactOpen = (isOpenContact) => {
    setIsContactOpen(isOpenContact);
  };
  return (
    <>
      <Header />
      <section className="p-10">
        <div className="container mx-auto p-10">
          <div className="flex justify-center ">
            <img src={CustomercareImg} className="h-72 w-72 object-cover" />
          </div>
          <div className="text-3xl font-bold text-center m-4">
            Customer Care
          </div>
          <div className=" text-center ">
            Please Feel Free To Talk To Us If You Have Any Questions.
          </div>
          <div className="text-center mb-4">
            We Endeavour To Answer Within 24 Hours.
          </div>
          <div className="flex justify-center gap-4 m-2">
            <div
              onClick={() => handleContactOpen(true)}
              className={`${
                isContactOpen ? "bg-[#228B22]" : "bg-gray-500"
              } text-white px-8 py-1 border rounded-lg cursor-pointer`}
            >
              Contact via Email
            </div>
            <div
              onClick={() => handleContactOpen(false)}
              className={`${
                isContactOpen ? "bg-gray-500" : "bg-[#228B22]"
              } text-white px-8 py-1 border rounded-lg cursor-pointer`}
            >
              Contact via Call
            </div>
          </div>
          {isContactOpen ? <ContactEmail /> : <ContactCall />}
        </div>
      </section>
      <Footer />
    </>
  );
};
