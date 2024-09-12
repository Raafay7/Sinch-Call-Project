// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const fetch = require('cross-fetch');
const app = express();
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for security headers
app.use(helmet());

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Validation and sanitization
app.post('/makeCall', [
    body('phoneNumber').isString().matches(/^\+\d{1,12}$/).withMessage('Invalid phone number format. It should start with "+" and contain up to 12 digits.'),
    body('message').notEmpty().withMessage('Message is required.'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, message } = req.body;

    const APPLICATION_KEY = process.env.SINCH_APP_KEY;
    const APPLICATION_SECRET = process.env.SINCH_APP_SECRET;
    const SINCH_NUMBER = process.env.SINCH_NUMBER;
    const LOCALE = process.env.LOCALE;

    const basicAuthentication = APPLICATION_KEY + ":" + APPLICATION_SECRET;

    fetch("https://calling.api.sinch.com/calling/v1/callouts", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + Buffer.from(basicAuthentication).toString('base64')
        },
        body: JSON.stringify({
            method: 'ttsCallout',
            ttsCallout: {
                cli: SINCH_NUMBER,
                destination: {
                    type: 'number',
                    endpoint: phoneNumber
                },
                locale: LOCALE,
                text: message,  // Use the voice input message
            }
        })
    })
    .then(response => response.json())
    .then(data => res.json(data))
    .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Example route for a homepage or index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route for 404 errors
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
