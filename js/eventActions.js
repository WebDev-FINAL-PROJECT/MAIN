//js/eventActions//

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

document.addEventListener("DOMContentLoaded", function() {
    const specificDateButton = document.getElementById('specificDateButton');
    const calendarSection = document.getElementById('calendarSection');
    const clearSelectionButton = document.getElementById('clearSelection');
    const displayMonths = document.getElementById('displayMonths');
    const eventDateInput = document.createElement('input');
    eventDateInput.type = 'hidden';
    eventDateInput.name = 'event_date';
    document.getElementById('start').appendChild(eventDateInput); // Add hidden input to form

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDates = [];

    specificDateButton.addEventListener('click', function() {
        calendarSection.classList.toggle('hidden');
        renderTwoMonthsCalendar(currentYear, currentMonth);
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
        currentMonth += 2;
        if (currentMonth > 11) {
            currentMonth %= 12;
            currentYear++;
        }
        renderTwoMonthsCalendar(currentYear, currentMonth);
    });

    document.getElementById('prevMonth').addEventListener('click', function() {
        currentMonth -= 2;
        if (currentMonth < 0) {
            currentMonth += 12;
            currentYear--;
        }
        renderTwoMonthsCalendar(currentYear, currentMonth);
    });

    clearSelectionButton.addEventListener('click', function() {
        selectedDates = [];
        eventDateInput.value = ''; // Clear hidden input
        renderTwoMonthsCalendar(currentYear, currentMonth);
    });

    function renderTwoMonthsCalendar(year, month) {
        const calendar = document.getElementById("calendar");
        calendar.innerHTML = '';
        displayMonths.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year} - ${new Date(year, month + 1).toLocaleString('default', { month: 'long' })} ${year}`;
        
        for (let i = 0; i < 2; i++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month';
            const monthName = new Date(year, month + i).toLocaleString('default', { month: 'long' });
            const header = document.createElement('h3');
            header.textContent = monthName;
            monthDiv.appendChild(header);
            renderMonthDays(monthDiv, year, month + i);
            calendar.appendChild(monthDiv);
        }
    }

    function renderMonthDays(monthDiv, year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            const dateKey = `${year}-${month + 1}-${day}`;
            dayElement.onclick = () => toggleDateSelection(dateKey, dayElement);
            if (selectedDates.includes(dateKey)) {
                dayElement.classList.add('selected');
            }
            monthDiv.appendChild(dayElement);
        }
    }

    function toggleDateSelection(dateKey, element) {
        const index = selectedDates.indexOf(dateKey);
        if (index === -1 && selectedDates.length < 5) {
            selectedDates.push(dateKey);
            element.classList.add('selected');
        } else if (index !== -1) {
            selectedDates.splice(index, 1);
            element.classList.remove('selected');
        }

        // Update hidden input value with selected dates as a comma-separated string
        eventDateInput.value = selectedDates.join(', ');
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const flexibleDateButton = document.getElementById('flexibleDateButton');
    const monthsSection = document.getElementById('flexibleDateSection');
    let selectedMonths = [];

    flexibleDateButton.addEventListener('click', function() {
        monthsSection.classList.toggle('hidden');
        if (!monthsSection.classList.contains('hidden')) {
            renderMonthsGrid(new Date().getFullYear()); // Render the current year by default
        }
    });

    function renderMonthsGrid(year) {
        const monthsGrid = document.getElementById('monthsGrid');
        monthsGrid.innerHTML = ''; // Clear the grid first
        const yearLabel = document.createElement('span');
        yearLabel.textContent = year;
        yearLabel.className = 'year-label';
        monthsGrid.appendChild(yearLabel);

        for (let i = 0; i < 12; i++) {
            const month = document.createElement('div');
            month.className = 'month-option';
            month.textContent = new Date(year, i).toLocaleString('default', { month: 'long' });
            if (selectedMonths.some(m => m.year === year && m.month === i)) {
                month.classList.add('selected');
            }
            month.onclick = () => toggleMonthSelection(year, i, month);
            monthsGrid.appendChild(month);
        }

        const prevYear = document.createElement('button');
        prevYear.textContent = '<';
        prevYear.className = 'year-nav';
        prevYear.onclick = () => renderMonthsGrid(year - 1);
        monthsGrid.insertBefore(prevYear, monthsGrid.firstChild);

        const nextYear = document.createElement('button');
        nextYear.textContent = '>';
        nextYear.className = 'year-nav';
        nextYear.onclick = () => renderMonthsGrid(year + 1);
        monthsGrid.appendChild(nextYear);
    }

    function toggleMonthSelection(year, month, element) {
        const index = selectedMonths.findIndex(m => m.year === year && m.month === month);
        if (index === -1 && selectedMonths.length < 3) {
            selectedMonths.push({ year, month });
            element.classList.add('selected');
        } else if (index !== -1) {
            selectedMonths.splice(index, 1);
            element.classList.remove('selected');
        }
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
    // Retrieve elements
    const yesButton = document.getElementById('yesButton');
    const noButton = document.getElementById('noButton');
    const sliderContainer = document.getElementById('sliderContainer');
    const budgetOptions = document.querySelector('.guest-options');
    const guestSlider = document.getElementById('guestSlider');
    const sliderValue = document.getElementById('sliderValue');

    // Event listener for the "Yes" button
    yesButton.addEventListener('click', function() {
        sliderContainer.classList.remove('hidden');  // Show the slider
        budgetOptions.classList.add('hidden');       // Hide the budget options
    });

    // Event listener for the "No" button
    noButton.addEventListener('click', function() {
        sliderContainer.classList.add('hidden');    // Hide the slider
        budgetOptions.classList.remove('hidden');   // Show the budget options
    });
    
    // Update the displayed guest count when the slider is adjusted
    guestSlider.addEventListener('input', function() {
        sliderValue.textContent = guestSlider.value; // Update the text to match the slider's value
    });

    // Additional event handling code...
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
        event.preventDefault();

        // Gather event data
        const chosenEvent = document.querySelector('.event-choice.active')?.textContent || '';
        const celebrantName = document.getElementById('wedding-name').value + ' and ' + document.getElementById('partner-name').value ||
                              document.getElementById('birthday-name').value ||
                              document.getElementById('other-event-name').value || '';
        const theme = document.getElementById('other-theme').value || '';
        const budget = document.querySelector('.budget-btn.selected')?.textContent || '';
        const eventDate = document.getElementById('specificDateButton').classList.contains('selected') ?
                          document.getElementById('calendar').textContent :
                          document.getElementById('monthsGrid').textContent || '';
        const invites = document.getElementById('guestSlider')?.value || '';
        const venue = document.getElementById('venueNoButton').classList.contains('selected') ?
                      "None" : document.getElementById('venue-name').value || '';
        const agreements = Array.from(document.querySelectorAll('.service-btn.selected')).map(btn => btn.textContent).join(', ') || '';
        const otherDetails = document.getElementById('extra-details').value || '';

        // Log the gathered data for debugging
        console.log("Chosen Event:", chosenEvent);
        console.log("Celebrant Name:", celebrantName);
        console.log("Theme:", theme);
        console.log("Budget:", budget);
        console.log("Event Date:", eventDate);
        console.log("Invites:", invites);
        console.log("Venue:", venue);
        console.log("Agreements:", agreements);
        console.log("Other Details:", otherDetails);

        // Check if required fields are filled
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

        // Log the data to be submitted
        console.log("Data to be submitted:", eventData);

        try {
            // Submit the event data to the server
            const response = await fetch('/submit-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });

            // Check the response status
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                alert('Failed to submit event details: ' + errorText);
                return;
            }

            // Parse the response data
            const data = await response.json();
            console.log('Event submitted successfully:', data);
            alert('Event details submitted successfully. Welcome to the dashboard!');
            window.location.href = '/client-dashboard.html'; // Redirect to client dashboard on success
        } catch (error) {
            console.error('Failed to submit event:', error);
            alert('Network error, please try again later.');
        }
    });
});
document.getElementById('submit-btn').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default form submission behavior

    const formData = {
        chosen_event: document.getElementById('chosen-event').value,
        celebrant_name: document.getElementById('celebrant-name').value,
        theme: document.getElementById('theme').value,
        budget: document.getElementById('budget').value,
        event_date: document.getElementById('event-date').value,
        invites: document.getElementById('invites').value,
        venue: document.getElementById('venue').value,
        agreements: document.getElementById('agreements').value,
        other_details: document.getElementById('other-details').value
    };

    fetch('/submit-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Event submitted successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to submit event details.');
    });
});

