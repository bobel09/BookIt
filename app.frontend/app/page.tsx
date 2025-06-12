"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  let mapScale = 500; // default for mobile
  if (isTablet) mapScale = 300;
  if (isDesktop) mapScale = 225;

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
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "120vh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "black",
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
            projectionConfig={{ scale: mapScale }}
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
              top: { xs: "10%", sm: "15%" },
              left: "50%",
              transform: "translate(-50%, -30%)",
              textAlign: "center",
              color: "#fff",
              zIndex: 2,
              width: { xs: "90%", sm: "auto" },
              px: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                marginBottom: "20px",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.1,
              }}
            >
              Welcome to BookIt
            </Typography>
            <Typography
              variant="h6"
              style={{ wordWrap: "break-word" }}
              sx={{
                marginBottom: "20px",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Don&apos;t hesitate no more and just BookIt!!!
              <br /> Your perfect itinerary is just a few clicks away.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ffcc00",
                color: "#000",
                fontWeight: "bold",
                fontSize: { xs: "1rem", sm: "1.1rem" },
                px: { xs: 3, sm: 5 },
                py: { xs: 1, sm: 1.5 },
                "&:hover": { backgroundColor: "#e6b800" },
              }}
              onClick={() => router.push("/login")}
            >
              Get Started
            </Button>
          </Box>
        )}

        {/* What We Offer Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1300,
            mx: "auto",
            mt: { xs: 8, md: 20 },
            mb: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 3,
            position: "relative",
            px: { xs: 1, sm: 2, md: 0 },
          }}
        >
          <Typography
            sx={{
              color: "#FFD700",
              fontWeight: 600,
              fontSize: { xs: "1rem", md: "1.1rem" },
              letterSpacing: 1.5,
              mb: 1,
              textTransform: "lowercase",
            }}
          >
            what we do
          </Typography>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: "1.3rem", sm: "2.1rem", md: "2.7rem" },
              color: "white",
              mb: 5,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            WE PROVIDE THE FOLLOWING SERVICES
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              width: "100%",
              height: { xs: "auto", md: "300px" },
              justifyContent: "center",
              alignItems: "stretch",
            }}
          >
            {/* Card 1 */}
            <Box
              sx={{
                flex: 1,
                background: "#fff",
                borderRadius: "18px",
                boxShadow: "0 4px 24px rgba(255,215,0,0.08)",
                p: { xs: 2, sm: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition:
                  "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)",
                border: "2px solid transparent",
                mb: { xs: 3, md: 0 },
                "&:hover": {
                  transform: "scale(1.025)",
                  boxShadow: "0 8px 36px 0 #FFD70033",
                  borderColor: "#FFD700",
                  cursor: "pointer",
                },
                minWidth: { xs: "90vw", sm: 260, md: 0 },
                maxWidth: { xs: "100%", md: "none" },
              }}
            >
              {/* Icon */}
              <Box sx={{ mb: 2 }}>
                <svg
                  width="40"
                  height="40"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 48 48"
                >
                  <rect x="8" y="16" width="32" height="24" rx="4" />
                  <path d="M8 24h32" />
                  <rect x="16" y="8" width="16" height="8" rx="2" />
                </svg>
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.05rem", sm: "1.25rem" },
                  color: "#232526",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Personalized Itinerary Planning
              </Typography>
              <Typography
                sx={{
                  color: "#888",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Custom travel plans, day-by-day activities, and local tips
                tailored to your interests.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <svg
                  width="30"
                  height="30"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 36 36"
                >
                  <circle cx="18" cy="18" r="15" />
                  <text
                    x="18"
                    y="24"
                    textAnchor="middle"
                    fontSize="24"
                    fill="#FFD700"
                  >
                    +
                  </text>
                </svg>
              </Box>
            </Box>
            {/* Card 2 */}
            <Box
              sx={{
                flex: 1,
                background: "#fafafa",
                borderRadius: "18px",
                boxShadow: "0 4px 24px rgba(255,215,0,0.08)",
                p: { xs: 2, sm: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "2px solid transparent",
                transition:
                  "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  transform: "scale(1.025)",
                  boxShadow: "0 8px 36px 0 #FFD70033",
                  borderColor: "#FFD700",
                  cursor: "pointer",
                },
                minWidth: { xs: "90vw", sm: 260, md: 0 },
                maxWidth: { xs: "100%", md: "none" },
                mb: { xs: 3, md: 0 },
              }}
            >
              <Box sx={{ mb: 2 }}>
                <svg
                  width="40"
                  height="40"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 48 48"
                >
                  <rect x="12" y="12" width="24" height="24" rx="6" />
                  <path d="M24 12v24" />
                  <path d="M12 24h24" />
                </svg>
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.05rem", sm: "1.25rem" },
                  color: "#232526",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Smart Flight & Hotel Search
              </Typography>
              <Typography
                sx={{
                  color: "#888",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Find the best flights and stays, compare prices, and book with
                confidence.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <svg
                  width="30"
                  height="30"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 36 36"
                >
                  <circle cx="18" cy="18" r="15" />
                  <text
                    x="18"
                    y="24"
                    textAnchor="middle"
                    fontSize="24"
                    fill="#FFD700"
                  >
                    +
                  </text>
                </svg>
              </Box>
            </Box>
            {/* Card 3 */}
            <Box
              sx={{
                flex: 1,
                background: "#fff",
                borderRadius: "18px",
                boxShadow: "0 4px 24px rgba(255,215,0,0.08)",
                p: { xs: 2, sm: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "2px solid transparent",
                transition:
                  "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  transform: "scale(1.025)",
                  boxShadow: "0 8px 36px 0 #FFD70033",
                  borderColor: "#FFD700",
                  cursor: "pointer",
                },
                minWidth: { xs: "90vw", sm: 260, md: 0 },
                maxWidth: { xs: "100%", md: "none" },
              }}
            >
              <Box sx={{ mb: 2 }}>
                <svg
                  width="40"
                  height="40"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 48 48"
                >
                  <path d="M24 8v32" />
                  <rect x="12" y="24" width="24" height="12" rx="4" />
                  <rect x="18" y="12" width="12" height="8" rx="2" />
                </svg>
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.05rem", sm: "1.25rem" },
                  color: "#232526",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Explore & Discover Destinations
              </Typography>
              <Typography
                sx={{
                  color: "#888",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Get inspired by trending places, curated lists, and AI-powered
                suggestions.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <svg
                  width="30"
                  height="30"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 36 36"
                >
                  <circle cx="18" cy="18" r="15" />
                  <text
                    x="18"
                    y="24"
                    textAnchor="middle"
                    fontSize="24"
                    fill="#FFD700"
                  >
                    +
                  </text>
                </svg>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: { xs: 8, md: 15 }, mb: 6, textAlign: "center" }}>
          {/* How To Use Section */}
          <Typography
            sx={{
              color: "#FFD700",
              fontWeight: 700,
              fontSize: { xs: "1rem", md: "1.15rem" },
              letterSpacing: 1.5,
              mb: 1.5,
            }}
          >
            how to use
          </Typography>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: "1.2rem", sm: "1.7rem", md: "2.2rem" },
              color: "white",
              mb: 4,
              textAlign: "center",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Get Started in 3 Easy Steps
          </Typography>
        </Box>
        {/* Steps Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1300,
            mx: "auto",
            mb: 12,
            mt: { xs: 4, md: 8 },
            p: { xs: 1, sm: 2, md: 5 },
            background: "#fff",
            borderRadius: "22px",
            boxShadow: "0 4px 32px 0 rgba(30,30,30,0.10)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "box-shadow 0.3s cubic-bezier(.4,2,.6,1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 3, md: 5 },
              width: "100%",
              justifyContent: "center",
              alignItems: "stretch",
              mt: 1,
            }}
          >
            {/* Step 1 */}
            <Box
              sx={{
                flex: 1,
                background: "#fafafa",
                borderRadius: "16px",
                p: { xs: 2, sm: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 2px 12px #FFD70022",
                border: "2px solid #FFD70022",
                minWidth: 180,
                minHeight: 180,
                transition:
                  "transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.03)",
                  boxShadow: "0 8px 36px 0 #FFD70033",
                  borderColor: "#FFD700",
                },
                mb: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ mb: 1 }}>
                <svg
                  width="32"
                  height="32"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 36 36"
                >
                  <circle cx="18" cy="18" r="16" />
                  <text
                    x="18"
                    y="25"
                    textAnchor="middle"
                    fontSize="20"
                    fill="#FFD700"
                  >
                    1
                  </text>
                </svg>
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.13rem" },
                  color: "#232526",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Create an Account or Login
              </Typography>
              <Typography
                sx={{
                  color: "#888",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Sign up or log in to start planning your next adventure.
              </Typography>
            </Box>
            {/* Step 2 */}
            <Box
              sx={{
                flex: 1,
                background: "#fafafa",
                borderRadius: "16px",
                p: { xs: 2, sm: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 2px 12px #FFD70022",
                border: "2px solid #FFD70022",
                minWidth: 180,
                minHeight: 180,
                transition:
                  "transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.03)",
                  boxShadow: "0 8px 36px 0 #FFD70033",
                  borderColor: "#FFD700",
                },
                mb: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ mb: 1 }}>
                <svg
                  width="32"
                  height="32"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 36 36"
                >
                  <circle cx="18" cy="18" r="16" />
                  <text
                    x="18"
                    y="25"
                    textAnchor="middle"
                    fontSize="20"
                    fill="#FFD700"
                  >
                    2
                  </text>
                </svg>
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.13rem" },
                  color: "#232526",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Set Your Preferences
              </Typography>
              <Typography
                sx={{
                  color: "#888",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Choose your travel style, interests, and wishlist destinations.
              </Typography>
            </Box>
            {/* Step 3 */}
            <Box
              sx={{
                flex: 1,
                background: "#fafafa",
                borderRadius: "16px",
                p: { xs: 2, sm: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 2px 12px #FFD70022",
                border: "2px solid #FFD70022",
                minWidth: 180,
                minHeight: 180,
                transition:
                  "transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.03)",
                  boxShadow: "0 8px 36px 0 #FFD70033",
                  borderColor: "#FFD700",
                },
              }}
            >
              <Box sx={{ mb: 1 }}>
                <svg
                  width="32"
                  height="32"
                  style={{ maxWidth: "100%" }}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="2.2"
                  viewBox="0 0 36 36"
                >
                  <circle cx="18" cy="18" r="16" />
                  <text
                    x="18"
                    y="25"
                    textAnchor="middle"
                    fontSize="20"
                    fill="#FFD700"
                  >
                    3
                  </text>
                </svg>
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1rem", sm: "1.13rem" },
                  color: "#232526",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Plan & Book Instantly
              </Typography>
              <Typography
                sx={{
                  color: "#888",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Use our smart search and AI suggestions to build and book your
                perfect trip.
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* About Us Section */}
        <Box sx={{ mt: { xs: 8, md: 15 }, mb: 6, textAlign: "center" }}>
          <Typography
            sx={{
              color: "#FFD700",
              fontWeight: 700,
              fontSize: { xs: "1rem", md: "1.15rem" },
              letterSpacing: 1.5,
              mb: 1.5,
            }}
          >
            about us
          </Typography>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: "1.1rem", sm: "1.5rem", md: "2rem" },
              color: "white",
              mb: 2,
              textAlign: "center",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Built by Alexiuc Vlad
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            maxWidth: 1300,
            mx: "auto",
            mb: 10,
            mt: 8,
            p: { xs: 1, sm: 2, md: 5 },
            background: "#fff",
            borderRadius: "22px",
            boxShadow: "0 4px 32px 0 rgba(30,30,30,0.10)",
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Typography
            sx={{
              color: "#888",
              fontSize: { xs: "0.98rem", sm: "1.13rem" },
              textAlign: "left",
              mb: 2.5,
              maxWidth: 600,
              lineHeight: 1.7,
            }}
          >
            This project was created by Alexiuc Vlad, a Computer Science student
            passionate about travel and technology. BookIt is a modern,
            minimalist itinerary planner designed to make your adventures
            seamless and inspiring.
          </Typography>
          {/* Contact moved below the about text for better layout */}
          <Box
            sx={{
              mt: { xs: 2, sm: 0 },
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: "#fffbe6",
              borderRadius: "18px",
              boxShadow: "0 2px 8px #FFD70022",
              px: 2.5,
              py: 1,
              border: "1.5px solid #FFD700",
              zIndex: 2,
              width: "fit-content",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "0 4px 16px #FFD70033",
              },
              transition: "box-shadow 0.2s ease",
              fontSize: { xs: "0.9rem", sm: "1.08rem" },
            }}
          >
            <svg
              width="18"
              height="18"
              style={{ maxWidth: "100%" }}
              fill="none"
              stroke="#FFD700"
              strokeWidth="2.1"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 4h16v16H4z"
                fill="#fffbe6"
                stroke="#FFD700"
                strokeWidth="2.1"
              />
              <path d="M4 4l8 8 8-8" stroke="#FFD700" strokeWidth="2.1" />
            </svg>
            <Typography
              sx={{
                color: "#232526",
                fontWeight: 600,
                fontSize: { xs: "0.9rem", sm: "1.08rem" },
                letterSpacing: 0.5,
                userSelect: "all",
              }}
            >
              vlad.alexiuc03@e-uvt.ro
            </Typography>
          </Box>
        </Box>
        {/* Footer */}
        <Footer />
      </Box>
    </>
  );
}
