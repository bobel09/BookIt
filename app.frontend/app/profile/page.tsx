"use client";

import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCurrentUser } from "../../src/hooks/querys/useCurrentUserQuery";
import EditPreferencesForm from "@/components/profilePage/EditPreferencesForm";
import VisitedCountriesManager from "@/components/profilePage/EditVisitedCountries";
import { useTrips } from "../../src/hooks/querys/useTrips";
import FlightResultCard from "../itinerary/components/FlightResultCard";
import ItineraryResultCard from "../itinerary/components/ItineraryResultCard";
import StayResultCard from "../itinerary/components/StayResultCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Notification from "@/components/Notification";
import Footer from "@/components/Footer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FullPageLoader from "@/components/FullPageLoader";
import InPageLoader from "@/components/InPageLoader";
import ErrorPage from "../error";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const { data: user, isLoading, isError } = useCurrentUser();
  const {
    data: trips,
    isLoading: loadingTrips,
    isError: tripsError,
  } = useTrips();

  if (isLoading) return <FullPageLoader text="Loading profile..." />;
  if (isError || !user) return <ErrorPage />;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#1b1b1b", color: "#fff" }}>
      <Navbar username={user.username} />
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          mt: { xs: 2, md: 6 },
          px: { xs: 1, sm: 2, md: 4 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            fontSize: { xs: "2rem", sm: "2.3rem", md: "2.5rem" },
          }}
        >
          Profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, md: 4 },
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "flex-start" },
          }}
        >
          <Paper
            sx={{
              flex: 1,
              p: { xs: 2, sm: 3, md: 4 },
              backgroundColor: "white",
              borderRadius: 2,
              mb: { xs: 2, md: 0 },
              minWidth: 0,
            }}
          >
            <Typography variant="h6">
              Username: <strong>{user.username}</strong>
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Email: <strong>{user.email}</strong>
            </Typography>

            <Divider sx={{ my: 3, borderColor: "#555" }} />

            <Typography variant="h5" sx={{ mb: 2 }}>
              Preferences
            </Typography>

            {Object.keys(user.preferences || {}).length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 200px", mb: 2 }}>
                  <Typography variant="subtitle1">💱 Currency</Typography>
                  <Chip
                    label={user.preferences.currency}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", mb: 2 }}>
                  <Typography variant="subtitle1">💰 Budget</Typography>
                  <Chip
                    label={user.preferences.budget}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", mb: 2 }}>
                  <Typography variant="subtitle1">
                    🏨 Hotel Preference
                  </Typography>
                  <Chip
                    label={user.preferences.hotel}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", mb: 2 }}>
                  <Typography variant="subtitle1">🌤️ Climate</Typography>
                  <Chip
                    label={user.preferences.climate}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", mb: 2 }}>
                  <Typography variant="subtitle1">🕐 Trip Style</Typography>
                  <Chip
                    label={user.preferences.tripStyle}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", mb: 2 }}>
                  <Typography variant="subtitle1">🏛️ Interests</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {user.preferences.interests?.map((i, idx) => (
                      <Chip
                        key={idx}
                        label={i}
                        sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: "1 1 200px", mb: 2 }}>
                  <Typography variant="subtitle1">
                    🍽️ Food Preference
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {user.preferences.food?.map((f, idx) => (
                      <Chip
                        key={idx}
                        label={f}
                        sx={{ backgroundColor: "#ff9800", color: "#fff" }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography color="gray">No preferences set.</Typography>
            )}
          </Paper>
          {/* VisitedCountriesManager notification support: wrap in a Box and show notification below */}
          <Box
            sx={{
              minWidth: { xs: 0, sm: 300, md: 350 },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <VisitedCountriesManager
              userId={user._id}
              visitedCountries={user.visitedCountries}
              onSuccess={() =>
                setSnackbar({
                  open: true,
                  message: "Visited countries updated!",
                  severity: "success",
                })
              }
              onError={() =>
                setSnackbar({
                  open: true,
                  message: "Failed to update visited countries.",
                  severity: "error",
                })
              }
            />
          </Box>
        </Box>
        <Box sx={{ textAlign: { xs: "center", md: "right" }, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setIsEditingPreferences(!isEditingPreferences)}
            sx={{
              borderColor: "#ffcc00",
              color: "#ffcc00",
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.08rem" },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.2 },
              minWidth: { xs: 120, sm: 140 },
              minHeight: { xs: 38, sm: 44 },
              "&:hover": {
                backgroundColor: "#ffcc00",
                color: "#000",
              },
            }}
          >
            {isEditingPreferences ? "Close Preferences" : "Edit Preferences"}
          </Button>
        </Box>
        {isEditingPreferences && (
          <EditPreferencesForm
            userId={user._id}
            initialPreferences={user.preferences}
            onSuccess={() =>
              setSnackbar({
                open: true,
                message: "Preferences saved!",
                severity: "success",
              })
            }
            onError={() =>
              setSnackbar({
                open: true,
                message: "Failed to save preferences.",
                severity: "error",
              })
            }
          />
        )}
        {/* User Trips Section */}
        <Box sx={{ mt: { xs: 3, md: 6 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" },
            }}
          >
            My Trips
          </Typography>
          {loadingTrips ? (
            <InPageLoader text="Loading trips..." />
          ) : tripsError ? (
            <ErrorPage />
          ) : trips && trips.length > 0 ? (
            <Grid container spacing={2}>
              {trips.map((trip) => {
                const tripKey = trip.id;
                const isExpanded = expandedTrip === tripKey;
                return (
                  <Box
                    key={tripKey}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "#f9f9f9",
                      mb: 2,
                      boxShadow: "0 2px 8px #FFD70033",
                    }}
                  >
                    <Card
                      sx={{
                        width: { xs: "100%", sm: "100%", md: "1140px" },
                        mx: "auto",
                        background: isExpanded ? "#fffbe6" : "#f9f9f9",
                        borderRadius: 3,
                        boxShadow: isExpanded
                          ? "0 4px 16px #FFD70055"
                          : "0 2px 8px #FFD70033",
                        mb: 2,
                        transition: "box-shadow 0.2s, background 0.2s",
                        cursor: "pointer",
                        minWidth: 0,
                      }}
                      onClick={() =>
                        setExpandedTrip(isExpanded ? null : tripKey)
                      }
                    >
                      <CardContent
                        sx={{
                          px: { xs: 2, sm: 3, md: 4 },
                          py: { xs: 2, sm: 3, md: 4 },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                            gap: { xs: 2, sm: 0 },
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                color: "#232526",
                                fontWeight: 800,
                                fontSize: {
                                  xs: "1.15rem",
                                  sm: "1.45rem",
                                  md: "1.7rem",
                                },
                                mb: 0.5,
                                letterSpacing: 0.1,
                              }}
                            >
                              {trip.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#444",
                                fontWeight: 600,
                                fontSize: {
                                  xs: "1rem",
                                  sm: "1.13rem",
                                  md: "1.22rem",
                                },
                                mb: 0.5,
                              }}
                            >
                              {trip.city}, {trip.country}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: 15, sm: 17, md: 19 },
                                color: "#232526",
                                mb: 0.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                                letterSpacing: 0.1,
                              }}
                            >
                              {trip.dateFrom}
                              <ArrowForwardIcon
                                sx={{
                                  fontSize: { xs: 18, sm: 20, md: 22 },
                                  color: "black",
                                  mx: 0.5,
                                }}
                              />
                              {trip.dateTo}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: 13, sm: 14, md: 15 },
                                color: "#bfa600",
                                fontWeight: 700,
                                mt: 1,
                              }}
                            >
                              {trip.itinerary?.length || 0} days | {trip.adults}{" "}
                              adult{trip.adults > 1 ? "s" : ""}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="large"
                            sx={{
                              borderColor: "#000",
                              color: "black",
                              fontWeight: 700,
                              fontSize: {
                                xs: "1rem",
                                sm: "1.08rem",
                                md: "1.15rem",
                              },
                              minWidth: { xs: 90, sm: 120 },
                              minHeight: { xs: 36, sm: 44 },
                              ml: { xs: 0, sm: 2 },
                              mt: { xs: 2, sm: 0 },
                              borderRadius: 2.5,
                              px: { xs: 2, sm: 3 },
                              py: { xs: 1, sm: 1.2 },
                              letterSpacing: 0.1,
                              boxShadow: isExpanded
                                ? "0 2px 8px #FFD70055"
                                : undefined,
                              background: isExpanded ? "#fffbe6" : undefined,
                              transition: "all 0.18s",
                              "&:hover": {
                                background: "#ffe066",
                                color: "#232526",
                                borderColor: "#FFD700",
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedTrip(isExpanded ? null : tripKey);
                            }}
                            endIcon={
                              isExpanded ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )
                            }
                          >
                            {isExpanded ? "Hide" : "Show"}
                          </Button>
                        </Box>
                        {isExpanded && (
                          <Box sx={{ mt: 3 }}>
                            {trip.selectedFlight && (
                              <Box mb={2}>
                                <FlightResultCard
                                  selectedFlight={trip.selectedFlight}
                                />
                              </Box>
                            )}
                            {trip.selectedStay && (
                              <Box mb={2}>
                                <StayResultCard
                                  selectedStay={trip.selectedStay}
                                  user={user}
                                  bookingUrl={trip.stayBookingUrl ?? null}
                                />
                              </Box>
                            )}
                            {trip.itinerary && trip.itinerary.length > 0 && (
                              <Box mb={2}>
                                <ItineraryResultCard
                                  itinerary={trip.itinerary}
                                />
                              </Box>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Grid>
          ) : (
            <Typography color="gray">No trips found.</Typography>
          )}
        </Box>

        <Notification
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
      <Footer />
    </Box>
  );
}
