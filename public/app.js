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

// Ease-Out Cubic function for smooth easing
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function scrollToBottom(duration) {
  const start = window.scrollY;
  const end = document.documentElement.scrollHeight;
  const distance = end - start;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeOutCubic(timeElapsed / duration) * distance + start;

    window.scrollTo(0, run);

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

function callback(entries) {
  entries.forEach(entry => {
    const currentVisibility = entry.intersectionRatio * 100;
    document.documentElement.style.setProperty("--visiblePct", Math.max(entry.intersectionRatio, 0));

    // Check if the visibility is increasing and has reached at least 25%
    if (currentVisibility >= 25 && currentVisibility > lastVisibility && !hasScrolledToBottom) {
      // Scroll to the bottom of the page with a custom duration
      scrollToBottom(1500); // Duration in milliseconds, adjust as needed

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
observerFooter.observe(footer);
