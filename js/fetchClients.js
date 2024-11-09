// fetchClients.js
document.addEventListener("DOMContentLoaded", function () {
    // Check which view we should show initially
    const selectedUserId = sessionStorage.getItem('selectedUserId');
    
    if (selectedUserId) {
        // If there's a selected user, show the dashboard view
        document.querySelector('.homepage-admin-dashboard').classList.add('hide');
        document.querySelector('.dashboard-main').classList.add('show');
        fetchClientSpecificData(selectedUserId);
    } else {
        // Otherwise, fetch and show the clients list
        fetch('/get-client-data')
            .then(response => response.json())
            .then(data => {
                console.log('Client Data:', data); // Debugging log
                populateClientsData(data);
            })
            .catch(error => console.error('Error fetching client data:', error));

    }
});

function populateClientsData(clients) {
    const container = document.querySelector('#clients .item-list');  // Make sure we're targeting the correct item-list
    if (!container) return; // Guard clause in case container isn't found
    
    container.innerHTML = ''; // Clear existing content

    clients.forEach(client => {
        const clientElement = document.createElement('div');
        clientElement.className = 'item';
        clientElement.innerHTML = `
            <div class="item-details">
                <h2 class="item-title">${client.celebrant_name || 'No Name'}</h2>
                <p class="item-description">${client.chosen_event || 'No Event'}</p>
            </div>
        `;

        // Click event to show dashboard-main and hide homepage-admin-dashboard
        clientElement.addEventListener('click', () => {
            // Store the user_id
            sessionStorage.setItem('selectedUserId', client.user_id);
            
            // Hide the homepage admin dashboard
            document.querySelector('.homepage-admin-dashboard').classList.add('hide');
            
            // Show the main dashboard
            document.querySelector('.dashboard-main').classList.add('show');
            
            // Fetch and load the client's specific data
            fetchClientSpecificData(client.user_id);
        });

        container.appendChild(clientElement);
    });
}

async function fetchClientSpecificData(userId) {
    try {
        const response = await fetch(`/get-user-event?user_id=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch client event data');
        }
        const eventData = await response.json();
        renderClientDetails(eventData);
    } catch (error) {
        console.error('Error fetching event data:', error);
        // Instead of alerting, we could show an error message in the UI
        document.querySelector('.dashboard-main').innerHTML = `
            <div class="error-message">
                <p>Failed to load client details. Please try again.</p>
                <button onclick="location.reload()">Refresh Page</button>
            </div>
        `;
    }
}

// Add the renderClientDetails function if it's not defined elsewhere
function renderClientDetails(data) {
    // Update each section with the client's data
    try {
        document.querySelector('#venue .item-title').textContent = data.venue || 'No Venue Selected';
        document.querySelector('#venue .item-description').textContent = data.venue_details || 'Venue details not provided';
        
        document.querySelector('#flowers .item-title').textContent = data.flowers || 'No Flowers Selected';
        document.querySelector('#flowers .item-description').textContent = data.flowers_details || 'Flowers details not provided';
        
        // Add similar updates for other sections...
        
    } catch (error) {
        console.error('Error rendering client details:', error);
    }
}
