import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Added SweetAlert2 import
import image from "../../assets/workcategory/image.png";
import Arrow from "../../assets/profile/arrow_back.svg";
import axios from "axios";

export default function WorkerList() {
  const [workers, setWorkers] = useState([]); // Moved to state
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { orderId, type } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("bharat_token");
  const fetchWorkers = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/worker/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWorkers(data.workers);
      else setWorkers([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleAssign = async (workerId) => {
    if (!workerId || !orderId || !type) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Worker, Order, or Type is missing.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/worker/assign-order`,
        {
          worker_id: workerId,
          order_id: orderId,
          type: type,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Order Assigned!",
          text: "The worker has been assigned successfully.",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        }).then(() => {
          navigate(`/emergency/worker/order-detail/${orderId}`);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: response.data.message || "Could not assign order.",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold text-xl"
        >
          <img src={Arrow} className="w-9 h-9 mr-2" alt="Back arrow" />
          Back
        </Link>
      </div>

      {/* Title + Add Worker */}
      <div className="w-full max-w-[81rem] shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-3 sm:p-4 space-y-4 mx-auto">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 xl:ml-[300px]">
          <h1 className="w-full text-center text-lg sm:text-xl lg:text-[25px] font-[700] text-gray-800">
            Worker List
          </h1>
        </div>

        {/* Worker Cards */}
        <div className="w-full max-w-5xl mt-4 mx-auto">
          {workers.length === 0 ? (
            <p className="text-center text-gray-600">No workers found</p>
          ) : (
            workers.map((worker) => (
              <div
                key={worker._id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-md p-4 gap-4"
              >
                {/* Left Section */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  {/* Image with Badge */}
                  <div className="relative">
                    <img
                      src={worker.image || image}
                      alt={worker.name}
                      className="w-36 h-36 sm:w-60 sm:h-45 rounded-lg object-cover"
                    />
                    <span className="absolute bottom-9 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#6DEA6D] text-[#FFFFFF] font-[500] text-xs px-3 py-1 rounded-full shadow w-[125px] sm:w-[131px] sm:h-[25px] lg:w-[184px] lg:p-[0px] lg:text-center lg:text-[15px]">
                      {worker.status || "Pending"}
                    </span>
                  </div>
                  <div className="lg:mb-[123px]">
                    <h2 className="text-base sm:text-lg lg:text-[25px] font-[600] text-gray-800">
                      {worker.name}
                    </h2>
                    <p className="text-sm lg:text-[17px] text-gray-500">
                      {worker.location || worker.address}
                    </p>
                  </div>
                </div>

                {/* Right Section (Buttons) */}
                <div className="flex flex-row sm:flex-col md:flex-col lg:flex-col xl:flex-col gap-2">
                  <button
                    type="button"
                    className="bg-[#228B22] text-white px-5 py-2 rounded shadow hover:bg-[#121212]"
                    onClick={() => handleAssign(worker._id)}
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}
