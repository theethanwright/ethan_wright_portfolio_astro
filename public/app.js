const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
      if (entry.isIntersecting) {
          entry.target.classList.add('show');
      } 
  });
});

const hiddenElements = document.querySelectorAll('.reveal');
hiddenElements.forEach((el) => observer.observe(el));

// function openNav() {
//   document.getElementById("menu").style.transform = "translateX(0%)";
//   document.getElementById("menu").style.zIndex = "2";
//   document.getElementById("navbar").style.zIndex = "1";
// }

// function closeNav() {
//   document.getElementById("menu").style.transform = "translateX(100%)";
//   document.getElementById("menu").style.zIndex = "1";
//   document.getElementById("navbar").style.zIndex = "2";
// }

function toggleMenu() {
  const sidebar = document.getElementById('menu');
  sidebar.classList.toggle('open');
}

// document.addEventListener("DOMContentLoaded", () => {
//   let isScrolling;
//   let lastScrollPosition = 0;
//   let currentScrollPosition = 0;
//   let scrollSpeed = 0;
//   const easeFactor = 0.05; // Adjust this value for more or less easing

//   function smoothScroll() {
//       // Calculate the difference between the current and last scroll positions
//       const scrollDifference = currentScrollPosition - lastScrollPosition;

//       // Apply easing to the scroll position
//       scrollSpeed += scrollDifference * easeFactor;

//       // Update the last scroll position
//       lastScrollPosition += scrollSpeed;

//       // Apply the scroll position to the window
//       window.scrollTo(0, lastScrollPosition);

//       // Decelerate the scroll speed
//       scrollSpeed *= 0.9;

//       // Continue the animation if there's still movement
//       if (Math.abs(scrollSpeed) > 0.1) {
//           requestAnimationFrame(smoothScroll);
//       }
//   }

//   window.addEventListener("scroll", () => {
//       currentScrollPosition = window.scrollY;

//       // Clear timeout if user is still scrolling
//       window.clearTimeout(isScrolling);

//       // Start the smooth scroll effect
//       requestAnimationFrame(smoothScroll);

//       // Set a timeout to stop updating scroll when the user stops scrolling
//       isScrolling = setTimeout(() => {
//           scrollSpeed = 0; // Reset speed when scrolling stops
//       }, 100);
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   let scrollPosition = 0;
//   let targetScrollPosition = 0;
//   const lagFactor = 0.5; // The lower the value, the more lag

//   // Function to update scroll position with a lag effect
//   function smoothScroll() {
//       // Calculate the difference between the current scroll and the target scroll
//       const diff = targetScrollPosition - scrollPosition;
      
//       // Update the scroll position by adding a portion of the difference (lag effect)
//       scrollPosition += diff * lagFactor;

//       // Apply the scroll position to the window
//       window.scrollTo(0, scrollPosition);

//       // Continue the animation if there's still a difference
//       if (Math.abs(diff) > 0.5) {
//           requestAnimationFrame(smoothScroll);
//       }
//   }

//   // Event listener to capture the actual scroll position set by the user
//   window.addEventListener("scroll", () => {
//       targetScrollPosition = window.scrollY;
//       requestAnimationFrame(smoothScroll);
//   });
// });