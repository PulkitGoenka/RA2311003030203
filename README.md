# RA2311003030203
. Root README.md (Main repo ka)
Backend Project

This repository contains all stages of the fullstack intern evaluation.

## Project Structure
├── logging middleware/          # Express logging middleware
├── notification_app_be/         # Priority inbox using Min-Heap
├── vehicle_maintence_scheduler/ # Knapsack-based vehicle scheduler
└── notification_system_design.md # System design document

## Tech Stack
- Node.js
- Express.js
- Axios
- dotenv

## Author
Pulkit Goenka

2. logging middleware/README.md
markdown# Logging Middleware

An Express.js middleware that logs all incoming requests and outgoing responses.

## What it does
- Logs request method, URL, timestamp, and body
- Logs response status code and time taken (in ms)

## Setup

```bash
npm install
node index.js
```

## Test in Postman

GET  → http://localhost:3000/health
POST → http://localhost:3000/test
Body: { "name": "test" }

## Example Log Output

[2026-05-02T10:00:00.000Z] --> GET /health
[2026-05-02T10:00:00.005Z] <-- GET /health | Status: 200 | 5ms

3. notification_app_be/README.md
markdown# Notification Priority Inbox

Fetches notifications from API and returns Top 10 by priority score using a Min-Heap.

## Algorithm
- Priority Score = (Type Weight × 2) + Recency Score
- Type Weights: urgent=4, update=2, promotional=1
- Recency Score = max(0, 10 - hours_since_received)
- Min-Heap of size 10 → O(n log 10) ≈ O(n) time complexity

## Setup

```bash
npm install
cp .env.example .env
# Add your AUTH_TOKEN and BASE_URL in .env
```

## Run

```bash
node testApi.js       # Test API connection
node priorityInbox.js # Get Top 10 priority inbox
```

## Environment Variables

```
AUTH_TOKEN=your_bearer_token
BASE_URL=http://20.207.122.201/evaluation-service
```

4. vehicle_maintence_scheduler/README.md
markdown# Vehicle Maintenance Scheduler

Solves a 0/1 Knapsack problem to maximize maintenance impact within mechanic hours budget.

## Problem Statement
- Fetch depots → each depot has a mechanic hours budget
- Fetch vehicle tasks → each task has duration and impact score
- Select tasks that maximize total impact without exceeding budget

## Algorithm
- 0/1 Knapsack Dynamic Programming
- dp[w] = maximum impact achievable with w hours
- Time Complexity: O(n × W) where n = tasks, W = mechanic hours

## Setup

```bash
npm install
cp .env.example .env
# Add your AUTH_TOKEN and BASE_URL in .env
```

## Run

```bash
node testApi.js   # Test API connection
node scheduler.js # Run the scheduler
```

## Environment Variables
AUTH_TOKEN=your_bearer_token
BASE_URL=http://20.207.122.201/evaluation-service

## Example Output
===== Depot: Central Depot (ID: 1) =====
Mechanic Hours Budget: 8 hours
Total tasks available: 10
Selected Tasks (Max Impact = 42):

Vehicle: V001 | Duration: 2h | Impact: 15
Vehicle: V003 | Duration: 3h | Impact: 18
Total Hours Used: 5 / 8
