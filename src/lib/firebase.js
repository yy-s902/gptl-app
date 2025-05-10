// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB4P7cPoQF9tVmpGcPowEeKe3eBGeZc63c",
    authDomain: "gptl1-542b5.firebaseapp.com",
    projectId: "gptl1-542b5",
    storageBucket: "gptl1-542b5.firebasestorage.app",
    messagingSenderId: "856837508334",
    appId: "1:856837508334:web:932d98a2ea2457ce3a37ff",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
