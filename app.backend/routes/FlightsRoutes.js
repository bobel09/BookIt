const express = require("express");
const router = express.Router();
const {
  searchFlightLocation,
  searchFlights,
  getFlightDetails,
} = require("../controllers/FlightController");

router.get("/search-location", searchFlightLocation);
router.get("/offers", searchFlights);
router.get("/details", getFlightDetails);

module.exports = router;
