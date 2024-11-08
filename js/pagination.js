document.addEventListener("DOMContentLoaded", () => {
    // Smooth Scroll Function
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Smooth Scroll Handlers
    document.querySelector('a[href="#home"]')?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScroll("#home");
    });

    document.querySelector('a[href="#about"]')?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScroll("#about");
    });

    document.querySelector('a[href="#reviews"]')?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScroll("#reviews");
    });

    document.querySelector('a[href="#contact"]')?.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScroll("footer");
    });

    // Modal Functionality
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");
    const bookEventButton = document.querySelector('.home button'); // "Book your events now!" button
    const contactUsButton = document.querySelector('.about .main-contents button'); // "Contact us!" button
    const loginButton = document.querySelector('nav button'); // Navbar login button
    const loginCloseButton = document.querySelector(".close");
    const signupCloseButton = document.querySelector(".signup-close");
    const signupRedirectLink = document.querySelector('.signup-redirect a');

    // Show Login Modal
    bookEventButton?.addEventListener("click", () => {
        loginModal.style.display = "block";
    });

    loginButton?.addEventListener("click", () => {
        loginModal.style.display = "block";
    });

    // Close Login Modal
    loginCloseButton?.addEventListener("click", () => {
        loginModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
    });

    // Show Signup Modal from Login Modal
    signupRedirectLink?.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.style.display = "none";
        signupModal.style.display = "block";
    });

    // Close Signup Modal
    signupCloseButton?.addEventListener("click", () => {
        signupModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === signupModal) {
            signupModal.style.display = "none";
        }
    });

    // Scroll to Footer on "Contact us!" Button Click
    contactUsButton?.addEventListener("click", () => {
        smoothScroll("footer");
    });

    // Dashboard Navigation
    const sections = document.querySelectorAll('.content');
    const links = document.querySelectorAll('.sidebar-link');

    function showSection(event) {
        event.preventDefault();
        const sectionId = event.target.getAttribute('href');
        sections.forEach(section => {
            if ('#' + section.id === sectionId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', showSection);
    });

    // Show only the first section initially
    sections.forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });

    // Theme Selection
    const themeButtons = document.querySelectorAll('.theme-btn');
    const otherInput = document.getElementById('theme');
    let selectedThemes = [];

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            const theme = button.textContent.trim();

            if (selectedThemes.includes(theme)) {
                selectedThemes = selectedThemes.filter(t => t !== theme);
            } else {
                selectedThemes.push(theme);
            }
        });
    });

    document.querySelector('[data-next="6"]')?.addEventListener('click', () => {
        const otherTheme = otherInput.value.trim();
        if (otherTheme) {
            selectedThemes.push(otherTheme);
        }
        console.log("Selected Themes:", selectedThemes);
    });

    // Booking Form
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

    // Admin Dashboard
    const homepageAdminDashboard = document.querySelector('.homepage-admin-dashboard');
    const dashboardMain = document.querySelector('.dashboard-main');
    const clientItems = document.querySelectorAll('.client .item');
    const backButton = document.getElementById('back-to-dashboard');

    homepageAdminDashboard.style.display = 'block';
    dashboardMain.style.display = 'none';

    clientItems.forEach(item => {
        item.addEventListener('click', () => {
            homepageAdminDashboard.style.display = 'none';
            dashboardMain.style.display = 'flex';
        });
    });

    backButton?.addEventListener('click', () => {
        dashboardMain.style.display = 'none';
        homepageAdminDashboard.style.display = 'block';
    });

    // Modal Handling for Adding Items
    function showModal(modalId) {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.add('hidden'));
        document.getElementById(modalId)?.classList.remove('hidden');
    }

    const addButtons = {
        '#venue .item img[src="add.png"]': 'addVenueModal',
        '#flowers .item img[src="add.png"]': 'addFlowerModal',
        '#invitations .item img[src="add.png"]': 'addAttendeesModal',
        '#makeup .item img[src="add.png"]': 'addArtistModal',
        '#music .item img[src="add.png"]': 'addMusicModal',
        '#officiant .item img[src="add.png"]': 'addOfficiantModal',
        '#photographer .item img[src="add.png"]': 'addPhotographerModal'
    };

    Object.entries(addButtons).forEach(([selector, modalId]) => {
        document.querySelector(selector)?.addEventListener('click', () => showModal(modalId));
    });

    // Close Modals
    document.querySelectorAll('.close, .cancel-btn').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal')?.classList.add('hidden');
        });
    });

    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector('.btn.logout-btn');

    // Redirect to homepage.html on logout button click
    logoutButton?.addEventListener('click', () => {
        window.location.href = "homepage.html";
    });
});
