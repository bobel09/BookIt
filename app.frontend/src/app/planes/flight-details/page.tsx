 "use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useFlightDetails } from "@/hooks/querys/useFlightDetails";
import Navbar from "@/components/Navbar";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";

export default function FlightDetailsPage() {
  const { data: user, isError } = useCurrentUser();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const currency = params.get("currency") || "";
  // Restore search context for back navigation
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departure_date = params.get("departure_date") || "";
  const return_date = params.get("return_date") || "";
  const adults = params.get("adults") || "";
  const travel_class = params.get("travel_class") || "";
  const non_stop = params.get("non_stop") || "";

  const { data, isLoading, error } = useFlightDetails({ token, currency });

  if (isError || !user) {
    return <Typography>Error loading profile</Typography>;
  }

  if (!token) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          Missing flight or search parameters.
        </Typography>
        <Button onClick={() => router.back()} sx={{ mt: 2 }}>
          Back
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading flight details...</Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load flight details.</Typography>
        <Button onClick={() => router.back()} sx={{ mt: 2 }}>
          Back
        </Button>
      </Box>
    );
  }

  // Extract details from API response
  const offer = data.data?.flightOffer || {};
  const priceObj =
    offer.priceBreakdown?.total || offer.unifiedPriceBreakdown?.price;
  const price = priceObj
    ? `${priceObj.units}${
        priceObj.nanos
          ? "." + String(priceObj.nanos).padStart(9, "0").replace(/0+$/, "")
          : ""
      }`
    : "-";
  const currencyCode = priceObj?.currencyCode || currency;
  const validatingAirline = offer.validatingAirlineCodes?.[0] || "";
  const segments = offer.segments || [];
  const firstLeg = segments[0]?.legs?.[0];
  const logo = firstLeg?.carriersData?.[0]?.logo;
  const airlineName = firstLeg?.carriersData?.[0]?.name || validatingAirline;
  const bookingUrl = offer.bookingUrl || "";

  return (
    <>
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
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
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
              {segments.map((seg: any, segIdx: number) => (
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
                      {seg.legs.map((leg: any, legIdx: number) => {
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
        </Box>
      </Box>
    </>
  );
}
