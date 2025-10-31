



import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import image from "../../assets/addworker/defaultDP.png";
import Arrow from "../../assets/profile/arrow_back.svg";

export default function WorkerList() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchWorkers = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      if (!token) {
        Swal.fire({
          title: "Error!",
          text: "You are not logged in. Please log in to continue.",
          icon: "error",
          confirmButtonText: "Go to Login",
        }).then(() => navigate("/login"));
        return;
      }
      const res = await fetch(`${BASE_URL}/worker/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setWorkers(data.workers || []);
      } else {
        Swal.fire("Error!", data.message || "Failed to fetch workers.", "error");
        if (data.message.includes("token")) {
          navigate("/login");
        }
        setWorkers([]);
      }
    } catch (err) {
      console.error("Fetch workers error:", err);
      Swal.fire("Error!", "Failed to connect to the server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const deleteWorker = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this worker?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("bharat_token");
        if (!token) {
          Swal.fire({
            title: "Error!",
            text: "You are not logged in. Please log in to continue.",
            icon: "error",
            confirmButtonText: "Go to Login",
          }).then(() => navigate("/login"));
          return;
        }
        const res = await fetch(`${BASE_URL}/worker/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire("Deleted!", "Worker has been deleted.", "success");
          fetchWorkers();
        } else {
          Swal.fire(
            "Error!",
            data.message || "Failed to delete worker.",
            "error"
          );
          if (data.message.includes("token")) {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("Delete worker error:", err);
        Swal.fire("Error!", "Something went wrong. Please try again.", "error");
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#228B22]"></div>
          <p className="text-gray-600 text-lg">Loading workers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {/* Main Content Wrapper */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl w-full mx-auto">
          {/* Back Button - Positioned above the card */}
          <div className="mb-5 mt-20">
            <Link
              to="/"
              className="flex items-center text-[#008000] hover:text-green-800 font-semibold text-xl"
              aria-label="Go back to previous page"
            >
              <img src={Arrow} className="w-9 h-9 mr-2" alt="Back arrow icon" />
              Back
            </Link>
          </div>

          {/* Worker List Card */}
          <div className="w-full shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-4 sm:p-6 space-y-4 bg-white">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-lg sm:text-xl lg:text-[25px] font-[700] text-gray-800 text-center">
                Worker List
              </h1>
              <button className="bg-[#228B22] text-white px-3 sm:px-4 py-2 rounded-2xl shadow hover:bg-[#121212] w-[160px] sm:w-[180px] lg:w-[220px] lg:h-[48px] text-[15px] font-[500] mt-4 sm:mt-0">
                <Link to="/add-worker" aria-label="Add new worker">
                  Add Worker
                </Link>
              </button>
            </div>

            <div className="w-full">
              {workers.length === 0 ? (
                <p className="text-center text-gray-600">No workers found</p>
              ) : (
                workers.map((worker) => (
                  <div
                    key={worker._id}
                    className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-md p-4 gap-4 mb-4 w-full"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <div className="relative flex-shrink-0">
                        <img
                          src={worker.image || image}
                          alt={`${worker.name}'s profile image`}
                          // className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-lg object-cover"
                            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover "
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h2 className="text-base sm:text-lg lg:text-[25px] font-bold text-gray-800 truncate">
                          {worker.name}
                        </h2>
                        <p className="text-base lg:text-[17px] text-gray-500 truncate">
                          {worker.address || "No address provided"}
                        </p>

                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full capitalize ${getStatusClass(
                              worker.verifyStatus
                            )}`}
                          >
                            {worker.verifyStatus || "N/A"}
                          </span>
                          {worker.verifyStatus === "rejected" &&
                            worker.rejectionReason && (
                              <p className="text-sm text-red-600 mt-1">
                                <strong>Reason:</strong> {worker.rejectionReason}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-full sm:w-40 mt-4 sm:mt-0">
                      <Link
                        to={`/editworker/${worker._id}`}
                        className="bg-[#228B22] text-white px-4 py-2 rounded shadow hover:bg-green-700 text-center w-full"
                        aria-label={`Edit worker ${worker.name}`}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteWorker(worker._id)}
                        className="bg-[#228B22] text-white px-4 py-2 rounded shadow hover:bg-green-700 text-center w-full"
                        aria-label={`Delete worker ${worker.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}