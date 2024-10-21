// index.js

const supabase = require('./supabaseClient');

const fetchData = async () => {
    try {
        console.log('Attempting to connect to the database...');

        // Example: Fetch data from a table named 'User-information'
        const { data, error } = await supabase
            .from('User_information') // Replace with your table name
            .select('*');

        if (error) {
            throw error; // Handle error appropriately
        }

        console.log('Data fetched successfully:', data);
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
};

fetchData();
