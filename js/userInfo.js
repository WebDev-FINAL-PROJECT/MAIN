document.addEventListener('DOMContentLoaded', async () => {
    const userInfoDiv = document.getElementById('user-info');

    try {
        // Fetch user information from the server
        const response = await fetch('/get-user-info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Ensure cookies (session data) are sent with the request
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching user info:', errorText);
            userInfoDiv.textContent = 'Failed to load user information.';
            return;
        }

        const { fName, lName } = await response.json();
        // Display the user's first and last name
        userInfoDiv.textContent = `Welcome, ${fName} ${lName}!`;
    } catch (error) {
        console.error('Failed to fetch user info:', error);
        userInfoDiv.textContent = 'Error loading user information.';
    }
});
