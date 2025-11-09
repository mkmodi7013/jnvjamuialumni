// Import the functions you need from the SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const course = document.getElementById('course').value;

    // Create a new entry in Firebase
    const newEntryRef = push(ref(database, 'registrations')); // "registrations" is the collection
    set(newEntryRef, {
        name: name,
        email: email,
        course: course
    })
    .then(() => {
        alert('Data submitted successfully!');
        form.reset();
    })
    .catch((error) => {
        console.error('Error submitting data:', error);
    });
});
