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
  const tbody = document.querySelector("#alumniTable tbody");
  tbody.innerHTML = `<tr><td colspan="18">Loading...</td></tr>`;

  try {
    const snap = await get(child(ref(db), "alumni"));
    if (!snap.exists()) {
      tbody.innerHTML = `<tr><td colspan="18">No alumni found</td></tr>`;
      return;
    }
    alumniData = snap.val();
    populateFilters(alumniData);
    renderTable(alumniData);
  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="18">Error loading data</td></tr>`;
  }
}

// ================= SORT =================
function getSortedKeys(data) {
  return Object.keys(data).sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, "")) || 0;
    const nb = parseInt(b.replace(/\D/g, "")) || 0;
    return na - nb;
  });
}

// ================= RENDER TABLE =================
function renderTable(data) {
  const tbody = document.querySelector("#alumniTable tbody");
  tbody.innerHTML = "";

  const keys = getSortedKeys(data);
  if (!keys.length) {
    tbody.innerHTML = `<tr><td colspan="18">No records found</td></tr>`;
    return;
  }

  keys.forEach((key, i) => {
    const a = data[key];
    const verifier = a.verifier || "None-Verifier";

    const tr = document.createElement("tr");
    tr.dataset.key = key;

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${key}</td>
      <td contenteditable class="edit-cell" data-field="name">${a.name || ""}</td>
      <td contenteditable class="edit-cell" data-field="gender">${a.gender || ""}</td>
      <td contenteditable class="edit-cell" data-field="profile">${a.profile || ""}</td>
      <td contenteditable class="edit-cell" data-field="entryclass">${a.entryclass || ""}</td>
      <td contenteditable class="edit-cell" data-field="exitclass">${a.exitclass || ""}</td>
      <td contenteditable class="edit-cell" data-field="entryyear">${a.entryyear || ""}</td>
      <td contenteditable class="edit-cell" data-field="exityear">${a.exityear || ""}</td>
      <td>
        <div contenteditable class="edit-cell" data-field="email">${a.email || ""}</div>
      </td>
      <td>
        <div contenteditable class="edit-cell" data-field="mobile">${a.mobile || ""}</div>
      </td>
      <td contenteditable class="edit-cell" data-field="organisation">${a.organisation || ""}</td>
      <td contenteditable class="edit-cell" data-field="designation">${a.designation || ""}</td>
      <td contenteditable class="edit-cell" data-field="location">${a.location || ""}</td>
      <td>${a.submittedAt ? new Date(a.submittedAt).toLocaleString() : ""}</td>

      <td>
        <button class="saveBtn hidden">Save</button>
        <button class="deleteBtn">Delete</button>
      </td>

      <td>
        <select class="verifier-select">
          <option value="None-Verifier" ${verifier === "None-Verifier" ? "selected" : ""}>None Verifier</option>
          <option value="Verifier" ${verifier === "Verifier" ? "selected" : ""}>Verifier</option>
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });

  attachRowEvents();
}

// ================= EVENTS ON ROW =================
function attachRowEvents() {

  // text edit → show save
  document.querySelectorAll(".edit-cell").forEach(cell => {
    cell.oninput = e => {
      const row = e.target.closest("tr");
      row.querySelector(".saveBtn")?.classList.remove("hidden");
    };
  });

  // verifier change → show save
  document.querySelectorAll(".verifier-select").forEach(sel => {
    sel.onchange = e => {
      const row = e.target.closest("tr");
      row.querySelector(".saveBtn")?.classList.remove("hidden");
    };
  });

  // save
  document.querySelectorAll(".saveBtn").forEach(btn => {
    btn.onclick = async () => {
      const row = btn.closest("tr");
      const key = row.dataset.key;

      const updates = {};
      row.querySelectorAll(".edit-cell").forEach(cell => {
        updates[cell.dataset.field] = cell.innerText.trim();
      });

      updates.verifier = row.querySelector(".verifier-select").value;

      await update(ref(db, `alumni/${key}`), updates);
      alumniData[key] = { ...alumniData[key], ...updates };

      btn.classList.add("hidden");
      alert("Saved successfully");
    };
  });

  // delete
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = async () => {
      const row = btn.closest("tr");
      const key = row.dataset.key;
      if (!confirm("Delete this record?")) return;

      await remove(ref(db, `alumni/${key}`));
      delete alumniData[key];
      renderTable(alumniData);
    };
  });
}

// ================= FILTERS =================
function populateFilters(data) {
  const gender = new Set(), profile = new Set(), year = new Set();
  Object.values(data).forEach(a => {
    if (a.gender) gender.add(a.gender);
    if (a.profile) profile.add(a.profile);
    if (a.entryyear) year.add(a.entryyear);
  });

  genderFilter.innerHTML = `<option value="">All</option>` + [...gender].map(v => `<option>${v}</option>`).join("");
  profileFilter.innerHTML = `<option value="">All</option>` + [...profile].map(v => `<option>${v}</option>`).join("");
  entryYearFilter.innerHTML = `<option value="">All</option>` + [...year].map(v => `<option>${v}</option>`).join("");
}

function filterData() {
  const s = searchInput.value.toLowerCase();
  const g = genderFilter.value;
  const p = profileFilter.value;
  const y = entryYearFilter.value;

  const filtered = Object.fromEntries(
    Object.entries(alumniData).filter(([_, a]) =>
      Object.values(a).some(v => v?.toString().toLowerCase().includes(s)) &&
      (!g || a.gender === g) &&
      (!p || a.profile === p) &&
      (!y || a.entryyear === y)
    )
  );
  renderTable(filtered);
}

// ================= GLOBAL EVENTS =================
searchInput.oninput = filterData;
genderFilter.onchange = filterData;
profileFilter.onchange = filterData;
entryYearFilter.onchange = filterData;
resetFilters.onclick = () => renderTable(alumniData);

// ================= LOAD =================
window.addEventListener("load", fetchAlumni);
