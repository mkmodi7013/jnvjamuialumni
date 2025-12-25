import { auth, db, secondaryAuth } from "./firebase.js";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  ref, get, set, remove
} from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const tbody = document.querySelector("#pendingTable tbody");

/* 🔐 Auth check */
onAuthStateChanged(auth, async (user)=>{
  if(!user){
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const email = user.email.toLowerCase();

  // 🔍 Find verifier in alumni
  const alumniSnap = await get(ref(db,"alumni"));
  if(!alumniSnap.exists()){
    tbody.innerHTML = `<tr><td colspan="7">No alumni found</td></tr>`;
    return;
  }

  const alumniData = alumniSnap.val();
  let verifier = null;

  for(const id in alumniData){
    if(alumniData[id].email?.toLowerCase() === email){
      verifier = alumniData[id];
      break;
    }
  }

  if(!verifier){
    alert("Access denied");
    return;
  }

  loadPending(verifier, alumniData);
});

/* 🔹 Load pending alumni */
async function loadPending(verifier, alumniData){
  const snap = await get(ref(db,"pending_alumni"));
  if(!snap.exists()){
    tbody.innerHTML = `<tr><td colspan="7">No pending alumni</td></tr>`;
    return;
  }

  tbody.innerHTML = "";
  let i = 1;

  for(const key in snap.val()){
    const u = snap.val()[key];

    const isAdmin = verifier.verifier === "Admin";
    const isMatch =
      u.entryclass === verifier.entryclass &&
      u.entryyear === verifier.entryyear;

    if(isAdmin || isMatch){
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i++}</td>
        <td>${u.name}</td>
        <td>${u.entryyear}</td>
        <td>${u.entryclass}</td>
        <td>${u.email}</td>
        <td>${u.mobile}</td>
        <td>
          <button class="verify">Verify</button>
          <button class="reject">Reject</button>
        </td>
      `;

      // ✅ VERIFY
      tr.querySelector(".verify").onclick = async ()=>{
        if(!confirm("Verify this alumni?")) return;

        let max = 0;
        Object.keys(alumniData).forEach(id=>{
          const n = parseInt(id.replace("jnvjamui",""));
          if(n > max) max = n;
        });

        const newId = "jnvjamui" + (max + 1);

        await set(ref(db,"alumni/"+newId),{
          ...u,
          alumniId:newId,
          verified:true,
          verifiedAt:new Date().toISOString()
        });

        // 🔐 Create Auth user (password 123456)
        try{
          await createUserWithEmailAndPassword(
            secondaryAuth,
            u.email,
            "123456"
          );
        }catch(e){
          console.warn("Auth:", e.message);
        }

        await remove(ref(db,"pending_alumni/"+key));
        alert("Verified successfully");
        location.reload();
      };

      // ❌ REJECT
      tr.querySelector(".reject").onclick = async ()=>{
        if(!confirm("Reject this entry?")) return;
        await remove(ref(db,"pending_alumni/"+key));
        location.reload();
      };

      tbody.appendChild(tr);
    }
  }

  if(i === 1){
    tbody.innerHTML =
      `<tr><td colspan="7">No matching pending alumni</td></tr>`;
  }
}
