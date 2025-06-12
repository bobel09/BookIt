"use client";

import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import { useAirportSearch } from "@/hooks/querys/useAirportSearch";
import { useFlightOffersSearch } from "@/hooks/querys/useFlightOffersSearch";
import { useDebounce } from "@/hooks/useDebounce";
import Navbar from "@/components/Navbar";
import { Airport, Segment, Leg } from "@shared/types/flightDetails";
import Footer from "@/components/Footer";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import InPageLoader from "@/components/InPageLoader";
import FullPageLoader from "@/components/FullPageLoader";
import SortIcon from "@mui/icons-material/Sort";
import SearchFlightParamsHandler from "./SearchFlightParamsHandler";

export default function PlanesSearchPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const router = useRouter();

  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [nonStop] = useState(false);
  const [enableReturn, setEnableReturn] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [flightSearchParams, setFlightSearchParams] = useState<{
    from: string;
    to: string;
    depart: string;
    returnDate?: string;
    adults: number;
    cabinClass: string;
    currency: string;
    nonStop: boolean;
  } | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const userCurrency = useMemo(
    () => user?.preferences?.currency || "USD",
    [user]
  );
  const debouncedFromInput = useDebounce(fromInput, 400);
  const debouncedToInput = useDebounce(toInput, 400);

  const fromSearch = useAirportSearch(debouncedFromInput);
  const toSearch = useAirportSearch(debouncedToInput);

  const canSearchFlights = useMemo(
    () =>
      fromAirport?.code &&
      toAirport?.code &&
      departureDate &&
      adults > 0 &&
      userCurrency &&
      (!enableReturn || returnDate),
    [
      fromAirport,
      toAirport,
      departureDate,
      returnDate,
      adults,
      userCurrency,
      enableReturn,
    ]
  );

  const { data: flights, isLoading: loadingFlights } = useFlightOffersSearch(
    flightSearchParams || {
      from: fromAirport?.id || "",
      to: toAirport?.id || "",
      depart: departureDate,
      returnDate: enableReturn ? returnDate : undefined,
      adults,
      cabinClass: travelClass,
      currency: userCurrency,
      nonStop,
    }
  );

  const handleSearchFlights = () => {
    if (canSearchFlights && fromAirport && toAirport) {
      setSearchTriggered(true);
      setFlightSearchParams({
        from: fromAirport.id,
        to: toAirport.id,
        depart: departureDate,
        returnDate: enableReturn ? returnDate : undefined,
        adults,
        cabinClass: travelClass,
        currency: userCurrency,
        nonStop,
      });
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);
  const flightTagsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    flights?.flightDeals?.forEach((deal: any) => {
      const tag =
        deal.key === "CHEAPEST"
          ? "Cheapest"
          : deal.key === "FASTEST"
          ? "Fastest"
          : deal.key === "BEST"
          ? "Best"
          : null;
      if (tag && deal.offerToken) {
        if (!map.has(deal.offerToken)) {
          map.set(deal.offerToken, []);
        }
        map.get(deal.offerToken)?.push(tag);
      }
    });
    return map;
  }, [flights]);

  // Helper to extract price as number for sorting
  const getOfferPrice = (offer: any) => {
    const priceObj =
      offer.priceBreakdown?.total || offer.unifiedPriceBreakdown?.price;
    if (!priceObj) return Number.POSITIVE_INFINITY;
    const units = Number(priceObj.units) || 0;
    const nanos = Number(priceObj.nanos) || 0;
    return units + nanos / 1e9;
  };

  if (userLoading) return <FullPageLoader text="Loading profile..." />;

  return (
    <>
      <Suspense fallback={null}>
        <SearchFlightParamsHandler
          setFromAirport={setFromAirport}
          setToAirport={setToAirport}
          setDepartureDate={setDepartureDate}
          setReturnDate={setReturnDate}
          setEnableReturn={setEnableReturn}
          setAdults={setAdults}
          setTravelClass={setTravelClass}
          setFlightSearchParams={setFlightSearchParams}
          setSearchTriggered={setSearchTriggered}
          userCurrency={userCurrency}
          nonStop={nonStop}
        />
      </Suspense>
      <Navbar username={user?.username || "Guest"} />
      <Box
        sx={{
          width: "100vw",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              p: 4,
              minHeight: "90vh",
              background:
                "linear-gradient(120deg, #232526 0%, #1e1e1e 60%, #101010 100%)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 6, mt: 2 }}>
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
                Find Your{" "}
                <Box
                  component="span"
                  sx={{ color: "#FFD700", fontWeight: 900 }}
                >
                  Flight
                </Box>{" "}
                ✈️
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#white",
                  mb: 3.5,
                  maxWidth: "520px",
                  margin: "0 auto",
                  fontWeight: 400,
                  fontSize: { xs: "1.05rem", sm: "1.13rem" },
                  lineHeight: 1.6,
                  letterSpacing: 0.01,
                }}
              >
                Search and compare flights to your next destination.
                <br />
                Enter your departure and arrival cities, select a date, and
                discover the best options for your journey.
              </Typography>
            </Box>

            {/* Flight search section */}
            <Box
              sx={{
                background: "#fff",
                borderRadius: "18px",
                boxShadow: "0 2px 12px 0 rgba(30,30,30,0.07)",
                border: "1px solid #ececec",
                p: { xs: 2, sm: 3 },
                mb: 6,
                maxWidth: 900,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                position: "relative",
                transition: "box-shadow 0.2s",
              }}
            >
              {/* From/To stacked with icon */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <Autocomplete
                  options={fromSearch.data || []}
                  getOptionLabel={(option) =>
                    option.name
                      ? `${option.name} (${option.code})`
                      : option.code
                  }
                  onInputChange={(_, value) => setFromInput(value)}
                  value={fromAirport}
                  onChange={(_, value) => setFromAirport(value)}
                  loading={fromSearch.isLoading}
                  sx={{
                    width: "100%",
                    background: "#fafafa",
                    borderRadius: "12px",
                    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)",
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="From"
                      placeholder="City or airport"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
                {/* Icon between fields */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    my: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      background: "black",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px 0 rgba(255,215,0,0.10)",
                    }}
                  >
                    <FlightLandIcon />
                  </Box>
                </Box>
                <Autocomplete
                  options={toSearch.data || []}
                  getOptionLabel={(option) =>
                    option.name
                      ? `${option.name} (${option.code})`
                      : option.code
                  }
                  onInputChange={(_, value) => setToInput(value)}
                  value={toAirport}
                  onChange={(_, value) => setToAirport(value)}
                  loading={toSearch.isLoading}
                  sx={{
                    width: "100%",
                    background: "#fafafa",
                    borderRadius: "12px",
                    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)",
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To"
                      placeholder="City or airport"
                      variant="outlined"
                      size="small"
                    />
                  )}
                />
              </Box>
              {/* Other fields in a responsive row */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <TextField
                  label="Departure"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 120,
                    flex: 1,
                    background: "#fafafa",
                    borderRadius: "10px",
                  }}
                />
                <TextField
                  select
                  label="Type"
                  value={enableReturn ? "round" : "oneway"}
                  onChange={(e) => setEnableReturn(e.target.value === "round")}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 90,
                    flex: 1,
                    background: "#fafafa",
                    borderRadius: "10px",
                  }}
                >
                  <option value="oneway">One Way</option>
                  <option value="round">Round Trip</option>
                </TextField>
                {enableReturn && (
                  <TextField
                    label="Return"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      minWidth: 120,
                      flex: 1,
                      background: "#fafafa",
                      borderRadius: "10px",
                    }}
                  />
                )}
                <TextField
                  label="Adults"
                  type="number"
                  inputProps={{ min: 1, max: 9 }}
                  value={adults}
                  onChange={(e) =>
                    setAdults(Math.max(1, Number(e.target.value)))
                  }
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 80,
                    flex: 1,
                    background: "#fafafa",
                    borderRadius: "10px",
                  }}
                />
                <TextField
                  select
                  label="Class"
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 110,
                    flex: 1,
                    background: "#fafafa",
                    borderRadius: "10px",
                  }}
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </TextField>
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
                  fontSize: "1.08rem",
                  px: 4,
                  py: 1.2,
                  letterSpacing: 0.2,
                  background:
                    "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
                  color: "#232526",
                  minHeight: 44,
                  minWidth: 150,
                  boxShadow: "0 2px 8px 0 rgba(255,215,0,0.10)",
                  transition: "background 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
                    boxShadow: "0 6px 24px 0 rgba(255,215,0,0.18)",
                  },
                }}
              >
                Search Flights
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
                <InPageLoader text="Loading flight results..." />
              ) : flights?.status === "error" ? (
                <Typography align="center" color="#ff5252" sx={{ py: 4 }}>
                  {flights?.message ||
                    "An error occurred while fetching flights."}
                </Typography>
              ) : flights?.flightOffers && flights.flightOffers.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Sort dropdown, only show if there are results */}
                  {searchTriggered &&
                    flights?.flightOffers &&
                    flights.flightOffers.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mb: 2,
                        }}
                      >
                        <TextField
                          select
                          size="small"
                          value={sortOrder}
                          onChange={(e) =>
                            setSortOrder(e.target.value as "asc" | "desc")
                          }
                          sx={{
                            minWidth: 150,
                            background: "#fffbe6",
                            borderRadius: "10px",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#FFD700",
                                borderWidth: 2,
                              },
                              "&:hover fieldset": {
                                borderColor: "#FFD700",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#FFD700",
                              },
                            },
                          }}
                          SelectProps={{ native: true }}
                          InputProps={{
                            startAdornment: (
                              <SortIcon sx={{ mr: 1, color: "#bfa600" }} />
                            ),
                          }}
                        >
                          <option value="asc">Price: Low to High</option>
                          <option value="desc">Price: High to Low</option>
                        </TextField>
                      </Box>
                    )}
                  {/* Sort flightOffers by price */}
                  {[...flights.flightOffers]
                    .sort((a, b) => {
                      const priceA = getOfferPrice(a);
                      const priceB = getOfferPrice(b);
                      return sortOrder === "asc"
                        ? priceA - priceB
                        : priceB - priceA;
                    })
                    .map((offer: any) => {
                      const priceObj =
                        offer.priceBreakdown?.total ||
                        offer.unifiedPriceBreakdown?.price;
                      const price = priceObj
                        ? `${priceObj.units}${
                            priceObj.nanos
                              ? `.${priceObj.nanos / 10000000}`
                              : ""
                          }`
                        : "N/A";
                      const currency = priceObj?.currencyCode || userCurrency;
                      const firstLeg = offer.segments?.[0]?.legs?.[0];
                      const logo = firstLeg?.carriersData?.[0]?.logo;
                      const airlineName = firstLeg?.carriersData?.[0]?.name;
                      const tags = flightTagsMap.get(offer.token) || [];
                      const sticker = tags.join(" · ");

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
                            position: "relative", // Add relative positioning for sticker
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
                              from: fromAirport?.id || "",
                              to: toAirport?.id || "",
                              departure_date: departureDate,
                              return_date: enableReturn ? returnDate : "",
                              adults: adults.toString(),
                              travel_class: travelClass,
                              non_stop: nonStop ? "1" : "0",
                            });
                            router.push(
                              `/planes/flight-details?${params.toString()}`
                            );
                          }}
                        >
                          {/* Airline logo */}
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
                              {sticker && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: -10,
                                    right: -10,
                                    background: "#ffd700",
                                    color: "#232526",
                                    padding: "4px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  }}
                                >
                                  {sticker}
                                </Box>
                              )}

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
                          {/* Flight details */}
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
                                        boxShadow:
                                          "0 2px 8px 0 rgba(0,0,0,0.04)",
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
                                                seg.legs[legIdx - 1]
                                                  ?.arrivalTime &&
                                                leg.departureTime
                                              ) {
                                                const prevLeg =
                                                  seg.legs[legIdx - 1];
                                                const prevArrival =
                                                  prevLeg.arrivalTime
                                                    ? new Date(
                                                        prevLeg.arrivalTime
                                                      )
                                                    : null;
                                                const thisDeparture =
                                                  leg.departureTime
                                                    ? new Date(
                                                        leg.departureTime
                                                      )
                                                    : null;
                                                if (
                                                  prevArrival &&
                                                  thisDeparture
                                                ) {
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
                                                      hours > 0
                                                        ? hours + "h "
                                                        : ""
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
                                                    {leg.carriersData?.[0]
                                                      ?.logo && (
                                                      <img
                                                        src={
                                                          leg.carriersData[0]
                                                            .logo
                                                        }
                                                        alt={
                                                          leg.carriersData[0]
                                                            .name || "Airline"
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
                                                        {leg.flightInfo
                                                          ?.flightNumber
                                                          ? `#${leg.flightInfo.flightNumber}`
                                                          : ""}
                                                      </Typography>
                                                      <Typography
                                                        sx={{
                                                          color: "#555",
                                                          fontSize: "0.96rem",
                                                        }}
                                                      >
                                                        {
                                                          leg.departureAirport
                                                            ?.code
                                                        }{" "}
                                                        (
                                                        {
                                                          leg.departureAirport
                                                            ?.cityName
                                                        }
                                                        ){" "}
                                                        {leg.departureTime
                                                          ?.replace("T", " ")
                                                          .slice(0, 16)}{" "}
                                                        →{" "}
                                                        {
                                                          leg.arrivalAirport
                                                            ?.code
                                                        }{" "}
                                                        (
                                                        {
                                                          leg.arrivalAirport
                                                            ?.cityName
                                                        }
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
                                                        Cabin:{" "}
                                                        {leg.cabinClass || "-"}
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
        </Box>
        <Footer />
      </Box>
    </>
  );
}
