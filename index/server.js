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
app.use(express.json()); // For parsing application/json

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
    res.sendFile(path.join(__dirname, '..', 'html', 'start.html')); // Serve the dashboard page
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
    req.session.user = { client_name: `${fName} ${lName}` };

    // Attempt to create a placeholder entry in user_choices
    let { data: choicesData, error: choicesError } = await supabase
        .from('user_choices')
        .insert([{ 
            client_name: `${fName} ${lName}`, // Only inserting client name initially
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
    const { data, error } = await supabase
        .from('User_information')
        .select('*')
        .match({ email: email, Password: password });


    if (error || data.length === 0) {
        res.status(401).json({ message: 'Login failed: User not found or password incorrect' });
    } 
    else {
        req.session.user = { client_name: data[0].FName + ' ' + data[0].LName };
        res.json({ message: 'Login successful', user: data[0], redirect: '/dashboard.html' });
    }
});
app.post('/submit-event', async (req, res) => {
    const { client_name, chosen_event, celebrant_name, theme } = req.body;

    try {
        console.log("Received data:", req.body); // Log the received data

        // First, check if a row already exists for this client_name
        const { data: existingData, error: selectError } = await supabase
            .from('user_choice')
            .select('*')
            .eq('client_name', client_name)
            .single(); // Fetch a single row with this client_name

        if (selectError && selectError.code !== 'PGRST116') {
            // Handle errors other than "row not found"
            throw selectError;
        }

        if (existingData) {
            // If a row exists for this client_name, only update if fields are null
            let updateData = {};

            if (!existingData.chosen_event && chosen_event) updateData.chosen_event = chosen_event;
            if (!existingData.celebrant_name && celebrant_name) updateData.celebrant_name = celebrant_name;
            if (!existingData.theme && theme) updateData.theme = theme;

            if (Object.keys(updateData).length === 0) {
                // No fields need updating; skip the update
                return res.json({ message: 'No updates needed; all fields are already set.' });
            }

            // Update the existing row with only the fields that are still null
            const { data: updatedData, error: updateError } = await supabase
                .from('user_choice')
                .update(updateData)
                .eq('client_name', client_name);

            if (updateError) throw updateError;

            console.log("Updated existing row:", updatedData);
            res.json({ message: 'Event details updated successfully!', data: updatedData });
        } else {
            // If no row exists, insert a new row
            const { data: insertedData, error: insertError } = await supabase
                .from('user_choice')
                .insert([{ client_name, chosen_event, celebrant_name, theme }]);

            if (insertError) throw insertError;

            console.log("Inserted new row:", insertedData);
            res.json({ message: 'Event details saved successfully!', data: insertedData });
        }
    } catch (error) {
        console.error('Error saving event details:', error.message);
        res.status(400).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



