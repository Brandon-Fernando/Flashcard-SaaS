// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC6etZ4KAnGZmmsVeTOVCtb61-ykCPOWM",
  authDomain: "flashcard-saas-f1b28.firebaseapp.com",
  projectId: "flashcard-saas-f1b28",
  storageBucket: "flashcard-saas-f1b28.appspot.com",
  messagingSenderId: "341888977680",
  appId: "1:341888977680:web:fefed30d84255c5b793395"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app)
const db = getFirestore(app);

export {db}