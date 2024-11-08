//signup.js
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
                alert('Signup successful! Welcome to Colors.');
                closeSignupModal(); // Close the signup modal
                window.location.href = '/start.html'; // Redirect to start.html
            } else {
                alert('Signup failed: ' + result.error);
            }
        } catch (error) {
            alert('Network error, please try again later.');
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("Received data from server:", data);  // Log server response

            if (response.ok) {
                alert(data.message);

                if (data.isAdmin) {
                    console.log("Redirecting to admin dashboard...");  // Log redirection for admin
                    window.location.href = '/dashboard.html';
                } else {
                    console.log("Redirecting to client dashboard...");  // Log redirection for regular user
                    window.location.href = '/client-dashboard.html';
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to log in');
        }
    });
});





function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.style.display = 'none';
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}




