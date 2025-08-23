// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCuDRqRvzuNhTLuGyznU1JdeNYmFZB8HcE",
  authDomain: "bharatwebsite-74d03.firebaseapp.com",
  projectId: "bharatwebsite-74d03",
  storageBucket: "bharatwebsite-74d03.firebasestorage.app",
  messagingSenderId: "1091596407121",
  appId: "1:1091596407121:web:c150b5719a6e165fa0c370",
  measurementId: "G-D837N6K988"
});

const messaging = firebase.messaging();
