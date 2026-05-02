const axios = require("axios");
require("dotenv").config();

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const BASE_URL = process.env.BASE_URL;

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

class MinHeap {
  constructor() { this.heap = []; }
  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }
  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) { this.heap[0] = last; this._sinkDown(0); }
    return top;
  }
  size() { return this.heap.length; }
  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].score <= this.heap[i].score) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }
  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l].score < this.heap[smallest].score) smallest = l;
      if (r < n && this.heap[r].score < this.heap[smallest].score) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

function calculatePriorityScore(notification) {
  const weights = { urgent: 4, update: 2, promotional: 1 };
  const typeScore = weights[notification.type] || 1;
  const hoursSinceReceived =
    (Date.now() - new Date(notification.receivedAt).getTime()) / (1000 * 60 * 60);
  const recencyScore = Math.max(0, 10 - hoursSinceReceived);
  return typeScore * 2 + recencyScore;
}

async function fetchNotifications() {
  try {
    const response = await axios.get(`${BASE_URL}/notifications`, { headers });
    return response.data;
  } catch (err) {
    console.error("Error fetching notifications:", err.response?.status, err.response?.data || err.message);
    return [];
  }
}

async function getTop10PriorityInbox() {
  console.log("Fetching notifications from:", BASE_URL);
  const notifications = await fetchNotifications();

  if (!notifications || notifications.length === 0) {
    console.log("No notifications found.");
    return;
  }

  console.log(`Total notifications fetched: ${notifications.length}`);

  const minHeap = new MinHeap();
  for (const notif of notifications) {
    const score = calculatePriorityScore(notif);
    minHeap.push({ ...notif, score });
    if (minHeap.size() > 10) minHeap.pop();
  }

  const top10 = [];
  while (minHeap.size() > 0) top10.unshift(minHeap.pop());

  console.log("\n===== TOP 10 PRIORITY INBOX =====");
  top10.forEach((n, i) => {
    console.log(`\n#${i + 1}`);
    console.log(`  ID: ${n.id}`);
    console.log(`  Type: ${n.type}`);
    console.log(`  Message: ${n.message}`);
    console.log(`  Received: ${n.receivedAt}`);
    console.log(`  Priority Score: ${n.score.toFixed(2)}`);
  });
}

getTop10PriorityInbox();
