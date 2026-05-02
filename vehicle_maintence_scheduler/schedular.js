const axios = require("axios");
require("dotenv").config();

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const BASE_URL = "https://backend-staging.mailet.in/fullstack-intern-eval";

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

async function fetchDepots() {
  const res = await axios.get(`${BASE_URL}/depots`, { headers });
  return res.data;
}

async function fetchVehicleTasks(depotId) {
  const res = await axios.get(`${BASE_URL}/depots/${depotId}/vehicles`, { headers });
  return res.data;
}

function knapsack(tasks, capacity) {
  const n = tasks.length;
  const dp = new Array(capacity + 1).fill(0);
  const selected = new Array(capacity + 1).fill(null).map(() => []);

  for (let i = 0; i < n; i++) {
    const { duration, impact } = tasks[i];
    for (let w = capacity; w >= duration; w--) {
      if (dp[w - duration] + impact > dp[w]) {
        dp[w] = dp[w - duration] + impact;
        selected[w] = [...selected[w - duration], tasks[i]];
      }
    }
  }

  return { maxImpact: dp[capacity], selectedTasks: selected[capacity] };
}

async function runScheduler() {
  console.log("Fetching depots...\n");

  let depots;
  try {
    depots = await fetchDepots();
  } catch (err) {
    console.error("Error fetching depots:", err.response?.status, err.response?.data || err.message);
    return;
  }

  for (const depot of depots) {
    console.log(`\n===== Depot: ${depot.name} (ID: ${depot.id}) =====`);
    console.log(`Mechanic Hours Budget: ${depot.mechanicHours} hours`);

    let tasks;
    try {
      tasks = await fetchVehicleTasks(depot.id);
    } catch (err) {
      console.error(`Error fetching tasks for depot ${depot.id}:`, err.message);
      continue;
    }

    if (!tasks || tasks.length === 0) {
      console.log("No tasks found for this depot.");
      continue;
    }

    console.log(`Total tasks available: ${tasks.length}`);

    const capacity = depot.mechanicHours;
    const { maxImpact, selectedTasks } = knapsack(tasks, capacity);

    console.log(`\nSelected Tasks (Max Impact = ${maxImpact}):`);
    let totalDuration = 0;
    selectedTasks.forEach((t, i) => {
      console.log(`  ${i + 1}. Vehicle: ${t.vehicleId} | Duration: ${t.duration}h | Impact: ${t.impact}`);
      totalDuration += t.duration;
    });
    console.log(`Total Hours Used: ${totalDuration} / ${capacity}`);
  }
}

runScheduler();
