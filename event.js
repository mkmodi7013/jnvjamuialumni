import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyByBYjFFEgtmhoNnyNF55vjiVBhMteIvcQ",
  authDomain: "jnvjamuialumni-edceb.firebaseapp.com",
  projectId: "jnvjamuialumni-edceb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= FETCH EVENT DATA =================

async function loadEvent() {
  const eventRef = doc(db, "events", "event2025");
  const eventSnap = await getDoc(eventRef);

  if (eventSnap.exists()) {
    const data = eventSnap.data();

    document.getElementById("eventTitle").innerText = data.title;
    document.getElementById("eventShortDesc").innerText = data.shortDescription;
    document.getElementById("eventDate").innerText = data.date;
    document.getElementById("eventTime").innerText = data.time;
    document.getElementById("eventVenue").innerText = data.venue;
    document.getElementById("eventDescription").innerText = data.description;
  }
}

loadEvent();

// ================= REGISTER FORM =================

const form = document.getElementById("eventForm");

form.addEventListener("submit", async function(e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;

  await addDoc(collection(db, "eventRegistrations"), {
    name,
    email,
    mobile,
    createdAt: new Date()
  });

  alert("✅ Registered Successfully!");
  form.reset();
});
