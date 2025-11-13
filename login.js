// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Your Firebase Configuration (replace with your project values)
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ---------------- LOGIN ----------------
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const msg = document.getElementById("auth-message");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.style.color = "green";
      msg.textContent = "Login successful!";
   window.location.href = "myprofile.html";
      setTimeout(() => {
        document.getElementById("login-modal").style.display = "none";
      }, 1000);
    })
    .catch((error) => {
      msg.style.color = "red";
      msg.textContent = error.message;
    });
});

// ---------------- SIGNUP ----------------
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.style.color = "green";
      msg.textContent = "Account created successfully! You can now log in.";
      signupForm.style.display = "none";
      loginForm.style.display = "block";
      document.getElementById("modal-title").textContent = "Login to Alumni Portal";
      document.getElementById("show-signup").style.display = "inline";
      document.getElementById("show-login").style.display = "none";
    })
    .catch((error) => {
      msg.style.color = "red";
      msg.textContent = error.message;
    });
});

// ---------------- TOGGLE BETWEEN LOGIN/SIGNUP ----------------
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");

showSignup.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  document.getElementById("modal-title").textContent = "Create an Account";
  showSignup.style.display = "none";
  showLogin.style.display = "inline";
  msg.textContent = "";
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  document.getElementById("modal-title").textContent = "Login to Alumni Portal";
  showSignup.style.display = "inline";
  showLogin.style.display = "none";
  msg.textContent = "";
});
