//eventActions
document.getElementById('wedding').addEventListener('click', function() {
    sendEventChoice('Wedding');
});

document.getElementById('birthday').addEventListener('click', function() {
    sendEventChoice('Birthday');
});

document.getElementById('other').addEventListener('click', function() {
    sendEventChoice('Others');
});

// eventActions.js
// eventActions.js
function sendEventChoice(eventType) {
    const clientName = sessionStorage.getItem('clientName'); // Get client name from session storage

    if (!clientName) {
        console.error('Client name not found in session storage!');
        alert('Login required. Please log in first.');
        return;
    }

    fetch('/submit-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            chosen_event: eventType,
            client_name: clientName // Send client name along with the event type
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        if (data.message) {
            alert(data.message); // Alert the user with the result
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to submit event choice');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('start'); // Get the form element

    // Add an event listener for the form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Collect the necessary form data (example: event details)
        const extraDetails = document.getElementById('extra-details').value;
        const chosen_event = sessionStorage.getItem('chosen_event'); // Assuming the chosen_event is stored
        const clientName = sessionStorage.getItem('clientName'); // Get the client name from sessionStorage

        // Make the POST request to submit the data to the server
        fetch('/submit-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                extra_details: extraDetails, // Send the additional details
                chosen_event: chosen_event,
                client_name: clientName
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Event details submitted successfully');
                window.location.href = '/dashboard.html'; // Redirect to dashboard.html
            } else {
                alert('Submission failed: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error submitting event:', error);
            alert('Failed to submit event details');
        });
    });
});




