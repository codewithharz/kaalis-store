const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const userAuthMiddleware = require('../middleware/userAuthMiddleware');

// @route   POST api/upload/image
// @desc    Upload an image to Cloudinary
// @access  Protected
router.post('/image', userAuthMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the Cloudinary URL
        res.status(200).json({
            url: req.file.path,
            public_id: req.file.filename
        });
    } catch (error) {
        console.error('Error in image upload:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// @route   POST api/upload/images
// @desc    Upload multiple images to Cloudinary
// @access  Protected
router.post('/images', userAuthMiddleware, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Return the Cloudinary URLs
        const urls = req.files.map(file => file.path);
        res.status(200).json({
            urls: urls
        });
    } catch (error) {
        console.error('Error in multiple images upload:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

module.exports = router;
