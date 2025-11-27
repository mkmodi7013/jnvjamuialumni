import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyByBYjFFEgtmhoNnyNF55vjiVBhMteIvcQ",
  authDomain: "jnvjamuialumni-edceb.firebaseapp.com",
  projectId: "jnvjamuialumni-edceb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= INSERT EVENT =================

const form = document.getElementById("insertEventForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const eventData = {
    title: document.getElementById("title").value,
    shortDescription: document.getElementById("shortDesc").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    venue: document.getElementById("venue").value,
    description: document.getElementById("description").value,
    updatedAt: new Date()
  };

  try {
    // Always update same event document
    await setDoc(doc(db, "events", "event2025"), eventData);

    alert("✅ Event details successfully saved to Firestore!");
    form.reset();
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Failed to save event");
  }
});
