const mongoose = require('mongoose');
const axios = require('axios');
const Job = require('../models/Job');
const { getJobFromQueue } = require('../services/queue');
const { isAllowed } = require('../services/rateLimiter');
require('dotenv').config();

async function processJobs() {
  await mongoose.connect(process.env.MONGO_URI);

  while (true) {
    const jobEntry = await getJobFromQueue('0');
    if (!jobEntry) continue;

    const requestId = jobEntry.data.requestId;
    const job = await Job.findOne({ requestId });
    if (!job) continue;

    try {
      await Job.updateOne({ requestId }, { status: 'processing' });

      if (!isAllowed(job.vendor)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }

      const vendorUrl = job.vendor === 'vendor-async'
        ? 'http://vendor-async:4001/fetch'
        : 'http://vendor-sync:4000/fetch';

      const response = await axios.post(vendorUrl, { request_id: requestId, payload: job.payload });

      if (job.vendor === 'vendor-sync') {
        const cleaned = cleanResponse(response.data);
        await Job.updateOne({ requestId }, { status: 'complete', result: cleaned });
      }

    } catch (err) {
      console.error('Worker error:', err.message);
      await Job.updateOne({ requestId }, { status: 'failed' });
    }
  }
}

function cleanResponse(data) {
  const cleaned = {};
  for (const key in data) {
    if (["ssn", "password", "credit_card"].includes(key)) continue;
    const val = data[key];
    cleaned[key] = typeof val === 'string' ? val.trim() : val;
  }
  return cleaned;
}

processJobs();