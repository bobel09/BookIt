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

// TypeScript interfaces for flight data
interface CarrierData {
  logo?: string;
  name?: string;
}

interface FlightInfo {
  flightNumber?: string;
}

interface Airport {
  id?: string;
  name?: string;
  iataCode?: string;
  code?: string;
  cityName?: string;
}

interface Leg {
  carriersData?: CarrierData[];
  flightInfo?: FlightInfo;
  departureAirport?: Airport;
  arrivalAirport?: Airport;
  departureTime?: string;
  arrivalTime?: string;
  cabinClass?: string;
}

interface Segment {
  departureAirport?: Airport;
  arrivalAirport?: Airport;
  departureTime?: string;
  arrivalTime?: string;
  legs?: Leg[];
}

interface PriceBreakdown {
  total?: { units: string; nanos?: number; currencyCode?: string };
  unifiedPriceBreakdown?: {
    price: { units: string; nanos?: number; currencyCode?: string };
  };
}

interface FlightOffer {
  token: string;
  priceBreakdown?: PriceBreakdown;
  unifiedPriceBreakdown?: {
    price: { units: string; nanos?: number; currencyCode?: string };
  };
  segments?: Segment[];
  validatingAirlineCodes?: string[];
}

export default function PlanesSearchPage() {
  const { data: user } = useCurrentUser();
  const router = useRouter();

  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [travelClass, setTravelClass] = useState<string>("ECONOMY");
  const [nonStop, setNonStop] = useState(false);

  // Only search airports if input is at least 3 characters and not already selected
  const fromSearch = useAirportSearch(
    fromInput.length >= 3 && !fromAirport ? fromInput : ""
  );
  const toSearch = useAirportSearch(
    toInput.length >= 3 && !toAirport ? toInput : ""
  );

  // For return date unlock
  const [enableReturn, setEnableReturn] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const userCurrency = user?.preferences.currency || "USD";

  // Only trigger search when the button is pressed and all fields are assigned
  const [flightSearchParams, setFlightSearchParams] = useState<{
    from: string;
    to: string;
    depart: string;
    returnDate?: string;
    adults: number;
    cabinClass: string;
    currency: string;
  } | null>(null);

  // Only require returnDate if round trip is selected
  const canSearchFlights =
    fromAirport &&
    toAirport &&
    departureDate &&
    adults > 0 &&
    userCurrency &&
    (!enableReturn || returnDate);

  const { data: flights, isLoading: loadingFlights } = useFlightOffersSearch(
    canSearchFlights && flightSearchParams
      ? flightSearchParams
      : {
          from: "",
          to: "",
          depart: "",
          adults: 1,
          cabinClass: "",
          currency: userCurrency,
        }
  );
  console.log("Flights data:", flights);

  const handleSearchFlights = () => {
    if (canSearchFlights) {
      setSearchTriggered(true);
      setFlightSearchParams({
        from: fromAirport.id,
        to: toAirport.id,
        depart: departureDate,
        returnDate: enableReturn ? returnDate : undefined,
        adults,
        cabinClass: travelClass,
        currency: userCurrency,
      });
      console.log(flights);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  // Reset searchTriggered when any search field changes
  useEffect(() => {
    setSearchTriggered(false);
  }, [
    fromAirport,
    toAirport,
    departureDate,
    returnDate,
    adults,
    travelClass,
    nonStop,
    enableReturn,
  ]);

  // Debug: print flightOffers to verify structure
  if (flights?.data?.flightOffers) {
    // eslint-disable-next-line no-console
    console.log("flightOffers:", flights.data.flightOffers);
  }

  return (
    <>
      <Navbar username={user?.username} />
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
              option.name ? `${option.name} (${option.code})` : option.code
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
                placeholder="Search city or airport"
                sx={{ borderRadius: "10px" }}
              />
            )}
          />

          {/* To Airport */}
          <Autocomplete
            options={toSearch.data || []}
            getOptionLabel={(option) =>
              option.name
                ? `${option.name} (${option.iataCode})`
                : option.iataCode
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
                placeholder="Search city or airport"
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
            disabled={
              !fromAirport || !toAirport || !departureDate || adults <= 0
            }
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
          {!searchTriggered ? (
            <Typography align="center" color="#ededed" sx={{ py: 4 }}>
              Please fill in the search fields and click &quot;Search
              Flights&quot; to see results.
            </Typography>
          ) : loadingFlights ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography align="center" color="#ededed" sx={{ mt: 2 }}>
                Loading flight results...
              </Typography>
            </Box>
          ) : flights?.status === "error" ? (
            <Typography align="center" color="#ff5252" sx={{ py: 4 }}>
              {flights?.message || "An error occurred while fetching flights."}
            </Typography>
          ) : flights?.flightOffers && flights.flightOffers.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {flights.flightOffers.map((offer: FlightOffer) => {
                const priceObj =
                  offer.priceBreakdown?.total ||
                  offer.unifiedPriceBreakdown?.price;
                const price = priceObj
                  ? `${priceObj.units}${
                      priceObj.nanos ? `.${priceObj.nanos / 10000000}` : ""
                    }`
                  : "N/A";
                const currency = priceObj?.currencyCode || userCurrency;
                // Use first available logo/name for card header
                const firstLeg = offer.segments?.[0]?.legs?.[0];
                const logo = firstLeg?.carriersData?.[0]?.logo;
                const airlineName = firstLeg?.carriersData?.[0]?.name;
                return (
                  <Box
                    key={offer.token}
                    sx={{
                      background: "#fffbe6",
                      borderRadius: "20px",
                      p: { xs: 2, sm: 3 },
                      boxShadow: "0 4px 16px 0 rgba(255,215,0,0.10)",
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 3,
                      alignItems: { xs: "flex-start", sm: "center" },
                      transition: "box-shadow 0.2s, transform 0.2s",
                      "&:hover": {
                        boxShadow: "0 8px 32px 0 rgba(255,215,0,0.18)",
                        transform: "scale(1.015)",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => {
                      const params = new URLSearchParams({
                        token: offer.token,
                        currency: userCurrency,
                        from: fromAirport?.code || "",
                        to: toAirport?.code || "",
                        departure_date: departureDate,
                        return_date: enableReturn ? returnDate : "",
                        adults: adults.toString(),
                        travel_class: travelClass,
                        non_stop: nonStop ? "1" : "0",
                      });
                      router.push(`/planes/flight-details?${params.toString()}`);
                    }}
                  >
                    {logo && (
                      <Box
                        sx={{
                          minWidth: 60,
                          minHeight: 60,
                          width: 60,
                          height: 60,
                          borderRadius: "12px",
                          overflow: "hidden",
                          mr: { sm: 3 },
                          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                          flexShrink: 0,
                          background: "#eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={logo}
                          alt={airlineName || "Airline"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "Black",
                          fontWeight: 700,
                          fontSize: { xs: "1.1rem", sm: "1.25rem" },
                          mb: 0.5,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          maxWidth: "100%",
                        }}
                      >
                        {airlineName ||
                          offer.validatingAirlineCodes?.join(", ") ||
                          "Unknown Airline"}{" "}
                        Flight
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "Black",
                            fontWeight: 700,
                            fontSize: "1.08rem",
                          }}
                        >
                          {price} {currency}
                        </Typography>
                      </Box>
                      {offer.segments && offer.segments.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {offer.segments.map(
                            (seg: Segment, segIdx: number) => (
                              <Box
                                key={segIdx}
                                sx={{
                                  mb: 2,
                                  p: 2,
                                  background: "#fff",
                                  borderRadius: "12px",
                                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 600,
                                    color: "#232526",
                                    mb: 0.5,
                                  }}
                                >
                                  Segment {segIdx + 1}:{" "}
                                  {seg.departureAirport?.code} (
                                  {seg.departureAirport?.cityName}) →{" "}
                                  {seg.arrivalAirport?.code} (
                                  {seg.arrivalAirport?.cityName})
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#555",
                                    fontSize: "0.97rem",
                                    mb: 1,
                                  }}
                                >
                                  {seg.departureTime
                                    ?.replace("T", " ")
                                    .slice(0, 16)}{" "}
                                  →{" "}
                                  {seg.arrivalTime
                                    ?.replace("T", " ")
                                    .slice(0, 16)}
                                </Typography>
                                {seg.legs && seg.legs.length > 0 && (
                                  <Box>
                                    {seg.legs.map(
                                      (leg: Leg, legIdx: number) => {
                                        // Layover calculation
                                        let layover = null;
                                        if (
                                          legIdx > 0 &&
                                          seg.legs &&
                                          seg.legs[legIdx - 1]?.arrivalTime &&
                                          leg.departureTime
                                        ) {
                                          const prevLeg = seg.legs[legIdx - 1];
                                          const prevArrival =
                                            prevLeg.arrivalTime
                                              ? new Date(prevLeg.arrivalTime)
                                              : null;
                                          const thisDeparture =
                                            leg.departureTime
                                              ? new Date(leg.departureTime)
                                              : null;
                                          if (prevArrival && thisDeparture) {
                                            const diffSec =
                                              (thisDeparture.getTime() -
                                                prevArrival.getTime()) /
                                              1000;
                                            if (
                                              !isNaN(diffSec) &&
                                              diffSec > 0
                                            ) {
                                              const hours = Math.floor(
                                                diffSec / 3600
                                              );
                                              const mins = Math.floor(
                                                (diffSec % 3600) / 60
                                              );
                                              layover = `${
                                                hours > 0 ? hours + "h " : ""
                                              }${mins}m layover in ${
                                                leg.departureAirport
                                                  ?.cityName ||
                                                leg.departureAirport?.code
                                              }`;
                                            }
                                          }
                                        }
                                        return (
                                          <React.Fragment key={legIdx}>
                                            {layover && (
                                              <Typography
                                                sx={{
                                                  color: "#bfa600",
                                                  fontSize: "0.95rem",
                                                  fontWeight: 500,
                                                  mb: 0.5,
                                                  mt: 1,
                                                }}
                                              >
                                                {layover}
                                              </Typography>
                                            )}
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2,
                                                mb: 1,
                                              }}
                                            >
                                              {leg.carriersData?.[0]?.logo && (
                                                <img
                                                  src={leg.carriersData[0].logo}
                                                  alt={
                                                    leg.carriersData[0].name ||
                                                    "Airline"
                                                  }
                                                  style={{
                                                    width: 32,
                                                    height: 32,
                                                    objectFit: "contain",
                                                    borderRadius: 6,
                                                    background: "#f5f5f5",
                                                  }}
                                                />
                                              )}
                                              <Box>
                                                <Typography
                                                  sx={{
                                                    fontWeight: 500,
                                                    color: "#232526",
                                                    fontSize: "1.01rem",
                                                  }}
                                                >
                                                  {leg.carriersData?.[0]
                                                    ?.name ||
                                                    "Unknown Airline"}{" "}
                                                  {leg.flightInfo?.flightNumber
                                                    ? `#${leg.flightInfo.flightNumber}`
                                                    : ""}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    color: "#555",
                                                    fontSize: "0.96rem",
                                                  }}
                                                >
                                                  {leg.departureAirport?.code} (
                                                  {
                                                    leg.departureAirport
                                                      ?.cityName
                                                  }
                                                  ){" "}
                                                  {leg.departureTime
                                                    ?.replace("T", " ")
                                                    .slice(0, 16)}{" "}
                                                  → {leg.arrivalAirport?.code} (
                                                  {leg.arrivalAirport?.cityName}
                                                  ){" "}
                                                  {leg.arrivalTime
                                                    ?.replace("T", " ")
                                                    .slice(0, 16)}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    color: "#888",
                                                    fontSize: "0.93rem",
                                                  }}
                                                >
                                                  Cabin: {leg.cabinClass || "-"}
                                                </Typography>
                                              </Box>
                                            </Box>
                                          </React.Fragment>
                                        );
                                      }
                                    )}
                                  </Box>
                                )}
                              </Box>
                            )
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography align="center" color="#ededed" sx={{ py: 4 }}>
              No results found for your search.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
