//js/pagination.js
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

    signupRedirectLink.addEventListener("click", function (e) {
        e.preventDefault(); 
        loginSection.style.display = "none";  
        signupSection.style.display = "block";  
    });

    document.addEventListener('click', function (event) {
        if (!loginSection.contains(event.target) && !loginButton.contains(event.target) &&
            !signupSection.contains(event.target) && !signupRedirectLink.contains(event.target)) {
            loginSection.style.display = 'none';
            signupSection.style.display = 'none';
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
 
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");

    const loginButton = document.querySelector('nav button');
    const signupRedirectLink = document.querySelector('.signup-redirect a'); 

    const loginCloseButton = document.querySelector(".close");
    const signupCloseButton = document.querySelector(".signup-close");

    loginButton.addEventListener("click", function () {
        loginModal.style.display = "block";
    });

    signupRedirectLink.addEventListener("click", function (e) {
        e.preventDefault(); 
        loginModal.style.display = "none";  
        signupModal.style.display = "block";  
    });

    loginCloseButton.addEventListener("click", function () {
        loginModal.style.display = "none";
    });

    signupCloseButton.addEventListener("click", function () {
        signupModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target === signupModal) {
            signupModal.style.display = "none";
        }
    });
});
//DASHBOARD
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.content');
    const links = document.querySelectorAll('.sidebar-link');

    function showSection(event) {
        event.preventDefault();
        const sectionId = event.target.getAttribute('href'); // Get the href attribute of the clicked link
        sections.forEach(section => {
            if ('#' + section.id === sectionId) {
                section.style.display = 'block'; // Show the linked section
            } else {
                section.style.display = 'none'; // Hide all other sections
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', showSection); // Add click event listener to each link
    });

    // Optionally hide all sections on load and show only the first one or a specific section
    sections.forEach((section, index) => {
        if (index === 0) section.style.display = 'block'; // Show only the first section initially
        else section.style.display = 'none';
    });
});
//Start.html

// pagination.js

document.addEventListener("DOMContentLoaded", function () {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const otherInput = document.getElementById('theme');
    let selectedThemes = [];

    themeButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Toggle the selected class
            this.classList.toggle('selected');

            const theme = this.textContent.trim();
            
            // Add or remove the theme from the selectedThemes array
            if (selectedThemes.includes(theme)) {
                selectedThemes = selectedThemes.filter(t => t !== theme);
            } else {
                selectedThemes.push(theme);
            }
        });
    });

    document.querySelector('[data-next="6"]').addEventListener('click', function () {
        const otherTheme = otherInput.value.trim();

        if (otherTheme) {
            selectedThemes.push(otherTheme);
        }

        console.log("Selected Themes:", selectedThemes);
        // You can store or send the selectedThemes as needed before continuing to the next section
    });
});

//Booking of the client form
const scheduleButtons = document.querySelectorAll('.schedule-btn');
const bookingFormContainer = document.getElementById('bookingFormContainer');

scheduleButtons.forEach(button => {
    button.addEventListener('click', () => {
        bookingFormContainer.style.display = 'flex'; 
    });
});

window.addEventListener('click', (e) => {
    if (e.target === bookingFormContainer) {
        bookingFormContainer.style.display = 'none'; 
    }
});

//Admin dashboard- makit first ang clients
const homepageAdminDashboard = document.querySelector('.homepage-admin-dashboard');
const dashboardMain = document.querySelector('.dashboard-main');
const clientItems = document.querySelectorAll('.client .item');
const backButton = document.getElementById('back-to-dashboard');
homepageAdminDashboard.style.display = 'block';
dashboardMain.style.display = 'none';

function showDashboardMain() {
    homepageAdminDashboard.style.display = 'none';
    dashboardMain.style.display = 'flex';
}

function goBackToDashboard() {
    dashboardMain.style.display = 'none';
    homepageAdminDashboard.style.display = 'block';
}

clientItems.forEach(item => {
    item.addEventListener('click', showDashboardMain);
});

backButton.addEventListener('click', goBackToDashboard);