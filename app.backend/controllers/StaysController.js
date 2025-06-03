const fetch = require("node-fetch");

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = "booking-com15.p.rapidapi.com";
const BASE_URL = `https://${RAPID_API_HOST}`;

// Search destinations
exports.searchDestination = async (req, res) => {
  const { query } = req.query;
  try {
    const url = `${BASE_URL}/api/v1/hotels/searchDestination?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to search destination", details: err.message });
  }
};

// Search hotels
exports.searchHotels = async (req, res) => {
  const { dest_id, checkin_date, checkout_date, adults, room_qty } = req.query;
  try {
    const params = new URLSearchParams({
      dest_id,
      checkin_date,
      checkout_date,
      adults_number: adults,
      room_qty,
    });
    const url = `${BASE_URL}/api/v1/hotels/searchHotels?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to search hotels", details: err.message });
  }
};

// Get hotel details
exports.getHotelDetails = async (req, res) => {
  const { hotel_id } = req.query;
  try {
    const url = `${BASE_URL}/api/v1/hotels/getHotelDetails?hotel_id=${encodeURIComponent(hotel_id)}`;
    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to get hotel details", details: err.message });
  }
};
