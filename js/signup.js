document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('signup-error-message');
    const loginForm = document.getElementById('login-form');
    const loginErrorMessage = document.getElementById('login-error-message');

    // Helper functions
    function resetErrorMessage(element) {
        element.style.display = 'none';
        element.textContent = '';
    }

    function displayErrorMessage(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    async function handleFormSubmission(url, data, successCallback, errorCallback) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                successCallback(result);
            } else {
                errorCallback(result.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Network error:', error);
            errorCallback('Network error, please try again later.');
        }
    }

    signupForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        resetErrorMessage(errorMessage);
    
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());
    
        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            console.log("Signup response:", response.status, result);
    
            if (response.ok) {
                alert('Signup successful! Welcome to Colors.');
                closeSignupModal();
                window.location.href = '/start.html';
            } else if (response.status === 409) {
                // User already exists
                displayErrorMessage(errorMessage, 'User already exists. Please use a different email.');
            } else {
                displayErrorMessage(errorMessage, 'Signup failed: ' + (result.error || 'An error occurred.'));
            }
        } catch (error) {
            console.error('Network error during signup:', error);
            displayErrorMessage(errorMessage, 'Network error, please try again later.');
        }
    });
    
    // Login form submission handler
    loginForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        resetErrorMessage(loginErrorMessage);

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        handleFormSubmission(
            '/login',
            { email, password },
            (data) => {
                alert(data.message);
                if (data.isAdmin) {
                    console.log("Redirecting to admin dashboard...");
                    window.location.href = '/dashboard.html';
                } else {
                    console.log("Redirecting to client dashboard...");
                    window.location.href = '/client-dashboard.html';
                }
            },
            (error) => {
                displayErrorMessage(loginErrorMessage, error);
            }
        );
    });
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('error-message');

    // Reset the error message
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful
            if (data.isAdmin) {
                window.location.href = '/dashboard.html';
            } else {
                window.location.href = '/client-dashboard.html';
            }
        } else {
            // Login failed, display error message
            errorMessage.textContent = 'Invalid email or password.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorMessage.textContent = 'An error occurred. Please try again later.';
        errorMessage.style.display = 'block';
    }
});

// Helper functions for modal control
function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.style.display = 'none';
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}
