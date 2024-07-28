document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    function waitForItems(callback) {
        let maxWaitTime = 10000; // Maximum wait time in milliseconds (10 seconds)
        let waited = 0;
        const interval = 100; // Interval for checking

        const checkInterval = setInterval(() => {
            const items = document.querySelectorAll('#all-resources .resource-card');
            console.log('Checking for items... Count:', items.length);

            if (items.length > 0) {
                clearInterval(checkInterval);
                console.log('Items are loaded:', items.length);
                callback();
            } else if (waited >= maxWaitTime) {
                clearInterval(checkInterval);
                console.error('Max wait time reached. Items did not load.');
            } else {
                waited += interval;
                console.log('Waiting for items to load...');
            }
        }, interval); // Check every 100ms
    }

    function selectRandomItem() {
        const items = document.querySelectorAll('#all-resources .resource-card');
        console.log('Total items found:', items.length);

        if (items.length === 0) {
            console.error('No items available in the resource-list');
            return;
        }

        const randomIndex = Math.floor(Math.random() * items.length);
        console.log('Random index selected:', randomIndex);

        const selectedItem = items[randomIndex];
        console.log('Selected item:', selectedItem);

        if (selectedItem) {
            const container = document.getElementById('resource-of-day');
            console.log('Resource of the day container:', container);
            
            container.innerHTML = ''; // Clear the container
            container.appendChild(selectedItem.cloneNode(true)); // Add the selected item

            // Store the selected item index and the selection date in localStorage
            localStorage.setItem('selectedItemIndex', randomIndex);
            localStorage.setItem('selectionDate', new Date().toISOString());
            console.log('Stored selectedItemIndex and selectionDate in localStorage');
        } else {
            console.error('Failed to select a random item');
        }
    }

    function loadSelectedItem() {
        const items = document.querySelectorAll('#all-resources .resource-card');
        console.log('Total items found for loading:', items.length);

        const selectedItemIndex = localStorage.getItem('selectedItemIndex');
        const selectionDate = localStorage.getItem('selectionDate');
        console.log('Loaded selectedItemIndex:', selectedItemIndex);
        console.log('Loaded selectionDate:', selectionDate);

        if (selectedItemIndex !== null && selectionDate !== null) {
            const selectedDate = new Date(selectionDate);
            const now = new Date();
            console.log('Selected date:', selectedDate);
            console.log('Current date:', now);

            // Check if the stored selection date is from today
            if (selectedDate.getDate() === now.getDate() &&
                selectedDate.getMonth() === now.getMonth() &&
                selectedDate.getFullYear() === now.getFullYear()) {
                
                if (selectedItemIndex < items.length) {
                    const selectedItem = items[selectedItemIndex];
                    console.log('Loaded selected item:', selectedItem);

                    if (selectedItem) {
                        const container = document.getElementById('resource-of-day');
                        console.log('Resource of the day container:', container);
                        
                        container.innerHTML = ''; // Clear the container
                        container.appendChild(selectedItem.cloneNode(true)); // Add the selected item
                        return true; // Item loaded successfully
                    } else {
                        console.error('Selected item not found in the current list');
                    }
                } else {
                    console.warn('Selected item index is out of bounds for the current list');
                    // Fallback: clear localStorage and select a new item
                    localStorage.removeItem('selectedItemIndex');
                    localStorage.removeItem('selectionDate');
                    selectRandomItem();
                }
            }
        }
        return false; // No valid item loaded
    }

    // Run the function once a day
    function runDaily() {
        waitForItems(() => {
            console.log('Running daily function');
            if (!loadSelectedItem()) {
                console.log('No valid item loaded, selecting new item');
                selectRandomItem();
            }

            // Calculate the milliseconds until the next midnight
            const now = new Date();
            const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
            const timeUntilNextMidnight = nextMidnight.getTime() - now.getTime();
            console.log('Milliseconds until next midnight:', timeUntilNextMidnight);

            // Set a timeout to run the function at the next midnight
            setTimeout(function() {
                console.log('Next midnight reached, selecting new item');
                selectRandomItem();
                // Repeat the process every 24 hours
                setInterval(selectRandomItem, 24 * 60 * 60 * 1000);
            }, timeUntilNextMidnight);
        });
    }

    // Start the process
    runDaily();
});
