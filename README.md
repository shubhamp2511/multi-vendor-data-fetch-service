# Multi-Vendor Data Fetch Service

A backend service that fetches and normalizes data from multiple external vendors (sync + async) through a unified job API.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/multi-vendor-data-fetch.git
cd multi-vendor-data-fetch

# Set up environment variables
cp .env.example .env

# Start everything with Docker Compose
docker-compose up --build

# API Endpoints
1. POST /jobs
     Accepts any JSON payload
     Returns: { "request_id": "<uuid>" }

2. GET /jobs/:id
    Returns job status (processing, complete, or failed)
    If complete, includes result

3. POST /vendor-webhook/:vendor
    Called by async vendor to submit result
    Updates job status to complete

## Architecture (ASCII Diagram)
Client
  |
  v
POST /jobs -------------> Redis Queue -------------> Worker
  |                                                  |
  v                                                  v
GET /jobs/:id                                Calls Vendor (sync/async)
                                                      |
                                                      v
                                          /vendor-webhook/:vendor
                                                      |
                                                      v
                                                   MongoDB


## Design Notes
Queue System: Redis Streams used for simplicity and speed

Vendor Mocking: Two vendors

Sync: replies instantly

Async: delays and calls back webhook

Rate Limiting: Logic stubbed for vendor-specific throttle

Resilient Design: Separate worker and vendor containers

## Sample cURL Requests

# Submit a job
curl -X POST http://localhost:3000/jobs -H "Content-Type: application/json" -d '{"vendor":"vendor-sync","query":"test"}'

# Check job status
curl http://localhost:3000/jobs/<request_id>

##  Load Testing

Use k6 or wrk:
k6 run load-test/script.js
Results & Tuning: See load-test/results.txt

## Folder Structure
api/              # Express route handlers
models/           # Mongoose job schema
services/         # Queue & rate-limiter
workers/          # Background job runner
vendors/          # Mock sync & async vendor APIs
load-test/        # Scripts and results

