// index.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const fName = document.getElementById('fname').value;
        const lName = document.getElementById('lname').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;

        if (password !== confirm) {
            alert('Passwords do not match.');
            return;
        }

        fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fName, lName, phone, email, password })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to sign up.');
        });
    });
});
