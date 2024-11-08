
document.addEventListener('DOMContentLoaded', function() {
    const eventButtons = document.querySelectorAll('.event-choice');
    const chosenEventInput = document.getElementById('chosen-event');

    eventButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons and add it to the clicked one
            eventButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update the hidden input's value with the selected event type
            chosenEventInput.value = this.textContent;
        });
    });
});
