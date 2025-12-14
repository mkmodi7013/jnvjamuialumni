import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
const db = getDatabase(app);

let alumniData = {};

// ================= FETCH DATA =================
async function fetchAlumni() {
  const tableBody = document.querySelector("#alumniTable tbody");
  tableBody.innerHTML = `<tr><td colspan="16">Loading...</td></tr>`;

  try {
    const snapshot = await get(child(ref(db), "alumni"));
    if (!snapshot.exists()) {
      tableBody.innerHTML = `<tr><td colspan="16">No alumni found</td></tr>`;
      return;
    }

    alumniData = snapshot.val();
    populateFilters(alumniData);
    renderTable(alumniData);

  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="16">Error loading data</td></tr>`;
  }
}

// ================= SORT KEYS =================
function getSortedKeys(data) {
  return Object.keys(data).sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, "")) || 0;
    const nb = parseInt(b.replace(/\D/g, "")) || 0;
    return na - nb;
  });
}

// ================= RENDER TABLE =================
function renderTable(data) {
  const tableBody = document.querySelector("#alumniTable tbody");
  tableBody.innerHTML = "";

  const keys = getSortedKeys(data);

  if (keys.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="16">No records found</td></tr>`;
    return;
  }

  keys.forEach((key, index) => {
    const a = data[key];

    tableBody.insertAdjacentHTML("beforeend", `
      <tr data-key="${key}">
        <td>${index + 1}</td>
        <td>${key}</td>
        <td>${a.name || ""}</td>
        <td>${a.gender || ""}</td>
        <td>${a.profile || ""}</td>
        <td>${a.entryclass || ""}</td>
        <td>${a.exitclass || ""}</td>
        <td>${a.entryyear || ""}</td>
        <td>${a.exityear || ""}</td>
        <td>${a.email || ""}</td>
        <td>${a.mobile || ""}</td>
        <td>${a.organisation || ""}</td>
        <td>${a.designation || ""}</td>
        <td>${a.location || ""}</td>
        <td>${a.submittedAt ? new Date(a.submittedAt).toLocaleString() : ""}</td>
        <td>
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </td>
      </tr>
    `);
  });

  addRowEventListeners();
}

// ================= FILTER OPTIONS =================
function populateFilters(data) {
  const genders = new Set();
  const profiles = new Set();
  const entryYears = new Set();

  Object.values(data).forEach(a => {
    if (a.gender) genders.add(a.gender);
    if (a.profile) profiles.add(a.profile);
    if (a.entryyear) entryYears.add(a.entryyear);
  });

  const genderFilter = document.getElementById("genderFilter");
  const profileFilter = document.getElementById("profileFilter");
  const entryYearFilter = document.getElementById("entryYearFilter");

  genderFilter.innerHTML = `<option value="">All Genders</option>`;
  profileFilter.innerHTML = `<option value="">All Profiles</option>`;
  entryYearFilter.innerHTML = `<option value="">All Entry Years</option>`;

  [...genders].sort().forEach(v => genderFilter.innerHTML += `<option value="${v}">${v}</option>`);
  [...profiles].sort().forEach(v => profileFilter.innerHTML += `<option value="${v}">${v}</option>`);
  [...entryYears].sort().forEach(v => entryYearFilter.innerHTML += `<option value="${v}">${v}</option>`);
}

// ================= FILTER DATA =================
function filterData() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const gender = document.getElementById("genderFilter").value;
  const profile = document.getElementById("profileFilter").value;
  const entryYear = document.getElementById("entryYearFilter").value;

  const filtered = Object.fromEntries(
    Object.entries(alumniData).filter(([_, a]) => {
      const textMatch = Object.values(a).some(v =>
        v && v.toString().toLowerCase().includes(search)
      );
      return (
        textMatch &&
        (!gender || a.gender === gender) &&
        (!profile || a.profile === profile) &&
        (!entryYear || a.entryyear === entryYear)
      );
    })
  );

  renderTable(filtered);
}

// ================= ADD EDIT & DELETE EVENTS =================
function addRowEventListeners() {
  const editButtons = document.querySelectorAll(".editBtn");
  const deleteButtons = document.querySelectorAll(".deleteBtn");

  editButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const key = row.dataset.key;

      const newName = prompt("Edit Name:", alumniData[key].name || "");
      if (newName !== null) {
        update(ref(db, `alumni/${key}`), { name: newName })
          .then(() => {
            alumniData[key].name = newName;
            renderTable(alumniData);
          })
          .catch(err => console.error(err));
      }
    });
  });

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      const key = row.dataset.key;

      if (confirm("Are you sure you want to delete this record?")) {
        remove(ref(db, `alumni/${key}`))
          .then(() => {
            delete alumniData[key];
            renderTable(alumniData);
          })
          .catch(err => console.error(err));
      }
    });
  });
}

// ================= EVENTS =================
document.getElementById("searchInput").addEventListener("input", filterData);
document.getElementById("genderFilter").addEventListener("change", filterData);
document.getElementById("profileFilter").addEventListener("change", filterData);
document.getElementById("entryYearFilter").addEventListener("change", filterData);
document.getElementById("resetFilters").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("genderFilter").value = "";
  document.getElementById("profileFilter").value = "";
  document.getElementById("entryYearFilter").value = "";
  renderTable(alumniData);
});

// ================= LOAD =================
window.addEventListener("load", fetchAlumni);
