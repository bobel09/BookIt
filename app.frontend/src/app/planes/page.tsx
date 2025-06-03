"use client";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useAirportSearch } from "@/hooks/querys/useAirportSearch";
import { useFlightOffersSearch } from "@/hooks/querys/useFlightOffersSearch";

interface Airport {
  iataCode: string;
  name: string;
  address: { cityName: string };
}

export default function PlanesSearchPage() {
  const { data: user, isError } = useCurrentUser();
  const router = useRouter();

  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [travelClass, setTravelClass] = useState<string>("");
  const [nonStop, setNonStop] = useState(false);

  const fromSearch = useAirportSearch(fromInput);
  const toSearch = useAirportSearch(toInput);

  // For return date unlock
  const [enableReturn, setEnableReturn] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const {
    data: flights,
    isLoading: loadingFlights,
    refetch: fetchFlights,
  } = useFlightOffersSearch({
    originLocationCode: fromAirport?.iataCode || "",
    destinationLocationCode: toAirport?.iataCode || "",
    departureDate,
    returnDate: enableReturn && searchTriggered ? returnDate : undefined,
    adults,
    travelClass,
    nonStop,
  });

  // Only fetch on button click
  useEffect(() => {
    // do nothing on mount
  }, []);

  const handleSearchFlights = () => {
    setSearchTriggered(true);
    fetchFlights();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  if (isError || !user) {
    localStorage.removeItem("token");
    return <Typography>Error loading profile</Typography>;
  }

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
            Find Your Flight ✈️
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
            Search and compare flights to your next destination. Enter your
            departure and arrival cities, select a date, and discover the best
            options for your journey.
          </Typography>
        </Box>

        {/* Flight search section */}
        <Box
          sx={{
            background: "#dfd8d7",
            borderRadius: "20px",
            boxShadow: "0 4px 16px 0 rgba(0,0,0,0.08)",
            p: 4,
            mb: 5,
            maxWidth: 900,
            mx: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* From Airport */}
          <Autocomplete
            options={fromSearch.data || []}
            getOptionLabel={(option) =>
              `${option.address.cityName} (${option.iataCode})`
            }
            onInputChange={(_, value) => setFromInput(value)}
            value={fromAirport}
            onChange={(_, value) => setFromAirport(value)}
            loading={fromSearch.isLoading}
            sx={{ minWidth: 200, background: "#fff", borderRadius: "10px" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                placeholder="Search city"
                sx={{ borderRadius: "10px" }}
              />
            )}
          />

          {/* To Airport */}
          <Autocomplete
            options={toSearch.data || []}
            getOptionLabel={(option) =>
              `${option.address.cityName} (${option.iataCode})`
            }
            onInputChange={(_, value) => setToInput(value)}
            value={toAirport}
            onChange={(_, value) => setToAirport(value)}
            loading={toSearch.isLoading}
            sx={{ minWidth: 200, background: "#fff", borderRadius: "10px" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                placeholder="Search city"
                sx={{ borderRadius: "10px" }}
              />
            )}
          />

          {/* Departure Date */}
          <TextField
            label="Departure Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            sx={{ background: "#fff", borderRadius: "10px", minWidth: 160 }}
          />

          {/* Enable Return Date */}
          <TextField
            select
            label="Trip Type"
            value={enableReturn ? "round" : "oneway"}
            onChange={(e) => setEnableReturn(e.target.value === "round")}
            SelectProps={{ native: true }}
            sx={{ background: "#fff", borderRadius: "10px", minWidth: 120 }}
          >
            <option value="oneway">One Way</option>
            <option value="round">Round Trip</option>
          </TextField>

          {/* Return Date */}
          {enableReturn && (
            <TextField
              label="Return Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              sx={{ background: "#fff", borderRadius: "10px", minWidth: 160 }}
            />
          )}

          {/* Adults */}
          <TextField
            label="Adults"
            type="number"
            inputProps={{ min: 1, max: 9 }}
            value={adults}
            onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
            sx={{ background: "#fff", borderRadius: "10px", minWidth: 100 }}
          />

          {/* Travel Class */}
          <TextField
            select
            label="Class"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ background: "#fff", borderRadius: "10px", minWidth: 120 }}
          >
            <option value="">Any</option>
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </TextField>

          {/* Non-stop */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: "10px",
              px: 2,
              py: 1,
            }}
          >
            <input
              type="checkbox"
              checked={nonStop}
              onChange={(e) => setNonStop(e.target.checked)}
              style={{ marginRight: 8 }}
              id="nonStopCheckbox"
            />
            <label
              htmlFor="nonStopCheckbox"
              style={{ color: "#232526", fontWeight: 500 }}
            >
              Non-stop only
            </label>
          </Box>

          <Button
            variant="contained"
            disabled={!fromAirport || !toAirport || !departureDate || adults <= 0}
            onClick={handleSearchFlights}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: "0 3px 16px 0 rgba(255,215,0,0.13)",
              fontSize: "1.08rem",
              px: 4,
              py: 1.2,
              letterSpacing: 0.2,
              background: "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
              color: "#232526",
              transition: "background 0.2s, box-shadow 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
                boxShadow: "0 6px 24px 0 rgba(255,215,0,0.18)",
              },
            }}
          >
            {loadingFlights ? <CircularProgress size={20} /> : "Search Flights"}
          </Button>
        </Box>

        {/* Results */}
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          {loadingFlights ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography align="center" color="#ededed" sx={{ mt: 2 }}>
                Loading flight results...
              </Typography>
            </Box>
          ) : !flights || flights.length === 0 ? (
            <Typography align="center" color="#ededed" sx={{ py: 4 }}>
              No flight results yet.
            </Typography>
          ) : (
            (flights as Array<{ itineraries: Array<{ segments: Array<{ departure: { iataCode: string; at: string }; arrival: { iataCode: string; at: string } }> }>; price: { total: string; currency: string } }> ).map((flight, index) => (
              <Box
                key={index}
                sx={{
                  background: "#fffbe6",
                  mb: 3,
                  p: 3,
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(255,215,0,0.10)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#FFD700", fontWeight: 700 }}
                >
                  {flight.itineraries[0]?.segments[0]?.departure.iataCode} → {flight.itineraries[0]?.segments[flight.itineraries[0]?.segments.length-1]?.arrival.iataCode}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                  {/* Outbound segments */}
                  <Typography sx={{ color: '#232526', fontWeight: 600, fontSize: '1.05rem' }}>Outbound:</Typography>
                  {flight.itineraries[0]?.segments.map((seg, i) => (
                    <Typography key={i} sx={{ color: '#232526', fontSize: '0.98rem' }}>
                      {seg.departure.iataCode} → {seg.arrival.iataCode} | {seg.departure.at?.slice(0,16).replace('T',' ')} → {seg.arrival.at?.slice(0,16).replace('T',' ')}
                    </Typography>
                  ))}
                </Box>
                {flight.itineraries[1] && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                    <Typography sx={{ color: '#232526', fontWeight: 600, fontSize: '1.05rem' }}>Return:</Typography>
                    {flight.itineraries[1]?.segments.map((seg, i) => (
                      <Typography key={i} sx={{ color: '#232526', fontSize: '0.98rem' }}>
                        {seg.departure.iataCode} → {seg.arrival.iataCode} | {seg.departure.at?.slice(0,16).replace('T',' ')} → {seg.arrival.at?.slice(0,16).replace('T',' ')}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Typography sx={{ color: "#232526", fontWeight: 500 }}>
                  Price: {flight.price?.total} {flight.price?.currency}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </>
  );
}
