import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json()); // Updated to handle JSON

// Create connection to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'signup' // Your database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Route to handle form submission
app.post('/signup', (req, res) => {
    let user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };

    let sql = 'INSERT INTO user SET ?';
    let query = db.query(sql, user, (err, result) => {
        if (err) {
            res.status(500).send('Failed to save user data'); // Send failure message if an error occurs
        } else {
            res.status(200).send('User registered successfully'); // Send success message when data is saved
        }
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
