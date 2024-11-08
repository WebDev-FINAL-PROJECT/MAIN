//index/server.js
require('dotenv').config();
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());  // For parsing application/json


app.use(express.static(path.join(__dirname, '..', 'html'), { index: false }));
app.use(express.static(path.join(__dirname, '..', 'css')));
app.use(express.static(path.join(__dirname, '..', 'js')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use false if you're not using HTTPS locally
}));

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'homepage.html')); // Serve the homepage
});

function ensureLoggedIn(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Unauthorized: No session available' });
    }
    next();
}

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'dashboard.html')); // Serve the dashboard page
});

app.get('/start.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'start.html')); // Serve the start page
});

app.post('/signup', async (req, res) => {
    const { fName, lName, phone, email, password } = req.body;

    let { data: userData, error: userError } = await supabase
        .from('User_information')
        .insert([{ 
            FName: fName,  
            LName: lName,  
            Phone_number: phone, 
            email: email,  
            Password: password  
        }])
        .select('*');

    if (userError || userData.length === 0) {
        console.error('Error inserting user data:', userError ? userError.message : "No data returned");
        return res.status(400).json({ error: userError ? userError.message : "User registration failed" });
    }

    // Initiate session after successful registration
    req.session.user = { client_name: `${fName} ${lName}` }; // Use template literals for session data

    // Attempt to create a placeholder entry in user_choices
    let { data: choicesData, error: choicesError } = await supabase
        .from('user_choices')
        .insert([{ 
            client_name: `${fName} ${lName}` // Use template literals for client_name
        }]);

    if (choicesError) {
        console.error('Error inserting into user choices:', choicesError.message);
        return res.status(400).json({ error: choicesError.message });
    }

    res.json({ 
        message: 'Signup successful, initial choice record created', 
        user: userData[0],
        choicesData 
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@admin.com' && password === 'admin') {
        console.log("Admin credentials detected for email:", email);  // Debugging log for admin
        res.json({ message: 'Login successful', isAdmin: true });
    } else {
        console.log("Checking database for regular user:", email); // Debugging log for non-admin
        const { data, error } = await supabase
            .from('User_information')
            .select('FName, LName')
            .eq('email', email)
            .eq('Password', password)
            .single();

        if (error || !data) {
            console.log("Login failed. User not found or incorrect password:", email); // Log login failure
            return res.status(401).json({ message: 'Login failed: Incorrect email or password' });
        } else {
            console.log("Regular user login detected for:", email);  // Log regular user success
            res.json({ message: 'Login successful', isAdmin: false });
        }
    }
});
app.post('/submit-event', async (req, res) => {
    console.log("Request received to /submit-event");
    const { chosen_event, celebrant_name, theme, budget, event_date, invites, venue, agreements, other_details } = req.body;
    

    // Validate required fields
    if (!chosen_event || !celebrant_name || !theme || !budget || !event_date) {
        return res.status(400).json({ error: "Missing required fields. Please check your inputs." });
    }

    try {
        // Insert data into the user_choice table
        const { data, error } = await supabase
            .from('user_choice')  // Make sure the table name is correctly spelled as in your database
            .insert([{
                chosen_event,
                celebrant_name,
                theme,
                budget,
                event_date,
                invites,
                venue,
                agreements,
                other_details
            }]);

        if (error) {
            console.error("Failed to insert data into user_choice table:", error);
            return res.status(400).json({ error: error.message });
        }

        // Send a successful response back to the client
        res.json({ message: "Event submitted successfully", data });
    } catch (error) {
        console.error("Server error when submitting event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Fixed template literal syntax
});
