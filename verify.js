import { db } from "./firebase.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const userKey = params.get("user");

const dataDiv = document.getElementById("data");

const snap = await get(ref(db, "alumni/" + userKey));
if (!snap.exists()) {
  dataDiv.innerHTML = "Invalid request";
  throw "invalid";
}

const user = snap.val();
dataDiv.innerHTML = `
<b>Name:</b> ${user.name}<br>
<b>Entry Year:</b> ${user.entryyear}<br>
<b>Entry Class:</b> ${user.entryclass}<br>
<b>Status:</b> ${user.status}
`;

window.approve = async () => {
  await set(ref(db, "alumni/" + userKey + "/status"), "verified");
  await set(ref(db, "alumni/" + userKey + "/verifiedBy"), "community/admin");
  alert("User verified");
};

window.reject = async () => {
  await set(ref(db, "alumni/" + userKey + "/status"), "rejected");
  alert("User rejected");
};
