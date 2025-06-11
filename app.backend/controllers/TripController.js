const Trip = require("../models/Trip");

// POST /api/trips - create a new trip
exports.createTrip = async (req, res) => {
  try {
    console.log('createTrip req.body:', req.body);
    const trip = new Trip({ ...req.body, userId: req.user.id }); // changed from req.user._id
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error('createTrip error:', err);
    res.status(400).json({ error: err.message });
  }
};

// GET /api/trips - get all trips for the current user
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/trips/:id - get a single trip by id (for the current user)
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
