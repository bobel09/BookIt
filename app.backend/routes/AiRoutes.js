const express = require("express"); // Correct import for express
const router = express.Router();
const { generateItinerary, suggestDestinations } = require("../controllers/AiController");
router.post("/generate-itinerary", generateItinerary);
router.post("/suggest-destinations", suggestDestinations);
module.exports = router;
