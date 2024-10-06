document.getElementById('signup-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
        first_name: document.querySelector('input[name="first_name"]').value,
        last_name: document.querySelector('input[name="last_name"]').value,
        phone: document.querySelector('input[name="phone"]').value,
        email: document.querySelector('input[name="email"]').value,
        username: document.querySelector('input[name="username"]').value,
        password: document.querySelector('input[name="password"]').value,
        confirm_password: document.querySelector('input[name="confirm_password"]').value
    };

    // Send the data using fetch
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Signup failed'); 
        }
    })
    .then(data => {
        // Show success message
        alert('You are successfully signed up!');
        console.log('Server response:', data); // Optional: Check the response from the server
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Signup failed. Please try again.');
    });
});
