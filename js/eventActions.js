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
document.addEventListener("DOMContentLoaded", function () {
    // Elements for navigating the calendar
    const monthYearElement = document.getElementById("monthYear");
    const calendarDaysElement = document.getElementById("calendarDays");
    const monthsGridElement = document.getElementById("monthsGrid");
    const currentYear = 2024; // Fixed year 2024
    let selectedMonth = new Date().getMonth();
    let selectedDate;

    // Month names for display
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Function to render the days in the selected month
    function renderCalendar() {
        monthYearElement.textContent = `${monthNames[selectedMonth]} ${currentYear}`;
        calendarDaysElement.innerHTML = "";

        // Get the first day and number of days in the month
        const firstDay = new Date(currentYear, selectedMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();

        // Add empty divs for the days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDaysElement.appendChild(document.createElement("div"));
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div");
            dayElement.textContent = day;
            dayElement.classList.add("day");
            dayElement.addEventListener("click", () => selectDate(day));
            calendarDaysElement.appendChild(dayElement);
        }
    }

    // Function to handle selecting a specific date
    function selectDate(day) {
        selectedDate = new Date(currentYear, selectedMonth, day);
        alert(`Selected date: ${selectedDate.toDateString()}`);
    }

    // Month navigation event listeners
    document.querySelectorAll(".calendar-header .arrow")[0].addEventListener("click", () => changeMonth(-1));
    document.querySelectorAll(".calendar-header .arrow")[1].addEventListener("click", () => changeMonth(1));

    function changeMonth(direction) {
        selectedMonth += direction;
        if (selectedMonth < 0) {
            selectedMonth = 11; // Wrap around to December
        } else if (selectedMonth > 11) {
            selectedMonth = 0; // Wrap around to January
        }
        renderCalendar();
    }

    // Render the calendar on load
    renderCalendar();

    // Render the months for the flexible date section
    function renderMonths() {
        monthsGridElement.innerHTML = "";
        monthNames.forEach((month, index) => {
            const monthElement = document.createElement("div");
            monthElement.textContent = month;
            monthElement.classList.add("month");
            monthElement.addEventListener("click", () => selectMonth(index));
            monthsGridElement.appendChild(monthElement);
        });
    }

    

    // Render the flexible date section months on load
    renderMonths();
});




