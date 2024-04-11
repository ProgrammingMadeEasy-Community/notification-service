const { ServiceBusClient } = require("@azure/service-bus");

exports.createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    let responseMessages = [];

    // Create a Service Bus client
    const sbClient = ServiceBusClient.createFromConnectionString("UseDevelopmentStorage=true");

    // Create a sender for the queue
    const smsSender = sbClient.createSender("sms");
    const pushSender = sbClient.createSender("push");
    const emailSender = sbClient.createSender("email");

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
        responseMessages.push(`Push notif inner message ${msg.deviceType}: ${msg.push}`);
        await pushSender.send({ body: `Push notif inner message ${msg.deviceType}: ${msg.push}` });
      }
    });

    await smsSender.close();
    await emailSender.close();
    await pushSender.close();
    await sbClient.close();

    res.status(200).json({ messages: responseMessages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};