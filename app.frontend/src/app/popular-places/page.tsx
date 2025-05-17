"use client";

import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  CardMedia,
  Collapse,
  IconButton,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Navbar from "@/components/Navbar";
import { usePopularCities } from "@/hooks/querys/usePopularCities";
import { usePopularPlaces } from "@/hooks/querys/usePopularPlaces";

interface City {
  name: string;
  photoReference: string;
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
  const [searchCity, setSearchCity] = useState<string | null>("");

  const { data: cities, isLoading: loadingCities } = usePopularCities(country);
  const {
    data: places,
    isLoading: loadingPlaces,
    refetch: refetchPlaces,
  } = usePopularPlaces(selectedCity ?? "");

  const handleExpandClick = (city: string) => {
    setExpandedCity(expandedCity === city ? null : city);
    setSelectedCity(city);
  };

  const handleSearchCity = (_event: any, value: string | null) => {
    setSearchCity(value);
    if (value) {
      setExpandedCity(value);
      setSelectedCity(value);
      refetchPlaces();
    }
  };

  return (
    <>
      <Navbar username="John Doe" />
      <Box
        sx={{
          p: 4,
          minHeight: "100vh",
          backgroundColor: "#f5f7fa",
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#333",
              mb: 1,
            }}
          >
            Discover the Best of {country}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mb: 3,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore the most popular cities and attractions in {country}. Select
            a city to see the top destinations and hidden gems.
          </Typography>

          {/* Autocomplete Search */}
          <Autocomplete
            options={cities?.map((city) => city.name) || []}
            value={searchCity}
            onChange={handleSearchCity}
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

        {/* Cities Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {loadingCities ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            cities?.slice(0, 5).map((city: City) => (
              <Box
                key={city.name}
                sx={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CardMedia
                    component="img"
                    sx={{ width: "250px", height: "150px", objectFit: "cover" }}
                    image={
                      city.photoReference
                        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${city.photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
                        : `https://via.placeholder.com/250x150.png?text=${city.name}`
                    }
                    alt={city.name}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#333" }}
                    >
                      {city.name}
                    </Typography>

                    <IconButton onClick={() => handleExpandClick(city.name)}>
                      {expandedCity === city.name ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                <Collapse
                  in={expandedCity === city.name}
                  timeout="auto"
                  unmountOnExit
                  sx={{ backgroundColor: "#fafafa", p: 2 }}
                >
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
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500, color: "#007bff" }}
                          >
                            {place.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
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
