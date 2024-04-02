exports.createNotification = async (req, res) => {
    try {
      const { message } = req.body;
      let responseMessages = [];
  
      message.forEach((msg) => {
        if (msg.sms && msg.phoneNumber) {
          // Custom action for SMS
          responseMessages.push(`SMS submitted for processing ${msg.phoneNumber}: ${msg.sms}`);
        }
  
        if (msg.email && msg.emailAddress) {
          // Custom action for Email
          responseMessages.push(`Email submitted for processing ${msg.emailAddress}: ${msg.email}`);
        }
  
        if (msg.push && msg.deviceType) {
          // Custom action for Push
          responseMessages.push(`Push notif submitted for processing ${msg.deviceType}: ${msg.push}`);
        }
      });
  
      res.status(200).json({ responseMessages: responseMessages });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };