const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const jobsRouter = require('./api/routes/jobs');
const webhookRouter = require('./api/routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/jobs', jobsRouter);
app.use('/vendor-webhook', webhookRouter);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`API server listening on port ${PORT}`));
  })
  .catch(err => console.error('Mongo connection error', err));