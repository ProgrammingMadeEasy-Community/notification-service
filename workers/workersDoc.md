![image](../Assets/notificationWorkers.jpg)

# smsSender.js

This script is located in the path `notification-service/workers/smsworker/src/functions/` in the ProgrammingMadeEasy-Community/notification-service repository. It is responsible for sending SMS messages using the Twilio service. The script is triggered by messages in a Service Bus Queue.

### Dependencies

- `@azure/functions`
- `twilio`

### Environment Variables

- `TWILIO_ACCOUNT_SID`: Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Twilio Auth Token

### Functions

`extractKeyValuePairs(inputString)`

- Takes a string of key-value pairs in the format ` +{phoneNumber}: {message}`
- Returns an object with phone numbers as keys and messages as values.

`app.serviceBusQueue(...)`

- An Azure Function that's triggered by messages in the `'sms_queue'` Service Bus Queue
- Sends an SMS to the phone number in the queued message

### Twilio Integration

- Uses the Twilio service to send SMS messages
- The sender phone number is hard-coded for now as `'+12054908514'` (this is our Twilio trial account phone number)

This script uses Azure Functions and Twilio to provide an SMS notification service. Messages are queued in a Service Bus Queue in the format `+{phoneNumber}: {message}`. When a message is added to the queue, this script is triggered to send an SMS to the phone number in the queued message.

# emailSender.js

This script is located in the path `notification-service/workers/emailworker/src/functions/` in the ProgrammingMadeEasy-Community/notification-service repository. It is responsible for sending email messages using the Mailgun service. The script is triggered by messages in a Service Bus Queue.

###Dependencies

- `@azure/functions`
- `mailgun-js`

### Environment Variables

- `MAILGUN_API_KEY`: Mailgun API Key
- `MAILGUN_DOMAIN`: Mailgun Domain

### Functions

`extractKeyValuePairs(inputString)`

- Takes a string of key-value pairs in the format +{email}: {message}
- Returns an object with emails as keys and messages as values.

`app.serviceBusQueue(...)`

- An Azure Function that’s triggered by messages in the 'email_queue' Service Bus Queue
- Sends an email to the email address in the queued message

### Mailgun Integration

- Uses the Mailgun service to send email messages
- The sender email is hard-coded for now as 'Excited User <akinpelu.dayo11@gmail.com>' (this is your Mailgun email)

This script uses Azure Functions and Mailgun to provide an email notification service. Messages are queued in a Service Bus Queue in the format `+{email}: {message}`. When a message is added to the queue, this script is triggered to send an email to the email address in the queued message.
