//js/eventActions.js//
document.addEventListener("DOMContentLoaded", function() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const otherThemeInput = document.getElementById('other-theme');
    const selectedThemes = new Set();

    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.value;
            if (selectedThemes.has(theme)) {
                selectedThemes.delete(theme);
                this.classList.remove('selected');
            } else {
                selectedThemes.add(theme);
                this.classList.add('selected');
            }
            // Update the other-theme textbox with selected themes, joined by commas
            otherThemeInput.value = Array.from(selectedThemes).join(', ');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for each event type button
    const eventButtons = document.querySelectorAll('.event-choice');
    const sections = document.querySelectorAll('#wedding-section, #birthday-section, #other-section');

    eventButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide all sections first
            sections.forEach(section => section.classList.add('hidden'));

            // Show the targeted section
            const targetSection = document.getElementById(button.getAttribute('data-target'));
            targetSection.classList.remove('hidden');
        });
    });

    // Theme selection and other existing functionality here...
});

document.addEventListener("DOMContentLoaded", function () {
    const monthsSection = document.getElementById('flexibleDateSection');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    if (monthsSection) {
        monthsSection.style.display = 'block';
        renderMonthsGrid(currentYear);
    }

    function renderMonthsGrid(year) {
        const monthsGrid = document.getElementById('monthsGrid');
        monthsGrid.innerHTML = '';

        const yearLabel = document.createElement('span');
        yearLabel.textContent = year;
        yearLabel.className = 'year-label';
        monthsGrid.appendChild(yearLabel);

        for (let i = 0; i < 12; i++) {
            const month = document.createElement('button');
            month.className = 'month-option';
            month.textContent = new Date(year, i).toLocaleString('default', { month: 'long' });

            if (year === currentYear && i < currentMonth) {
                month.disabled = true;
                month.classList.add('disabled');
            } else {
                month.onclick = () => {
                    toggleMonthSelection(year, i, month);
                };
            }

            monthsGrid.appendChild(month);
        }

        const prevYear = document.createElement('button');
        prevYear.textContent = '<';
        prevYear.className = 'year-nav';
        prevYear.onclick = () => {
            if (year > currentYear) {
                renderMonthsGrid(year - 1);
            }
        };
        monthsGrid.insertBefore(prevYear, monthsGrid.firstChild);

        const nextYear = document.createElement('button');
        nextYear.textContent = '>';
        nextYear.className = 'year-nav';
        nextYear.onclick = () => renderMonthsGrid(year + 1);
        monthsGrid.appendChild(nextYear);
    }

    function toggleMonthSelection(year, month, element) {
        document.querySelectorAll('.month-option').forEach(mo => mo.classList.remove('selected'));
        element.classList.add('selected');
        updateFormWithSelectedMonth(year, month);
    }

    function updateFormWithSelectedMonth(year, month) {
        const dateInput = document.getElementById('eventDate'); // Assuming you have an input field with this ID
        dateInput.value = `${year}-${month + 1}`; // Store the month as a full date string
    }
});



