"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import { useFlightDetails } from "@/hooks/querys/useFlightDetails";
import Navbar from "@/components/Navbar";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import {
  Segment,
  Leg,
  BaggagePolicy,
  TravellerCabinLuggage,
} from "@shared/types/flightDetails";
import FullPageLoader from "@/components/FullPageLoader";
import ErrorPage from "../../error";
import SearchFlightDetailsParamsHandler from "./SearchFlightDetailsParamsHandler";

export default function FlightDetailsPage() {
  const { data: user, isLoading: userLoading, isError } = useCurrentUser();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [currency, setCurrency] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departure_date, setDepartureDate] = useState("");
  const [return_date, setReturnDate] = useState("");
  const [adults, setAdults] = useState("");
  const [travel_class, setTravelClass] = useState("");
  const [non_stop, setNonStop] = useState("");

  const { data, isLoading, error } = useFlightDetails({ token, currency });

  // Restore variable assignments using state variables
  const segments: Segment[] = data?.segments || [];
  const priceObj =
    data?.priceBreakdown?.total || data?.unifiedPriceBreakdown?.price;
  const price = priceObj
    ? `${priceObj.units}${
        priceObj.nanos
          ? "." + String(priceObj.nanos).padStart(9, "0").replace(/0+$/, "")
          : ""
      }`
    : "-";
  const currencyCode = priceObj?.currencyCode || currency;
  const baggagePolicies = data?.baggagePolicies || [];
  const firstLeg = segments[0]?.legs?.[0];
  const logo = firstLeg?.carriersData?.[0]?.logo;
  const airlineName = firstLeg?.carriersData?.[0]?.name || "Unknown Airline";
  const bookingUrl = `https://flights.booking.com/flights/${from}.AIRPORT-${to}.AIRPORT/${token}?type=ONEWAY&adults=1&depart=${departure_date}&cabinClass=${travel_class}`;
  const travellerCabinLuggage = data?.travellerCabinLuggage || [];

  if (userLoading || isLoading) {
    return <FullPageLoader text="Loading flight details..." />;
  }
  if (isError || !user) {
    return <ErrorPage />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <SearchFlightDetailsParamsHandler
          setToken={setToken}
          setCurrency={setCurrency}
          setFrom={setFrom}
          setTo={setTo}
          setDepartureDate={setDepartureDate}
          setReturnDate={setReturnDate}
          setAdults={setAdults}
          setTravelClass={setTravelClass}
          setNonStop={setNonStop}
        />
      </Suspense>
      <Navbar username={user.username} />
      <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
        <Button
          onClick={() => {
            // Go back to planes page with search context
            const searchParams = new URLSearchParams({
              from,
              to,
              departure_date,
              return_date,
              adults,
              travel_class,
              non_stop,
            });
            window.location.href = `/planes?${searchParams.toString()}`;
          }}
          sx={{ mb: 2 }}
        >
          &larr; Back to results
        </Button>
        <Box
          sx={{
            background: "#fffbe6",
            borderRadius: "20px",
            boxShadow: "0 4px 16px 0 rgba(255,215,0,0.10)",
            p: { xs: 2, sm: 4 },
            mb: 3,
          }}
        >
          {/* Airline Logo and Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            {logo && (
              <Box
                sx={{
                  minWidth: 60,
                  minHeight: 60,
                  width: 60,
                  height: 60,
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  background: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={logo}
                  alt={airlineName || "Airline"}
                  width={60}
                  height={60}
                  style={{ objectFit: "contain" }}
                />
              </Box>
            )}
            <Typography variant="h4" sx={{ color: "#FFD700", fontWeight: 700 }}>
              {airlineName || "Flight"}
            </Typography>
          </Box>
          {/* Price */}
          {price && (
            <Typography
              sx={{
                color: "#232526",
                fontWeight: 600,
                fontSize: "1.15rem",
                mb: 1,
              }}
            >
              Price:{" "}
              <span style={{ color: "#FFD700" }}>
                {price} {currencyCode}
              </span>
            </Typography>
          )}
          {/* Segments and Legs */}
          {segments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {segments.map((seg: Segment, segIdx: number) => (
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
                    sx={{ fontWeight: 600, color: "#232526", mb: 0.5 }}
                  >
                    Segment {segIdx + 1}: {seg.departureAirport?.code} (
                    {seg.departureAirport?.cityName}) →{" "}
                    {seg.arrivalAirport?.code} ({seg.arrivalAirport?.cityName})
                  </Typography>
                  <Typography
                    sx={{ color: "#555", fontSize: "0.97rem", mb: 1 }}
                  >
                    {seg.departureTime?.replace("T", " ").slice(0, 16)} →{" "}
                    {seg.arrivalTime?.replace("T", " ").slice(0, 16)}
                  </Typography>
                  {Array.isArray(seg.legs) && seg.legs.length > 0 && (
                    <Box>
                      {seg.legs.map((leg: Leg, legIdx: number) => {
                        // Layover calculation
                        let layover = null;
                        if (
                          legIdx > 0 &&
                          seg.legs &&
                          seg.legs[legIdx - 1]?.arrivalTime &&
                          leg.departureTime
                        ) {
                          const prevLeg = seg.legs[legIdx - 1];
                          const prevArrival = prevLeg.arrivalTime
                            ? new Date(prevLeg.arrivalTime)
                            : null;
                          const thisDeparture = leg.departureTime
                            ? new Date(leg.departureTime)
                            : null;
                          if (prevArrival && thisDeparture) {
                            const diffSec =
                              (thisDeparture.getTime() -
                                prevArrival.getTime()) /
                              1000;
                            if (!isNaN(diffSec) && diffSec > 0) {
                              const hours = Math.floor(diffSec / 3600);
                              const mins = Math.floor((diffSec % 3600) / 60);
                              layover = `${
                                hours > 0 ? hours + "h " : ""
                              }${mins}m layover in ${
                                leg.departureAirport?.cityName ||
                                leg.departureAirport?.code
                              }`;
                            }
                          }
                        }
                        return (
                          <div key={legIdx}>
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
                                  alt={leg.carriersData[0].name || "Airline"}
                                  width={32}
                                  height={32}
                                  style={{
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
                                  {leg.carriersData?.[0]?.name ||
                                    "Unknown Airline"}{" "}
                                  {leg.flightInfo?.flightNumber
                                    ? `#${leg.flightInfo.flightNumber}`
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{ color: "#555", fontSize: "0.96rem" }}
                                >
                                  {leg.departureAirport?.code} (
                                  {leg.departureAirport?.cityName}){" "}
                                  {leg.departureTime
                                    ?.replace("T", " ")
                                    .slice(0, 16)}{" "}
                                  → {leg.arrivalAirport?.code} (
                                  {leg.arrivalAirport?.cityName}){" "}
                                  {leg.arrivalTime
                                    ?.replace("T", " ")
                                    .slice(0, 16)}
                                </Typography>
                                <Typography
                                  sx={{ color: "#888", fontSize: "0.93rem" }}
                                >
                                  Cabin: {leg.cabinClass || "-"}
                                </Typography>
                              </Box>
                            </Box>
                          </div>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
          {/* Book Button */}
          {bookingUrl && (
            <Button
              variant="contained"
              color="primary"
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                mt: 2,
                background: "#FFD700",
                color: "#232526",
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.2,
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px 0 rgba(255,215,0,0.13)",
                "&:hover": { background: "#e6c200" },
              }}
            >
              Book this flight
            </Button>
          )}
          {/* Baggage Policies */}
          {baggagePolicies.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#FFD700", fontWeight: 700, mb: 2 }}
              >
                Baggage Policies
              </Typography>
              {baggagePolicies.map((policy: BaggagePolicy, idx: number) => (
                <Box key={idx} sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      color: "#232526",
                      fontWeight: 500,
                      fontSize: "1.05rem",
                    }}
                  >
                    {policy.name}:{" "}
                    <a
                      href={policy.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Details
                    </a>
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          {/* Traveller Cabin Luggage */}
          {travellerCabinLuggage.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#FFD700", fontWeight: 700, mb: 2 }}
              >
                Cabin Luggage
              </Typography>
              {travellerCabinLuggage.map(
                (luggage: TravellerCabinLuggage, idx: number) => (
                  <Box key={idx} sx={{ mb: 1 }}>
                    <Typography
                      sx={{
                        color: "#232526",
                        fontWeight: 500,
                        fontSize: "1.05rem",
                      }}
                    >
                      Type: {luggage.luggageAllowance.luggageType}, Weight:{" "}
                      {luggage.luggageAllowance.maxWeightPerPiece}{" "}
                      {luggage.luggageAllowance.massUnit}, Size:{" "}
                      {luggage.luggageAllowance.sizeRestrictions.maxLength}x
                      {luggage.luggageAllowance.sizeRestrictions.maxWidth}x
                      {luggage.luggageAllowance.sizeRestrictions.maxHeight}{" "}
                      {luggage.luggageAllowance.sizeRestrictions.sizeUnit}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
