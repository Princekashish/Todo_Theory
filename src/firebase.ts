import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; "firebase/"

const firebaseConfig = {
  apiKey: "AIzaSyBYM7M7qpTU0wpxHuMezp8Mq1jM-R2bt_I",
  authDomain: "todo-c27f4.firebaseapp.com",
  projectId: "todo-c27f4",
  storageBucket: "todo-c27f4.appspot.com",
  messagingSenderId: "328436999451",
  appId: "1:328436999451:web:2471a3100fc972cace1fbe",
  measurementId: "G-QK5HG1QMWM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
