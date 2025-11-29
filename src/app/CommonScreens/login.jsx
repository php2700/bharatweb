import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import { getToken } from "firebase/messaging";
import { initForegroundNotifications, messaging } from "../../firebase";
import image from "../../assets/login/img.png";
import flag from "../../assets/login/flag.png";
import logo from "../../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [fcmToken, setFcmToken] = useState("");
  const navigate = useNavigate();


  // 🔹 1. If user is already logged in, redirect to home (or dashboard)
  useEffect(() => {
    const token = localStorage.getItem("bharat_token"); // change key as per your login storage
    if (token) {
      const role = localStorage.getItem("role");
      if (role == "user") {
        navigate("/homeuser");
      } else if (role == "both") {
        navigate("/homeservice");
      } else {
				navigate("/homeservice");
			}
    }
  }, [navigate]);

  useEffect(() => {
    initForegroundNotifications();
  }, []);

  // 🔹 2. Generate FCM token automatically (no permission dialog)
  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("❌ Notification permission not granted");
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        console.log("FCM Token:", token);
        setFcmToken(token);
      } catch (err) {
        console.error("Error fetching FCM token:", err);
      }
    };
    fetchFcmToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile || mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile, firebase_token: fcmToken }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("mobileNumber", mobile);
        localStorage.setItem("otp", data.temp_otp);

        toast.success("OTP sent successfully!");
        setTimeout(() => {
          navigate("/verify-otp");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen flex items-center justify-center bg-white mt-[50px]">
        <div className="flex flex-col md:flex-row w-full max-w-[100rem] overflow-hidden">
     <div className="w-full md:w-1/2 flex justify-center">
  <img
    src={image}
    alt="Plumber working"
    className="
      w-full 
      h-auto 
      object-contain 
      max-h-[220px]      /* Small mobile screens */
      sm:max-h-[280px]   /* >640px */
      md:max-h-none      /* Desktop normal size */
    "
  />
</div>


          <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="flex flex-col items-center space-y-6 w-full">
              <img
                src={logo}
                alt="The Bharat Works"
                className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[286px] h-auto object-contain "
              />

              <h2 className="font-bold text-gray-900 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] mb-1">
                Enter Your Mobile Number
              </h2>
              <p className="text-gray-500 text-sm sm:text-base text-center px-2">
                Just one step away to start{" "}
                <span className="font-semibold text-gray-700">
                  The Bharat Works.
                </span>
              </p>

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center mt-4 space-y-6"
              >
                <div className="flex items-center px-3 w-[280px] sm:w-[320px] md:w-[330px] lg:w-[390px] py-2 rounded-xl border-2 border-[#C6C6C6] bg-white">
                  <img src={flag} alt="India Flag" className="w-6 h-4 mr-2" />
                  <div className="flex items-center text-gray-700 mr-2">
                    <span className="text-sm font-semibold">+91</span>
                    <svg
                      className="w-4 h-4 ml-1 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
                        setMobile(value);
                      }
                    }}
                    maxLength={10}
                    className="w-full py-2 px-2 text-gray-700 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-[280px] sm:w-[320px] md:w-[330px] lg:w-[390px] ${
                    loading
                      ? "bg-[#228B22] cursor-not-allowed"
                      : "bg-[#228B22] hover:bg-green-700"
                  } text-white font-semibold py-3 rounded-2xl text-[16px] sm:text-[18px] md:text-[19px]`}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Send OTP"}
                </button>
              </form>
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
 