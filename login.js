// complete main.js / login.js file
// Handles:
// 1. Firebase Login
// 2. Auto open registration modal after 10 sec if user not registered
// 3. Prevents null innerHTML error
// 4. Fix for 400 Bad Request by validating inputs

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ================= FIREBASE CONFIG =================
// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyByBYjFFEgtmhoNnyNF55vjiVBhMteIvcQ",
  authDomain: "jnvjamuialumni-edceb.firebaseapp.com",
  databaseURL: "https://jnvjamuialumni-edceb-default-rtdb.firebaseio.com",
  projectId: "jnvjamuialumni-edceb",
  storageBucket: "jnvjamuialumni-edceb.firebasestorage.app",
  messagingSenderId: "412877503961",
  appId: "1:412877503961:web:8cfc88edcc694a43b9edc8",
  measurementId: "G-D59BC7Q6JE"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const registrationModal = document.getElementById("registration-modal");
  const profileContainer = document.getElementById("profileContainer");

  // ================= SAFE CHECK =================
  function safeSetHTML(element, html) {
    if (element) {
      element.innerHTML = html;
    } else {
      console.warn("Element not found in DOM");
    }
  }

  // ================= AUTO REGISTRATION MODAL =================
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      setTimeout(() => {
        if (registrationModal) {
          registrationModal.style.display = "flex";
        }
      }, 10000);

      safeSetHTML(profileContainer,
        `<p>You are not logged in. Please <span style='color:blue;cursor:pointer' onclick='openLogin()'>Login</span> first.</p>`
      );
    }
  });

  // ================= LOGIN FUNCTION =================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          alert("Login Success:", userCredential.user);
           window.location.href = "myprofile.html";
          if (registrationModal) registrationModal.style.display = "none";
        })
        .catch((error) => {
          console.error("Login Error:", error.message);
          alert("Invalid email or password");
        });
    });
  }
});

// ================= OPEN LOGIN FUNCTION =================
window.openLogin = function () {
  const loginModal = document.getElementById("login-modal");
  if (loginModal) {
    loginModal.style.display = "flex";
  }
};

// ================= IMPORTANT NOTES =================
// 1. Replace YOUR_API_KEY etc with your Firebase config
// 2. Ensure ids exist in HTML:
//    - loginForm
//    - login-email
//    - login-password
//    - registration-modal
//    - profileContainer
//    - login-modal
// 3. Fix 400 error is usually caused by wrong email/password or disabled auth method in Firebase console