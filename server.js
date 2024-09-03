require('dotenv').config();
const express = require('express');
const fetch = require('cross-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/makeCall', async (req, res) => {
    const phoneNumber = req.body.phoneNumber;

    const APPLICATION_KEY = process.env.APPLICATION_KEY;
    const APPLICATION_SECRET = process.env.APPLICATION_SECRET;
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
                    text: 'Hello, Muhammad Qasim here from XSPACE',
                }
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
