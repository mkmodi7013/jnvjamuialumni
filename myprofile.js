// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  update,
  child
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔧 Firebase Configuration
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
const db = getDatabase(app);

const profileContainer = document.getElementById("profile-container");

// 🧩 Create editable profile table (email & key readonly)
function createTable(userData, key) {
  let table = `
    <h2 style="text-align:center;">Your Profile</h2>
    <table border="1" style="border-collapse:collapse; width:100%; text-align:left;">
      <tr><th>Field</th><th>Value</th></tr>
      <tr>
        <td><strong>Record Key</strong></td>
        <td><input type="text" id="recordKey" value="${key}" readonly style="background:#eee; color:#666;" /></td>
      </tr>`;

  for (let field in userData) {
    table += `
      <tr>
        <td>${field}</td>
        <td>
          <input type="text" id="${field}" value="${userData[field]}" 
          ${field === "email" ? "readonly style='background:#eee; color:#666;'" : ""} />
        </td>
      </tr>`;
  }

  table += `</table>
    <div style="text-align:center; margin-top:20px;">
      <button class="btn" id="updateBtn">Update</button>
      <button class="btn" id="logoutBtn" style="background:#dc3545;">Logout</button>
    </div>`;

  profileContainer.innerHTML = table;

  // Event Listeners
  document.getElementById("updateBtn").addEventListener("click", () => updateProfile(key));
  document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => {
      alert("Logged out successfully!");
      window.location.href = "index.html";
    });
  });
}

// 🛠️ Update user data in Firebase
function updateProfile(key) {
  const updatedData = {};
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    const field = input.id;
    // Skip email and record key fields (not editable)
    if (field !== "email" && field !== "recordKey") {
      updatedData[field] = input.value;
    }
  });

  update(ref(db, "alumni/" + key), updatedData)
    .then(() => {
      alert("Profile updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    });
}

// 👤 Fetch logged-in user data
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userEmail = user.email;
    const dbRef = ref(db);

    get(child(dbRef, "alumni"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const alumniData = snapshot.val();
          let userFound = false;

          Object.entries(alumniData).forEach(([key, record]) => {
            if (record.email && record.email.toLowerCase() === userEmail.toLowerCase()) {
              userFound = true;
              createTable(record, key);
            }
          });

          if (!userFound) {
            profileContainer.innerHTML = `<p>No profile data found for your account.</p>`;
          }
        } else {
          profileContainer.innerHTML = `<p>No alumni data available.</p>`;
        }
      })
      .catch((error) => {
        console.error(error);
        profileContainer.innerHTML = `<p>Error loading data.</p>`;
      });
  } else {
    profileContainer.innerHTML = `<p>You are not logged in. Please <a href="index.html">login</a> first.</p>`;
  }
});
