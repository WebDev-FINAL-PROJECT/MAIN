document.addEventListener('DOMContentLoaded', async () => {
    const editEventButton = document.getElementById('editEventButton');
    const editEventModal = document.getElementById('editEventModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editEventForm = document.getElementById('editEventForm');

    // Function to fetch event data from the server and populate the form
    async function fetchEventData() {
        try {
            const response = await fetch('/get-user-event', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure cookies (session data) are sent with the request
            });

            if (!response.ok) {
                throw new Error('Failed to fetch event data.');
            }

            const eventData = await response.json();
            populateForm(eventData);
        } catch (error) {
            console.error(error);
            alert('Error fetching event data.');
        }
    }

    // Populate the form with fetched data
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

    // Show the modal and fetch data when "Edit Event" button is clicked
    editEventButton.addEventListener('click', () => {
        editEventModal.classList.remove('hidden');
        fetchEventData();
    });

    // Close the modal when the close button or cancel button is clicked
    closeModal.addEventListener('click', () => {
        editEventModal.classList.add('hidden');
    });
    cancelEdit.addEventListener('click', () => {
        editEventModal.classList.add('hidden');
    });

    // Handle form submission to update event details
    editEventForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(editEventForm);
        const eventData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/update-user-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to update event data.');
            }

            alert('Event details updated successfully!');
            editEventModal.classList.add('hidden');
        } catch (error) {
            console.error(error);
            alert('Error updating event details.');
        }
    });
});
