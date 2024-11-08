document.addEventListener("DOMContentLoaded", function() {
    fetchClientsData();
});

function fetchClientsData() {
    fetch('/get-client-data') // Adjust this URL to your actual API endpoint
        .then(response => response.json())
        .then(data => populateClientsData(data))
        .catch(error => console.error('Error fetching client data:', error));
}

function populateClientsData(clients) {
    const container = document.querySelector('.item-list');
    container.innerHTML = ''; // Clear existing entries
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
