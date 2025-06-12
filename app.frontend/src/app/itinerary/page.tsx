// app/(routes)/itinerary/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useGenerateItinerary } from "@/hooks/mutations/useGenerateItineraryQuery";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import { useAirportSearch } from "@/hooks/querys/useAirportSearch";
import { useSearchDestination } from "@/hooks/querys/useSearchDestination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Collapse,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Navbar from "@/components/Navbar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type { Airport } from "../../../../shared/types/flightDetails";
import FlightResultCard from "./components/FlightResultCard";
import ItineraryResultCard from "./components/ItineraryResultCard";
import StayResultCard from "./components/StayResultCard";
import { useCreateTrip } from "@/hooks/querys/useCreateTrip";
import FlightOptions from "./components/FlightOptions";
import TripDetailsForm from "./components/TripDetailsForm";
import Footer from "@/components/Footer";
import FullPageLoader from "@/components/FullPageLoader";
import InPageLoader from "@/components/InPageLoader";
import ItinerarySearchParamsHandler from "./ItinerarySearchParamsHandler";

const Alert = React.forwardRef(function Alert(
  props: React.ComponentProps<typeof MuiAlert>,
  ref: React.Ref<HTMLDivElement>
) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

// Define a type for destination options
interface DestinationOption {
  dest_id?: string;
  search_type?: string;
  image_url?: string;
  region?: string;
  city_name?: string;
  hotels?: number;
  city_ufi?: string | null;
  type?: string;
  lc?: string;
  dest_type?: string;
  roundtrip?: string;
  cc1?: string;
  name?: string;
  latitude?: number;
  label?: string;
  country?: string;
  longitude?: number;
  nr_hotels?: number;
  landmark_type?: number;
  airports?: Airport[];
}

export default function ItineraryPage() {
  const { data: user } = useCurrentUser();
  const router = useRouter();
  const [destinationInput, setDestinationInput] = useState("");
  const [destinationOption, setDestinationOption] =
    useState<DestinationOption | null>(null);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [adults, setAdults] = useState(1);

  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [fromInput, setFromInput] = useState("");

  const [extraPreferences, setExtraPreferences] = useState("");
  const [includeFlights, setIncludeFlights] = useState(true);
  const [includeStays, setIncludeStays] = useState(true);
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTriggered, setSaveTriggered] = useState(false);

  const [destinationError, setDestinationError] = useState("");
  const [flightError, setFlightError] = useState("");

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "error" });

  const [tripTitle, setTripTitle] = useState("");

  const debouncedFromInput = useDebounce(fromInput, 400);
  const debouncedDestinationSearch = useDebounce(destinationSearch, 400);

  const fromSearch = useAirportSearch(debouncedFromInput);
  const toSearch = useAirportSearch(destinationInput);
  const destinationResults = useSearchDestination(debouncedDestinationSearch);

  const {
    mutate: generateItinerary,
    data,
    isPending,
    isError,
    error,
  } = useGenerateItinerary();
  const {
    mutate: saveTrip,
    isPending: isSaving,
    isSuccess: isSaveSuccess,
  } = useCreateTrip();

  // Store the last generated itinerary input values
  const [lastGeneratedInput, setLastGeneratedInput] = useState<{
    country: string;
    destination: string;
    dateFrom: string;
    dateTo: string;
    adults: number;
    fromAirport?: string | null;
    toAirport?: string | null;
  } | null>(null);

  // Show notification if save was successful
  useEffect(() => {
    if (isSaveSuccess && saveTriggered) {
      setNotification({
        open: true,
        message: "Trip saved!",
        severity: "success",
      });
      setShowSaveDialog(false);
      setSaveTriggered(false);
      setTripTitle("");
    }
  }, [isSaveSuccess, saveTriggered]);

  useEffect(() => {
    // Only set toAirport if not already set and there are results
    if (!toAirport && toSearch.data?.length > 0) {
      setToAirport(toSearch.data[0] as Airport);
    }
  }, [toSearch.data, toAirport]);

  const handleSubmit = () => {
    setDestinationError("");
    setFlightError("");
    let hasError = false;
    if (!destinationInput) {
      setDestinationError("Destination is required.");
      hasError = true;
    }
    if (includeFlights && !fromAirport) {
      setFlightError("Both flight fields are required if including flights.");
      setNotification({
        open: true,
        message: "Please select a departure airport.",
        severity: "error",
      });
      hasError = true;
    }
    if (includeFlights && !toAirport) {
      setFlightError("Both flight fields are required if including flights.");
      setNotification({
        open: true,
        message: "Please select an arrival airport.",
        severity: "error",
      });
      hasError = true;
    }
    if (!dateFrom || !dateTo || !adults) {
      setNotification({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      hasError = true;
    }
    if (hasError) return;

    // Get values from URL params
    const params = new URLSearchParams(window.location.search);
    const urlCountry = params.get("country") || "";
    const urlDestination = params.get("destination") || "";

    // Store a copy of the input values
    setLastGeneratedInput({
      country: urlCountry,
      destination: urlDestination,
      dateFrom,
      dateTo,
      adults,
      fromAirport: includeFlights ? fromAirport?.id || null : null,
      toAirport: includeFlights ? toAirport?.id || null : null,
    });

    const payload = {
      city: destinationInput,
      dateFrom,
      dateTo,
      adults,
      fromAirport: fromAirport?.id || null,
      toAirport: toAirport?.id || null,
      extraPreferences: extraPreferences || "",
      includeFlights,
      includeStays,
      preferences: user?.preferences || {},
    };
    generateItinerary(payload);
  };

  useEffect(() => {
    if (data) {
      setDateFrom("");
      setDateTo("");
      setAdults(1);
      setFromAirport(null);
      setToAirport(null);
      setExtraPreferences("");
      setIncludeFlights(true);
      setIncludeStays(true);
    }
  }, [data, destinationInput]);

  // Improved: Only update URL if params actually changed to avoid infinite loop and flicker
  useEffect(() => {
    // Build intended params from state
    const intendedParams = new URLSearchParams();
    if (destinationInput) intendedParams.set("destination", destinationInput);
    if (destinationOption && destinationOption.country)
      intendedParams.set("country", destinationOption.country);

    // Get current params from the URL (excluding unrelated params)
    const currentParams = new URLSearchParams(window.location.search);
    // Only keep the keys we care about
    ["destination", "country"].forEach((key) => {
      if (!intendedParams.has(key)) currentParams.delete(key);
    });
    // Now compare
    let changed = false;
    for (const key of ["destination", "country"]) {
      if (intendedParams.get(key) !== currentParams.get(key)) {
        changed = true;
        break;
      }
    }
    if (changed) {
      const newUrl =
        window.location.pathname +
        (intendedParams.toString() ? `?${intendedParams}` : "");
      router.replace(newUrl, { scroll: false });
    }
  }, [destinationInput, destinationOption, router]);

  // After AI response, re-sync form fields from URL params if needed
  useEffect(() => {
    if (!data) return;
    const params = new URLSearchParams(window.location.search);
    const urlDestination = params.get("destination") || "";

    // Only update if different from current state
    if (destinationInput !== urlDestination) {
      setDestinationInput(urlDestination);
      setDestinationSearch(urlDestination);
      setDestinationOption(null);
    }
    // No need to sync other fields
  }, [data]);

  // Utility to clear just the destination-related params
  function clearDestinationUrlParams() {
    const params = new URLSearchParams(window.location.search);
    ["destination", "country"].forEach((key) => params.delete(key));
    router.replace(
      window.location.pathname + (params.toString() ? `?${params}` : ""),
      { scroll: false }
    );
  }

  if (!user) {
    return <FullPageLoader />;
  }
  if (isError) {
    return <Typography>Error loading profile</Typography>;
  }

  return (
    <>
      {/* Suspense boundary for search param handler */}
      <Suspense fallback={null}>
        <ItinerarySearchParamsHandler
          destinationInput={destinationInput}
          setDestinationInput={setDestinationInput}
          setDestinationSearch={setDestinationSearch}
          setDestinationOption={setDestinationOption}
          setToAirport={setToAirport}
        />
      </Suspense>
      <Navbar username={user.username} />
      <Box
        sx={{
          mt: 4,
          minHeight: "100vh",
          background:
            "linear-gradient(120deg, #232526 0%, #1e1e1e 60%, #101010 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
              mt: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "white",
                mb: 1.5,
                letterSpacing: 0.5,
                fontFamily: "Inter, Roboto, Arial, sans-serif",
                lineHeight: 1.18,
                textShadow: "0 2px 12px rgba(30,30,30,0.04)",
                fontSize: { xs: "2.1rem", sm: "2.6rem", md: "2.9rem" },
              }}
            >
              Create an Itinerary for{" "}
              <Box component="span" sx={{ color: "#FFD700", fontWeight: 900 }}>
                {destinationInput || "your chosen destination"}
              </Box>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "white",
                mb: 3.5,
                maxWidth: "520px",
                margin: "0 auto",
                fontWeight: 400,
                fontSize: { xs: "1.05rem", sm: "1.13rem" },
                lineHeight: 1.6,
                letterSpacing: 0.01,
              }}
            >
              Fill in the details of your trip and generate a personalized
              itinerary for your destination.
            </Typography>
          </Box>

          <Box
            sx={{
              background: "#fff",
              borderRadius: "24px",
              boxShadow: "0 8px 32px 0 rgba(40,40,40,0.10)",
              p: { xs: 2, sm: 4 },
              mb: 5,
              maxWidth: 900,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TripDetailsForm
              destinationInput={destinationInput}
              destinationOption={destinationOption}
              destinationSearch={destinationSearch}
              destinationError={destinationError}
              destinationResults={destinationResults}
              setDestinationInput={setDestinationInput}
              setDestinationOption={setDestinationOption}
              setDestinationSearch={setDestinationSearch}
              setToAirport={setToAirport}
              clearDestinationUrlParams={clearDestinationUrlParams}
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              adults={adults}
              setAdults={setAdults}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2.5,
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setShowFlightForm((v) => !v)}
                sx={{
                  borderRadius: "10px",
                  fontWeight: 600,
                  color: showFlightForm ? "#FFD700" : "#232526",
                  borderColor: showFlightForm ? "#FFD700" : undefined,
                  width: { xs: "100%", sm: 290 },
                  height: 80,
                  mb: { xs: 1, sm: 0 },
                  py: 1.1,
                  fontSize: "1.05rem",
                  letterSpacing: 0.1,
                  background: showFlightForm ? "#fffbe6" : undefined,
                  boxShadow: showFlightForm ? "0 2px 8px #ffe06633" : undefined,
                  transition: "all 0.18s",
                }}
                endIcon={
                  showFlightForm ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
              >
                {showFlightForm ? "Hide Flight Options" : "Add Flight Options"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowExtraOptions((v) => !v)}
                sx={{
                  borderRadius: "10px",
                  fontWeight: 600,
                  color: showExtraOptions ? "#FFD700" : "#232526",
                  borderColor: showExtraOptions ? "#FFD700" : undefined,
                  width: { xs: "100%", sm: 290 },
                  height: 80,
                  py: 1.1,
                  fontSize: "1.05rem",
                  letterSpacing: 0.1,
                  background: showExtraOptions ? "#fffbe6" : undefined,
                  boxShadow: showExtraOptions
                    ? "0 2px 8px #ffe06633"
                    : undefined,
                  transition: "all 0.18s",
                }}
                endIcon={
                  showExtraOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
              >
                {showExtraOptions
                  ? "Hide Extra Preferences"
                  : "Add Extra Preferences"}
              </Button>
            </Box>
            <Collapse in={showFlightForm}>
              <FlightOptions
                show={showFlightForm}
                includeFlights={includeFlights}
                fromAirport={fromAirport}
                toAirport={toAirport}
                fromSearch={fromSearch}
                toSearch={toSearch}
                fromInput={fromInput}
                setFromInput={setFromInput}
                setFromAirport={setFromAirport}
                setToAirport={setToAirport}
                flightError={flightError}
                destinationInput={destinationInput}
              />
            </Collapse>
            <Collapse in={showExtraOptions}>
              <TextField
                label="Write any extra preferences or details (e.g., places, activities, atmosphere, etc.)"
                multiline
                rows={4}
                value={extraPreferences}
                onChange={(e) => setExtraPreferences(e.target.value)}
                sx={{
                  background: "#f9f9f9",
                  borderRadius: "10px",
                  width: "100%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  mt: 2,
                }}
              />
            </Collapse>
          </Box>
          {/* Options Section */}
          <Box
            sx={{
              background: "#fff",
              borderRadius: "24px",
              boxShadow: "0 8px 32px 0 rgba(40,40,40,0.10)",
              p: { xs: 2, sm: 4 },
              mb: 5,
              maxWidth: 900,
              mx: "auto",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#232526",
                  mb: 1,
                  letterSpacing: 0.2,
                }}
              >
                Options
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeFlights}
                    onChange={(e) => setIncludeFlights(e.target.checked)}
                    sx={{
                      color: "#FFD700",
                      "&.Mui-checked": { color: "#FFD700" },
                      transform: "scale(1.2)",
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, color: "#232526" }}>
                    Include Flights
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeStays}
                    onChange={(e) => setIncludeStays(e.target.checked)}
                    sx={{
                      color: "#FFD700",
                      "&.Mui-checked": { color: "#FFD700" },
                      transform: "scale(1.2)",
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600, color: "#232526" }}>
                    Include Stays
                  </Typography>
                }
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isPending}
              sx={{
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "12px",
                boxShadow: "0 3px 16px 0 rgba(255,215,0,0.13)",
                fontSize: "1.18rem",
                px: 5,
                py: 1.5,
                letterSpacing: 0.2,
                background: "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
                color: "#232526",
                transition: "background 0.2s, box-shadow 0.2s",
                mt: { xs: 2, md: 0 },
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
                  boxShadow: "0 6px 24px 0 rgba(255,215,0,0.18)",
                },
              }}
            >
              Generate Itinerary
            </Button>
          </Box>
          {/* Results Section */}
          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            {isError && (
              <Typography color="error" mt={2}>
                Error: {(error as Error)?.message}
              </Typography>
            )}
            {isPending && <InPageLoader text="Generating your itinerary..." />}
            {data && (
              <Box mt={4}>
                {/* Itinerary Section - visually enhanced by days */}
                {data.itinerary && (
                  <ItineraryResultCard itinerary={data.itinerary} />
                )}

                {/* Selected Flight Section (styled like Flights) */}
                {data.selectedFlight && (
                  <FlightResultCard selectedFlight={data.selectedFlight} />
                )}

                {/* Selected Stay Section (styled like Stays) */}
                {data.selectedStay && (
                  <StayResultCard
                    selectedStay={data.selectedStay}
                    user={user}
                    bookingUrl={data.stayBookingUrl}
                  />
                )}
                {/* Save Trip Section - only visible when results exist */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2.5,
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    mt: 4,
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => setShowSaveDialog(true)}
                    sx={{
                      fontWeight: 700,
                      borderRadius: "12px",
                      fontSize: "1.08rem",
                      px: 4,
                      py: 1.2,
                      background:
                        "linear-gradient(90deg, #4caf50 60%, #81c784 100%)",
                      color: "#fff",
                      boxShadow: "0 3px 16px 0 rgba(76,175,80,0.13)",
                      mt: { xs: 2, md: 0 },
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #388e3c 60%, #81c784 100%)",
                      },
                    }}
                  >
                    Save Trip
                  </Button>
                </Box>
                {/* Trip Title Dialog */}
                <Dialog
                  open={showSaveDialog}
                  onClose={() => setShowSaveDialog(false)}
                >
                  <DialogTitle>Save Your Trip</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Trip Title"
                      fullWidth
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                      required
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setShowSaveDialog(false)}
                      color="inherit"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (!tripTitle) {
                          setNotification({
                            open: true,
                            message: "Please enter a trip title.",
                            severity: "error",
                          });
                          return;
                        }
                        if (!lastGeneratedInput) {
                          setNotification({
                            open: true,
                            message:
                              "Please generate an itinerary before saving.",
                            severity: "error",
                          });
                          return;
                        }
                        const {
                          country,
                          destination,
                          dateFrom,
                          dateTo,
                          adults,
                          fromAirport,
                          toAirport,
                        } = lastGeneratedInput;
                        if (!destination || !dateFrom || !dateTo || !adults) {
                          setNotification({
                            open: true,
                            message:
                              "Please fill in all required fields before saving.",
                            severity: "error",
                          });
                          return;
                        }
                        saveTrip({
                          title: tripTitle,
                          city: destination,
                          country,
                          dateFrom,
                          dateTo,
                          adults,
                          fromAirport: fromAirport || undefined,
                          toAirport: toAirport || undefined,
                          extraPreferences: extraPreferences || "",
                          includeFlights,
                          includeStays,
                          selectedFlight: data?.selectedFlight,
                          selectedStay: data?.selectedStay,
                          stayBookingUrl: data?.stayBookingUrl ?? undefined,
                          itinerary: data?.itinerary || [],
                          status: "active",
                        });
                        setSaveTriggered(true);
                      }}
                      color="success"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            )}
          </Box>
        </Box>
        <Footer />
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((n) => ({ ...n, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification((n) => ({ ...n, open: false }))}
          severity={notification.severity}
          sx={{ fontSize: "1.08rem" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
