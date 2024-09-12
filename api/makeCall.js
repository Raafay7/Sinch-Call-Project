const fetch = require('cross-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phoneNumber, message } = req.body;

    // Sinch credentials from environment variables
    const APPLICATION_KEY = process.env.SINCH_APP_KEY;
    const APPLICATION_SECRET = process.env.SINCH_APP_SECRET;
    const SINCH_NUMBER = process.env.SINCH_NUMBER;
    const LOCALE = process.env.LOCALE;

    const basicAuthentication = `${APPLICATION_KEY}:${APPLICATION_SECRET}`;


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
                    text: message
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error in /makeCall:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
