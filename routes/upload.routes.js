const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

const router = express.Router();

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second initial delay

// Helper function for retry logic with exponential backoff
const retryOperation = async (operation, retries = MAX_RETRIES, delay = RETRY_DELAY) => {
    try {
        return await operation();
    } catch (error) {
        if (retries === 0) {
            throw error;
        }
        logger.warn(`Operation failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryOperation(operation, retries - 1, delay * 2); // Exponential backoff
    }
};

// Configure multer with memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Upload image to Cloudinary with retry logic
router.post('/image', upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        logger.info(`Starting image upload for: ${req.file.originalname}`);

        // Upload with retry logic
        const uploadOperation = () => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'student-management',
                        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                        transformation: [
                            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                            { quality: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(req.file.buffer);
            });
        };

        const result = await retryOperation(uploadOperation);

        logger.info(`Image uploaded successfully: ${result.public_id}`);

        return res.status(200).json({
            success: true,
            secure_url: result.secure_url,
            public_id: result.public_id,
            url: result.url
        });

    } catch (err) {
        logger.error('Image upload failed after retries:', err.message);
        next(err);
    }
});

// Delete image from Cloudinary
router.delete('/image/:publicId', async (req, res, next) => {
    try {
        const { publicId } = req.params;
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.status(200).json({ success: true, message: 'Image deleted successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Failed to delete image' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
