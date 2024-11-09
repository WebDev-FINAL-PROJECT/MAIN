//js/adminDashboard.js
const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);
const adminRouter = Router();

adminRouter.use(fileUpload());

// Middleware to ensure the user is logged in
function ensureLoggedIn(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Unauthorized: No session available' });
    }
    next();
}

// Endpoint to upload an image and update venue details
adminRouter.post('/upload-venue-image', ensureLoggedIn, async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // 'venueImage' is the name of the input field in the form
    let venueImage = req.files.venueImage;
    const fileName = `${Date.now()}_${venueImage.name}`;

    try {
        // Upload the image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('venues')
            .upload(fileName, venueImage.data);

        if (uploadError) throw uploadError;

        // Retrieve the public URL for the uploaded image
        const { publicURL, error: urlError } = supabase
            .storage
            .from('venues')
            .getPublicUrl(fileName);

        if (urlError) throw urlError;

        // Update the venue record with the new image URL
        const { data, error } = await supabase
            .from('venue')
            .update({ venue_img: publicURL })
            .match({ id: req.body.venueId });  // Assuming you pass venueId in the body

        if (error) throw error;

        res.json({ message: 'Image uploaded successfully', data });
    } catch (error) {
        console.error('Error uploading image to Supabase:', error.message);
        res.status(500).json({ error: 'Failed to upload image.' });
    }
});

module.exports = adminRouter;
adminRouter.post('/add-venue', ensureLoggedIn, async (req, res) => {
    if (!req.files || !req.files.venueImage) {
        return res.status(400).send('No image file uploaded.');
    }
    
    let { venueImage } = req.files;
    let { venueName, venueLocation, venueType, venuePrice } = req.body;
    const fileName = `venues/${Date.now()}_${venueImage.name}`;

    try {
        // Upload the image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('venue-images')
            .upload(fileName, venueImage.data);
        
        if (uploadError) throw uploadError;

        // Get the public URL of the uploaded image
        const { data: publicData } = supabase.storage.from('venue-images').getPublicUrl(fileName);
        const publicURL = publicData.publicUrl;


        // Insert venue data along with image URL into the 'venue' table
        const { data, error } = await supabase
            .from('venue')
            .insert([{
                venue_name: venueName,
                location: venueLocation,
                type: venueType,
                price: venuePrice,
                venue_img: publicURL
            }]);

        if (error) throw error;

        res.json({ message: 'Venue added successfully', data });
    } catch (error) {
        console.error('Error in adding venue:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const addVenueForm = document.getElementById('addVenueForm');
    const addVenueButton = document.querySelector('#addVenueForm button[type="submit"]');
    const modal = document.getElementById('addVenueModal');

    // Prevent the modal from closing when clicking the submit button
    addVenueButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Stop event from bubbling and closing the modal
    });

    // Form submission handler
    addVenueForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the normal form submission behavior

        // Get form input values
        const venueName = document.getElementById('venueName').value;
        const venueLocation = document.getElementById('venueLocation').value;
        const venueType = document.getElementById('venueType').value;
        const venuePrice = document.getElementById('venuePrice').value;
        const fileInput = document.getElementById('venueImage');

        // Create FormData object
        const formData = new FormData();
        formData.append('venueName', venueName);
        formData.append('venueLocation', venueLocation);
        formData.append('venueType', venueType);
        formData.append('venuePrice', venuePrice);

        // Check if an image file is selected
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            formData.append('venueImage', file, file.name);
        }

        try {
            // Send form data to the server using fetch API
            const response = await fetch('/admin/add-venue', {
                method: 'POST',
                body: formData,
            });

            // Parse the response
            const data = await response.json();

            if (response.ok) {
                alert('Venue added successfully!');
                console.log('Success:', data);

                // Optionally clear the form and close the modal
                addVenueForm.reset();
                modal.classList.add('hidden');
            } else {
                throw new Error(data.error || 'Failed to add venue');
            }
        } catch (error) {
            console.error('Error adding venue:', error);
            alert('Error adding venue. Please try again.');
        }
    });
});
