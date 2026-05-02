const axios = require("axios");
require("dotenv").config();

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const BASE_URL = process.env.BASE_URL;

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

async function testAPIs() {
  console.log("=== Testing Vehicle Scheduler APIs ===");
  console.log("Base URL:", BASE_URL);
  console.log("Token:", AUTH_TOKEN ? "Found ✅" : "MISSING ❌\n");

  try {
    console.log("1. Testing /depots ...");
    const depotRes = await axios.get(`${BASE_URL}/depots`, { headers });
    console.log("   SUCCESS! Depots:", depotRes.data.length);
    console.log("   Sample:", JSON.stringify(depotRes.data[0], null, 2));

    const firstDepotId = depotRes.data[0]?.id;
    if (firstDepotId) {
      console.log(`\n2. Testing /depots/${firstDepotId}/vehicles ...`);
      const vRes = await axios.get(`${BASE_URL}/depots/${firstDepotId}/vehicles`, { headers });
      console.log("   SUCCESS! Vehicles:", vRes.data.length);
      console.log("   Sample:", JSON.stringify(vRes.data[0], null, 2));
    }
  } catch (err) {
    console.error("FAILED!", err.response?.status, err.response?.data || err.message);
  }
}

testAPIs();
