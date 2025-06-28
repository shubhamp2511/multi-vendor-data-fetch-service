const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Job = require('../../models/Job');
const { addToQueue } = require('../../services/queue');

// POST /jobs - Submit job
router.post('/', async (req, res) => {
  const requestId = uuidv4();
  const vendor = req.body.vendor || 'vendor-sync';

  await Job.create({ requestId, payload: req.body, vendor });
  await addToQueue({ requestId });

  res.status(202).json({ request_id: requestId });
});

// GET /jobs/:id - Fetch job status
router.get('/:id', async (req, res) => {
  const job = await Job.findOne({ requestId: req.params.id });
  if (!job) return res.status(404).json({ error: 'Not found' });
  return res.json({ status: job.status, result: job.status === 'complete' ? job.result : undefined });
});

module.exports = router;
