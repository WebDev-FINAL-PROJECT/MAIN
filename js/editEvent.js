document.addEventListener('DOMContentLoaded', () => {
    const editEventButton = document.getElementById('editEventButton');

    editEventButton.addEventListener('click', async () => {
        try {
            // Fetch the event details from the server
            const response = await fetch('/get-event-details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                alert('Failed to fetch event details: ' + errorText);
                return;
            }

            // Parse the event data
            const { eventData } = await response.json();
            if (!eventData) {
                alert("No event details found.");
                return;
            }

            // Populate the form with the fetched data
            document.getElementById('chosen-event').value = eventData.chosen_event || '';
            document.getElementById('wedding-name').value = eventData.celebrant_name?.split(' and ')[0] || '';
            document.getElementById('partner-name').value = eventData.celebrant_name?.split(' and ')[1] || '';
            document.getElementById('birthday-name').value = eventData.celebrant_name || '';
            document.getElementById('other-event-name').value = eventData.celebrant_name || '';
            document.getElementById('other-theme').value = eventData.theme || '';
            document.querySelector(`.budget-btn[data-budget="${eventData.budget}"]`)?.classList.add('selected');
            document.getElementById('event-date').value = eventData.event_date || '';
            document.getElementById('guestSlider').value = eventData.invites || '';
            document.getElementById('venue-name').value = eventData.venue || '';
            document.getElementById('extra-details').value = eventData.other_details || '';

            // Log the fetched data for debugging
            console.log("Fetched Event Data:", eventData);
            alert("Event details loaded. You can now edit them.");
        } catch (error) {
            console.error('Failed to fetch event details:', error);
            alert('Network error, please try again later.');
        }
    });
});
