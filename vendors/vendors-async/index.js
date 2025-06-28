const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/fetch', (req, res) => {
  const { request_id, payload } = req.body;

  setTimeout(() => {
    axios.post('http://api:3000/vendor-webhook/vendor-async', {
      request_id,
      data: { message: `Async data for ${payload.query}` }
    }).catch(console.error);
  }, 2000);

  res.status(202).json({ status: 'accepted' });
});

app.listen(4001, () => console.log('Async vendor running on port 4001'));
