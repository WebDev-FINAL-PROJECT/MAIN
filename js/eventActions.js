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
    const selectedMonthInput = document.getElementById('selectedMonth'); // Hidden input field

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
            month.type = 'button'; // Prevent form submission

            // Disable past months in the current year
            if (year === currentYear && i < currentMonth) {
                month.disabled = true;
                month.classList.add('disabled');
            } else {
                month.onclick = (event) => {
                    event.preventDefault(); // Prevent form submission
                    toggleMonthSelection(year, i, month);
                };
            }

            monthsGrid.appendChild(month);
        }

        // Navigation buttons
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
        // Deselect all previously selected months
        document.querySelectorAll('.month-option').forEach(mo => mo.classList.remove('selected'));
    
        // Select the clicked month
        element.classList.add('selected');
    
        // Ask the user to select a day
        const selectedDay = prompt("Please enter the day (1-31):", "1");
    
        // Validate the day input
        const day = parseInt(selectedDay);
        if (isNaN(day) || day < 1 || day > 31) {
            alert("Invalid day. Please enter a number between 1 and 31.");
            return;
        }
    
        // Update the form with the selected date in "Day_Month_Year" format
        updateFormWithSelectedDate(day, year, month);
    }
    
    function updateFormWithSelectedDate(day, year, month) {
        const dateInput = document.getElementById('eventDate');
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    
        // Store the selected date in the "Day_Month_Year" format
        dateInput.value = `${day}_${monthName}_${year}`;
        console.log(`Selected date: ${dateInput.value}`); // Debug log
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
document.getElementById('start').addEventListener('submit', async function (event) {
    event.preventDefault();

    let celebrantName = '';
    if (!document.getElementById('wedding-section').classList.contains('hidden')) {
        celebrantName = `${document.getElementById('wedding-name').value} and ${document.getElementById('partner-name').value}`;
    } else if (!document.getElementById('birthday-section').classList.contains('hidden')) {
        celebrantName = document.getElementById('birthday-name').value;
    } else {
        celebrantName = document.getElementById('other-event-name').value;
    }

    const eventData = {
        chosen_event: document.querySelector('.event-choice.active')?.textContent || '',
        celebrant_name: celebrantName,
        theme: document.getElementById('other-theme').value || '',
        budget: document.querySelector('.budget-btn.selected')?.textContent || '',
        event_date: document.getElementById('eventDate')?.value || '',
        invites: document.getElementById('guestSlider')?.value || '',
        venue: document.getElementById('venueNoButton').classList.contains('selected') ? "None" : document.getElementById('venue-name').value || '',
        agreements: Array.from(document.querySelectorAll('.service-btn.selected')).map(btn => btn.textContent).join(', '),
        other_details: document.getElementById('extra-details').value || ''
    };

    try {
        const response = await fetch('/submit-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            alert('Failed to submit event details: ' + errorText);
            return;
        }

        const data = await response.json();
        console.log('Event submitted successfully:', data);
        alert('Event details submitted successfully.');
        window.location.href = '/client-dashboard.html';
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error, please try again later.');
    }
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
document.addEventListener('DOMContentLoaded', function () {
    const editEventButton = document.getElementById('editEventButton');
    const editEventModal = document.getElementById('editEventModal');
    const closeModal = document.getElementById('closeModal');
    const editEventForm = document.getElementById('editEventForm');

    // Event listener for "Edit Event" button
    editEventButton.addEventListener('click', async function () {
        try {
            // Fetch the event data for the logged-in user
            const response = await fetch('/get-event-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching event data:', errorText);
                alert('Failed to fetch event data. Please try again.');
                return;
            }

            const eventData = await response.json();
            console.log('Fetched event data:', eventData);

            // Populate the form fields with the fetched data
            document.getElementById('chosenEvent').value = eventData.chosen_event || '';
            document.getElementById('celebrantName').value = eventData.celebrant_name || '';
            document.getElementById('theme').value = eventData.theme || '';
            document.getElementById('budget').value = eventData.budget || '';
            document.getElementById('eventDate').value = eventData.event_date || '';
            document.getElementById('invites').value = eventData.invites || '';
            document.getElementById('venue').value = eventData.venue || '';
            document.getElementById('agreements').value = eventData.agreements || '';
            document.getElementById('otherDetails').value = eventData.other_details || '';

            // Show the modal
            editEventModal.classList.remove('hidden');
        } catch (error) {
            console.error('Error during edit event fetch:', error);
            alert('An error occurred while fetching event details.');
        }
    });

    // Event listener for closing the modal
    closeModal.addEventListener('click', function () {
        editEventModal.classList.add('hidden');
    });

    // Optional: Add a listener for the "Cancel" button
    document.getElementById('cancelEdit').addEventListener('click', function () {
        editEventModal.classList.add('hidden');
    });
});

// Add this at the end of eventActions.js
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('eventDate');

    // Set a minimum date (today's date)
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Log the selected date (for debugging purposes)
    dateInput.addEventListener('change', () => {
        console.log(`Selected date: ${dateInput.value}`); // Format: YYYY-MM-DD
    });
});
