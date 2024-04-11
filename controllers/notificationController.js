const { ServiceBusClient } = require("@azure/service-bus");
require("dotenv").config();

const connectionString = process.env.SERVICEBUS_CONNECTION_STRING || "<connection string>";
const smsQueueName = process.env.SMS_QUEUE_NAME || "smsQueue";
const pushQueueName = process.env.PUSH_QUEUE_NAME || "pushQueue";
const emailQueueName = process.env.EMAIL_QUEUE_NAME || "emailQueue";

exports.createNotification = async (req, res) => {
  const sbClient = new ServiceBusClient(connectionString);
  const smsSender = sbClient.createSender(smsQueueName);
  const pushSender = sbClient.createSender(pushQueueName);
  const emailSender = sbClient.createSender(emailQueueName);

  try {
    const { message } = req.body;
    let responseMessages = [];

    for (const msg of message) {
      if (msg.sms && msg.phoneNumber) {
        responseMessages.push(`SMS inner message ${msg.phoneNumber}: ${msg.sms}`);
        await smsSender.sendMessages({ body: `SMS inner message ${msg.phoneNumber}: ${msg.sms}` });
      }

      if (msg.email && msg.emailAddress) {
        responseMessages.push(`Email message ${msg.emailAddress}: ${msg.email}`);
        await emailSender.sendMessages({ body: `Email message ${msg.emailAddress}: ${msg.email}` });
      }

      if (msg.pushText && msg.deviceType) {
        responseMessages.push(`Push notif message ${msg.deviceType}: ${msg.pushText}`);
        await pushSender.sendMessages({ body: `Push notif message ${msg.deviceType}: ${msg.pushText}` });
      }
    }

    res.status(200).json({ messages: responseMessages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await smsSender.close();
    await emailSender.close();
    await pushSender.close();
    sbClient.close();
  }
};