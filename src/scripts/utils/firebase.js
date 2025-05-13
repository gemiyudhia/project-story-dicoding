// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCKmcBaWiH8LzBWSfYszjHGwBqvRCzwiw",
  authDomain: "story-dicoding-2cc3d.firebaseapp.com",
  projectId: "story-dicoding-2cc3d",
  storageBucket: "story-dicoding-2cc3d.firebasestorage.app",
  messagingSenderId: "992228553530",
  appId: "1:992228553530:web:370861f190025721859603"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app}