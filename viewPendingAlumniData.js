import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getDatabase, ref, get, set, remove
} from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyByBYjFFEgtmhoNnyNF55vjiVBhMteIvcQ",
  authDomain: "jnvjamuialumni-edceb.firebaseapp.com",
  databaseURL: "https://jnvjamuialumni-edceb-default-rtdb.firebaseio.com",
  projectId: "jnvjamuialumni-edceb",
  storageBucket: "jnvjamuialumni-edceb.appspot.com",
  messagingSenderId: "412877503961",
  appId: "1:412877503961:web:8cfc88edcc694a43b9edc8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tableBody = document.querySelector("#pendingTable tbody");

// ================= LOAD PENDING =================
async function loadPending(){
  tableBody.innerHTML = `<tr><td colspan="7">Loading...</td></tr>`;

  const snap = await get(ref(db,"pending_alumni"));
  if(!snap.exists()){
    tableBody.innerHTML = `<tr><td colspan="7">No pending users</td></tr>`;
    return;
  }

  const data = snap.val();
  tableBody.innerHTML = "";

  let i=1;
  for(const key in data){
    const a = data[key];

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i++}</td>
      <td>${a.name || ""}</td>
      <td>${a.entryyear || ""}</td>
      <td>${a.entryclass || ""}</td>
      <td>${a.email || ""}</td>
      <td>${a.mobile || ""}</td>
      <td>
        <button class="verify">Verify</button><br>
        <button class="reject">Reject</button>
      </td>
    `;

    tr.querySelector(".verify").onclick = ()=>verifyUser(key);
    tr.querySelector(".reject").onclick = ()=>rejectUser(key);

    tableBody.appendChild(tr);
  }
}

// ================= VERIFY USER =================
async function verifyUser(pendingKey){

  if(!confirm("Verify this alumni?")) return;

  // 1️⃣ Pending data
  const snap = await get(ref(db,"pending_alumni/"+pendingKey));
  if(!snap.exists()){
    alert("Data not found");
    return;
  }
  const data = snap.val();

  // 2️⃣ Find last alumni ID
  const alumniSnap = await get(ref(db,"alumni"));
  const alumniData = alumniSnap.exists()? alumniSnap.val() : {};

  let max = 0;
  Object.keys(alumniData).forEach(id=>{
    const n = parseInt(id.replace("jnvjamui",""));
    if(!isNaN(n) && n>max) max=n;
  });

  const newId = "jnvjamui" + (max+1);

  // 3️⃣ Save to alumni
  await set(ref(db,"alumni/"+newId),{
    ...data,
    alumniId:newId,
    verified:true,
    verifiedAt:new Date().toISOString()
  });

  // 4️⃣ Remove pending
  await remove(ref(db,"pending_alumni/"+pendingKey));

  alert("Verified as "+newId);
  loadPending();
}

// ================= REJECT USER =================
async function rejectUser(key){
  if(!confirm("Reject & delete this entry?")) return;
  await remove(ref(db,"pending_alumni/"+key));
  loadPending();
}

// ================= INIT =================
loadPending();
