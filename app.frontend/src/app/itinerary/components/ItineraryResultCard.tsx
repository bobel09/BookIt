import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import MuseumIcon from "@mui/icons-material/Museum";
import ParkIcon from "@mui/icons-material/Park";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import EventIcon from "@mui/icons-material/Event";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface Activity {
  time: string;
  type: string;
  description: string;
  location?: string;
}

interface DayItinerary {
  title: string;
  activities: Activity[];
}

interface ItineraryResultCardProps {
  itinerary: DayItinerary[];
}

const activityTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "meal":
    case "breakfast":
    case "lunch":
    case "dinner":
      return <RestaurantIcon sx={{ color: "#ff9800" }} />;
    case "walk":
    case "walking tour":
      return <DirectionsWalkIcon sx={{ color: "#388e3c" }} />;
    case "museum":
      return <MuseumIcon sx={{ color: "#1976d2" }} />;
    case "park":
      return <ParkIcon sx={{ color: "#43a047" }} />;
    case "cafe":
      return <LocalCafeIcon sx={{ color: "#6d4c41" }} />;
    case "event":
      return <EventIcon sx={{ color: "#ab47bc" }} />;
    case "nightlife":
      return <NightlifeIcon sx={{ color: "#d32f2f" }} />;
    default:
      return <HelpOutlineIcon sx={{ color: "#bdbdbd" }} />;
  }
};

const ItineraryResultCard: React.FC<ItineraryResultCardProps> = ({
  itinerary,
}) => {
  if (!itinerary || !Array.isArray(itinerary)) return null;
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          color: "#232526",
          mb: 2,
          fontWeight: 700,
          letterSpacing: 0.2,
        }}
      >
        Itinerary
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          background: "transparent",
          mb: 4,
        }}
      >
        {itinerary.map((day, idx) => (
          <Box
            key={idx}
            sx={{
              position: "relative",
              background: "#fff",
              borderRadius: "16px",
              border: "1.5px solid #ececec",
              boxShadow: "0 2px 12px 0 rgba(30,30,30,0.06)",
              p: { xs: 2, sm: 3 },
              pl: 7,
              minHeight: 110,
              mb: 0,
              overflow: "hidden",
              transition: "box-shadow 0.18s",
              "&:hover": {
                boxShadow: "0 6px 24px 0 rgba(30,30,30,0.10)",
              },
            }}
          >
            {/* Day circle */}
            <Box
              sx={{
                position: "absolute",
                left: 18,
                top: 24,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "2.5px solid #FFD700",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#bfa600",
                zIndex: 2,
                boxShadow: "0 1px 4px 0 rgba(30,30,30,0.04)",
              }}
            >
              {idx + 1}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "#232526",
                mb: 1,
                ml: 8,
                fontSize: "1.08rem",
                letterSpacing: 0.1,
              }}
            >
              {day.title}
            </Typography>
            <Box sx={{ ml: 1, paddingTop: 2 }}>
              {day.activities && day.activities.length > 0 ? (
                <Stack spacing={1.2}>
                  {day.activities.map((activity, aIdx) => (
                    <Box
                      key={aIdx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        mb: 0.5,
                        borderLeft:
                          aIdx !== 0 ? "1.5px solid #f3f3f3" : undefined,
                        pl: aIdx !== 0 ? 2 : 0,
                        pt: aIdx !== 0 ? 1 : 0,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#232526",
                            fontSize: "1.01rem",
                            fontWeight: 400,
                            display: "inline",
                          }}
                        >
                          {activity.time && (
                            <Chip
                              label={activity.time}
                              size="small"
                              sx={{
                                mr: 1,
                                background: "#f7f7f7",
                                color: "#bfa600",
                                fontWeight: 500,
                                fontSize: "0.93em",
                                borderRadius: "6px",
                              }}
                            />
                          )}
                          {activity.description}
                        </Typography>
                        {activity.location && (
                          <Typography
                            sx={{
                              color: "#888",
                              fontSize: "0.97rem",
                              ml: 0.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <LocationOnIcon
                              sx={{ fontSize: 17, color: "#bfa600" }}
                            />
                            {activity.location}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography
                  sx={{
                    color: "#888",
                    fontSize: "1.08rem",
                    fontWeight: 400,
                  }}
                >
                  No activities for this day.
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ItineraryResultCard;
