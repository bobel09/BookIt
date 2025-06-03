const express = require("express");
const router = express.Router();
const { citiesData } = require("../utils/parseCitiesCSV");

router.get("/search", (req, res) => {
  const { country, query } = req.query;

  if (!country) {
    return res.status(400).json({ error: "Country parameter is required" });
  }

  const normalizedCountry = country.trim().toLowerCase();
  const normalizedQuery = query?.trim().toLowerCase() || "";

  const cities = citiesData(); 
  if (!Array.isArray(cities)) {
    return res.status(500).json({ error: "Cities data is not available" });
  }

  const matches = cities.filter((city) => {
    const cityCountry = city.country?.toLowerCase() || "";
    const cityName = city.name?.toLowerCase() || "";

    return (
      cityCountry === normalizedCountry &&
      cityName.includes(normalizedQuery)
    );
  });

  matches.sort((a, b) => b.population - a.population);

  res.json(matches.map((c) => c.name));
});

module.exports = router;
