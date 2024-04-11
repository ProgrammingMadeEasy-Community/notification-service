const { ServiceBusClient } = require("@azure/service-bus");

// Load the .env file if it exists
require("dotenv").config();

// Define connection string and related Service Bus entity names here
const connectionString = process.env.SERVICEBUS_CONNECTION_STRING || "<connection string>";
const smsQueueName = process.env.SMS_QUEUE_NAME || "smsQueue";
const pushQueueName = process.env.PUSH_QUEUE_NAME || "pushQueue";
const emailQueueName = process.env.EMAIL_QUEUE_NAME || "emailQueue";

exports.createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    let responseMessages = [];

    // Create a Service Bus client
    const sbClient = new ServiceBusClient(connectionString);

    // Create a sender for the queue
    const smsSender = sbClient.createSender(smsQueueName);
    const pushSender = sbClient.createSender(pushQueueName);
    const emailSender = sbClient.createSender(emailQueueName);

    message.forEach(async (msg) => {
      if (msg.sms && msg.phoneNumber) {
        // Custom action for SMS
        responseMessages.push(`SMS inner message ${msg.phoneNumber}: ${msg.sms}`);
        await smsSender.send({ body: `SMS inner message ${msg.phoneNumber}: ${msg.sms}` });
      }

      if (msg.email && msg.emailAddress) {
        // Custom action for Email
        responseMessages.push(`Email inner message ${msg.emailAddress}: ${msg.email}`);
        await emailSender.send({ body: `Email inner message ${msg.emailAddress}: ${msg.email}` });
      }

      if (msg.push && msg.deviceType) {
        // Custom action for Push
        responseMessages.push(`Push notif inner message ${msg.deviceType}: ${msg.pushText}`);
        await pushSender.send({ body: `Push notif inner message ${msg.deviceType}: ${msg.pushText}` });
      }
    });
    await smsSender.close();
    await emailSender.close();
    await pushSender.close();

    res.status(200).json({ messages: responseMessages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    sbClient.close();
  }
};