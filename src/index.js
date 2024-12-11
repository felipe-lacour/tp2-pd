import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfIQITAxUuGbdxvjy5-oPV2UNFoYm3XrY",
  authDomain: "sputify-803d3.firebaseapp.com",
  projectId: "sputify-803d3",
  storageBucket: "sputify-803d3.firebasestorage.app",
  messagingSenderId: "1042984633835",
  appId: "1:1042984633835:web:cca7195754c791239fc5ae"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);