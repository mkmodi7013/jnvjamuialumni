import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config
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

// Elements
const tableBody = document.querySelector("#alumniTable tbody");
let alumniData = {};

// Fetch and display data
async function fetchAlumni() {
  tableBody.innerHTML = `<tr><td colspan="14">Loading...</td></tr>`;
  try {
    const snapshot = await get(child(dbRef, "alumni"));
    if (snapshot.exists()) {
      alumniData = snapshot.val();
      renderTable();
    } else {
      tableBody.innerHTML = `<tr><td colspan="14">No data found.</td></tr>`;
    }
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="14">Error loading data.</td></tr>`;
  }
}

function renderTable() {
  tableBody.innerHTML = "";
  const keys = Object.keys(alumniData);
  if (!keys.length) {
    tableBody.innerHTML = `<tr><td colspan="14">No records.</td></tr>`;
    return;
  }

  keys.forEach((key, index) => {
    const a = alumniData[key];
    tableBody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${index + 1}</td>
        <td>${key}</td>
        <td>${a.name || ''}</td>
        <td>${a.gender || ''}</td>
        <td>${a.profile || ''}</td>
        <td>${a.entryclass || ''}</td>
        <td>${a.exitclass || ''}</td>
        <td>${a.entryyear || ''}</td>
        <td>${a.exityear || ''}</td>
        <td>${a.email || ''}</td>
        <td>${a.mobile || ''}</td>
        <td>${a.organisation || ''}</td>
        <td>${a.designation || ''}</td>
        <td>${a.submittedAt || ''}</td>
        <td>
          <button class="update-btn" data-key="${key}">Update</button>
        </td>
      </tr>
    `);
  });

  // ✅ Only Update functionality remains
  document.querySelectorAll(".update-btn").forEach(btn => {
    btn.addEventListener("click", () => openUpdateModal(btn.dataset.key));
  });
}

// Modal Elements
const updateModal = document.getElementById("updateModal");
const closeModal = document.querySelector(".close");
const updateForm = document.getElementById("updateForm");

// Open modal with data
function openUpdateModal(key) {
  const data = alumniData[key];
  if (!data) return;
  document.getElementById("updateKey").value = key;
  document.getElementById("updateName").value = data.name || "";
  document.getElementById("updateGender").value = data.gender || "";
  document.getElementById("updateProfile").value = data.profile || "";
  document.getElementById("updateEntryClass").value = data.entryclass || "";
  document.getElementById("updateExitClass").value = data.exitclass || "";
  document.getElementById("updateEntryYear").value = data.entryyear || "";
  document.getElementById("updateExitYear").value = data.exityear || "";
  document.getElementById("updateEmail").value = data.email || "";
  document.getElementById("updateMobile").value = data.mobile || "";
  document.getElementById("updateOrganisation").value = data.organisation || "";
  document.getElementById("updateDesignation").value = data.designation || "";
  updateModal.style.display = "block";
}

// Close modal
closeModal.addEventListener("click", () => updateModal.style.display = "none");
window.addEventListener("click", e => { if(e.target==updateModal) updateModal.style.display="none"; });

// Handle update form submit
updateForm.addEventListener("submit", async e => {
  e.preventDefault();
  const key = document.getElementById("updateKey").value;
  const updatedData = {
    ...alumniData[key],
    name: document.getElementById("updateName").value,
    gender: document.getElementById("updateGender").value,
    profile: document.getElementById("updateProfile").value,
    entryclass: document.getElementById("updateEntryClass").value,
    exitclass: document.getElementById("updateExitClass").value,
    entryyear: document.getElementById("updateEntryYear").value,
    exityear: document.getElementById("updateExitYear").value,
    email: document.getElementById("updateEmail").value,
    mobile: document.getElementById("updateMobile").value,
    organisation: document.getElementById("updateOrganisation").value,
    designation: document.getElementById("updateDesignation").value
  };
  await set(ref(db, "alumni/" + key), updatedData);
  updateModal.style.display = "none";
  fetchAlumni();
});

// Initial fetch
window.addEventListener("load", fetchAlumni);
