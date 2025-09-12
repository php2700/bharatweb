import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import money from "../../assets/login/money.png";
import Header from "../../component/Header";
import Footer from "../../component/footer";
import banner from "../../assets/profile/banner.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setNotifications } from "../../redux/emergencySlice"; // 👈 NEW

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Notifications() {
  const dispatch = useDispatch();
  const { notifications, status, error } = useSelector(
    (state) => state.emergency
  );

  // Redirect to login if not authenticated
  if (!localStorage.getItem("bharat_token")) {
    return <Navigate to="/login" replace />;
  }

  // Fetch notifications from API
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("bharat_token");
      const res = await fetch(`${BASE_URL}/user/getAllNotification`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        dispatch(setNotifications(data.notifications)); // update Redux
        // Save notifications in localStorage
        localStorage.setItem(
          "notifications",
          JSON.stringify(data.notifications)
        );
      } else {
        toast.error(data.message || "Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  fetchNotifications();
}, [dispatch]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 👇 Extra effect: show toast when profile verified
  useEffect(() => {
    if (notifications.some((n) => n.title.includes("Profile Verified"))) {
      toast.success("🎉 Your profile has been verified!");
    }
  }, [notifications]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#228B22]"></div>
          <p className="text-gray-600 text-lg">Loading notifications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-[56rem] mx-auto bg-white shadow-md rounded-lg border border-gray-200 mt-10 p-4">
          <h4 className="text-center text-[20px]">Notifications</h4>
          <p className="text-center text-red-500">{error}</p>
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </>
    );
  }

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notif) => {
    const date = new Date(notif.createdAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const today = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString(
      "en-US",
      { day: "numeric", month: "long", year: "numeric" }
    );

    let section = date;
    if (date === today) section = "Today";
    else if (date === yesterday) section = "Yesterday";

    if (!acc[section]) acc[section] = [];
    acc[section].push(notif);
    return acc;
  }, {});

  // Convert grouped notifications to array format for rendering
  const notificationSections = Object.keys(groupedNotifications).map(
    (section) => ({
      section,
      items: groupedNotifications[section].map((notif) => ({
        title: notif.title || "Notification",
        message: notif.message || "No message available",
      })),
    })
  );

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-[56rem] mx-auto bg-white shadow-md rounded-lg border border-gray-200 mt-10">
        <h4 className="text-center mt-4 text-[20px]">Notifications</h4>
        <div className="divide-y">
          {notificationSections.length === 0 ? (
            <p className="text-center text-gray-600 p-4">
              No notifications found
            </p>
          ) : (
            notificationSections.map((section, i) => (
              <div key={i} className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  {section.section}
                </h3>
                {section.items.map((notif, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={money}
                        alt="coin"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500">{notif.message}</p>
                      </div>
                    </div>
                    <button className="text-green-600 text-sm font-medium border border-green-600 px-3 py-1 rounded-lg">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="w-full max-w-[90%] mx-auto rounded-[50px] overflow-hidden relative bg-[#f2e7ca] h-[400px] mt-5">
        <img
          src={banner}
          alt="Gardening illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </>
  );
}
