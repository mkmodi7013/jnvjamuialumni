// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyByBYjFFEgtmhoNnyNF55vjiVBhMteIvcQ",
  authDomain: "jnvjamuialumni-edceb.firebaseapp.com",
  databaseURL: "https://jnvjamuialumni-edceb-default-rtdb.firebaseio.com",
  projectId: "jnvjamuialumni-edceb",
  storageBucket: "jnvjamuialumni-edceb.firebasestorage.app",
  messagingSenderId: "412877503961",
  appId: "1:412877503961:web:8cfc88edcc694a43b9edc8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const dbRef = ref(db);

// Elements
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const countryCodeSelect = document.getElementById("countryCode");
const phoneNumberInput = document.getElementById("phoneNumber");
const otpInput = document.getElementById("otpCode");
const loginSection = document.getElementById("loginSection");
const verifySection = document.getElementById("verifySection");
const statusMessage = document.getElementById("statusMessage");

let confirmationResult;

// 🧩 reCAPTCHA Setup
window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "normal",
  callback: () => console.log("reCAPTCHA verified ✅"),
  "expired-callback": () => alert("reCAPTCHA expired. Please refresh."),
});

// 🚀 Step 1: Send OTP
sendOtpBtn.addEventListener("click", async () => {
  const countryCode = countryCodeSelect.value;
  const phone = phoneNumberInput.value.trim();

  if (!phone) return alert("Please enter your phone number.");

  const fullPhone = `${countryCode}${phone}`;
  try {
    confirmationResult = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
    statusMessage.innerText = `✅ OTP sent to ${fullPhone}`;
    loginSection.style.display = "none";
    verifySection.style.display = "block";
  } catch (error) {
    console.error("Error sending OTP:", error);
    statusMessage.innerText = `❌ ${error.message}`;
  }
});

// 🚀 Step 2: Verify OTP and check in Realtime Database
verifyOtpBtn.addEventListener("click", async () => {
  const otpCode = otpInput.value.trim();
  if (!otpCode) return alert("Enter the OTP received.");

  try {
    const result = await confirmationResult.confirm(otpCode);
    const user = result.user;
    const phoneNumber = user.phoneNumber;

    // 🔍 Check if this phone exists in Realtime Database
    const snapshot = await get(child(dbRef, "alumni"));
    let exists = false;
    let foundKey = null;

    if (snapshot.exists()) {
      const alumniData = snapshot.val();
      for (const key in alumniData) {
        if (alumniData[key].mobile === phoneNumber) {
          exists = true;
          foundKey = key;
          break;
        }
      }
    }

    if (exists) {
      alert(`✅ Welcome back! Logged in as ${phoneNumber}`);
      localStorage.setItem("loggedInPhone", phoneNumber);
      window.location.href = "dashboard.html";
    } else {
          alert("❌ Mobile number not registered in alumni database.");
      window.location.reload();
    }

  } catch (error) {
    console.error("Error verifying OTP:", error);
    statusMessage.innerText = `❌ ${error.message}`;
  }
});
