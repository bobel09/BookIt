const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TripController = require("../controllers/TripController");

// POST /api/trips - create a new trip
router.post("/", auth, TripController.createTrip);

// GET /api/trips - get all trips for the current user
router.get("/", auth, TripController.getTrips);

// GET /api/trips/:id - get a single trip by id
router.get("/:id", auth, TripController.getTripById);

module.exports = router;
