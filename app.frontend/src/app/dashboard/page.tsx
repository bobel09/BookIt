"use client";

import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import { ALL_COUNTRIES_NAMES } from "../../components/profilePage/EditVisitedCountries";

const geoJsonUrl = "/ne_110m_admin_0_countries.geojson";

export default function WelcomePage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [worldData, setWorldData] = useState<any>(undefined);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredCountryKey, setHoveredCountryKey] = useState<string | null>(
    null
  );
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [zoomLevel] = useState(2);
  const [center] = useState<[number, number]>([0, 20]);
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(geoJsonUrl);
      const data = await response.json();
      setWorldData(data);
    };
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSearchChange = (
    event: React.ChangeEvent<object>,
    value: string | null
  ) => {
    setSearchValue(value);
    if (value) {
      const country = ALL_COUNTRIES_NAMES.find(
        (country) => country.toLowerCase() === value.toLowerCase()
      );
      if (country) {
        setSelectedCountry(country);
      } else {
        setSelectedCountry(null);
      }
    } else {
      setSelectedCountry(null);
    }
  };
  if (!worldData) return <Typography>Loading map...</Typography>;

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError || !user) {
    localStorage.removeItem("token");
    return <Typography>Error loading profile</Typography>;
  }

  const visitedCountries = user.visitedCountries || [];

  return (
    <>
      <Navbar username={user.username} />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          position: "relative",
          background:
            "linear-gradient(120deg, #232526 0%, #1e1e1e 60%, #101010 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "75%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
              mb: 2,
              py: 4,
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              transition:
                "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                transform: "scale(1.025)",
                boxShadow: "0 8px 36px 0 rgba(0,0,0,0.12)",
                cursor: "pointer",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: { xs: "2.2rem", md: "2.8rem" },
                fontWeight: 800,
                color: "#232526",
                letterSpacing: 1,
                mb: 1,
                textAlign: "center",
                textShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              Where to Next?
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: { xs: "1rem", md: "1.2rem" },
                color: "#666",
                fontWeight: 400,
                textAlign: "center",
                letterSpacing: 0.5,
                mt: 0.5,
                mb: 3,
              }}
            >
              Explore the world. Plan your next adventure.
            </Typography>
            <Autocomplete
              options={ALL_COUNTRIES_NAMES}
              value={searchValue}
              onChange={handleSearchChange}
              sx={{
                width: "100%",
                maxWidth: 500,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  background: "#f7f7f7",
                  boxShadow: "none",
                  paddingLeft: "8px",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  "& fieldset": { borderColor: "#e0e0e0" },
                  "&:hover fieldset": { borderColor: "#007bff" },
                  "&.Mui-focused fieldset": { borderColor: "#232526" },
                  "& input": {
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "1.1rem",
                  },
                },
                "& .MuiInputAdornment-root": {
                  marginLeft: "8px",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label=""
                  placeholder={
                    selectedCountry
                      ? `Selected: ${selectedCountry}`
                      : "Search for a country..."
                  }
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: 8,
                            color: "#007bff",
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="11"
                              cy="11"
                              r="7"
                              stroke="#007bff"
                              strokeWidth="2"
                            />
                            <path
                              d="M20 20L16.65 16.65"
                              stroke="#007bff"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      background: "#f7f7f7",
                      boxShadow: "none",
                      "& fieldset": { borderColor: "#e0e0e0" },
                      "&:hover fieldset": { borderColor: "#007bff" },
                      "&.Mui-focused fieldset": { borderColor: "#232526" },
                    },
                  }}
                />
              )}
            />
            {selectedCountry && (
              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 32px",
                    backgroundColor: "yellow  ",
                    color: "black",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: "50px",
                    boxShadow: "0 4px 16px rgba(0, 123, 255, 0.3)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "gray",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 24px rgba(0, 123, 255, 0.4)",
                    },
                  }}
                  onClick={() => {
                    router.push(`/popular-places?country=${selectedCountry}`);
                  }}
                >
                  🚀 Make it Happen
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", height: "50%", marginTop: "20px" }}>
          {/* Map Section */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <ComposableMap
              projectionConfig={{ scale: 200 }}
              style={{
                width: "90%",
                height: "500px",
                borderRadius: "20px",
                border: "1px solid rgb(60, 60, 59)",
                backgroundColor: "#f0f0f0",
              }}
            >
              <ZoomableGroup
                zoom={zoomLevel}
                center={center}
                minZoom={2}
                maxZoom={5}
              >
                <Geographies geography={worldData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const isHovered = hoveredCountryKey === geo.rsmKey;
                      const isSelected =
                        selectedCountry === geo.properties.NAME;
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
                            setSearchValue(geo.properties.NAME);
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
                              transform: isHovered ? "scale(1.00099)" : "none",
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

            {hoveredCountry && (
              <Box
                sx={{
                  position: "absolute",
                  top: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "6px 14px",
                  fontSize: "14px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "#fff",
                  borderRadius: "8px",
                  fontWeight: 500,
                  zIndex: 1000,
                }}
              >
                {hoveredCountry}
              </Box>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            py: 2,
            mt: 20,
            color: "black",
            textAlign: "center",
            fontSize: "1rem",
            letterSpacing: 0.5,
            left: 0,
            bottom: 0,
            zIndex: 1200,
          }}
        >
          &copy; {new Date().getFullYear()} Book It. All rights reserved.
        </Box>
      </Box>
    </>
  );
}
