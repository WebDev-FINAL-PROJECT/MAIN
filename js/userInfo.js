//js/userInfo.js
// userInfo.js
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/get-user-info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for including session cookies
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        const userInfo = document.getElementById('user-info');

        if (data.fName && data.lName) {
            userInfo.textContent = `Welcome ${data.fName} ${data.lName}!!`;
        } else {
            userInfo.textContent = 'User information not available.';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
        document.getElementById('user-info').textContent = 'Failed to load user information.';
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
            const response = await fetch('/get-event-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Add this line
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

    function populateForm(data) {
        document.getElementById('chosenEvent').value = data.chosen_event || '';
        document.getElementById('celebrantName').value = data.celebrant_name || '';
        document.getElementById('theme').value = data.theme || '';
        document.getElementById('budget').value = data.budget || '';
    
        // Format the event date to display as "Month_Year"
        if (data.event_date) {
            try {
                const [year, month] = data.event_date.split('-'); // Assuming "YYYY-MM" format
                const monthName = new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'long' });
                document.getElementById('eventDate').value = `${monthName}_${year}`;
            } catch (error) {
                console.error('Error formatting event date:', error);
                document.getElementById('eventDate').value = ''; // Fallback in case of an error
            }
        } else {
            document.getElementById('eventDate').value = '';
        }
        console.log('Raw event_date:', data.event_date);

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

// Scroll to the top when the modal opens
editEventButton.addEventListener('click', () => {
    editEventModal.scrollTop = 0;
});

document.addEventListener('DOMContentLoaded', () => {
    const editEventModal = document.getElementById('editEventModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');

    // Function to close the modal
    function closeModalFunction() {
        editEventModal.classList.add('hidden');
    }

    closeModal.addEventListener('click', closeModalFunction);

    cancelEdit.addEventListener('click', closeModalFunction);

    window.addEventListener('click', (event) => {
        if (event.target === editEventModal) {
            closeModalFunction();
        }
    });
});
