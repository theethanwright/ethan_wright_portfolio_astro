    document.addEventListener("DOMContentLoaded", () => {
        const resourceList = document.getElementById('resource-list');
        const resourceCards = Array.from(resourceList.children);
        
        // Shuffle the resource cards array
        for (let i = resourceCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [resourceCards[i], resourceCards[j]] = [resourceCards[j], resourceCards[i]];
        }

        // Clear the resource list and append the shuffled resource cards
        resourceList.innerHTML = '';
        resourceCards.forEach(card => resourceList.appendChild(card));
    });
