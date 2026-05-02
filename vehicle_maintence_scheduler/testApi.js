const axios = require("axios");
require("dotenv").config();

const AUTH_TOKEN = process.env.AUTH_TOKEN;
const BASE_URL = "https://backend-staging.mailet.in/fullstack-intern-eval";

const headers = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
};

async function testAPIs() {
  console.log("=== Testing Vehicle Scheduler APIs ===\n");

  try {
    console.log("1. Testing /depots ...");
    const depotRes = await axios.get(`${BASE_URL}/depots`, { headers });
    console.log("   SUCCESS! Depots found:", depotRes.data.length);
    console.log("   Sample depot:", JSON.stringify(depotRes.data[0], null, 2));

    const firstDepotId = depotRes.data[0]?.id;
    if (firstDepotId) {
      console.log(`\n2. Testing /depots/${firstDepotId}/vehicles ...`);
      const vehicleRes = await axios.get(`${BASE_URL}/depots/${firstDepotId}/vehicles`, { headers });
      console.log("   SUCCESS! Vehicles found:", vehicleRes.data.length);
      console.log("   Sample vehicle:", JSON.stringify(vehicleRes.data[0], null, 2));
    }
  } catch (err) {
    console.error("FAILED! Status:", err.response?.status);
    console.error("Error:", err.response?.data || err.message);
  }
}

testAPIs();
