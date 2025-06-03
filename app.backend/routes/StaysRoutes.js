const express = require("express");
const router = express.Router();
const StaysController = require("../controllers/StaysController");

router.get("/destinations", StaysController.searchDestination);
router.get("/hotels", StaysController.searchHotels);
router.get("/hotel-details", StaysController.getHotelDetails);

module.exports = router;
