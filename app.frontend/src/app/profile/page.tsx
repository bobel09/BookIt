"use client";

import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCurrentUser } from "../../hooks/querys/useCurrentUserQuery";
import EditPreferencesForm from "@/components/profilePage/EditPreferencesForm";
import VisitedCountriesManager from "@/components/profilePage/EditVisitedCountries";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const { data: user, isLoading, isError } = useCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError || !user) return <Typography>Error loading profile</Typography>;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#1b1b1b", color: "#fff" }}>
      <Navbar username={user.username} onLogout={handleLogout} />

      <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 6, px: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          Profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Preferences Section */}
          <Paper
            sx={{ flex: 1, p: 4, backgroundColor: "gray", borderRadius: 2 }}
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">💱 Currency</Typography>
                  <Chip
                    label={user.preferences.currency}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">💰 Budget</Typography>
                  <Chip
                    label={user.preferences.budget}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    🏨 Hotel Preference
                  </Typography>
                  <Chip
                    label={user.preferences.hotel}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">🌤️ Climate</Typography>
                  <Chip
                    label={user.preferences.climate}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">🕐 Trip Style</Typography>
                  <Chip
                    label={user.preferences.tripStyle}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
            ) : (
              <Typography color="gray">No preferences set.</Typography>
            )}
          </Paper>

          <VisitedCountriesManager
            userId={user._id}
            visitedCountries={user.visitedCountries}
          />
        </Box>
        <Box sx={{ textAlign: "right", mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setIsEditingPreferences(!isEditingPreferences)}
            sx={{
              borderColor: "#ffcc00",
              color: "#ffcc00",
              fontWeight: "bold",
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
          />
        )}
      </Box>
    </Box>
  );
}
