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
    const clientName = `${fName} ${lName}`;

    try {
        let { data: userData, error: userError } = await supabase
            .from('User_information')
            .insert([{ 
                FName: fName,  
                LName: lName,  
                Phone_number: phone, 
                email: email,  
                Password: password  
            }])
            .single();

        if (userError) throw userError;

        // Insert a placeholder record in user_choice
        let { error: choicesError } = await supabase
            .from('user_choice')
            .insert([{ 
                client_name: clientName
            }]);

        if (choicesError) throw choicesError;

        req.session.user = { client_name: clientName }; // Store user info in session
        res.json({ 
            message: 'Signup successful. Record initialized in user_choice.', 
            user: userData
        });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(400).json({ error: error.message });
    }
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
    const {
        chosen_event,
        celebrant_name,
        theme,
        event_date,
        invites,
        venue,
        agreements,
        other_details,
        budget
    } = req.body;

    const clientName = req.session.user && req.session.user.client_name;

    if (!clientName) {
        return res.status(401).json({ error: "User must be logged in." });
    }

    try {
        // Fetch the most recent record for updates
        const { data: recentData, error: fetchError } = await supabase
            .from('user_choice')
            .select('*')
            .eq('client_name', clientName)
            .order('id', { ascending: false })
            .limit(1)
            .single();

        if (fetchError || !recentData) {
            throw new Error(fetchError?.message || "No existing record found to update.");
        }

        // Prepare the update object based on fields that are null
        const updatePayload = {};
        if (chosen_event && recentData.chosen_event === null) updatePayload.chosen_event = chosen_event;
        if (celebrant_name && recentData.celebrant_name === null) updatePayload.celebrant_name = celebrant_name;
        if (theme && recentData.theme === null) updatePayload.theme = theme;
        if (event_date && recentData.event_date === null) updatePayload.event_date = event_date;
        if (invites && recentData.invites === null) updatePayload.invites = invites;
        if (venue && recentData.venue === null) updatePayload.venue = venue;
        if (agreements && recentData.agreements === null) updatePayload.agreements = agreements;
        if (other_details && recentData.other_details === null) updatePayload.other_details = other_details;
        if (budget && recentData.budget === null) updatePayload.budget = budget;

        // Perform the update only if necessary
        if (Object.keys(updatePayload).length > 0) {
            const { error: updateError } = await supabase
                .from('user_choice')
                .update(updatePayload)
                .eq('id', recentData.id);

            if (updateError) {
                throw new Error(updateError.message);
            }

            res.json({ message: "Event details successfully updated." });
        } else {
            res.json({ message: "No updates made as no null fields required updating or new data was provided." });
        }
    } catch (error) {
        console.error("Error updating event details:", error.message);
        res.status(500).json({ error: "Failed to update event details", details: error.message });
    }
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Fixed template literal syntax
});
