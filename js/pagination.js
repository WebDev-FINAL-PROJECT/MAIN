document.addEventListener("DOMContentLoaded", function () {
    // Smooth scroll function
    function smoothScroll(target) {
        document.querySelector(target).scrollIntoView({ behavior: "smooth" });
    }

    // Handle 'Home' link click
    document.querySelector('a[href="#home"]').addEventListener("click", function (e) {
        e.preventDefault();
        smoothScroll("#home");
    });

    // Handle 'About' link click
    document.querySelector('a[href="#about"]').addEventListener("click", function (e) {
        e.preventDefault();
        smoothScroll("#about");
    });

    // Handle 'Reviews' link click
    document.querySelector('a[href="#reviews"]').addEventListener("click", function (e) {
        e.preventDefault();
        smoothScroll("#reviews");
    });

    // Handle 'Contacts' link click
    document.querySelector('a[href="#contact"]').addEventListener("click", function (e) {
        e.preventDefault();
        smoothScroll("#contact");
    });
});

document.addEventListener("DOMContentLoaded", function () {

    const loginSection = document.querySelector('.login');
    const signupSection = document.querySelector('.signup');
    const loginButton = document.querySelector('nav button'); 
    const signupRedirectLink = document.querySelector('.signup-redirect a'); 

    loginButton.addEventListener("click", function () {
        if (loginSection.style.display === "none" || loginSection.style.display === "") {
            loginSection.style.display = "block";  
            signupSection.style.display = "none";  
        } else {
            loginSection.style.display = "none";   
        }
    });

    // Add a click event listener to the "Sign up now" link
    signupRedirectLink.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default navigation
        loginSection.style.display = "none";  // Hide the login section
        signupSection.style.display = "block";  // Show the signup section
    });

    // Optional: Add a function to hide both sections when clicked outside
    document.addEventListener('click', function (event) {
        if (!loginSection.contains(event.target) && !loginButton.contains(event.target) &&
            !signupSection.contains(event.target) && !signupRedirectLink.contains(event.target)) {
            loginSection.style.display = 'none';
            signupSection.style.display = 'none';
        }
    });
});

/// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
    // Get the modals
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");

    // Get the buttons that open the modals
    const loginButton = document.querySelector('nav button'); // Assuming this is the login button
    const signupRedirectLink = document.querySelector('.signup-redirect a'); // For "Sign up now" link in login form

    // Get the close buttons
    const loginCloseButton = document.querySelector(".close");
    const signupCloseButton = document.querySelector(".signup-close");

    // When the user clicks the login button, open the login modal
    loginButton.addEventListener("click", function () {
        loginModal.style.display = "block";
    });

    // When the user clicks the "Sign up now" link, open the signup modal and close login modal
    signupRedirectLink.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default navigation
        loginModal.style.display = "none";  // Hide the login modal
        signupModal.style.display = "block";  // Show the signup modal
    });

    // When the user clicks on <span> (x), close the modals
    loginCloseButton.addEventListener("click", function () {
        loginModal.style.display = "none";
    });

    signupCloseButton.addEventListener("click", function () {
        signupModal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close both
    window.addEventListener("click", function (event) {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target === signupModal) {
            signupModal.style.display = "none";
        }
    });
});




