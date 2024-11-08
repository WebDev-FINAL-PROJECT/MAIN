//js/fetchClient.js
document.addEventListener("DOMContentLoaded", function() {
    fetch('/get-client-data')  // Adjust this endpoint to match your server configuration
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateClientsData(data);
        })
        .catch(error => console.error('Error fetching client data:', error));
});

function populateClientsData(clients) {
    const container = document.querySelector('.item-list');
    container.innerHTML = ''; // Clear existing content

    clients.forEach(client => {
        const clientElement = document.createElement('div');
        clientElement.className = 'item';
        clientElement.innerHTML = `
            <div class="item-details">
                <h2 class="item-title">${client.celebrant_name}</h2>
                <p class="item-description">${client.chosen_event}</p>
            </div>
        `;
        container.appendChild(clientElement);
    });
}
