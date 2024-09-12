const fetch = require('cross-fetch');  // Import fetch if you're running this server-side

async function makeCall(phoneNumber, message) {
    try {
        const APPLICATION_KEY = process.env.SINCH_APP_KEY;
        const APPLICATION_SECRET = process.env.SINCH_APP_SECRET;
        const SINCH_NUMBER = process.env.SINCH_NUMBER;
        const LOCALE = process.env.LOCALE;

        const basicAuthentication = Buffer.from(`${APPLICATION_KEY}:${APPLICATION_SECRET}`).toString('base64');

        const response = await fetch("https://calling.api.sinch.com/calling/v1/callouts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + basicAuthentication
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

        if (!response.ok) {
            // Log the full response for debugging
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;

    } catch (error) {
        console.error('Error making the call:', error);
        throw error;
    }
}
