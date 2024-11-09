// ES Module Imports
import dotenv from 'dotenv';
import session from 'express-session';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'html'), { index: false }));
app.use(express.static(path.join(__dirname, '..', 'css')));
app.use(express.static(path.join(__dirname, '..', 'js')));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
    }
}));

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'homepage.html'));
});

function ensureLoggedIn(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Unauthorized: No session available' });
    }
    next();
}

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'dashboard.html'));
});

app.get('/start.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'start.html'));
});

app.post('/signup', async (req, res) => {
    const { fName, lName, phone, email, password } = req.body;

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
        const { data: userData, error: userError } = await supabase
            .from('User_information')
            .insert([{ FName: fName, LName: lName, Phone_number: phone, email, Password: password }])
            .select('id')
            .single();

        if (userError) {
            throw userError;
        }

        const userId = userData.id;

        const { error: choiceError } = await supabase
            .from('user_choice')
            .insert([{ user_id: userId }]);

        if (choiceError) {
            throw choiceError;
        }

        const { error: meetingError } = await supabase
            .from('meeting_schedules')
            .insert([{ user_id: userId }]);

        if (meetingError) {
            throw meetingError;
        }

        req.session.user = { user_id: userId };

        res.json({
            message: 'Signup successful. Records initialized in user_choice and meeting_schedules.',
            user: userData,
        });
    } catch (error) {
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

    req.session.user = {
        user_id: data.id,
        fName: data.FName,
        lName: data.LName,
    };

    res.json({ message: 'Login successful', isAdmin: false, user: data });
});

app.post('/submit-event', async (req, res) => {
    const { chosen_event, celebrant_name, theme, event_date, invites, venue, agreements, other_details, budget } = req.body;
    const userId = req.session.user?.user_id;

    if (!userId) {
        return res.status(401).json({ error: "User must be logged in." });
    }

    try {
        const { data: currentData, error: fetchError } = await supabase
            .from('user_choice')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;

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
        res.status(500).json({ error: "Internal server error during event update." });
    }
});

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
        res.status(500).json({ error: 'Internal server error.' });
    }
});
app.get('/get-user-info', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'User not logged in.' });
    }

    const userId = req.session.user.user_id;

    try {
        const { data, error } = await supabase
            .from('User_information')
            .select('FName, LName')
            .eq('id', userId)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ fName: data.FName, lName: data.LName });
    } catch (error) {
        console.error('Error fetching user information:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
app.post('/add-venue', async (req, res) => {
    const { venue_name, venue_location, venue_type, venue_price, venue_img } = req.body;

    try {
        // Insert the venue data into the "venue" table in Supabase
        const { data, error } = await supabase
            .from('venue')
            .insert([
                {
                    venue_name: venue_name,
                    venue_location: venue_location,
                    venue_type: venue_type,
                    venue_price: venue_price,
                    venue_img: venue_img,
                },
            ]);

        if (error) {
            throw error;
        }

        res.json({ message: 'Venue added successfully', data });
    } catch (error) {
        console.error('Error adding venue:', error.message);
        res.status(500).json({ error: 'Failed to add venue. Please try again.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
