//js/eventActions


document.addEventListener('DOMContentLoaded', function() {
    // Handle the form submission for event details
    const form = document.getElementById('start');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Check which event type is selected and get the correct celebrant name
        let celebrantName = '';
        if (document.querySelector('.event-choice.active').id === 'wedding') {
            celebrantName = document.getElementById('wedding-name').value + ' and ' + document.getElementById('partner-name').value;
        } else if (document.querySelector('.event-choice.active').id === 'birthday') {
            celebrantName = document.getElementById('birthday-name').value;
        } else if (document.querySelector('.event-choice.active').id === 'other') {
            celebrantName = document.getElementById('other-event-name').value;
        }

        const theme = document.getElementById('other-theme').value; // Get the theme from the textbox
        const clientName = sessionStorage.getItem('clientName'); // Get the client name from session storage

        // Construct the data object to be sent
        const data = {
            chosen_event: document.querySelector('.event-choice.active').textContent,
            celebrant_name: celebrantName,
            theme: theme,
            client_name: clientName
            // Add other fields if needed
        };

        console.log("Data to be submitted:", data); // Log the data to confirm

        // Send the data to the server
        fetch('/submit-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Event submitted:', data);
            alert('Event details submitted successfully!');
            window.location.href = '/dashboard.html'; // Redirect on success
        })
        .catch(error => {
            console.error('Failed to submit event:', error);
            alert('Failed to submit event details');
        });
    });
});

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
