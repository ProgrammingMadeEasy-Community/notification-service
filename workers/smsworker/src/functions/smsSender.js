const { app } = require('@azure/functions');
const twilio = require('twilio');

function extractKeyValuePairs(inputString) {
    const regex = /(\+\d+):\s*(.*)/g;
    const keyValuePairs = {};
    let match;

    while ((match = regex.exec(inputString)) !== null) {
        const phoneNumber = match[1];
        const smsMessage = match[2];
        keyValuePairs[phoneNumber] = smsMessage;
    }

    return keyValuePairs;
}

app.serviceBusQueue('smsSender', {
    connection: 'ServiceBusEndpoint',
    queueName: 'sms_queue',
    handler: async (message, context) => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);

        const keyValuePairs = extractKeyValuePairs(message); // Contains the message from queue number:message
        for (const phoneNumber in keyValuePairs) {
            const smsMessage = keyValuePairs[phoneNumber];
            try {
                await client.messages.create({
                    body: smsMessage,
                    from: '+12054908514', // Our Twilio phone number
                    to: phoneNumber // This now includes the country code
                });
                context.log(`SMS sent to ${phoneNumber}: ${smsMessage}`);
            } catch (error) {
                context.log(`Error sending SMS to ${phoneNumber}: ${error.message}`);
            }
        }
    }
});
