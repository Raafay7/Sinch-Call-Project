// Load environment variables from .env file
require('dotenv').config();

const fetch = require('cross-fetch');
const { body, validationResult } = require('express-validator');

// Export as a serverless function handler
export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Validation and sanitization
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

        try {
            const response = await fetch("https://calling.api.sinch.com/calling/v1/callouts", {
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
            });

            const data = await response.json();
            return res.status(200).json(data);

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
