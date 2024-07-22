
    document.addEventListener('DOMContentLoaded', (event) => {
        function selectRandomItem() {
            const items = document.querySelectorAll('#resource-list .resource-card');
            if (items.length === 0) {
                console.error('No items available in the resource-list');
                return;
            }

            const randomIndex = Math.floor(Math.random() * items.length);
            const selectedItem = items[randomIndex];

            if (selectedItem) {
                const container = document.getElementById('resource-of-day');
                container.innerHTML = ''; // Clear the container
                container.appendChild(selectedItem.cloneNode(true)); // Add the selected item

                // Store the selected item index and the selection date in localStorage
                localStorage.setItem('selectedItemIndex', randomIndex);
                localStorage.setItem('selectionDate', new Date().toISOString());
            } else {
                console.error('Failed to select a random item');
            }
        }

        function loadSelectedItem() {
            const items = document.querySelectorAll('#resource-list .resource-card');
            const selectedItemIndex = localStorage.getItem('selectedItemIndex');
            const selectionDate = localStorage.getItem('selectionDate');

            if (selectedItemIndex !== null && selectionDate !== null) {
                const selectedDate = new Date(selectionDate);
                const now = new Date();

                // Check if the stored selection date is from today
                if (selectedDate.getDate() === now.getDate() &&
                    selectedDate.getMonth() === now.getMonth() &&
                    selectedDate.getFullYear() === now.getFullYear()) {
                    
                    const selectedItem = items[selectedItemIndex];
                    if (selectedItem) {
                        const container = document.getElementById('resource-of-day');
                        container.innerHTML = ''; // Clear the container
                        container.appendChild(selectedItem.cloneNode(true)); // Add the selected item
                        return true; // Item loaded successfully
                    }
                }
            }
            return false; // No valid item loaded
        }

        // Run the function once a day
        function runDaily() {
            if (!loadSelectedItem()) {
                selectRandomItem();
            }

            // Calculate the milliseconds until the next midnight
            const now = new Date();
            const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
            const timeUntilNextMidnight = nextMidnight.getTime() - now.getTime();

            // Set a timeout to run the function at the next midnight
            setTimeout(function() {
                selectRandomItem();
                // Repeat the process every 24 hours
                setInterval(selectRandomItem, 24 * 60 * 60 * 1000);
            }, timeUntilNextMidnight);
        }

        // Start the process
        runDaily();
    });