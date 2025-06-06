const fetch = require("node-fetch");

const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com";
const RAPIDAPI_BASE = `https://${RAPIDAPI_HOST}`;

// 1. Search for airport/city suggestions
exports.searchFlightLocation = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword || keyword.length < 3) {
    return res.status(400).json({ error: "Keyword must be at least 3 characters long." });
  }

  try {
    const response = await fetch(
      `${RAPIDAPI_BASE}/api/v1/flights/searchDestination?query=${encodeURIComponent(keyword)}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    const data = await response.json();
    if (!data.status) {
      return res.status(500).json({ error: data.message || "Location search failed." });
    }

    res.json(data.data || []);
  } catch (error) {
    console.error("searchFlightLocation error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 2. Search for flights
exports.searchFlights = async (req, res) => {
  const {
    from,
    to,
    depart,
    returnDate,
    adults,
    cabinClass,
    currency ,
  } = req.query;

  if (!from || !to || !depart) {
    return res.status(400).json({ error: "Missing required query parameters: from, to, depart." });
  }

  try {
    const queryParams = new URLSearchParams({
      fromId: from,
      toId: to,
      departDate: depart,
      type: returnDate ? "ROUNDTRIP" : "ONEWAY",
      returnDate: returnDate || "",
      adults: String(adults),
      cabinClass,
      currency_code: currency || "USD",
    });

    const response = await fetch(
      `${RAPIDAPI_BASE}/api/v1/flights/searchFlights?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    const data = await response.json();
    console.log("searchFlights response:", data);
    if (!data.status) {
      return res.status(500).json({ error: data.message || "Flight search failed." });
    }

    res.json(data.data);
  } catch (error) {
    console.error("searchFlights error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// 3. Get full flight details using token
exports.getFlightDetails = async (req, res) => {
  const { token, currency } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing required query parameter: token." });
  }

  try {
    const response = await fetch(
      `${RAPIDAPI_BASE}/api/v1/flights/getFlightDetails?token=${encodeURIComponent(token)}&currency=${encodeURIComponent(currency || "USD")}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    const data = await response.json();
    if (!data.status) {
      return res.status(500).json({ error: data.message || "Failed to get flight details." });
    }

    res.json(data.data);
  } catch (error) {
    console.error("getFlightDetails error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
