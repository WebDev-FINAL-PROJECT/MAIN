// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'html'), { index: false }));
app.use(express.static(path.join(__dirname, '..', 'css')));

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);

// Serve HTML page on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'signup.html'));
});

// Handle form submission
app.post('/signup', async (req, res) => {
    const { fName, lName, phone, email, password } = req.body;
    const { data, error } = await supabase
        .from('User_information')
        .insert([{ FName: fName, LName: lName, 'Phone-number': phone, email: email, Password: password }]);

    if (error) {
        console.error('Error inserting data:', error.message);
        return res.status(400).json({ error: error.message });
    }
    res.json({ message: 'Signup successful', data: data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
