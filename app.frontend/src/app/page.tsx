"use client";

import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useRouter } from "next/navigation";

// GeoJSON Data URL
const geoJsonUrl = "/ne_110m_admin_0_countries.geojson";

export default function LandingPage() {
  const [worldData, setWorldData] = useState<
    string | Record<string, any> | string[] | undefined
  >(undefined);
  const [zoomLevel] = useState(1.5);
  const [center] = useState<[number, number]>([0, 20]);
  const [showWelcomeText] = useState(true);
  const router = useRouter();

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
    <Box
      sx={{
        width: "100%",
        minHeight: "120vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Map */}
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
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "#d6d6d6",
                          stroke: "#333",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 0.3s ease",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%)",
            zIndex: 1,
            display: showWelcomeText ? "block" : "none",
          }}
        />
      </Box>

      {showWelcomeText && (
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            textAlign: "center",
            color: "#fff",
            zIndex: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            Welcome to the Itinerary Planner
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: "20px" }}>
            Discover and organize your perfect journey around the world!
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ffcc00",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e6b800" },
            }}
            onClick={() => router.push("/login")}
          >
            Get Started
          </Button>
        </Box>
      )}
    </Box>
  );
}
