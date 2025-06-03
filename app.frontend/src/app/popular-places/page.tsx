"use client";

import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  TextField,
  Autocomplete,
  CircularProgress,
  Button,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Navbar from "@/components/Navbar";
import { usePopularCities } from "@/hooks/querys/usePopularCities";
import { usePopularPlaces } from "@/hooks/querys/usePopularPlaces";
import Image from "next/image";
import { useCitySearch } from "@/hooks/querys/useCitySearch";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import { useRouter } from "next/navigation";

interface City {
  name: string;
  photoReference?: string;
}

interface Place {
  name: string;
  address: string;
}

const PopularPlacesPage = () => {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") || "France";

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchedCity, setSearchedCity] = useState<City | null>(null);
  const { data: user, isError } = useCurrentUser();
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

  return (
    <>
      <Navbar username={user.username} />
      <Box
        sx={{
          p: 4,
          minHeight: "100vh",
          background:
            "linear-gradient(120deg, #232526 0%, #1e1e1e 60%, #101010 100%)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "#fff", mb: 1 }}
          >
            Discover the Best of {country}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#ededed",
              mb: 3,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore the most popular cities and attractions in {country}. Select
            a city to see the top destinations and hidden gems.
          </Typography>

          {/* Search bar */}
          <Autocomplete
            options={citiesSearch.data || []}
            value={searchCity}
            inputValue={inputValue}
            onInputChange={(_, newValue) => setInputValue(newValue)}
            onChange={handleSearchCity}
            loading={citiesSearch.isLoading}
            loadingText="Searching cities..."
            noOptionsText="No cities found"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for another city"
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  mx: "auto",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                }}
              />
            )}
          />
        </Box>

        {/* City Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {loadingCities ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            displayedCities.map((city: City) => (
              <Box
                key={city.name}
                onClick={() => handleSelectCityCard(city.name)}
                sx={{
                  width: "100%",
                  background:
                    selectedCity === city.name
                      ? "linear-gradient(105deg, #fdf6e3 60%, #ececec 100%)"
                      : "#dfd8d7",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow:
                    selectedCity === city.name
                      ? "0 8px 32px 0 rgba(255,215,0,0.18), 0 1.5px 6px 0 rgba(255,215,0,0.10)"
                      : "0 4px 16px 0 rgba(0,0,0,0.08)",
                  transition:
                    "transform 0.25s, box-shadow 0.25s, background 0.25s",
                  "&:hover": {
                    transform: "scale(1.025)",
                    boxShadow: "0 8px 32px 0 rgba(255,215,0,0.13)",
                    cursor: "pointer",
                  },
                  border:
                    selectedCity === city.name
                      ? "2.5px solid #FFD700"
                      : "1.5px solid #e0e0e0",
                  position: "relative",
                  minHeight: 170,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
                  <Box
                    sx={{
                      width: "220px",
                      height: "130px",
                      overflow: "hidden",
                      borderRadius: "12px",
                      position: "relative",
                      flexShrink: 0,
                      background: "#dfd8d7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow:
                        selectedCity === city.name
                          ? "0 2px 12px 0 rgba(255,215,0,0.10)"
                          : "none",
                      border:
                        selectedCity === city.name
                          ? "2px solid #ffe066"
                          : "1px solid #e0e0e0",
                      transition: "border 0.2s, box-shadow 0.2s",
                    }}
                  >
                    {city.photoReference ? (
                      <Image
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${city.photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`}
                        alt={city.name}
                        fill
                        style={{ objectFit: "cover", borderRadius: "12px" }}
                        sizes="220px"
                        priority
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#555",
                          fontSize: "1.2rem",
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
                      pl: 3,
                      pr: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#232526",
                        letterSpacing: selectedCity === city.name ? 0.5 : 0,
                        fontSize:
                          selectedCity === city.name ? "1.28rem" : "1.13rem",
                        transition:
                          "color 0.2s, font-size 0.2s, letter-spacing 0.2s",
                        textShadow:
                          selectedCity === city.name
                            ? "0 1px 6px #ffe066"
                            : "none",
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
                        "&:hover": {
                          background: "#fffbe6",
                        },
                        ml: 1,
                        boxShadow:
                          selectedCity === city.name
                            ? "0 1px 4px 0 #ffe066"
                            : "none",
                        transition:
                          "color 0.2s, background 0.2s, box-shadow 0.2s",
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
                      justifyContent: "flex-end",
                      px: 4,
                      pb: 1.5,
                      pt: 0.5,
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
                        boxShadow: "0 3px 16px 0 rgba(255,215,0,0.13)",
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
                          boxShadow: "0 6px 24px 0 rgba(255,215,0,0.18)",
                        },
                      }}
                      onClick={() => {
                        router.push(
                          `/what-to-get?city=${encodeURIComponent(
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
                  sx={{ backgroundColor: "#fdf6e3", p: 2 }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background:
                          "linear-gradient(90deg, #fffbe6 0%, #fdf6e3 100%)",
                        borderRadius: "10px",
                        px: 2,
                        py: 1.5,
                        boxShadow: "0 2px 8px rgba(255, 215, 0, 0.07)",
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
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
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
