"use client";

import React, { useState, Suspense } from "react";
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { usePopularCities } from "@/hooks/querys/usePopularCities";
import { usePopularPlaces } from "@/hooks/querys/usePopularPlaces";
import Image from "next/image";
import { useCitySearch } from "@/hooks/querys/useCitySearch";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import { useRouter } from "next/navigation";
import FullPageLoader from "@/components/FullPageLoader";
import InPageLoader from "@/components/InPageLoader";
import ErrorPage from "../error";
import SearchCountryParamHandler from "./SearchCountryParamHandler";
import Navbar from "@/components/Navbar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface City {
  name: string;
  photoReference?: string;
}

interface Place {
  name: string;
  address: string;
}

const PopularPlacesPage = () => {
  const [country, setCountry] = useState("France");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchedCity, setSearchedCity] = useState<City | null>(null);
  const { data: user, isLoading: userLoading, isError } = useCurrentUser();
  const router = useRouter();

  const { data: cities, isLoading: loadingCities } = usePopularCities(country);

  const {
    data: places,
    isLoading: loadingPlaces,
    refetch: refetchPlaces,
  } = usePopularPlaces(selectedCity ?? "");

  const citiesSearch = useCitySearch({
    country,
    query: inputValue,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearchCity = (_event: any, value: string | null) => {
    setSearchCity(value ?? "");
    if (value) {
      const found = cities?.find((c: City) => c.name === value);
      setExpandedCity(value);
      setSelectedCity(value);
      refetchPlaces();
      setSearchedCity(
        found
          ? { name: found.name, photoReference: found.photoReference }
          : { name: value }
      );
    }
  };

  // Only select card on click, don't expand
  const handleSelectCityCard = (city: string) => {
    setSelectedCity(city);
    // Store photoReference for the selected city
    const found = cities?.find((c: City) => c.name === city);
    setSearchedCity(
      found
        ? { name: found.name, photoReference: found.photoReference }
        : { name: city }
    );
    refetchPlaces();
  };

  const displayedCities: City[] = searchedCity
    ? [
        searchedCity,
        ...(cities
          ? cities
              .filter((c: { name: string }) => c.name !== searchedCity.name)
              .slice(0, 5)
          : []),
      ]
    : cities?.slice(0, 5) || [];

  if (userLoading) return <FullPageLoader text="Loading profile..." />;
  if (isError || !user) return <ErrorPage />;

  return (
    <>
      <Suspense fallback={null}>
        <SearchCountryParamHandler
          setCountry={setCountry}
          defaultCountry="France"
        />
      </Suspense>
      <Navbar username={user.username} />
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          minHeight: "100vh",
          background:
            "linear-gradient(120deg, #232526 0%, #1e1e1e 60%, #101010 100%)",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
            mt: 2,
            mx: "auto",
            maxWidth: 1400,
            background: "#fff",
            borderRadius: "18px",
            boxShadow: "0 2px 12px 0 rgba(30,30,30,0.07)",
            border: "1.5px solid #ececec",
            p: { xs: 2, sm: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#232526",
              mb: 1.5,
              letterSpacing: 0.5,
              fontFamily: "Inter, Roboto, Arial, sans-serif",
              lineHeight: 1.18,
              textShadow: "0 2px 12px rgba(30,30,30,0.04)",
              fontSize: { xs: "2.1rem", sm: "2.6rem", md: "2.9rem" },
            }}
          >
            Discover the Best of
            <Box
              component="span"
              sx={{ color: "#FFD700", fontWeight: 900, ml: 1 }}
            >
              {country}
            </Box>
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#6c6c6c",
              mb: 3,
              maxWidth: "600px",
              margin: "0 auto",
              fontWeight: 400,
              fontSize: { xs: "1.05rem", sm: "1.13rem" },
              lineHeight: 1.6,
              letterSpacing: 0.01,
            }}
          >
            Explore the most popular cities and attractions in {country}. Select
            a city to see the top destinations and hidden gems.
          </Typography>
          <Autocomplete
            options={citiesSearch.data || []}
            value={searchCity}
            inputValue={inputValue}
            onInputChange={(_, newValue) => setInputValue(newValue)}
            onChange={handleSearchCity}
            loading={citiesSearch.isLoading}
            loadingText="Searching cities..."
            noOptionsText="No cities found"
            sx={{
              width: "100%",
              maxWidth: 420,
              mx: "auto",
              background: "#f7f7f7",
              borderRadius: "16px",
              boxShadow: "0 2px 12px 0 rgba(30,30,30,0.06)",
              border: "1.5px solid #e0e0e0",
              transition: "box-shadow 0.2s, border-color 0.2s",
              "&:hover": {
                boxShadow: "0 4px 24px 0 rgba(255,215,0,0.10)",
                borderColor: "#FFD700",
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for another city"
                variant="outlined"
                size="medium"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: 8,
                        color: "#FFD700",
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="11"
                          cy="11"
                          r="7"
                          stroke="#FFD700"
                          strokeWidth="2"
                        />
                        <path
                          d="M20 20L16.65 16.65"
                          stroke="#FFD700"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  ),
                }}
                sx={{
                  borderRadius: "16px",
                  background: "#f7f7f7",
                  boxShadow: "none",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    background: "#f7f7f7",
                    boxShadow: "none",
                    "& fieldset": { borderColor: "#e0e0e0" },
                    "&:hover fieldset": { borderColor: "#FFD700" },
                    "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                  },
                  "& input": {
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "1.13rem",
                  },
                }}
              />
            )}
          />
        </Box>

        {/* City Cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mx: "auto",
            maxWidth: 1400,
          }}
        >
          {loadingCities ? (
            <InPageLoader text="Loading cities..." />
          ) : (
            displayedCities.map((city: City) => (
              <Box
                key={city.name}
                onClick={() => handleSelectCityCard(city.name)}
                sx={{
                  width: "100%",
                  background:
                    selectedCity === city.name
                      ? "linear-gradient(105deg, #fffbe6 60%, #fff9e3 100%)"
                      : "#fff",
                  borderRadius: { xs: "16px", sm: "22px" },
                  overflow: "hidden",
                  boxShadow:
                    selectedCity === city.name
                      ? "0 8px 32px 0 #FFD70033, 0 1.5px 6px 0 #FFD70022"
                      : "0 2px 8px 0 #e0e0e0",
                  border:
                    selectedCity === city.name
                      ? "2.5px solid #FFD700"
                      : "1.5px solid #e0e0e0",
                  position: "relative",
                  minHeight: { xs: 120, sm: 180 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition:
                    "transform 0.22s, box-shadow 0.22s, background 0.22s, border 0.22s",
                  "&:hover":
                    selectedCity === city.name
                      ? {
                          transform: "scale(1.018)",
                          boxShadow: "0 8px 32px 0 #FFD70044",
                          borderColor: "#FFD700",
                          background:
                            "linear-gradient(105deg, #fffbe6 60%, #fff9e3 100%)",
                        }
                      : {
                          transform: "scale(1.018)",
                          boxShadow: "0 8px 32px 0 #FFD70044",
                        },
                  p: { xs: 1, sm: 0 },
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "stretch", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 1.5, sm: 2 },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "200px" },
                      height: { xs: 140, sm: 150 },
                      mb: { xs: 1.5, sm: 0 },
                      overflow: "hidden",
                      borderRadius: { xs: "14px", sm: "18px" },
                      position: "relative",
                      flexShrink: 0,
                      background: "#f7f7f7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        selectedCity === city.name
                          ? "0 2px 12px 0 #FFD70033"
                          : "none",
                      border:
                        selectedCity === city.name
                          ? "2px solid #ffe066"
                          : "1px solid #e0e0e0",
                      transition: "border 0.2s, box-shadow 0.2s",
                      mx: { xs: "auto", sm: 0 },
                    }}
                  >
                    {city.photoReference ? (
                      <Image
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${city.photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`}
                        alt={city.name}
                        fill
                        style={{ objectFit: "cover", borderRadius: "18px" }}
                        sizes="200px"
                        priority
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#555",
                          fontSize: "1.1rem",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        {city.name}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      pl: { xs: 0, sm: 3 },
                      pr: { xs: 0, sm: 1 },
                      pt: { xs: 1, sm: 0 },
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      width: "100%",
                      gap: { xs: 1.5, sm: 0 },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color:
                          selectedCity === city.name ? "#bfa600" : "#232526",
                        letterSpacing: selectedCity === city.name ? 0.7 : 0.2,
                        fontSize: {
                          xs: "1.08rem",
                          sm:
                            selectedCity === city.name ? "1.35rem" : "1.13rem",
                        },
                        transition:
                          "color 0.2s, font-size 0.2s, letter-spacing 0.2s",
                        textShadow:
                          selectedCity === city.name
                            ? "0 1px 8px #ffe06688"
                            : "none",
                        mb: { xs: 1, sm: 0 },
                      }}
                    >
                      {city.name}
                    </Typography>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCity(
                          expandedCity === city.name ? null : city.name
                        );
                        setSelectedCity(city.name);
                      }}
                      sx={{
                        color: selectedCity === city.name ? "#FFD700" : "#888",
                        background:
                          selectedCity === city.name
                            ? "#fffbe6"
                            : "transparent",
                        "&:hover": { background: "#fffbe6" },
                        ml: { xs: 0, sm: 1 },
                        mt: { xs: 1, sm: 0 },
                        boxShadow:
                          selectedCity === city.name
                            ? "0 1px 4px 0 #ffe066"
                            : "none",
                        transition:
                          "color 0.2s, background 0.2s, box-shadow 0.2s",
                        alignSelf: { xs: "flex-end", sm: "center" },
                      }}
                    >
                      {expandedCity === city.name ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* Show "Let's do it" button only for selected card */}
                {selectedCity === city.name && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", sm: "flex-end" },
                      px: { xs: 2, sm: 4 },
                      pb: { xs: 1, sm: 1.5 },
                      pt: { xs: 0, sm: 0.5 },
                      background: "transparent",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: "10px",
                        boxShadow: "0 3px 16px 0 #FFD70033",
                        fontSize: "1.08rem",
                        px: 4,
                        py: 1.2,
                        letterSpacing: 0.2,
                        background:
                          "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
                        color: "#232526",
                        transition: "background 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
                          boxShadow: "0 6px 24px 0 #FFD70044",
                        },
                      }}
                      onClick={() => {
                        router.push(
                          `/itinerary?destination=${encodeURIComponent(
                            city.name
                          )}&country=${encodeURIComponent(country)}`
                        );
                      }}
                    >
                      Let&apos;s do it
                    </Button>
                  </Box>
                )}

                <Collapse
                  in={expandedCity === city.name}
                  timeout="auto"
                  unmountOnExit
                  sx={{
                    backgroundColor: "#fff",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: "0 2px 12px 0 #FFD70022",
                    mt: 2,
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: "#fffbe6",
                        borderRadius: "10px",
                        px: 2,
                        py: 1.5,
                        boxShadow: "0 2px 8px rgba(255, 215, 0, 0.13)",
                        border: "1.5px solid #ffe066",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ mr: 1, color: "#FFD700", fontSize: 28 }}>
                        <span role="img" aria-label="sparkle">
                          ✨
                        </span>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#232526",
                          fontSize: "1.13rem",
                          letterSpacing: 0.1,
                        }}
                      >
                        Discover what you can experience in {city.name}
                        <Typography
                          component="span"
                          sx={{
                            display: "block",
                            fontWeight: 400,
                            color: "#232526",
                            fontSize: "1rem",
                            mt: 0.5,
                          }}
                        >
                          Here’s a sneak peek at top activities and places!
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                  {loadingPlaces ? (
                    <InPageLoader text="Loading places..." />
                  ) : (
                    <Box>
                      {places?.slice(0, 5).map((place: Place) => (
                        <Box
                          key={place.name}
                          sx={{
                            mb: 2,
                            p: 2,
                            backgroundColor: "#fffbe6",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 6px rgba(255, 215, 0, 0.08)",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500, color: "#232526" }}
                          >
                            {place.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#232526" }}>
                            {place.address}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Collapse>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </>
  );
};

export default PopularPlacesPage;
