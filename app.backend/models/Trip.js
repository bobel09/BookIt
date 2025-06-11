const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true }, 
  city: { type: String, required: true },
  country: { type: String, required: true },
  dateFrom: { type: String, required: true }, 
  dateTo: { type: String, required: true },
  adults: { type: Number, required: true },
  fromAirport: { type: String },
  toAirport: { type: String },
  extraPreferences: { type: String },
  includeFlights: { type: Boolean, required: true },
  includeStays: { type: Boolean, required: true },
  selectedFlight: { type: mongoose.Schema.Types.Mixed }, // FlightOffer object (vezi shared/types/flightDetails.ts)
  selectedStay: { type: mongoose.Schema.Types.Mixed },   // StayHotel object (poți crea un shared/types/stayHotel.ts pentru tipizare)
  stayBookingUrl: { type: String },
  itinerary: { type: Array, required: true }, // array of DayPlan
  status: { type: String, enum: ["draft", "active", "archived", "deleted"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", TripSchema);
