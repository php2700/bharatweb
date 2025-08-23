// src/utils/getFcmToken.js
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const getFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
  vapidKey: "BB4krNzHVO1aWqrQAHGbz-5Y4LRP97M0YJHKahBZM_tte_CFxz2OEY4SZI-ao9KuwS_JRKnN2XtRXtBYzYgtQ6c",
    });
    return token;
  } catch (error) {
    console.error("FCM token error:", error);
    return null;
  }
};
