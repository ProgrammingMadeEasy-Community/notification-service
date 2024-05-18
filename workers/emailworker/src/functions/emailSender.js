const { app } = require('@azure/functions');
const mailgun = require('mailgun-js');

function extractKeyValuePairs(inputString) {
  const regex =
    /(\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b):\s*(.*)/g;
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
          from: 'Excited User <mailgun@sandbox-123.mailgun.org>',
          to: email,
          subject: 'Hello',
          html: emailMessage
        };
        context.log(data);
        await mg.messages().send(data);
        context.log(`Email sent to ${email}: ${emailMessage}`);
      } catch (error) {
        context.log(`Error sending email to ${email}: ${error.message}`);
      }
    }
  }
});
