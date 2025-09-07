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
import { Link, useNavigate, useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { Search } from "lucide-react";
import norelatedwork from "../../../assets/bidding/no_related_work.png";
import Swal from "sweetalert2";
import Nowork from "../../../assets/bidding/no_related_work.png";
import call from "../../../assets/bidding/call.png";
import msg from "../../../assets/bidding/msg.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserProfile } from "../../../redux/userSlice";

import { SearchIcon } from "lucide-react";
// import FilterWorker from "./FilterWorker";
import Accepted from "../../directHiring/User/Accepted";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import Accepted from "./Accepted";

export default function BiddinggetWorkDetail() {
  const { id } = useParams();
  localStorage.setItem('order_id',id);
  const [isCancelled, setIsCancelled] = useState(false);
    const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
const [subCategoryIds, setSubCategoryIds] = useState([]);
const [providers, setProviders] = useState([]);
const navigate=useNavigate();
  const [tab, setTab] = useState("bidder");
  const [orderDetail, setOrderDetail] = useState(null);
  
  const [activeTab, setActiveTab] = useState("Bidder");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleView = (serviceproviderid, bidding_offer_id, order_id) => {
  navigate(`/bidding/hiredetail/${serviceproviderid}`, {
    state: { bidding_offer_id, order_id }
  });
};

  const InviteSendWorker = async (workerid) => {
  const order_id = id; // assuming you have `id` already in scope
  const token = localStorage.getItem("bharat_token"); // if you need auth token
   


  const payload = {
    order_id: order_id,
    provider_ids: [workerid],
  };

  try {
    const response = await fetch(`${BASE_URL}/bidding-order/inviteServiceProviders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // remove if not needed
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    // console.log("API Response:", result);

    if (response.ok) {
      toast.success("Invitation sent successfully ");
    } else {
      alert("Error: " + (result.message || "Something went wrong"));
    }
  } catch (error) {
    console.error("API Error:", error);
    alert("Network error, please try again.");
  }
};

  
   useEffect(() => {
    const fetchOffers = async () => {
      try {
        // ✅ Get token from localStorage
        const token = localStorage.getItem("bharat_token");

        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        // ✅ API call using fetch
        const response = await fetch(
          `https://api.thebharatworks.com/api/bidding-order/getBiddingOffers/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }

        const data = await response.json();
        setOffers(data); // 👈 adjust if response has {data: ...}
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);
  console.log(offers);

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
        const order = data.data;

        // ✅ Sirf IDs extract karna
        setCategoryId(order?.category_id?._id || null);

        setSubCategoryIds(
          Array.isArray(order?.sub_category_ids)
            ? order.sub_category_ids.map((sub) => sub._id)
            : []
        );

        // Agar full order bhi chahiye toh alag store kar lo
        setOrderDetail(order);
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
useEffect(() => {
  // Ye tab chalega jab categoryId aur subCategoryIds dono available hon
  if (!categoryId || subCategoryIds.length === 0) return;

  const fetchServiceProviders = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/user/getServiceProviders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id: categoryId,
          subcategory_ids: subCategoryIds,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProviders(data.data); // 👈 response save in state
      } else {
        console.error(data.message || "Failed to fetch service providers");
      }
    } catch (err) {
      console.error("Error fetching service providers:", err);
    }
  };

  fetchServiceProviders();
}, [categoryId, subCategoryIds]);
console.log(providers);
  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
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
      <div className="flex justify-center items-center w-full">
  <div className="bg-white rounded-[42px] shadow-[0px_4px_4px_0px_#00000040] p-4 max-w-3xl w-full">
    {/* Tabs */}
    <div className="flex flex-wrap justify-center gap-2 sm:gap-6 lg:gap-10 mb-4 bg-[#D9D9D9] p-[8px] rounded-full">
      <button
        onClick={() => setTab("bidder")}
        className={`px-4 py-2 lg:px-17 lg:py-3 rounded-full font-medium text-sm ${
          tab === "bidder"
            ? "bg-[#228B22] text-white border-3"
            : "bg-gray-100 text-[#228B22]"
        }`}
      >
        Bidder
      </button>
      <button
        onClick={() => setTab("related")}
        className={`px-4 py-2 lg:px-17 lg:py-3 rounded-full font-medium text-sm ${
          tab === "related"
            ? "bg-[#228B22] text-white border-3"
            : "bg-gray-100 text-[#228B22]"
        }`}
      >
        Related Worker
      </button>
    </div>

    {/* Search Box */}
    <div className="w-full flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search for services"
        className="flex-1 bg-transparent px-3 outline-none text-sm text-gray-700"
      />
      <SlidersHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
    </div>

    {/* Conditional Rendering */}
    {tab === "related" ? (
      <div className="flex flex-col items-center justify-center text-gray-500 py-10">
       {Array.isArray(providers) && providers.length > 0 ? (
    providers.map((provider) => (
      <div
        key={provider._id}
        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-[#F9F9F9] rounded-xl p-4 shadow w-[738px]"
      >
        {/* Worker Image */}
        <img
          src={images} // ya offer.image agar API deta hai
          alt={provider.full_name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
        />

        {/* Worker Details */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-[17px] font-bold text-[#303030]">
            {provider.full_name}
          </h3>
         <p className="text-sm text-gray-500 truncate max-w-[200px]">
  {provider.skill}
</p>

          <span className="px-4 py-1 bg-[#F27773] text-white font-[600] text-xs rounded-full inline-block mt-1">
            location
          </span>
          <div>
            <button className="text-green-600 font-medium text-sm mt-1">
              View Profile
            </button>
          </div>
        </div>

        {/* Status + Invite */}
        <div className="flex flex-col items-center sm:items-end w-full sm:w-auto mt-3 sm:mt-0">
          {/* <span className="text-lg font-semibold text-gray-800 mb-2">
            amount
          </span> */}
          <div className="flex items-center gap-4 sm:gap-7">
            <span className="w-8 h-8 rounded-full bg-[#e1e1e1] flex items-center justify-center">
              <img src={call} alt="call" className="w-[18px] sm:w-[23px]" />
            </span>
            <span className="w-8 h-8 rounded-full bg-[#e1e1e1] flex items-center justify-center">
              <img src={msg} alt="msg" className="w-[18px] sm:w-[23px]" />
            </span>
            <button onClick={()=>InviteSendWorker(provider._id)}
            className="bg-[#228B22] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-green-700">
              Invite
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="flex flex-col items-center justify-center text-gray-500 py-10">
      <img
        src={Nowork}
        alt="No worker"
        className="w-48 sm:w-72 md:w-96 mb-4"
      />
    </div>
  )}
      </div>
    ) : (
      <div className="mt-6 space-y-4">
  {Array.isArray(offers?.data) && offers.data.length > 0 ? (
    offers.data.map((offer) => (
      <div
        key={offer._id}
        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-[#F9F9F9] rounded-xl p-4 shadow"
      >
        {/* Worker Image */}
        <img
          src={images} // ya offer.image agar API deta hai
          alt={offer.name}
          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
        />

        {/* Worker Details */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-[17px] font-bold text-[#303030]">
            {offer.provider_id.full_name}
          </h3>
          <p className="text-sm text-gray-500">{offer.message}</p>
          <span className="px-4 py-1 bg-[#F27773] text-white font-[600] text-xs rounded-full inline-block mt-1">
            {offer.provider_id.location.address}
          </span>
          <div>
           <button
  onClick={() => handleView(offer.provider_id.id,offer._id,offer.order_id)}
  className="text-green-600 font-medium text-sm mt-1 underline"
>
  View Profile
</button>

          </div>
        </div>

        {/* Status + Invite */}
        <div className="flex flex-col items-center sm:items-end w-full sm:w-auto mt-3 sm:mt-0">
          <span className="text-lg font-semibold text-gray-800 mb-2">
            ₹{offer.bid_amount}
          </span>
            <button 
            className="bg-[#228B22] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-green-700">
              Accept
            </button>
          {/* <div className="flex items-center gap-4 sm:gap-7">
            <span className="w-8 h-8 rounded-full bg-[#e1e1e1] flex items-center justify-center">
              <img src={call} alt="call" className="w-[18px] sm:w-[23px]" />
            </span>
            <span className="w-8 h-8 rounded-full bg-[#e1e1e1] flex items-center justify-center">
              <img src={msg} alt="msg" className="w-[18px] sm:w-[23px]" />
            </span>
            <button onClick={()=>InviteSendWorker(offer.provider_id.id)}
            className="bg-[#228B22] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-green-700">
              Invite
            </button>
          </div> */}
        </div>
      </div>
    ))
  ) : (
    <div className="flex flex-col items-center justify-center text-gray-500 py-10">
      <img
        src={Nowork}
        alt="No worker"
        className="w-48 sm:w-72 md:w-96 mb-4"
      />
    </div>
  )}
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