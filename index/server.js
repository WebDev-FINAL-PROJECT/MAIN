require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'html'), { index: false }));
app.use(express.static(path.join(__dirname, '..', 'css')));
app.use(express.static(path.join(__dirname, '..', 'js'))); 

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'html', 'homepage.html')); // Serve the homepage
});

app.post('/signup', async (req, res) => {

    console.log(req.body);
    const { fName, lName, phone, email, password } = req.body;
    const { data, error } = await supabase
        .from('User_information')
        .insert([{ 
            FName: fName,  
            LName: lName,  
            Phone_number: phone, 
            email: email,  
            Password: password  
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

//LOGIN
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
            res.json({ message: 'Login successful', user: data[0] });
        }
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});
