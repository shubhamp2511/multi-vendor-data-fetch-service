const express = require('express');
const router = express.Router();
const Job = require('../../models/Job');

router.post('/:vendor', async (req, res) => {
  const { request_id, data } = req.body;
  const cleaned = cleanResponse(data);
  await Job.updateOne({ requestId: request_id }, { status: 'complete', result: cleaned });
  res.sendStatus(200);
});

function cleanResponse(data) {
  const cleaned = {};
  for (const key in data) {
    if (["ssn", "password", "credit_card"].includes(key)) continue;
    const val = data[key];
    cleaned[key] = typeof val === 'string' ? val.trim() : val;
  }
  return cleaned;
}

module.exports = router;
