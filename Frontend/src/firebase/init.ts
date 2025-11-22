// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB1PVJJYEis-nBC26zUlGHw066KEg-xPo",
  authDomain: "aichatbot-39176.firebaseapp.com",
  projectId: "aichatbot-39176",
  storageBucket: "aichatbot-39176.firebasestorage.app",
  messagingSenderId: "770991831150",
  appId: "1:770991831150:web:cc0a694505402bc8b98e7f",
  measurementId: "G-6G1GEVRBQ8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);