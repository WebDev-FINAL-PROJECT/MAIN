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

    try {
        // Insert user data into User_information
        const { data: userData, error: userError } = await supabase
            .from('User_information')
            .insert([{ FName: fName, LName: lName, Phone_number: phone, email, Password: password }])
            .select('id')
            .single();

        if (userError) throw userError;

        const userId = userData.id;

        // Create a placeholder entry in user_choice with the foreign key user_id
        const { error: choicesError } = await supabase
            .from('user_choice')
            .insert([{ user_id: userId }]);

        if (choicesError) throw choicesError;

        req.session.user = { user_id: userId };
        res.json({ message: 'Signup successful. Record initialized in user_choice.', user: userData });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(400).json({ error: error.message });
    }
});



app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@admin.com' && password === 'admin') {
        res.json({ message: 'Login successful', isAdmin: true });
    } else {
        const { data, error } = await supabase
            .from('User_information')
            .select('FName, LName')
            .eq('email', email)
            .eq('Password', password)
            .single();

        if (error || !data) {
            // Return a 401 status for unauthorized access
            return res.status(401).json({ message: 'Login failed: Incorrect email or password' });
        } else {
            res.json({ message: 'Login successful', isAdmin: false });
        }
    }
});

app.post('/submit-event', async (req, res) => {
    const { chosen_event, celebrant_name, theme, event_date, invites, venue, agreements, other_details, budget } = req.body;
    const userId = req.session.user?.user_id;

    if (!userId) {
        return res.status(401).json({ error: "User must be logged in." });
    }

    try {
        // Fetch the current record to check for NULL fields
        const { data: currentData, error: fetchError } = await supabase
            .from('user_choice')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

        // Prepare the update payload, only filling NULL columns
        const updatePayload = {};
        if (currentData.chosen_event === null && chosen_event) updatePayload.chosen_event = chosen_event;
        if (currentData.celebrant_name === null && celebrant_name) updatePayload.celebrant_name = celebrant_name;
        if (currentData.theme === null && theme) updatePayload.theme = theme;
        if (currentData.event_date === null && event_date) updatePayload.event_date = event_date;
        if (currentData.invites === null && invites) updatePayload.invites = invites;
        if (currentData.venue === null && venue) updatePayload.venue = venue;
        if (currentData.agreements === null && agreements) updatePayload.agreements = agreements;
        if (currentData.other_details === null && other_details) updatePayload.other_details = other_details;
        if (currentData.budget === null && budget) updatePayload.budget = budget;

        // Update the row if there are changes to be made
        if (Object.keys(updatePayload).length > 0) {
            const { error: updateError } = await supabase
                .from('user_choice')
                .update(updatePayload)
                .eq('user_id', userId);

            if (updateError) throw updateError;

            res.json({ message: "Event details updated successfully." });
        } else {
            res.json({ message: "No updates were made, as there were no NULL columns to replace." });
        }
    } catch (error) {
        console.error("Failed to update event details:", error);
        res.status(500).json({ error: "Internal server error during event update." });
    }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Fixed template literal syntax
});
