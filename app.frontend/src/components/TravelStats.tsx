import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { ALL_COUNTRIES_NAMES } from "../components/profilePage/EditVisitedCountries";

const TravelStats: React.FC<{ visitedCountries: string[] }> = ({
  visitedCountries,
}) => {
  const totalCountries = ALL_COUNTRIES_NAMES.length;
  const totalVisited = visitedCountries.length;
  const percent = Math.round((totalVisited / totalCountries) * 100);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        height: "100%",
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
        🌍 Travel Stats
      </Typography>
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontSize: { xs: "1.2rem", md: "1.5rem" },
          color: "#007bff",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 0.5,
          mt: 0.5,
          mb: 2,
        }}
      >
        <b>{totalVisited}</b> countries visited out of <b>{totalCountries}</b>
      </Typography>
      <Box sx={{ width: "100%", maxWidth: 400, mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            height: 14,
            borderRadius: 7,
            background: "#e3e3e3",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #FFD700 0%, #4caf50 100%)",
            },
          }}
        />
      </Box>
      <Typography
        sx={{
          color: "#666",
          fontWeight: 500,
          fontSize: "1.1rem",
          mt: 1,
          textAlign: "center",
        }}
      >
        {percent}% of the world explored
      </Typography>
    </Box>
  );
};

export default TravelStats;
