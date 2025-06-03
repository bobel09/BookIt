const fetch = require("node-fetch");

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const GOOGLE_API_HOST = "https://maps.googleapis.com/maps/api/place/textsearch/json";

/**
 * Fetch popular cities in a country
 * @param {string} country - The country name
 */
const cityStrategies = [
  "biggest cities in",
  "largest cities in",
  "top cities in",
  "tourist attractions in",
];

const placeStrategies = [
  "popular places in",
  "tourist attractions in",
  "must-see places in",
  "best places to visit in",
  "top sights in",
];

const getCitiesFromQuery = async (query) => {
  const url = `${GOOGLE_API_HOST}?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
  console.log(`Requesting Cities: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const seen = new Set();
      const uniqueCities = [];
      data.results.forEach((place) => {
        const key = place.name + (place.formatted_address || "");
        if (!seen.has(key)) {
          seen.add(key);
          uniqueCities.push({
            name: place.name,
            photoReference: place.photos ? place.photos[0].photo_reference : null,
            address: place.formatted_address,
          });
        }
      });
      return uniqueCities;
    }

    console.warn(`Query "${query}" returned no results or failed.`);
    return [];
  } catch (error) {
    console.error(`Error with query "${query}":`, error);
    return [];
  }
};

const getPlacesFromQuery = async (query) => {
  const url = `${GOOGLE_API_HOST}?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
  console.log(`Requesting Places: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results.map((place) => ({
        name: place.name,
        photoReference: place.photos ? place.photos[0].photo_reference : null,
        address: place.formatted_address,
      }));
    }

    console.warn(`Query "${query}" returned no results or failed.`);
    return [];
  } catch (error) {
    console.error(`Error with query "${query}":`, error);
    return [];
  }
};

/**
 * Fetch popular cities in a country using multiple strategies
 */
const getPopularCities = async (req, res) => {
  const { country } = req.query;

  if (!country) {
    return res.status(400).json({ error: "Country parameter is required" });
  }

  try {
    for (const strategy of cityStrategies) {
      const query = `${strategy} ${country}`;
      const cities = await getCitiesFromQuery(query);

      // Filter out cities where the name matches the country (case-insensitive, trimmed)
      const filteredCities = cities.filter(
        (city) =>
          city.name &&
          city.name.trim().toLowerCase() !== country.trim().toLowerCase()
      );

      if (filteredCities.length > 0) {
        return res.json(filteredCities);
      }
    }

    console.warn(`All strategies failed for ${country}.`);
    return res.status(404).json({ error: "No cities found" });

  } catch (error) {
    console.error("Error fetching popular cities:", error);
    res.status(500).json({ error: "Failed to fetch popular cities" });
  }
};

/**
 * Fetch popular places in a city using multiple strategies
 */
const getPopularPlaces = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  try {
    for (const strategy of placeStrategies) {
      const query = `${strategy} ${city}`;
      const places = await getPlacesFromQuery(query);

      if (places.length > 0) {
        return res.json(places);
      }
    }

    console.warn(`All strategies failed for ${city}.`);
    return res.status(404).json({ error: "No places found" });

  } catch (error) {
    console.error("Error fetching popular places:", error);
    res.status(500).json({ error: "Failed to fetch popular places" });
  }
};

module.exports = {
  getPopularCities,
  getPopularPlaces,
};
