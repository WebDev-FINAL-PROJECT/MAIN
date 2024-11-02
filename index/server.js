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

app.post('/submit-event', ensureLoggedIn, async (req, res) => {
    const { chosen_event } = req.body;
    const client_name = req.session.user.client_name;

    let { data: updatedData, error: updateError } = await supabase
        .from('user_choices')
        .update({ chosen_event: chosen_event })
        .match({ client_name: client_name });

    if (updateError || !updatedData || updatedData.length === 0) {
        let { data: insertedData, error: insertError } = await supabase
            .from('user_choices')
            .insert([{ client_name: client_name, chosen_event: chosen_event }]);

        if (insertError) {
            console.error('Error inserting data:', insertError.message);
            return res.status(400).json({ error: insertError.message, message: "Failed to insert new event choice." });
        }
        res.json({ message: 'New event choice successfully recorded', data: insertedData });
    } else {
        res.json({ message: 'Event choice successfully updated', data: updatedData });
    }
});


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
    } else {
        req.session.user = { client_name: data[0].FName + ' ' + data[0].LName };
        res.json({ message: 'Login successful', user: data[0], redirect: '/dashboard.html' });
    }
});

app.post('/submit-event-choice', async (req, res) => {
    const { user_id, chosen_event } = req.body;
    
    // Attempt to update an existing record
    const { data, error } = await supabase
        .from('user_choices')
        .update({ chosen_event: chosen_event })
        .match({ user_id: user_id }); // Match the user_id column

    if (error) {
        console.error('Error updating data:', error.message);
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Event choice updated successfully', data });
});
function ensureLoggedIn(req, res, next) {
    if (!req.session.user) {
        res.status(401).json({ error: 'Unauthorized: No session available' });
    } else {
        next();
    }
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
