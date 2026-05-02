const axios = require("axios");
require("dotenv").config();

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const BASE_URL = process.env.BASE_URL;

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

async function testAPI() {
  console.log("Testing Notification API...");
  console.log("URL:", `${BASE_URL}/notifications`);
  console.log("Token:", AUTH_TOKEN ? "Found ✅" : "MISSING ❌");
  try {
    const res = await axios.get(`${BASE_URL}/notifications`, { headers });
    console.log("\nSUCCESS! Status:", res.status);
    console.log("Total notifications:", res.data.length);
    console.log("Sample:", JSON.stringify(res.data[0], null, 2));
  } catch (err) {
    console.error("\nFAILED! Status:", err.response?.status);
    console.error("Error:", err.response?.data || err.message);
  }
}

testAPI();
