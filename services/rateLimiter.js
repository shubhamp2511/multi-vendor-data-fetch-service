const rateLimits = new Map();

function isAllowed(vendor, limitPerSecond = 2) {
  const now = Date.now();
  const timestamps = rateLimits.get(vendor) || [];
  const windowStart = now - 1000;
  const recent = timestamps.filter(ts => ts > windowStart);

  if (recent.length < limitPerSecond) {
    recent.push(now);
    rateLimits.set(vendor, recent);
    return true;
  }
  return false;
}

module.exports = { isAllowed };