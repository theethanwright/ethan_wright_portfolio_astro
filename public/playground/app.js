// Select all elements with the class "pg-img-cover"
var dots = document.querySelectorAll(".pg-img-cover");

for (var i = 0; i < dots.length; i++) {
    dots[i].dotIndex = i;
    dots[i].addEventListener("click", function() {
        // Clone the clicked element
        var clickedElement = this.cloneNode(true);
        clickedElement.classList.remove("col-span-2");
        clickedElement.classList.add("max-h-full");
        if (clickedElement.tagName.toLowerCase() === 'video') {
            clickedElement.muted = false;
        }

        // Get the card element and set its content to the cloned element
        var card = document.getElementById("card");
        card.innerHTML = '';
        card.appendChild(clickedElement);
        
        // Display the card container
        document.getElementById("cardContainer").style.display = "flex";
    });
}

// Function to close the card
function closeCard() {
    document.getElementById("cardContainer").style.display = "none";
    var card = document.getElementById("card");
    card.innerHTML = '';
}
