# notification-service overview:
This repository contains the codebase for a notification system, designed for PME's photo editing and ordering app. Our notification system consists of several components working together to deliver notifications to users over three channels (SMS, Email, Push). The system is built using JavaScript and leverages cloud services for scalability and reliability.

## Team:
* Emmanuel Adebayo
* Oludayo
* Emmanuel
  
## Components:
![image](./assets/architecture.png)

### Notification API:
* Built using Node.js with Express framework.
* Receives notification requests from upstream services via HTTP POST requests.
* Builds the notification, reads user preferences and enqueues notification on the messaging queue.
  
### Serverless functions:
* Queue triggered functions consume messages from a message queue and send notifications to the recipient over any of their preferred channels.
* Written in Node.js, utilising a cloud function that triggers every time a new message arrives on the queue.

### Database:
* Stores notification metadata and user preferences.
* Maintains information about sent notifications, including status, retries, and timestamps.

### CRON job:
* Reads the notification table and re enqueues failed notifications with retry count less than 3.

## Data Flow:
* Upstream services (e.g., other microservices, scripts, cron jobs) trigger notifications by sending requests to the Notification Microservice's HTTP POST endpoint.
* The Notification Microservice receives the notification requests and enqueues them into a message queue.
* Serverless functions  consume messages from the queue and send notifications using third-party services providers.
* Notification status and metadata are logged in the database for tracking and retry purposes.
