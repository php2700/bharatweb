// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// 🔹 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5QyOydwl8JnM_54ifKjd02QaTcaf1q2U",
  authDomain: "bharatapp-28243.firebaseapp.com",
  projectId: "bharatapp-28243",
  storageBucket: "bharatapp-28243.firebasestorage.app",
  messagingSenderId: "255771605949",
  appId: "1:255771605949:web:0e1034e1f25b03498630d4",
  measurementId: "G-B5KTVXCK88",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Messaging instance
export const messaging = getMessaging(app);

// 🔹 Foreground notifications
export const initForegroundNotifications = () => {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground notification received:", payload);
    if (Notification.permission === "granted") {
      new Notification(payload.notification?.title, {
        body: payload.notification?.body,
        icon: payload.notification?.icon || "/logo.png",
      });
    }
  });
};
