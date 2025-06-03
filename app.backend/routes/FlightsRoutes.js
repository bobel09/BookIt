const express = require("express");
const router = express.Router();
const {
  searchAirportsByCity,
  searchFlights,
} = require("../controllers/FlightController");

router.get("/airports", searchAirportsByCity);
router.get("/offers", searchFlights);

module.exports = router;
