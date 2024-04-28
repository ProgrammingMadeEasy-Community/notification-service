[!image](Assets/notificationWorkers.jpg)

# smsSender.js
This script is located in the path `notification-service/workers/smsworker/src/functions/` in the ProgrammingMadeEasy-Community/notification-service repository. It is responsible for sending SMS messages using the Twilio service. The script is triggered by messages in a Service Bus Queue.

### Dependencies
* `@azure/functions`
* `twilio`

### Environment Variables
* `TWILIO_ACCOUNT_SID`: Twilio Account SID
* `TWILIO_AUTH_TOKEN`: Twilio Auth Token

### Functions
`extractKeyValuePairs(inputString)`
* Takes a string of key-value pairs in the format ```json+{phoneNumber}: {message}```
* Returns an object with phone numbers as keys and messages as values.
  
`app.serviceBusQueue(...)`
* An Azure Function that's triggered by messages in the `'sms_queue'` Service Bus Queue
* Sends an SMS to the phone number in the queued message

### Twilio Integration
* Uses the Twilio service to send SMS messages
* The sender phone number is hard-coded for now as `'+12054908514'` (this is our Twilio trial account phone number)

This script uses Azure Functions and Twilio to provide an SMS notification service. Messages are queued in a Service Bus Queue in the format ```json+{phoneNumber}: {message}```. When a message is added to the queue, this script is triggered to send an SMS to the phone number in the queued message.
