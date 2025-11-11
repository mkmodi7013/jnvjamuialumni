// Import Firebase SDK (modular v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔥 Your Firebase configuration (replace with your real details)
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
const db = getDatabase(app);
const dbRef = ref(db);

// Reference the registration form
const form = document.getElementById("registrationForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form values
  const alumniData = {
    name: document.getElementById("name").value,
    gender: document.getElementById("gender").value,
    profile: document.getElementById("profile").value,
    entryclass: document.getElementById("entryclass").value,
    exitclass: document.getElementById("exitclass").value,
    entryyear: document.getElementById("entryyear").value,
    exityear: document.getElementById("exityear").value,
    email: document.getElementById("email").value,
    mobile: document.getElementById("mobile").value,
    organisation: document.getElementById("organisation").value,
    designation: document.getElementById("designation").value,
    submittedAt: new Date().toISOString()
  };

  try {
    // 🔹 Step 1: Get current alumni list
     
    const snapshot = await get(child(dbRef, "alumni"));
    let nextIndex = 1;

    if (snapshot.exists()) {
      const alumniDataAll = snapshot.val();
      const totalCount = Object.keys(alumniDataAll).length;
      nextIndex = totalCount + 1;
      
    }
   

    // 🔹 Step 2: Create new custom key like jnvjamui1, jnvjamui2, etc.
    const newKey = `jnvjamui${nextIndex}`;

    // 🔹 Step 3: Save data under that key
   

    await set(ref(db, "alumni/" + newKey), alumniData);

    alert(`✅ Data saved successfully as "${newKey}"`);
    form.reset();

  } catch (error) {
    console.error("❌ Error adding data:", error);
    alert("Error submitting form. Check console for details.");
  }
});
