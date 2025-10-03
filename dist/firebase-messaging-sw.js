// // Import Firebase scripts
// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// // Initialize Firebase
// firebase.initializeApp({
//   apiKey: "AIzaSyCuDRqRvzuNhTLuGyznU1JdeNYmFZB8HcE",
//   authDomain: "bharatwebsite-74d03.firebaseapp.com",
//   projectId: "bharatwebsite-74d03",
//   storageBucket: "bharatwebsite-74d03.firebasestorage.app",
//   messagingSenderId: "1091596407121",
//   appId: "1:1091596407121:web:c150b5719a6e165fa0c370",
//   measurementId: "G-D837N6K988"
// });

// const messaging = firebase.messaging();

// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA5QyOydwl8JnM_54ifKjd02QaTcaf1q2U",
  authDomain: "bharatapp-28243.firebaseapp.com",
  projectId: "bharatapp-28243",
  storageBucket: "bharatapp-28243.firebasestorage.app",
  messagingSenderId: "255771605949",
  appId: "1:255771605949:web:0e1034e1f25b03498630d4",
  measurementId: "G-B5KTVXCK88",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log("payload", payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title, {
    body,
    icon: icon || "/logo.png",
  });
});
