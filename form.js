// Import the functions you need from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your web app's Firebase configuration
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
const database = getDatabase(app);

// Reference to the form
const form = document.getElementById('registrationForm');

form.addEventListener("submit", async (e) => { // ✅ async function
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const course = document.getElementById("course").value;

  const registrationsRef = ref(database, 'registrations');

  try {
    const snapshot = await get(registrationsRef); // ✅ await inside async function
    let nextNumber = 1;

    if (snapshot.exists()) {
      const data = snapshot.val();
      const keys = Object.keys(data);

      keys.forEach(key => {
        const match = key.match(/jnvjamui(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num >= nextNumber) nextNumber = num + 1;
        }
      });
    }

    const newKey = "jnvjamui" + String(nextNumber).padStart(2, "0");

    await set(ref(database, 'registrations/' + newKey), { name, email, course });

    alert(`Registration added with ID: ${newKey}`);
    form.reset();
  } catch (error) {
    console.error(error);
  }
});


 