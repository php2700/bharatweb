// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCuDRqRvzuNhTLuGyznU1JdeNYmFZB8HcE",
  authDomain: "bharatwebsite-74d03.firebaseapp.com",
  projectId: "bharatwebsite-74d03",
  storageBucket: "bharatwebsite-74d03.firebasestorage.app",
  messagingSenderId: "1091596407121",
  appId: "1:1091596407121:web:c150b5719a6e165fa0c370",
  measurementId: "G-D837N6K988"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
