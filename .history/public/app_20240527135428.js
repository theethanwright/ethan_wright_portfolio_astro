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

window.addEventListener("scroll", setScrollVar)
window.addEventListener ("resize", setScrollVar)

function setScrollVar() {
  const footerElement = document.querySelector(".footer"); // Use querySelector to get a single element
  const htmlElement = document.documentElement;
  
  // Calculate the percentage of screen height scrolled
  const percentOfScreenHeightScrolled = (htmlElement.scrollTop / (htmlElement.scrollHeight - htmlElement.clientHeight) * 100);

  // Set the --scroll custom property
  htmlElement.style.setProperty("--viewportHeight", htmlElement.scrollHeight);

  // Set the --scroll custom property
  htmlElement.style.setProperty("--scroll", Math.max(percentOfScreenHeightScrolled, 0));

  // Set the --footerHeight custom property (assuming footerHeight is a variable)
  const footerHeight = footerElement.getBoundingClientRect().height;
  htmlElement.style.setProperty("--footerHeight", Math.max((htmlElement.scrollHeight - footerHeight) / htmlElement.scrollHeight) * 100);

  //console.log(footerElement.getBoundingClientRect().height)
  console.log(htmlElement.clientHeight + "px")
}


setScrollVar()

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