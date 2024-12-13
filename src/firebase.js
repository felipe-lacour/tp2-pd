import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDfIQITAxUuGbdxvjy5-oPV2UNFoYm3XrY",
    authDomain: "sputify-803d3.firebaseapp.com",
    projectId: "sputify-803d3",
    storageBucket: "sputify-803d3.firebasestorage.app",
    messagingSenderId: "1042984633835",
    appId: "1:1042984633835:web:cca7195754c791239fc5ae"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);