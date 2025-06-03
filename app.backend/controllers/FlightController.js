const { getAmadeusAccessToken } = require("../middleware/amadeusService");
const fetch = require("node-fetch");

const AMADEUS_HOST = "https://test.api.amadeus.com";

exports.searchAirportsByCity = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword || keyword.length < 3 || !/^[a-zA-Z0-9\s]+$/.test(keyword)) {
    return res
      .status(400)
      .json({ error: "Keyword must be at least 3 alphanumeric characters" });
  }

  try {
    const token = await getAmadeusAccessToken();
    const response = await fetch(
      `${AMADEUS_HOST}/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(
        keyword
      )}&page[limit]=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    console.log("Amadeus location API response:", data);
    if (data.errors) {
      console.error("Amadeus location API error:", data.errors);
      return res.status(400).json(data.errors);
    }

    res.json(data.data || []);
  } catch (err) {
    console.error("Airport search failed:", err);
    res.status(500).json({ error: "Failed to fetch airport data" });
  }
};


exports.searchFlights = async (req, res) => {
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    travelClass,
    nonStop,
    currencyCode = "EUR",
  } = req.query;

  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const token = await getAmadeusAccessToken();

    const query = new URLSearchParams({
      originLocationCode: String(originLocationCode),
      destinationLocationCode: String(destinationLocationCode),
      departureDate: String(departureDate),
      ...(returnDate && { returnDate: String(returnDate) }),
      adults: String(adults),
      ...(travelClass && { travelClass }),
      ...(nonStop && { nonStop }),
      currencyCode,
      max: "10",
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${query.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    if (data.errors) {
      console.error("Amadeus API error:", data.errors);
      return res.status(400).json(data.errors);
    }

    res.json(data.data || []);
  } catch (err) {
    console.error("Flight search failed:", err);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
};
