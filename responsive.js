// Toggle menu when hamburger is clicked
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});



// Get modal element
const modal = document.getElementById('contact-modal');

// Get all buttons that open the modal
const openButtons = document.querySelectorAll('.open-modal');

// Get the <span> element that closes the modal
const closeBtn = document.querySelector('.close');

// Open modal when any button is clicked
openButtons.forEach(button => {
  button.addEventListener('click', () => {
    modal.style.display = 'block';
  });
});

// Close modal when user clicks on X
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal if user clicks outside modal content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// ---------------- MODAL LOGIN ----------------

// Open/Close Login Modal
const loginModal = document.getElementById("login-modal");
const openLoginBtn = document.querySelector(".open-login");
const closeLoginBtn = document.querySelector(".close-login");

openLoginBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
});

closeLoginBtn.addEventListener("click", () => {
  loginModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
});


openLoginBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
});

closeLoginBtn.addEventListener("click", () => {
  loginModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
});
// 🔹 Open Modal
function openLoginModal() {
  modal.style.display = "flex";

  // 🧹 Clear previous input values each time
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";

  document.getElementById("signup-name").value = "";
  document.getElementById("signup-email").value = "";
  document.getElementById("signup-password").value = "";

  // Ensure login form shows by default
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  showSignup.style.display = "inline";
  showLogin.style.display = "none";
  document.getElementById("modal-title").innerText = "Login to Alumni Portal";
}
// left box slider
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyByBYjFFEgtmhoNnyNF55vjiVBhMteIvcQ",
  authDomain: "jnvjamuialumni-edceb.firebaseapp.com",
  databaseURL: "https://jnvjamuialumni-edceb-default-rtdb.firebaseio.com",
  projectId: "jnvjamuialumni-edceb",
  storageBucket: "jnvjamuialumni-edceb.firebasestorage.app",
  messagingSenderId: "412877503961",
  appId: "1:412877503961:web:8cfc88edcc694a43b9edc8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const slider = document.getElementById("newsSlider");

async function loadEvent(){
  console.log("Fetching event...");

  const docRef = doc(db, "events", "event2025");
  const docSnap = await getDoc(docRef);

  if(docSnap.exists()){
    console.log("Document data:", docSnap.data());
    const data = docSnap.data();

    if(data.items && Array.isArray(data.items)){
      data.items.forEach(event=>{
        slider.innerHTML += `
          <div class="news-item">
            <h4>${event.title}</h4>
            <p>${event.shortDescription}</p>
            <small>
              📅 ${event.date} &nbsp; 
              ⏰ ${event.time} <br>
              📍 ${event.venue}
            </small>
          </div>
        `;
      });
    } else {
      slider.innerHTML += `
        <div class="news-item">
          <h4>${data.title}</h4>
          <p>${data.shortDescription}</p>
          <small>
            📅 ${data.date} &nbsp; ⏰ ${data.time} <br>
            📍 ${data.venue}
          </small>
        </div>
      `;
    }

  } else {
    console.log("No such document!");
    slider.innerHTML = "<p>No events found.</p>";
  }
}

loadEvent();





