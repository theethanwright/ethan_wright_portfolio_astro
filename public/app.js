document.querySelectorAll('.blur-image-full').forEach(function(img) {
  if (img.complete) img.classList.add('loaded');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
      if (entry.isIntersecting) {
          entry.target.classList.add('show');
      } 
  });
});

const hiddenElements = document.querySelectorAll('.reveal');
hiddenElements.forEach((el) => observer.observe(el));

function toggleMenu() {
  const sidebar = document.getElementById('menu');
  sidebar.classList.toggle('open');
}

// Observer for footer animation

const footer = document.getElementById('footer');
let hasScrolledToBottom = false; // Flag to control the scroll behavior
let lastVisibility = 0; // To track the last visibility percentage

let options = {
  root: null,
  rootMargin: "0px",
  threshold: Array.from({ length: 101 }, (_, i) => i / 100), // Generate thresholds from 0 to 1 at 0.01 intervals
};

let observerFooter = new IntersectionObserver(callback, options);

function callback(entries) {
  entries.forEach(entry => {
    const currentVisibility = entry.intersectionRatio * 100;
    document.documentElement.style.setProperty("--visiblePct", Math.max(entry.intersectionRatio, 0));

    // Check if the visibility is increasing and has reached at least 25%
    if (currentVisibility >= 25 && currentVisibility > lastVisibility && !hasScrolledToBottom) {
      // Scroll to the bottom of the page
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth' // Optional: adds smooth scrolling effect
      });

      // Set the flag to true to prevent continuous scrolling to the bottom
      hasScrolledToBottom = true;
    } else if (currentVisibility < 25) {
      // Reset the flag when the footer is less than 25% visible
      hasScrolledToBottom = false;
    }

    // Update the last visibility percentage
    lastVisibility = currentVisibility;
  });
}

// Start observing the footer element
if (footer) {
  observerFooter.observe(footer);
}



