// This code should be saved in a file named `signup.js` in your 'js' directory
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
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
                alert('Signup successful!');
            } else {
                alert('Signup failed: ' + result.error);
            }
        } catch (error) {
            alert('Network error, please try again later.');
        }
    });
});
