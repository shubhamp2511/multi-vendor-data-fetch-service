const express = require('express');
const app = express();
app.use(express.json());

app.post('/fetch', (req, res) => {
  const { request_id, payload } = req.body;
  res.json({ request_id, result: { message: `Sync data for ${payload.query}` } });
});

app.listen(4000, () => console.log('Sync vendor running on port 4000'));
