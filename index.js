// ================= NAVBAR TOGGLE =================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});


// ================= CONTACT MODAL =================
const modal = document.getElementById('contact-modal');
const openButtons = document.querySelectorAll('.open-modal');
const closeBtn = document.querySelector('.close');

openButtons.forEach(button => {
  button.addEventListener('click', () => {
    modal.style.display = 'block';
  });
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});


// ================= FIREBASE (EVENT SLIDER) =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyByBYjFFEgtmhoNnyNF55vjiVBhMteIvcQ",
  authDomain: "jnvjamuialumni-edceb.firebaseapp.com",
  projectId: "jnvjamuialumni-edceb",
  storageBucket: "jnvjamuialumni-edceb.appspot.com",
  messagingSenderId: "412877503961",
  appId: "1:412877503961:web:8cfc88edcc694a43b9edc8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const slider = document.getElementById("newsSlider");

// ================= LOAD EVENTS =================
async function loadEvent() {
  const docRef = doc(db, "events", "event2025");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    slider.innerHTML = "<p>No events found.</p>";
    return;
  }

  const data = docSnap.data();
  slider.innerHTML = "";

  if (Array.isArray(data.items)) {
    data.items.forEach(event => {
      slider.innerHTML += `
        <div class="news-item">
          <h4>${event.title}</h4>
          <p>${event.shortDescription}</p>
          <small>
            📅 ${event.date} &nbsp; ⏰ ${event.time}<br>
            📍 ${event.venue}
          </small>
        </div>
      `;
    });
  } else {
    slider.innerHTML = `
      <div class="news-item">
        <h4>${data.title}</h4>
        <p>${data.shortDescription}</p>
        <small>
          📅 ${data.date} &nbsp; ⏰ ${data.time}<br>
          📍 ${data.venue}
        </small>
      </div>
    `;
  }
}

loadEvent();
