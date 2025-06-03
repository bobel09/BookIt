const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

let citiesData = []; // Use let, not const, to allow reassignment
const csvPath = path.join(__dirname, "../data/cities.csv");

function parseCSV() {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvPath)
      .pipe(csvParser({ separator: ";" }))
      .on("data", (row) => {
        try {
          const name = row["Name"];
          const country = row["Country name EN"];
          const population = parseInt(row["Population"], 10);
          const coordinates = row["Coordinates"];

          if (name && country && population > 10000){
            results.push({ name, country, population, coordinates });
          }
        } catch (err) {
          console.error("Error parsing row:", err);
        }
      })
      .on("end", () => {
        citiesData = results; // Reassign instead of push(...results)
        console.log("CSV parsing complete. Cities loaded:", results.length);
        console.log("First 5 cities:", results.slice(0, 5));
        resolve();
      })
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      });
  });
}

module.exports = { parseCSV, citiesData: () => citiesData };
