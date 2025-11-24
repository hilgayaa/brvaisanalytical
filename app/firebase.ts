// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpzbVQkHbVBJbkP7dPsAoLmv4BPQD2E6A",
  authDomain: "brvais-3416c.firebaseapp.com",
  projectId: "brvais-3416c",
  storageBucket: "brvais-3416c.firebasestorage.app",
  messagingSenderId: "853246843806",
  appId: "1:853246843806:web:fafcdc85aa561cebc2d48f",
  measurementId: "G-WSPC20D78F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);