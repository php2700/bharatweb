import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import Swal from "sweetalert2";
import image from "../../assets/workcategory/image.png";
import Arrow from "../../assets/profile/arrow_back.svg";

export default function WorkerList() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate(); // For redirecting on auth failure
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
        }).then(() => navigate("/login")); // Redirect to login page
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
          navigate("/login"); // Redirect on token failure
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
          Swal.fire("Error!", data.message || "Failed to delete worker.", "error");
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
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="flex items-center text-[#008000] hover:text-green-800 font-semibold text-xl"
          aria-label="Go back to previous page"
        >
          <img src={Arrow} className="w-9 h-9 mr-2" alt="Back arrow icon" />
          Back
        </Link>
      </div>

      <div className="w-full max-w-[81rem] shadow-[0px_4px_4px_0px_#00000040] rounded-xl p-3 sm:p-4 space-y-4 mx-auto">
        <div className="w-full max-w-4xl flex justify-between items-center mb-6 xl:ml-[260px]">
          <h1 className="w-full text-center text-lg sm:text-xl lg:text-[25px] font-[700] text-gray-800">
            Worker List
          </h1>
          <button className="bg-[#228B22] text-white px-2 sm:px-3 py-1 rounded-2xl shadow hover:bg-[#121212] w-[160px] sm:w-[180px] lg:w-[220px] lg:h-[48px] text-[15px] font-[500]">
            <Link to="/add-worker" aria-label="Add new worker">Add Worker</Link>
          </button>
        </div>

        <div className="w-full max-w-5xl mt-4 mx-auto">
          {workers.length === 0 ? (
            <p className="text-center text-gray-600">No workers found</p>
          ) : (
            workers.map((worker) => (
              <div
                key={worker._id}
                className="flex flex-col sm:flex-row items-start justify-between bg-white rounded-lg shadow-md p-4 gap-4 mb-4"
              >
                <div className="flex items-start space-x-4 w-full sm:w-auto">
                  <div className="relative flex-shrink-0">
                    <img
                      src={worker.image || image}
                      alt={`${worker.name}'s profile image`}
                      className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-lg object-cover"
                    />
                    

                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg lg:text-[25px] font-bold mt-10 text-gray-800 truncate">
                      {worker.name}
                    </h2>
                    <p className="text-base lg:text-[17px] text-gray-500 truncate">{worker.address || "No address provided"}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 min-w-[120px] w-40 mt-10">
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
      <div className="mt-[50px]">
        <Footer />
      </div>
    </>
  );
}