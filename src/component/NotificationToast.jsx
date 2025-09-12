// src/components/NotificationToast.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearNotification } from "../redux/notificationSlice";

export default function NotificationToast() {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.notification);

  useEffect(() => {
    if (message) {
      // Show toast based on type
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;
        default:
          toast(message);
      }

      // Clear notification after showing
      dispatch(clearNotification());
    }
  }, [message, type, dispatch]);

  return <ToastContainer position="top-right" autoClose={3000} />;
}
