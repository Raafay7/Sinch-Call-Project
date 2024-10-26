const twilio = require('twilio');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phoneNumber, message } = req.body;

    // Validate required fields
    if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'Missing required fields: phoneNumber or message' });
    }

    // Log environment variables to check if they are correctly loaded
    console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
    console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
    console.log('TWILIO_NUMBER:', process.env.TWILIO_NUMBER);

    // Twilio credentials from environment variables
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_NUMBER = process.env.TWILIO_NUMBER;

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    try {
        const call = await client.calls.create({
            from: TWILIO_NUMBER,  // Your Twilio number
            to: phoneNumber,      // The recipient's phone number
            url: "http://demo.twilio.com/docs/voice.xml",  // URL pointing to Twilio XML instructions
        });

        res.status(200).json({ callSid: call.sid });
    } catch (error) {
        // Log the error details from Twilio
        console.error('Error in /api/makeCall:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
            status: error.status,
            moreInfo: error.moreInfo // Twilio's error documentation URL
        });
    }
};
