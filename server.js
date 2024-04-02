const express = require('express');
const app = express();
const notificationRoutes = require('./routes/notificationRoutes');

app.use(express.json()); // for parsing application/json
app.use('/', notificationRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});