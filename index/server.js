//server.js
require('dotenv').config();
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

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'homepage.html')); // Serve the homepage
});

app.post('/submit-event', async (req, res) => {
    const { chosen_event, client_name } = req.body;

    // First, try to update the existing record
    let { data: updatedData, error: updateError } = await supabase
        .from('user_choices')
        .update({ chosen_event: chosen_event })
        .match({ client_name: client_name });

    // If no rows are updated, it means the record doesn't exist, so insert a new one
    if (!updatedData || updatedData.length === 0) {
        let { data: insertedData, error: insertError } = await supabase
            .from('user_choices')
            .insert([{ client_name: client_name, chosen_event: chosen_event }]);

        if (insertError) {
            console.error('Error inserting data:', insertError.message);
            return res.status(400).json({ error: insertError.message });
        }
        res.json({ message: 'New event choice successfully recorded', data: insertedData });
    } else {
        if (updateError) {
            console.error('Error updating data:', updateError.message);
            return res.status(400).json({ error: updateError.message });
        }
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

    // First, insert the user data into the User_information table
    let { data: userData, error: userError } = await supabase
        .from('User_information')
        .insert([{ 
            FName: fName,  
            LName: lName,  
            Phone_number: phone, 
            email: email,  
            Password: password  
        }])
        .select('*'); // Ensure data is being returned

    if (userError || userData.length === 0) {
        console.error('Error inserting user data:', userError ? userError.message : "No data returned");
        return res.status(400).json({ error: userError ? userError.message : "User registration failed" });
    }

    // If the user is successfully created, insert into user_choices
    const fullName = `${fName} ${lName}`; // Combine first and last name
    let { data: choicesData, error: choicesError } = await supabase
        .from('user_choices')
        .insert([{ 
            client_name: fullName, // Only inserting client name initially
        }]);

    if (choicesError) {
        console.error('Error inserting into user choices:', choicesError.message);
        return res.status(400).json({ error: choicesError.message });
    }

    // Return success response
    res.json({ 
        message: 'Signup and initial choice record successful', 
        user: userData[0], // Safely accessing first element after checking
        choicesData 
    });
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase
            .from('User_information')
            .select('*')
            .match({ email: email, Password: password });

        if (error) throw error;
        if (data.length === 0) {
            res.status(401).json({ message: 'Login failed: User not found or password incorrect' });
        } else {
            res.json({ message: 'Login successful', user: data[0], redirect: '/dashboard.html' }); // Include redirect URL in the successful login response
        }
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).json({ message: 'Error logging in', error: err.message });
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
