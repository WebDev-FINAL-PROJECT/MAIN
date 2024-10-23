document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                showAlert('Signup successful!', 'success');
            } else {
                showAlert(result.error, 'error');
            }
        } catch (error) {
            showAlert('Network error, please try again later.', 'error');
        }
    });

    function showAlert(message, type) {
        const alertBox = document.createElement('div');
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.remove();
        }, 5000); // Remove the alert box after 5 seconds
    }
});
