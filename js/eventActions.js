document.addEventListener('DOMContentLoaded', function() {
    const addVenueForm = document.getElementById('addVenueForm');
    
    if (addVenueForm) {
        addVenueForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log('Form submission triggered'); // Debug log

            try {
                // Get form values
                const formData = {
                    venueName: document.getElementById('venueName').value.trim(),
                    venueLocation: document.getElementById('venueLocation').value.trim(),
                    venueType: document.getElementById('venueType').value.trim(),
                    venuePrice: document.getElementById('venuePrice').value.trim(),
                    venueImage: document.getElementById('venueImage').value.trim() || null
                };

                console.log('Sending data:', formData); // Debug log

                // Log the full URL being used
                console.log('Sending request to:', window.location.origin + '/add-venue');

                const response = await fetch('/add-venue', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                console.log('Response status:', response.status); // Debug log
                console.log('Response headers:', [...response.headers.entries()]); // Debug log

                // Check if response is ok before trying to parse JSON
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Response error:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Response data:', data); // Debug log

                if (data.success) {
                    alert('Venue added successfully!');
                    addVenueForm.reset();
                    document.getElementById('addVenueModal').classList.add('hidden');
                    // Optionally refresh the venue list here
                    window.location.reload();
                } else {
                    throw new Error(data.message || 'Failed to add venue');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to add venue: ' + error.message);
            }
        });
    } else {
        console.error('Venue form not found');
    }
});

