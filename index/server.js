//index/server.js
require('dotenv').config();
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());  // For parsing application/json


app.use(express.static(path.join(__dirname, '..', 'html'), { index: false }));
app.use(express.static(path.join(__dirname, '..', 'css')));
app.use(express.static(path.join(__dirname, '..', 'js')));

// CORS Middleware Configuration
app.use(cors({
    origin: 'http://localhost:3000', // Change this to your frontend's origin
    credentials: true, // Allow session cookies
}));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to 'true' if using HTTPS
        httpOnly: true,
    }
}));


app.get('/get-user-info', async (req, res) => {
    const userId = req.session?.user?.user_id;

    // Check if user is logged in
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in.' });
    }

    try {
        // Fetch user information using the primary key (ID)
        const { data, error } = await supabase
            .from('User_information')
            .select('FName, LName')
            .eq('id', userId)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Respond with the user's first and last name
        res.json({ fName: data.FName, lName: data.LName });
    } catch (error) {
        console.error('Error fetching user information:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


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

    console.log('Signup request received:', req.body);

    // Input validation
    const namePattern = /^[A-Za-z\s]+$/;
    const phonePattern = /^\d+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namePattern.test(fName) || !namePattern.test(lName)) {
        return res.status(400).json({ error: 'First name and last name must only contain letters.' });
    }

    if (!phonePattern.test(phone)) {
        return res.status(400).json({ error: 'Phone number must only contain digits.' });
    }

    if (!emailPattern.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    try {
        // Insert user data into `User_information`
        const { data: userData, error: userError } = await supabase
            .from('User_information')
            .insert([{ FName: fName, LName: lName, Phone_number: phone, email, Password: password }])
            .select('id')
            .single();

        if (userError) {
            console.error('User insertion error:', userError.message);
            throw userError;
        }

        const userId = userData.id;
        console.log(`New user ID: ${userId}`);

        // Insert record into `user_choice` table
        const { error: choiceError } = await supabase
            .from('user_choice')
            .insert([{ user_id: userId }]);

        if (choiceError) {
            console.error('User choice insertion error:', choiceError.message);
            throw choiceError;
        }

        console.log('User choice record inserted successfully.');

        // Insert a record into `meeting_schedules` table with only `user_id`, others default to NULL
        // Insert a record into `meeting_schedules` table with only `user_id`
        const { error: meetingError } = await supabase
            .from('meeting_schedules')
            .insert([{ user_id: userId }]);


        if (meetingError) {
            console.error('Meeting schedule insertion error:', meetingError.message);
            throw meetingError;
        }

        console.log('Meeting schedule record inserted successfully with NULL values for other fields.');

        // Set session user data
        req.session.user = { user_id: userId };

        // Respond with success
        res.json({
            message: 'Signup successful. Records initialized in user_choice and meeting_schedules.',
            user: userData,
        });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(400).json({ error: error.message });
    }
});








app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase
        .from('User_information')
        .select('id, FName, LName')
        .eq('email', email)
        .eq('Password', password)
        .single();

    if (error || !data) {
        return res.status(401).json({ message: 'Login failed: Incorrect email or password' });
    }

    // Store user information in the session
    req.session.user = {
        user_id: data.id,
        fName: data.FName,
        lName: data.LName,
    };

    console.log('Session User ID:', req.session.user.user_id); // Add this line for debugging

    res.json({ message: 'Login successful', isAdmin: false, user: data });
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

// Route to fetch event data for the logged-in user
app.get('/get-event-data', async (req, res) => {
    const userId = req.session?.user?.user_id;

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in.' });
    }

    try {
        const { data, error } = await supabase
            .from('user_choice')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Event data not found.' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching event data:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route to update event data
app.post('/update-event', async (req, res) => {
    const userId = req.session?.user?.user_id;
    const updatedData = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'User must be logged in.' });
    }

    try {
        const { error } = await supabase
            .from('user_choice')
            .update(updatedData)
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        res.json({ message: 'Event details updated successfully.' });
    } catch (error) {
        console.error('Failed to update event details:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.get('/get-user-event', async (req, res) => {
    const userId = req.session?.user?.user_id;

    console.log('Session User ID:', userId); // Debug log

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in.' });
    }

    try {
        const { data, error } = await supabase
            .from('user_choice')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Supabase Error:', error.message);
            return res.status(500).json({ error: 'Failed to fetch event data from database.' });
        }

        if (!data) {
            return res.status(404).json({ error: 'Event data not found.' });
        }

        res.json(data);
    } catch (error) {
        console.error('Internal Server Error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});



// Update user event data
app.post('/update-user-event', async (req, res) => {
    const userId = req.session?.user?.user_id;
    const updatedData = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in.' });
    }

    try {
        const { error } = await supabase
            .from('user_choice')
            .update(updatedData)
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        res.json({ message: 'Event data updated successfully.' });
    } catch (error) {
        console.error('Error updating event data:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/submit-booking', async (req, res) => {
    const { name, meeting_date, meeting_time, purpose } = req.body;
    const userId = req.session?.user?.user_id; // Assuming user session management is handled

    if (!userId) {
        return res.status(401).send('User must be logged in.');
    }

    try {
        const { error } = await supabase
            .from('meeting_schedules')
            .insert({
                user_id: userId,
                name: name,
                meeting_date: meeting_date,
                meeting_time: meeting_time,
                purpose: purpose
            });

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Booking submitted successfully.' });
    } catch (error) {
        console.error('Error submitting booking:', error);
        res.status(500).json({ error: 'Failed to submit booking.' });
    }
});

app.get('/get-client-data', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('user_choice')
            .select('*'); // Adjust according to your actual data structure
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch client data', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});









const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Fixed template literal syntax
});
