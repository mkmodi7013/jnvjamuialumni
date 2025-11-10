import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let alumniData = {};

async function fetchAlumni() {
  const tableBody = document.querySelector("#alumniTable tbody");
  tableBody.innerHTML = `<tr><td class="loading" colspan="13">Loading...</td></tr>`;

  try {
    const snapshot = await get(child(ref(db), "alumni"));
    if (snapshot.exists()) {
      alumniData = snapshot.val();
      populateFilters(alumniData);
      renderTable(alumniData);
    } else {
      tableBody.innerHTML = `<tr><td colspan="13" class="loading">No alumni found.</td></tr>`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    tableBody.innerHTML = `<tr><td colspan="13" class="loading">Error loading data.</td></tr>`;
  }
}

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

  genders.forEach(g => genderFilter.insertAdjacentHTML('beforeend', `<option value="${g}">${g}</option>`));
  profiles.forEach(p => profileFilter.insertAdjacentHTML('beforeend', `<option value="${p}">${p}</option>`));
  entryYears.forEach(y => entryYearFilter.insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`));
}

function renderTable(data) {
  const tableBody = document.querySelector("#alumniTable tbody");
  tableBody.innerHTML = "";
  const keys = Object.keys(data);

  if(keys.length === 0){
    tableBody.innerHTML = `<tr><td colspan="13" class="loading">No records found.</td></tr>`;
    return;
  }

  keys.forEach((key, index) => {
    const a = data[key];
    const row = `
      <tr>
        <td>${index + 1}</td>
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
        <td>${a.submittedAt ? new Date(a.submittedAt).toLocaleString() : ''}</td>
      </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

function filterData() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();
  const genderValue = document.getElementById("genderFilter").value;
  const profileValue = document.getElementById("profileFilter").value;
  const entryYearValue = document.getElementById("entryYearFilter").value;

  const filteredData = Object.fromEntries(
    Object.entries(alumniData).filter(([key, a]) => {
      const matchesSearch = Object.values(a).some(val =>
        val && val.toString().toLowerCase().includes(searchQuery)
      );
      const matchesGender = genderValue ? a.gender === genderValue : true;
      const matchesProfile = profileValue ? a.profile === profileValue : true;
      const matchesEntryYear = entryYearValue ? a.entryyear === entryYearValue : true;

      return matchesSearch && matchesGender && matchesProfile && matchesEntryYear;
    })
  );

  renderTable(filteredData);
}

// Event listeners
document.getElementById("searchInput").addEventListener("input", filterData);
document.getElementById("genderFilter").addEventListener("change", filterData);
document.getElementById("profileFilter").addEventListener("change", filterData);
document.getElementById("entryYearFilter").addEventListener("change", filterData);
document.getElementById("resetFilters").addEventListener("click", () => {
  document.getElementById("searchInput").value = '';
  document.getElementById("genderFilter").value = '';
  document.getElementById("profileFilter").value = '';
  document.getElementById("entryYearFilter").value = '';
  renderTable(alumniData);
});

window.addEventListener("load", fetchAlumni);
