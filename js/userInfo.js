//js/userInfo.js
document.addEventListener('DOMContentLoaded', async () => {
    const userInfoDiv = document.getElementById('user-info');

    try {
        // Fetch user information from the server
        const response = await fetch('/get-user-info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure cookies (session data) are sent with the request
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching user info:', errorText);
            userInfoDiv.textContent = 'Failed to load user information.';
            return;
        }

        const { fName, lName } = await response.json();
        // Display the user's first and last name
        userInfoDiv.textContent = `Welcome, ${fName} ${lName}!`;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        userInfoDiv.textContent = 'Error loading user information.';
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    const editEventButton = document.getElementById('editEventButton');
    const editEventModal = document.getElementById('editEventModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');

    // Fetch event data for the logged-in user
    async function fetchEventData() {
        try {
            console.log("Fetching event data..."); // Debug log
            const response = await fetch('/get-user-event', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensures session cookie is sent
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to fetch event data:', errorText);
                alert(`Error fetching event data: ${errorText}`);
                return;
            }

            const eventData = await response.json();
            console.log('Fetched Event Data:', eventData); // Debug log

            if (!eventData || Object.keys(eventData).length === 0) {
                alert('No event data found for the logged-in user.');
                return;
            }

            // Populate the form with the fetched data
            populateForm(eventData);
        } catch (error) {
            console.error('Error fetching event data:', error);
            alert('Error fetching event data. Please try again later.');
        }
    }

    // Function to populate the form fields
    function populateForm(data) {
        document.getElementById('chosenEvent').value = data.chosen_event || '';
        document.getElementById('celebrantName').value = data.celebrant_name || '';
        document.getElementById('theme').value = data.theme || '';
        document.getElementById('budget').value = data.budget || '';
        document.getElementById('eventDate').value = data.event_date || '';
        document.getElementById('invites').value = data.invites || '';
        document.getElementById('venue').value = data.venue || '';
        document.getElementById('agreements').value = data.agreements || '';
        document.getElementById('otherDetails').value = data.other_details || '';
    }

    // Event Listener for the Edit Event Button
    editEventButton.addEventListener('click', () => {
        console.log('Edit Event button clicked'); // Debug log
        editEventModal.classList.remove('hidden'); // Show the modal
        fetchEventData(); // Fetch and populate the data
    });

    // Close the modal when the close button is clicked
    closeModal.addEventListener('click', () => {
        editEventModal.classList.add('hidden');
    });

    // Close the modal when the cancel button is clicked
    cancelEdit.addEventListener('click', () => {
        editEventModal.classList.add('hidden');
    });
});
