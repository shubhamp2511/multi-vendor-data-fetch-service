const { createClient } = require('redis');
const client = createClient({ url: process.env.REDIS_URL });
const STREAM_NAME = 'jobs-stream';

async function initRedis() {
  if (!client.isOpen) await client.connect();
}

async function addToQueue({ requestId }) {
  await initRedis();
  await client.xAdd(STREAM_NAME, '*', { requestId });
}

async function getJobFromQueue(lastId = '$') {
  await initRedis();
  const res = await client.xRead(
    { key: STREAM_NAME, id: lastId },
    { COUNT: 1, BLOCK: 5000 }
  );
  if (res) {
    const [stream] = res;
    const [entryId, data] = stream.messages[0];
    return { entryId, data };
  }
  return null;
}

module.exports = { addToQueue, getJobFromQueue };