const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getPopularCities,
  getPopularPlaces,
} = require("../controllers/PlacesController");

router.get("/popular-cities",protect,getPopularCities);
router.get("/popular-places", protect,getPopularPlaces);

module.exports = router;
