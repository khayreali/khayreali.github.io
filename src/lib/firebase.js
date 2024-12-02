// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5D7xGNIn4xQU-GfwUXlV5rjKu_f27DdA",
  authDomain: "personal-website-98d70.firebaseapp.com",
  projectId: "personal-website-98d70",
  storageBucket: "personal-website-98d70.firebasestorage.app",
  messagingSenderId: "991895801460",
  appId: "1:991895801460:web:cf2f8d722d8b1f039ecb21",
  measurementId: "G-Z0ZMG4JYCC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };