const { app } = require('@azure/functions');

app.serviceBusQueue('smsSender', {
    connection: '',
    queueName: 'myinputqueue',
    handler: (message, context) => {
        context.log('Service bus queue function processed message:', message);
    }
});
