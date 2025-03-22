"use client";

import { Box, Typography } from "@mui/material";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const geoJsonUrl = "/ne_110m_admin_0_countries.geojson";

export default function WelcomePage() {
  const [worldData, setWorldData] = useState<
    string | Record<string, any> | string[] | undefined
  >(undefined);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredCountryKey, setHoveredCountryKey] = useState<string | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [zoomLevel] = useState(1.5);
  const [center] = useState<[number, number]>([0, 20]);

  const visitedCountries = [
    "United States of America",
    "Spain",
    "Hungary",
    "Greece",
    "Germany",
    "Croatia",
    "Bulgaria",
    "Italy",
    "North Macedonia",
    "Turkey",
    "Egypt",
  ];

  // Fetch GeoJSON Data
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(geoJsonUrl);
      const data = await response.json();
      setWorldData(data);
    };

    fetchData();
  }, []);

  if (!worldData) return <Typography>Loading map...</Typography>;

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      <Navbar />

      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box
          sx={{
            width: "200px",
            padding: "20px",
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "8px",
            margin: "20px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            Legend
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
          >
            <Box
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: "#4caf50",
                marginRight: "10px",
              }}
            />
            Selected Country
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
          >
            <Box
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: "#007bff",
                marginRight: "10px",
              }}
            />
            Visited Country
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: "#d6d6d6",
                marginRight: "10px",
              }}
            />
            Unvisited Country
          </Box>
        </Box>

        {/* Map Section */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <ComposableMap
            projectionConfig={{ scale: 200 }}
            style={{ width: "100%", height: "100%", perspective: "1000px" }}
          >
            <ZoomableGroup
              zoom={zoomLevel}
              center={center}
              minZoom={0.8}
              maxZoom={5}
            >
              <Geographies geography={worldData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isHovered = hoveredCountryKey === geo.rsmKey;
                    const isSelected = selectedCountry === geo.properties.NAME;
                    const isVisited = visitedCountries.includes(
                      geo.properties.NAME
                    );

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          const countryName =
                            geo.properties.NAME || "Unknown Country";
                          setHoveredCountry(countryName);
                          setHoveredCountryKey(geo.rsmKey);
                        }}
                        onMouseLeave={() => {
                          setHoveredCountry(null);
                          setHoveredCountryKey(null);
                        }}
                        onClick={() => {
                          setSelectedCountry(geo.properties.NAME);
                        }}
                        style={{
                          default: {
                            fill: isSelected
                              ? "#4caf50"
                              : isVisited
                              ? "#007bff"
                              : "#d6d6d6",
                            stroke: "#333",
                            strokeWidth: 0.5,
                            outline: "none",
                            transition: "all 0.3s ease",
                          },
                          hover: {
                            fill: "#ffcc00",
                            stroke: "#333",
                            strokeWidth: 1,
                            outline: "none",
                            transform: isHovered ? "scale(1.01)" : "none",
                            boxShadow: isHovered
                              ? "0 16px 32px rgba(0, 0, 0, 0.2)"
                              : "none",
                            transition: "all 0.3s ease",
                          },
                          pressed: {
                            fill: "#ff5722",
                            stroke: "#333",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Hovered Country Info */}
          {hoveredCountry && (
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "8px 16px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "bold",
                zIndex: 1000,
              }}
            >
              {hoveredCountry}
            </Box>
          )}

          {/* Selected Country Info */}
          {selectedCountry && (
            <Box
              sx={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                padding: "8px 16px",
                backgroundColor: "#4caf50",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                zIndex: 2,
              }}
            >
              Selected Country: {selectedCountry}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
