// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-ee7ef.firebaseapp.com",
  projectId: "mern-blog-ee7ef",
  storageBucket: "mern-blog-ee7ef.appspot.com",
  messagingSenderId: "941687762392",
  appId: "1:941687762392:web:c3f3720e3be4ba44f656ad"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);