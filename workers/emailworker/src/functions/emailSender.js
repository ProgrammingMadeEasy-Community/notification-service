const { app } = require('@azure/functions');
const mailgun = require('mailgun-js');

function extractKeyValuePairs(inputString) {
  const regex = /(\+\d+):\s*(.*)/g;
  const keyValuePairs = {};
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    const email = match[1];
    const emailMessage = match[2];
    keyValuePairs[email] = emailMessage;
  }

  return keyValuePairs;
}

app.serviceBusQueue('emailSender', {
  connection: 'ServiceBusEndpoint',
  queueName: 'email_queue',
  handler: async (message, context) => {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const mg = mailgun({ apiKey: apiKey, domain: domain });

    const keyValuePairs = extractKeyValuePairs(message); // Contains the message from queue email:message
    for (const email in keyValuePairs) {
      const emailMessage = keyValuePairs[email];
      try {
        const data = {
          from: 'Excited User <akinpelu.dayo11@gmail.com>',
          to: email,
          subject: 'Hello',
          text: emailMessage
        };
        await mg.messages().send(data);
        context.log(`Email sent to ${email}: ${emailMessage}`);
      } catch (error) {
        context.log(`Error sending email to ${email}: ${error.message}`);
      }
    }
  }
});
