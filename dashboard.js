const phoneDisplay = document.getElementById("userPhone");
const logoutBtn = document.getElementById("logoutBtn");

const phone = localStorage.getItem("loggedInPhone");
if (!phone) {
  window.location.href = "login.html";
} else {
  phoneDisplay.textContent = phone;
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInPhone");
  window.location.href = "login.html";
});
