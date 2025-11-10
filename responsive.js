// Toggle menu when hamburger is clicked
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});



// Get modal element
const modal = document.getElementById('contact-modal');

// Get all buttons that open the modal
const openButtons = document.querySelectorAll('.open-modal');

// Get the <span> element that closes the modal
const closeBtn = document.querySelector('.close');

// Open modal when any button is clicked
openButtons.forEach(button => {
  button.addEventListener('click', () => {
    modal.style.display = 'block';
  });
});

// Close modal when user clicks on X
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal if user clicks outside modal content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
