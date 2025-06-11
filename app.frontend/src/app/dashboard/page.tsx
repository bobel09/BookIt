"use client";

import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
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
import TravelStats from "../../components/TravelStats";
import { useUpdateUserWishlist } from "@/hooks/mutations/updateUserWishlist";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WishlistStats from "@/components/WishlistStats";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useUpdateVisitedCountries } from "@/hooks/mutations/updateUserVisitedCountriesMutation";
import Notification from "@/components/Notification";
import Footer from "@/components/Footer";
import InPageLoader from "@/components/InPageLoader";
import FullPageLoader from "@/components/FullPageLoader";
import AiDestinationSuggestions from "@/components/AiDestinationSuggestions";
import { useTheme, useMediaQuery } from "@mui/material";
import ErrorPage from "../error";

const geoJsonUrl = "/ne_110m_admin_0_countries.geojson";

export default function WelcomePage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [worldData, setWorldData] = useState<any>(undefined);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredCountryKey, setHoveredCountryKey] = useState<string | null>(
    null
  );
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // const [zoomLevel] = useState(2);
  const [center] = useState<[number, number]>([0, 20]);
  const { data: user, isLoading, isError } = useCurrentUser();
  const wishlist = user?.wishlist || [];
  const { mutate: updateWishlist, isPending: wishlistLoading } =
    useUpdateUserWishlist();
  const { mutate: updateVisitedCountries, isPending: visitedLoading } =
    useUpdateVisitedCountries(user?._id || "");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

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
  if (!worldData) return <FullPageLoader text="Loading map..." />;

  if (isLoading) return <FullPageLoader text="Loading profile..." />;
  if (isError || !user) return <ErrorPage />;

  const visitedCountries = user.visitedCountries || [];

  // Responsive map scale and zoom
  let mapScale = 200;
  let initialZoom = 2;
  let maxZoom = 5;
  if (isMobile) {
    mapScale = 300;
    maxZoom = 40;
  } else if (isTablet) {
    mapScale = 380;
    initialZoom = 2;
    maxZoom = 5;
  } else {
    mapScale = 300;
    initialZoom = 2;
    maxZoom = 5;
  }
  let mapWidth = "100%";
  if (!isMobile && !isTablet) mapWidth = "1500px";

  return (
    <>
      <Navbar username={user.username} />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          background:
            "linear-gradient(120deg, #232526 0%, #1e1e1e 60%, #101010 100%)",
          overflowX: "hidden",
        }}
      />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          overflowX: "hidden",
          maxWidth: "100vw",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 1, sm: 2, md: 0 },
            width: "100vw",
            maxWidth: "100vw",
            overflowX: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1500,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: { xs: 2, md: 4 },
              mb: { xs: 1, md: 2 },
              py: { xs: 2, md: 4 },
              background: "#fff",
              borderRadius: { xs: "10px", md: "18px" },
              border: "1.5px solid #ececec",
              boxShadow: "0 2px 12px 0 rgba(30,30,30,0.06)",
              transition:
                "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)",
              "&:hover": {
                transform: { xs: "none", md: "scale(1.025)" },
                boxShadow: {
                  xs: "0 2px 12px 0 rgba(30,30,30,0.06)",
                  md: "0 8px 36px 0 rgba(0,0,0,0.12)",
                },
                cursor: "pointer",
              },
              overflowX: "hidden",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: { xs: "1.5rem", sm: "2.2rem", md: "2.8rem" },
                fontWeight: 800,
                color: "#232526",
                letterSpacing: 1,
                mb: 1.2,
                textAlign: "center",
                textShadow: "0 2px 8px rgba(0,0,0,0.04)",
                lineHeight: 1.18,
              }}
            >
              Where to{" "}
              <Box component="span" sx={{ color: "#FFD700", fontWeight: 900 }}>
                Next?
              </Box>
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: { xs: "0.98rem", sm: "1.08rem", md: "1.18rem" },
                color: "#6c6c6c",
                fontWeight: 400,
                textAlign: "center",
                letterSpacing: 0.5,
                mt: 0.5,
                mb: { xs: 2, md: 3.2 },
                lineHeight: 1.6,
                maxWidth: 520,
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
                minWidth: { xs: 0, sm: 220 },
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
                    fontSize: { xs: "0.98rem", sm: "1.1rem" },
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
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
                      color: "#232526",
                      fontWeight: 700,
                      fontSize: "1rem",
                      borderRadius: "30px",
                      px: 3,
                      boxShadow: "0 2px 8px #ffe06655",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
                      },
                    }}
                    onClick={() =>
                      router.push(`/popular-places?country=${selectedCountry}`)
                    }
                  >
                    🚀 Make it Happen
                  </Button>
                  <IconButton
                    aria-label={
                      wishlist.includes(selectedCountry)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    onClick={() => {
                      if (wishlist.includes(selectedCountry)) {
                        updateWishlist(
                          {
                            userId: user._id,
                            wishlist: wishlist.filter(
                              (c: string) => c !== selectedCountry
                            ),
                          },
                          {
                            onSuccess: () =>
                              setSnackbar({
                                open: true,
                                message: `Removed from wishlist!`,
                                severity: "success",
                              }),
                            onError: () =>
                              setSnackbar({
                                open: true,
                                message: `Failed to update wishlist.`,
                                severity: "error",
                              }),
                          }
                        );
                      } else {
                        if (visitedCountries.includes(selectedCountry)) {
                          setSnackbar({
                            open: true,
                            message:
                              "You can't wishlist a country you've already visited!",
                            severity: "error",
                          });
                          return;
                        }
                        updateWishlist(
                          {
                            userId: user._id,
                            wishlist: [...wishlist, selectedCountry],
                          },
                          {
                            onSuccess: () =>
                              setSnackbar({
                                open: true,
                                message: `Added to wishlist!`,
                                severity: "success",
                              }),
                            onError: () =>
                              setSnackbar({
                                open: true,
                                message: `Failed to update wishlist.`,
                                severity: "error",
                              }),
                          }
                        );
                      }
                    }}
                    disabled={wishlistLoading}
                    sx={{
                      background: wishlist.includes(selectedCountry)
                        ? "#ffeaea"
                        : "#fffbe6",
                      color: wishlist.includes(selectedCountry)
                        ? "#d32f2f"
                        : "#d32f2f",
                      borderRadius: "50%",
                      boxShadow: wishlist.includes(selectedCountry)
                        ? "0 2px 8px #ffb3b3"
                        : "0 2px 8px #ffe06655",
                      border: wishlist.includes(selectedCountry)
                        ? "2px solid #d32f2f"
                        : "2px solid #ffd700",
                      ml: 1,
                      "&:hover": {
                        background: wishlist.includes(selectedCountry)
                          ? "#ffd6d6"
                          : "#ffe066",
                      },
                    }}
                  >
                    {wishlist.includes(selectedCountry) ? (
                      <FavoriteIcon fontSize="medium" />
                    ) : (
                      <FavoriteBorderIcon fontSize="medium" />
                    )}
                  </IconButton>
                  <IconButton
                    aria-label={
                      visitedCountries.includes(selectedCountry)
                        ? "Remove from visited"
                        : "Mark as visited"
                    }
                    onClick={() => {
                      if (visitedCountries.includes(selectedCountry)) {
                        // Remove from visited
                        updateVisitedCountries(
                          visitedCountries.filter(
                            (c: string) => c !== selectedCountry
                          ),
                          {
                            onSuccess: () =>
                              setSnackbar({
                                open: true,
                                message: `Removed from visited!`,
                                severity: "success",
                              }),
                            onError: () =>
                              setSnackbar({
                                open: true,
                                message: `Failed to update visited countries.`,
                                severity: "error",
                              }),
                          }
                        );
                      } else {
                        if (wishlist.includes(selectedCountry)) {
                          setSnackbar({
                            open: true,
                            message:
                              "You can't mark as visited a country that's in your wishlist!",
                            severity: "error",
                          });
                          return;
                        }
                        updateVisitedCountries(
                          [...visitedCountries, selectedCountry],
                          {
                            onSuccess: () =>
                              setSnackbar({
                                open: true,
                                message: `Marked as visited!`,
                                severity: "success",
                              }),
                            onError: () =>
                              setSnackbar({
                                open: true,
                                message: `Failed to update visited countries.`,
                                severity: "error",
                              }),
                          }
                        );
                      }
                    }}
                    disabled={visitedLoading}
                    sx={{
                      background: visitedCountries.includes(selectedCountry)
                        ? "#e0f7fa"
                        : "#f7ffe6",
                      color: visitedCountries.includes(selectedCountry)
                        ? "#007bff"
                        : "#007bff",
                      borderRadius: "50%",
                      boxShadow: visitedCountries.includes(selectedCountry)
                        ? "0 2px 8px #b3e5fc"
                        : "0 2px 8px #e0ffb3",
                      border: visitedCountries.includes(selectedCountry)
                        ? "2px solid #007bff"
                        : "2px solid #4caf50",
                      ml: 1,
                      "&:hover": {
                        background: visitedCountries.includes(selectedCountry)
                          ? "#b3e5fc"
                          : "#e0ffb3",
                      },
                    }}
                  >
                    <CheckCircleIcon fontSize="medium" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    mt: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: wishlist.includes(selectedCountry)
                        ? "#d32f2f"
                        : "#888",
                    }}
                  >
                    {wishlist.includes(selectedCountry)
                      ? "In your wishlist"
                      : "Add to wishlist"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: visitedCountries.includes(selectedCountry)
                        ? "#007bff"
                        : "#888",
                    }}
                  >
                    {visitedCountries.includes(selectedCountry)
                      ? "Visited"
                      : "Mark as visited"}
                  </Typography>
                </Box>
              </Box>
            )}
            <Notification
              open={snackbar.open}
              message={snackbar.message}
              severity={snackbar.severity}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            height: { xs: "auto", md: "50%" },
            marginTop: { xs: 2, md: "20px" },
            width: "100vw",
            maxWidth: "100vw",
            overflowX: "hidden",
          }}
        >
          {/* Map Section */}
          <Box
            sx={{
              flex: 1,
              position: "relative",
              justifyContent: "center",
              display: "flex",
              width: "100vw",
              maxWidth: "100vw",
              overflowX: "auto",
            }}
          >
            <ComposableMap
              projectionConfig={{ scale: mapScale }}
              style={{
                width: mapWidth,
                maxWidth: "100vw",
                height: "350px",
                borderRadius: "20px",
                border: "1px solid rgb(60, 60, 59)",
                backgroundColor: "#f0f0f0",
              }}
            >
              <ZoomableGroup
                zoom={initialZoom}
                center={center}
                minZoom={2}
                maxZoom={maxZoom}
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
                      const isWishlisted = wishlist.includes(
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
                                : isWishlisted
                                ? "#d32f2f"
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
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1500,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4,
            }}
          >
            <TravelStats visitedCountries={visitedCountries} />
            <WishlistStats wishlist={wishlist} />
          </Box>
        </Box>
        <AiDestinationSuggestions />
        <Footer />
      </Box>
    </>
  );
}