document.addEventListener("DOMContentLoaded", function() {
    const budgetButtons = document.querySelectorAll('.budget-btn');
    let lastSelectedButton = null;  // Variable to keep track of the last selected button

    budgetButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (lastSelectedButton) {
                lastSelectedButton.classList.remove('selected');  // Remove the selected class from the previously selected button
            }
            this.classList.add('selected');  // Add the selected class to the clicked button
            lastSelectedButton = this;  // Update the lastSelectedButton to be the currently clicked button
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Directly show the slider container without condition
    const sliderContainer = document.getElementById('sliderContainer');
    if (sliderContainer) {
        sliderContainer.style.display = 'block';  // Force the slider container to be always visible
    }

    // Ensure the guest slider updates the display text as the user changes its value
    const guestSlider = document.getElementById('guestSlider');
    const sliderValue = document.getElementById('sliderValue');
    if (guestSlider && sliderValue) {
        guestSlider.addEventListener('input', function() {
            sliderValue.textContent = guestSlider.value; // Update the text to reflect the slider's value
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const guestButtons = document.querySelectorAll('.guest-btn');

    guestButtons.forEach(button => {
        button.addEventListener('click', function() {
            guestButtons.forEach(btn => btn.classList.remove('selected')); // Remove selected from all buttons
            this.classList.add('selected'); // Add selected to the clicked button
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const yesButton = document.getElementById('venueYesButton');
    const noButton = document.getElementById('venueNoButton');
    const venueInfo = document.getElementById('venueInfo');

    yesButton.addEventListener('click', function() {
        venueInfo.classList.remove('hidden'); // Show the input field
        noButton.classList.remove('selected'); // Ensure noButton is not selected
        this.classList.add('selected'); // Mark the yesButton as selected
    });

    noButton.addEventListener('click', function() {
        venueInfo.classList.add('hidden'); // Hide the input field
        yesButton.classList.remove('selected'); // Ensure yesButton is not selected
        this.classList.add('selected'); // Mark the noButton as selected
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const yesButton = document.getElementById('agreementYes');
    const noButton = document.getElementById('agreementNo');
    const serviceOptions = document.getElementById('serviceOptions');
    const serviceButtons = document.querySelectorAll('.service-btn');

    yesButton.addEventListener('click', function() {
        serviceOptions.classList.remove('hidden');
        this.classList.add('selected');
        noButton.classList.remove('selected');
    });

    noButton.addEventListener('click', function() {
        serviceOptions.classList.add('hidden');
        this.classList.add('selected');
        yesButton.classList.remove('selected');
        serviceButtons.forEach(button => button.classList.remove('selected')); // Deselect all services
    });

    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('selected'); // Toggle service selection
        });
    });
});

//DATABASE//
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('start');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Gather event data
        const chosenEvent = document.querySelector('.event-choice.active')?.textContent || '';
        const celebrantName = document.getElementById('wedding-name').value + ' and ' + document.getElementById('partner-name').value ||
                              document.getElementById('birthday-name').value ||
                              document.getElementById('other-event-name').value || '';
        const theme = document.getElementById('other-theme').value || '';
        const budget = document.querySelector('.budget-btn.selected')?.textContent || '';
        const eventDate = document.getElementById('monthsGrid').textContent || '';
        const invites = document.getElementById('guestSlider')?.value || '';
        const venue = document.getElementById('venueNoButton').classList.contains('selected') ?
                      "None" : document.getElementById('venue-name').value || '';
        const agreements = Array.from(document.querySelectorAll('.service-btn.selected')).map(btn => btn.textContent).join(', ') || '';
        const otherDetails = document.getElementById('extra-details').value || '';

        // Validate required fields
        if (!chosenEvent || !celebrantName || !theme || !budget || !eventDate) {
            alert("Please fill out all required fields.");
            return;
        }

        // Prepare the data object for submission
        const eventData = {
            chosen_event: chosenEvent,
            celebrant_name: celebrantName,
            theme: theme,
            budget: budget,
            event_date: eventDate,
            invites: invites,
            venue: venue,
            agreements: agreements,
            other_details: otherDetails
        };

        console.log("Data to be submitted:", eventData);

        try {
            // Submit the data using fetch (AJAX)
            const response = await fetch('/submit-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            // Check if the response is okay
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                alert('Failed to submit event details: ' + errorText);
                return;
            }

            // Parse the response data
            const data = await response.json();
            console.log('Event submitted successfully:', data);
            alert('Event details submitted successfully. Redirecting to the dashboard...');
            window.location.href = '/client-dashboard.html'; // Redirect to the dashboard
        } catch (error) {
            console.error('Failed to submit event:', error);
            alert('Network error, please try again later.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');

    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const description = document.getElementById('description').value;

        // Validate input here if needed
        if (!name || !date || !time || !description) {
            alert('Please fill out all fields.');
            return;
        }

        const bookingData = {
            name: name,
            meeting_date: date,
            meeting_time: time,
            purpose: description
        };

        fetch('/submit-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Booking submitted successfully:', data);
            alert('Booking submitted successfully!');
           
        })
        .catch(error => {
            console.error('Failed to submit booking:', error);
            alert('Failed to submit booking.');
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    // This code assumes your client items are selectable by the class 'item'
    const clientItems = document.querySelectorAll('.item');

    clientItems.forEach(item => {
        item.addEventListener('click', function() {
            const clientId = this.dataset.clientId; // This retrieves the data-client-id attribute
            showClientDashboard(clientId); // Function to handle the display of dashboard-main
        });
    });
});

function showClientDashboard(clientId) {
    // This function needs to do several things:
    // 1. Hide the current main content or any visible content sections
    document.querySelector('.homepage-admin-dashboard').classList.add('hide');
    // 2. Show the dashboard-main content
    document.querySelector('.dashboard-main').classList.remove('hide');

    // Optionally fetch client-specific data
    fetch(`/get-client-details?clientId=${clientId}`) // Make sure the URL and parameters are correct
        .then(response => response.json())
        .then(data => {
            // Update the dashboard-main with the data returned
            updateDashboard(data);
        })
        .catch(error => console.error('Error fetching client details:', error));
}

function updateDashboard(data) {
    // Assuming you have elements within dashboard-main to display this data
    document.querySelector('#clientName').textContent = data.name;
    document.querySelector('#clientEvent').textContent = data.eventType;
    // Add more elements as needed
}


document.getElementById('addVenueForm').addEventListener('submit', function(event) {
    event.preventDefault(); // to prevent the default form submission behavior

    const formData = new FormData(this);

    fetch('/add-venue', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add venue');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Venue added successfully!');
        // Optionally redirect the user or clear the form
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to add venue');
    });
});
