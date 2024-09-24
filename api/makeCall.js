const twilio = require('twilio');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phoneNumber, message } = req.body;

    // Twilio credentials from environment variables
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_NUMBER = process.env.TWILIO_NUMBER;

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    try {
        const call = await client.calls.create({
            twiml: `<Response><Say>${message}</Say></Response>`, // TTS message
            to: phoneNumber,
            from: TWILIO_NUMBER
        });

        res.status(200).json({ callSid: call.sid });
    } catch (error) {
        console.error('Error in /makeCall:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
