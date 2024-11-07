const express = require('express');
const pool = require('./db');

const app = express();

app.post('/update-theme', async (req, res) => {
    try {
        const { client_name, theme } = req.body;
        
        // Update the user_choice table with the theme
        const query = `
            UPDATE user_choice 
            SET theme = $1 
            WHERE client_name = $2
        `;
        
        await pool.query(query, [theme, client_name]);
        
        res.json({ success: true, message: 'Theme updated successfully' });
    } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({ success: false, message: 'Failed to update theme' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 