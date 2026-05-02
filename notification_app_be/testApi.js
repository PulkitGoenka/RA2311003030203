const axios = require("axios");
require("dotenv").config();

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const BASE_URL = "https://backend-staging.mailet.in/fullstack-intern-eval";

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

async function testAPI() {
  console.log("Testing Notification API...\n");
  try {
    const res = await axios.get(`${BASE_URL}/notifications`, { headers });
    console.log("SUCCESS! Status:", res.status);
    console.log("Total notifications:", res.data.length);
    console.log("Sample (first item):", JSON.stringify(res.data[0], null, 2));
  } catch (err) {
    console.error("FAILED! Status:", err.response?.status);
    console.error("Error:", err.response?.data || err.message);
  }
}

testAPI();
