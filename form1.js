// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getDatabase, ref, set, get, child 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyByBYjFFEgtmhoNnyNF55vjiVBhMteIvcQ",
  authDomain: "jnvjamuialumni-edceb.firebaseapp.com",
  databaseURL: "https://jnvjamuialumni-edceb-default-rtdb.firebaseio.com",
  projectId: "jnvjamuialumni-edceb",
  storageBucket: "jnvjamuialumni-edceb.appspot.com",
  messagingSenderId: "412877503961",
  appId: "1:412877503961:web:8cfc88edcc694a43b9edc8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

// ================= AUTO OPEN MODAL =================
const modal = document.getElementById("contact-modal");
const isRegistered = localStorage.getItem("registered");

if (!isRegistered || isRegistered !== "true") {
  setTimeout(() => {
    modal.style.display = "flex";
  }, 10000);
}

// ================= FORM SUBMIT =================
const form = document.getElementById("registrationForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if (!emailPattern.test(email)) {
    alert("❌ Please enter a valid email address!");
    return;
  }

  try {
    // ================= CHECK DUPLICATE EMAIL =================
    const snapshot = await get(child(dbRef, "alumni"));
    let nextIndex = 1;

    if (snapshot.exists()) {
      const allData = snapshot.val();
      const emails = Object.values(allData).map(a => a.email.toLowerCase());

      if (emails.includes(email.toLowerCase())) {
        alert("❌ This email is already registered!");
        return;
      }

      nextIndex = Object.keys(allData).length + 1;
    }

    // ================= SAVE DATA =================
    const newKey = `jnvjamui${nextIndex}`;

    const alumniData = {
      name: document.getElementById("name").value,
      gender: document.getElementById("gender").value,
      profile: document.getElementById("profile").value,
      entryclass: document.getElementById("entryclass").value,
      exitclass: document.getElementById("exitclass").value,
      entryyear: document.getElementById("entryyear").value,
      exityear: document.getElementById("exityear").value,
      email: email,
      mobile: document.getElementById("mobile").value,
      organisation: document.getElementById("organisation").value,
      designation: document.getElementById("designation").value,
      location: document.getElementById("location").value,
      submittedAt: new Date().toISOString()
    };

    await set(ref(db, "alumni/" + newKey), alumniData);

    localStorage.setItem("registered", "true");
    alert("✅ Registration Successful!");

    form.reset();
    modal.style.display = "none";

  } catch (error) {
    console.error(error);
    alert("❌ Something went wrong!");
  }
});

// ================= LOGOUT =================
window.logoutUser = function () {
  localStorage.removeItem("registered");
  alert("Logged out successfully");
  location.reload();
};
