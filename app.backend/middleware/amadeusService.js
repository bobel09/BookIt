// middleware/amadeusService.js
const fetch = require("node-fetch");

async function getAmadeusAccessToken() {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Failed to get Amadeus token:", err);
    throw new Error("Failed to get Amadeus token");
  }

  const data = await response.json();
  return data.access_token;
}

module.exports = { getAmadeusAccessToken };
