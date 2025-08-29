import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import image from "../../../assets/workcategory/image.png";
import banner from "../../../assets/banner.png";
import { Phone, MessageSquare } from "lucide-react";
import HireCard from "./HireCard";

export default function MyHire() {
  const tasks = [
      {
      id: "#new2323",
      image: image,
      title: "Chair work",
      description: "Lorem Ipsum is...",
      date: "21/02/25",
      status: "Pending",
      address:'Indore M.p'
    },
    {
      id: "#new2323",
      image: image,
      title: "Chair work",
      description: "Lorem Ipsum is...",
      date: "21/02/25",
      status: "Review",
      address:'Indore M.p'
    },
    {
      id: "#new2323",
      image: image,
      title: "Chair work",
      description: "Lorem Ipsum is...",
      date: "21/02/25",
      status: "Completed",
      address:'Indore M.p'

    },
    {
      id: "#new2323",
      image: image,
      title: "Chair work",
      description: "Lorem Ipsum is...",
      date: "21/02/25",
      status: "Cancelled",
      address:'Indore M.p'

    },
    
  ];
  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-[#228B22] text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="max-w-4xl shadow-2xl py-10  mx-auto my-10 space-y-4">
          <div className="text-2xl font-semibold text-center">My Hire</div>
          <div className="flex justify-evenly gap-2 mb-6 border border-white bg-gray-200">
            <button className="px-6 py-2 rounded-full border border-[#228B22] text-[#228B22]">
              Bidding Tasks
            </button>
            <button className="px-6 py-2 rounded-full bg-[#228B22] text-white">
              Direct Hiring
            </button>
            <button className="px-6 py-2 rounded-full border border-[#228B22] text-[#228B22]">
              Emergency Tasks
            </button>
          </div>
          <div className="px-2 md:px-10 lg:px-20">
            {tasks.map((task, index) => (
              <HireCard key={index} task={task} />
            ))}
          </div>
        </div>

        <div className="w-full  mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-103 mt-5">
          <img
            src={banner}
            alt="Gardening"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full object-cover"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
