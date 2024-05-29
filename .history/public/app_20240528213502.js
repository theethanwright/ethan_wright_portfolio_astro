const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
      console.log(entry)
      if (entry.isIntersecting) {
          entry.target.classList.add('show');
      } 
  });
});

const hiddenElements = document.querySelectorAll('.reveal');
hiddenElements.forEach((el) => observer.observe(el));

function openNav() {
  document.getElementById("menu").style.transform = "translateX(0%)";
  document.getElementById("menu").style.zIndex = "2";
  document.getElementById("navbar").style.zIndex = "1";
}

function closeNav() {
  document.getElementById("menu").style.transform = "translateX(100%)";
  document.getElementById("menu").style.zIndex = "1";
  document.getElementById("navbar").style.zIndex = "2";
}