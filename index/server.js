require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'html' and 'css' directories
app.use(express.static(path.join(__dirname, '..', 'html'), { index: false }));
app.use(express.static(path.join(__dirname, '..', 'css')));
app.use(express.static(path.join(__dirname, '..', 'js'))); 

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);

// Serve homepage.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'homepage.html')); // Serve the homepage
});

// Handle form submission for signup
app.post('/signup', async (req, res) => {

    console.log(req.body);
    const { fName, lName, phone, email, password } = req.body;
    const { data, error } = await supabase
        .from('User_information')
        .insert([{ 
            FName: fName,  // Assuming the actual column name is 'fname'
            LName: lName,  // Assuming the actual column name is 'lname'
            Phone_number: phone,  // Change 'Phone-number' to 'phone_number' if that's the correct column name
            email: email,  // Ensure this is all lowercase if your DB column is lowercase
            Password: password  // Ensure this is all lowercase if your DB column is lowercase
        }]);

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
