import { db } from "./firebase.js";
import { ref, set, get, child } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const form = document.getElementById("registrationForm");
const dbRef = ref(db);

// 🔴 ADMIN DETAILS
const ADMIN_MOBILE = "9304939412"; // ← admin WhatsApp number
const ADMIN_EMAIL  = "mkmodi7013@gmail.com";

// ⏱️ Anti-bot timing
const pageLoadTime = Date.now();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ⏱️ Time check (bot control)
  if ((Date.now() - pageLoadTime) / 1000 < 5) {
    alert("❌ Suspicious submission blocked");
    return;
  }

  // 🔹 Get values
  const name        = val("name");
  const gender      = val("gender");
  const profile     = val("profile");
  const entryclass  = val("entryclass");
  const exitclass   = val("exitclass");
  const entryyear   = val("entryyear");
  const exityear    = val("exityear");
  const email       = val("email").toLowerCase();
  const mobile      = val("mobile");
  const organisation= val("organisation");
  const designation = val("designation");
  const location    = val("location");

  // 🔐 Basic validation
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    alert("❌ Invalid mobile number");
    return;
  }

  // 🔎 Fetch existing alumni
  const snap = await get(child(dbRef, "alumni"));
  let nextIndex = 1;
  let verifierMobile = null;
  let verifierName = null;

  if (snap.exists()) {
    const data = snap.val();
    nextIndex = Object.keys(data).length + 1;

    Object.values(data).forEach(u => {

      // ❌ Duplicate check
      if (u.email === email || u.mobile === mobile) {
        alert("❌ You are already registered");
        throw "DUPLICATE";
      }

      // ✅ Same year + class VERIFIED user
      if (
        u.entryyear === entryyear &&
        u.entryclass === entryclass &&
        u.status === "verified"
      ) {
        verifierMobile = u.mobile;
        verifierName = u.name;
      }
    });
  }

  // 🆕 New user key
  const newKey = "jnvjamui" + nextIndex;

  // 💾 Save as PENDING
   const pendingKey = "p_" + Date.now();

await set(ref(db, "pending_alumni/" + pendingKey), {
  name, gender, profile,
  entryclass, exitclass,
  entryyear, exityear,
  email, mobile,
  organisation, designation, location,
  assignedVerifier: verifierMobile ? verifierMobile : "admin",
  submittedAt: new Date().toISOString()
});


  // 📲 WhatsApp message
  const message = `
JNV Jamui Alumni Verification Request

Name: ${name}
Entry Year: ${entryyear}
Entry Class: ${entryclass}

Click to verify:
https://YOURDOMAIN.com/verify.html?user=${newKey}
`;

  // 📞 Decide verifier
  const whatsappNumber = verifierMobile
    ? "91" + verifierMobile
    : ADMIN_MOBILE;

 alert("✅ Registration submitted successfully. Verification pending.");
form.reset();
document.getElementById("contact-modal").style.display = "none";


  alert(
    verifierMobile
      ? "✅ Submitted! Verification request sent to your batchmate."
      : "✅ Submitted! Verification request sent to Admin."
  );

  form.reset();
  document.getElementById("contact-modal").style.display = "none";
});

// 🔧 Helper
function val(id) {
  return document.getElementById(id).value.trim();
}
