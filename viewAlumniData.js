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
    const row = document.createElement("tr");
    row.dataset.key = key;

    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${key}</td>
        <td contenteditable="true" class="edit-cell" data-field="name">${a.name || ""}</td>
        <td contenteditable="true" class="edit-cell" data-field="gender">${a.gender || ""}</td>
        <td contenteditable="true" class="edit-cell" data-field="profile">${a.profile || ""}</td>
        <td contenteditable="true" class="edit-cell" data-field="entryclass">${a.entryclass || ""}</td>
        <td contenteditable="true" class="edit-cell" data-field="exitclass">${a.exitclass || ""}</td>
        <td contenteditable="true" class="edit-cell" data-field="entryyear">${a.entryyear || ""}</td>
        <td contenteditable="true" class="edit-cell" data-field="exityear">${a.exityear || ""}</td>
       <!-- ईमेल: एडिटेबल टेक्स्ट + छोटा क्लिकेबल लिंक -->
        <td>
            <div contenteditable="true" class="edit-cell" data-field="email" style="display:inline-block; min-width:50px;">${a.email || ""}</div>
            ${a.email ? `<a href="mailto:${a.email}" title="Send Mail" style="margin-left:5px; text-decoration:none;">📧</a>` : ""}
        </td>

        <!-- मोबाइल: एडिटेबल टेक्स्ट + छोटा क्लिकेबल लिंक -->
        <td>
            <div contenteditable="true" class="edit-cell" data-field="mobile" style="display:inline-block; min-width:50px;">${a.mobile || ""}</div>
            ${a.mobile ? `<a href="tel:${a.mobile}" title="Call Now" style="margin-left:5px; text-decoration:none;">📞</a>` : ""}
        </td>
        <td contenteditable="true" class="edit-cell" data-field="organisation">${a.organisation || ""}</td>
        <td contenteditable="true" class="edit-cell" data-field="designation">${a.designation || ""}</td>
        <td contenteditable="true" class="edit-cell" data-field="location">${a.location || ""}</td>
        <td>${a.submittedAt ? new Date(a.submittedAt).toLocaleString() : ""}</td>
        <td>
          <button type="button" class="saveBtn" style="display:none; background:green; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Save</button>
          <button type="button" class="deleteBtn" style="background:red; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-top:2px;">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
  });

  addRowEventListeners(); // इवेंट्स जोड़ें
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
  // 1. जब भी किसी सेल में टाइप करें, उस रो का 'Save' बटन दिखाएँ
  document.querySelectorAll(".edit-cell").forEach(cell => {
    cell.oninput = (e) => {
      const row = e.target.closest("tr");
      const saveBtn = row.querySelector(".saveBtn");
      if (saveBtn) saveBtn.style.display = "block";
      e.target.style.backgroundColor = "#fff9c4"; // एडिट हो रहे सेल का रंग बदलें
    };
  });

  // 2. सेव बटन का लॉजिक
  document.querySelectorAll(".saveBtn").forEach(btn => {
    btn.onclick = async () => {
      const row = btn.closest("tr");
      const key = row.dataset.key;
      const editableCells = row.querySelectorAll(".edit-cell");
      
      const updates = {};
      editableCells.forEach(cell => {
        const fieldName = cell.dataset.field;
        updates[fieldName] = cell.innerText.trim();
      });

      try {
        await update(ref(db, `alumni/${key}`), updates);
        
        // लोकल डेटा अपडेट करें ताकि फिल्टर में पुराना डेटा न आए
        alumniData[key] = { ...alumniData[key], ...updates };
        
        btn.style.display = "none"; // सेव होने के बाद बटन छुपाएं
        editableCells.forEach(c => c.style.backgroundColor = "transparent");
        alert("सफलतापूर्वक सेव हो गया!");
      } catch (err) {
        alert("सेव फेल हुआ: " + err.message);
      }
    };
  });

  // 3. डिलीट बटन का लॉजिक
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.onclick = async () => {
      const key = btn.closest("tr").dataset.key;
      if (confirm(`क्या आप ${alumniData[key].name || 'इसे'} डिलीट करना चाहते हैं?`)) {
        try {
          await remove(ref(db, `alumni/${key}`));
          delete alumniData[key];
          renderTable(alumniData); // टेबल रिफ्रेश करें
        } catch (err) {
          alert("Delete Error: " + err.message);
        }
      }
    };
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
