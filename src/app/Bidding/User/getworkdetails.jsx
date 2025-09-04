import Footer from "../../../component/footer";
import Header from "../../../component/Header";
import image from "../../../assets/workcategory/image.png";
import banner from "../../../assets/banner.png";
import ratingImg from "../../../assets/rating/ic_round-star.png";
import hisWorkImg from "../../../assets/directHiring/his-work.png";
import filterIcon from "../../../assets/directHiring/filter-square.png";
import images from "../../../assets/workcategory/image.png";
import warningImg from "../../../assets/directHiring/warning.png";
import callIcon from "../../../assets/directHiring/call.png";
import messageIcon from "../../../assets/directHiring/message.png";
import edit from "../../../assets/bidding/edit.png";
import cancel from "../../../assets/bidding/cancel.png";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import norelatedwork from "../../../assets/bidding/no_related_work.png";
import Swal from "sweetalert2";

import { SearchIcon } from "lucide-react";
// import FilterWorker from "./FilterWorker";
import Accepted from "../../directHiring/User/Accepted";
import { useEffect, useState } from "react";
// import Accepted from "./Accepted";

export default function BiddinggetWorkDetail() {
  const { id } = useParams();
  const [isCancelled, setIsCancelled] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Bidder");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) return;

        const res = await fetch(
          `${BASE_URL}/bidding-order/getBiddingOrderById/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setOrderDetail(data.data); // assuming API returns { data: {...} }
        } else {
          console.error(data.message || "Failed to fetch order");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);
  let title;
  let address;
  let description;
  let createdAt;
  let deadline;
  let project_id;
  let hire_status;
  if (orderDetail) {
    // checks if orderDetail is not null or undefined
    title = orderDetail.title;
    address = orderDetail.address;
    description = orderDetail.description;
    project_id = orderDetail.project_id;
    hire_status = orderDetail.hire_status;
    createdAt = new Date(orderDetail.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    deadline = new Date(orderDetail.deadline).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }

  const bidders = [
    {
      id: 1,
      name: "Dipak Sharma",
      location: "Indore MP",
      status: "Add Feature",
      image: image,
      amount: "200",
      rating: 4.5,
      skills:
        "Lorem, ipsum dolor sit amet consectetur ",
    },
    {
      id: 2,
      name: "Dipak Sharma",
      location: "Indore MP",
      status: "Add Feature",
      image: image,
      amount: "200",
      rating: 4.5,
      skills:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
    },
    {
      id: 3,
      name: "Dipak Sharma",
      location: "Indore MP",
      status: "Add Feature",
      image: image,
      amount: "200",
      rating: 4.5,
      skills:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias  consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
    },
    {
      id: 4,
      name: "Dipak Sharma",
      location: "Indore MP",
      status: "Add Feature",
      image: image,
      amount: "200",
      rating: 4.5,
      skills:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime tempora accusantium minima repellendus alias consectetur adipisicing elit. Eum itaque mollitia culpa ratione iusto iste dignissimos cupiditate. Sequi id alias ab ea. Amet maxime ",
    },
  ];
const canceltask = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to cancel this task?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel it",
  }).then((result) => {
    if (result.isConfirmed) {
      // ✅ Get token from localStorage
      const token = localStorage.getItem("bharat_token");

      // ✅ API Call using fetch
      fetch(
        `https://api.thebharatworks.com/api/bidding-order/cancelBiddingOrder/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            throw new Error("Failed to cancel task");
          }
          return res.json();
        })
        .then((data) => {
          setIsCancelled(true); // ✅ Update UI
          Swal.fire("Cancelled!", "Task has been cancelled.", "success");
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Error!", "Something went wrong while cancelling.", "error");
        });
    }
  });
};
  return (
    <>
      <Header />
      <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex justify-start mb-4">
          <button className="text-[#228B22] text-sm hover:underline">
            &lt; Back
          </button>
        </div>
        <div className="container max-w-5xl  mx-auto my-10 p-8 bg-white shadow-lg rounded-3xl">
          <div className="text-2xl text-center font-bold mb-4">Work Detail</div>

          <div>
            <img src={hisWorkImg} className="h-80 w-full" />
          </div>
          <div className=" py-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-lg font-semibold">Chhawani Usha Ganj</p>
                <span className="inline-block bg-red-500 text-white text-lg font-semibold px-3  rounded-full mt-2">
                  {address}
                </span>
              </div>
              <div className="text-right">
                <p className="bg-black text-white text-md px-4 rounded-full inline-block">
                  {project_id}
                </p>
                <p className="text-md mt-2">
                  <span className="font-semibold">
                    Posted Date: {createdAt}
                  </span>
                </p>
                <p className="text-md">
                  <span className="font-semibold">
                    Completion Date: {deadline}
                  </span>
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold">Work Title</h3>

            <div className="border border-[#228B22] rounded-lg p-4 text-sm text-gray-700 space-y-3">
              <p>{description}</p>
            </div>

            {/* default ui we show */}

            {/* payment page */}
            <div className="space-y-6">
  <div className="flex justify-center gap-6">
    {hire_status === "cancelled" || isCancelled ? (
      // 🔴 Only show cancelled message
      <div className="flex items-center justify-center gap-2 bg-[#FF0000] text-white px-6 py-3 rounded-lg font-medium">
        <img src={cancel} alt="Cancelled" className="w-5 h-5" />
        Cancelled Task By User
      </div>
    ) : (
      // 🟢 Show Edit + Cancel buttons
      <>
        <Link
          to={`/bidding/edittask/${id}`}
          className="flex items-center gap-2 text-[#228B22] px-6 py-3 rounded-lg font-medium border-2"
        >
          <img src={edit} alt="Edit" className="w-5 h-5" />
          Edit
        </Link>

        <button
          onClick={canceltask}
          className="flex items-center gap-2 bg-[#FF0000] text-white px-6 py-3 rounded-lg font-medium"
        >
          <img src={cancel} alt="Cancel" className="w-5 h-5" />
          Cancel Task
        </button>
      </>
    )}
  </div>
</div>

          </div>
        </div>
        <div className="flex justify-center items-center bg-white">
      <div className="w-full max-w-4xl border border-green-200 rounded-2xl shadow-sm p-4">
        {/* Tabs */}
        <div className="flex justify-center mb-4 bg-[#D9D9D9] rounded-full p-1">
          <button
            className={`px-8 py-2 rounded-full transition-all ${
              activeTab === "Bidder"
                ? "bg-[#228B22] text-white"
                : "bg-white text-green-600"
            }`}
            onClick={() => setActiveTab("Bidder")}
          >
            Bidder
          </button>
          <button
            className={`ml-2 px-8 py-2 rounded-full transition-all ${
              activeTab === "Related worker"
                ? "bg-[#228B22] text-white"
                : "bg-white text-green-600"
            }`}
            onClick={() => setActiveTab("Related worker")}
          >
            Related worker
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for services"
            className="w-full border rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>

        {activeTab === "Bidder" ? (
          <div className="space-y-4">
            {bidders.map((bidder) => (
              <div
                key={bidder.id}
                className="flex items-center justify-between bg-white rounded-xl shadow-md p-4"
              >
                {/* Left side (image + info) */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={bidder.image}
                      alt={bidder.name}
                      className="w-full h-full object-cover"
                    />
                    {bidder.viewed && (
                      <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 rounded">
                        Viewed
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{bidder.name}</h2>
                    <p className="text-sm text-gray-500">{bidder.skills}</p>
                    <span className="inline-block bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full mt-2">
                      {bidder.location}
                    </span>
                    <p className="text-sm text-green-600 font-medium mt-1 cursor-pointer">
                      View Profile
                    </p>
                  </div>
                </div>

                {/* Right side (amount + actions) */}
                <div className="flex flex-col items-end">
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{bidder.amount}.00
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="w-8 h-8 bg-green-100 rounded-full"></button>
                    <button className="w-8 h-8 bg-green-100 rounded-full"></button>
                  </div>
                  <button className="mt-3 bg-[#228B22] text-white px-4 py-1 rounded-lg hover:bg-green-700">
                    Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state for Related worker */
          <div className="flex flex-col justify-center items-center text-center py-10">
            <img
              src={norelatedwork}
              alt="Illustration"
              className="w-60 h-auto mb-4"
            />
            <p className="text-gray-500">No related workers found</p>
          </div>
        )}
      </div>
    </div>

        {/* filter data getting  */}
        {/* <FilterWorker /> */}

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
