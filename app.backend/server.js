const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const fetch = require("node-fetch");
const { parseCSV } = require("./utils/parseCitiesCSV");
const TripsRoutes = require("./routes/TripsRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use("/api/users", require("./routes/UserRoutes"));
app.use("/api/places", require("./routes/PlacesRoutes"));
app.use("/api/cities", require("./routes/CitiesRoutes"));
app.use("/api/flights", require("./routes/FlightsRoutes"));
app.use("/api/stays", require("./routes/StaysRoutes"));
app.use("/api/itinerary", require("./routes/AiRoutes"));
app.use("/api/trips", TripsRoutes);

// Load cities before starting the server
parseCSV().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
