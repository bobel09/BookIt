import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { Segment, Leg, Airport } from "@shared/types/flightDetails";

interface FlightResultCardProps {
  selectedFlight: {
    segments: Segment[];
    priceBreakdown?: any;
    unifiedPriceBreakdown?: any;
    token?: string;
    fromAirport?: Airport;
    toAirport?: Airport;
    tags?: string[];
    [key: string]: any;
  };
}

const FlightResultCard: React.FC<FlightResultCardProps> = ({
  selectedFlight,
}) => {
  if (!selectedFlight) return null;

  const priceObj =
    selectedFlight.priceBreakdown?.total ||
    selectedFlight.unifiedPriceBreakdown?.price;
  const price = priceObj
    ? `${priceObj.units}${
        priceObj.nanos ? `.${priceObj.nanos / 10000000}` : ""
      }`
    : "N/A";
  const currency = priceObj?.currencyCode || "USD";
  const firstLeg = selectedFlight.segments?.[0]?.legs?.[0];
  const logo = firstLeg?.carriersData?.[0]?.logo;
  const airlineName = firstLeg?.carriersData?.[0]?.name;
  const tags = selectedFlight.tags || [];
  const sticker = tags.join(" · ");
  const fromAirport = selectedFlight.fromAirport;
  const toAirport = selectedFlight.toAirport;

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          color: "#232526",
          mb: 2,
          fontWeight: 700,
          letterSpacing: 0.2,
        }}
      >
        Recommended Flight
      </Typography>
      <Box
        sx={{
          background: "#fff",
          borderRadius: "16px",
          border: "1.5px solid #ececec",
          boxShadow: "0 2px 12px 0 rgba(30,30,30,0.06)",
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          alignItems: { xs: "flex-start", sm: "center" },
          position: "relative",
          transition: "box-shadow 0.2s, transform 0.2s",
          "&:hover": {
            boxShadow: "0 6px 24px 0 rgba(30,30,30,0.10)",
            transform: "scale(1.012)",
            cursor: "pointer",
          },
        }}
      >
        {/* Airline logo and sticker */}
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
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              flexShrink: 0,
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {sticker && (
              <Box
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  background: "#fff",
                  color: "#FFD700",
                  border: "2px solid #FFD700",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(255,215,0,0.10)",
                }}
              >
                {sticker}
              </Box>
            )}
            <Image
              src={logo}
              alt={airlineName || "Airline"}
              width={60}
              height={60}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              unoptimized={true}
            />
          </Box>
        )}
        {/* Flight details - all segments and legs */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#232526",
              fontWeight: 700,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              mb: 0.5,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {airlineName || selectedFlight.airline || "Flight"}
          </Typography>
          <Typography
            sx={{
              color: "#232526",
              fontWeight: 600,
              fontSize: "1.08rem",
              mt: 1,
            }}
          >
            {price} {currency}
          </Typography>
          {/* Segments (outbound/return) */}
          {selectedFlight.segments && selectedFlight.segments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {selectedFlight.segments.map((seg: Segment, segIdx: number) => (
                <Box
                  key={segIdx}
                  sx={{
                    mb: 2,
                    p: 2,
                    background: "#f7f6f2", // More visible than #fafafa
                    borderRadius: "10px",
                    border: "1.5px solid #e0d7b8", // Subtle gold-tinted border
                    boxShadow: "0 1px 4px 0 rgba(200,180,60,0.06)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: "#232526", mb: 0.5 }}
                  >
                    Segment {segIdx + 1}: {seg.departureAirport?.code} (
                    {seg.departureAirport?.cityName}) →{" "}
                    {seg.arrivalAirport?.code} ({seg.arrivalAirport?.cityName})
                  </Typography>
                  <Typography
                    sx={{ color: "#444", fontSize: "0.99rem", mb: 1 }}
                  >
                    {seg.departureTime?.replace("T", " ").slice(0, 16)} →{" "}
                    {seg.arrivalTime?.replace("T", " ").slice(0, 16)}
                  </Typography>
                  {seg.legs && seg.legs.length > 0 && (
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
                                <Image
                                  src={leg.carriersData[0].logo}
                                  alt={leg.carriersData[0].name || "Airline"}
                                  width={32}
                                  height={32}
                                  style={{
                                    objectFit: "contain",
                                    borderRadius: 6,
                                    background: "#f5f5f5",
                                  }}
                                  unoptimized={true}
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
                                  sx={{ color: "#888", fontSize: "0.96rem" }}
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
                                  sx={{ color: "#bbb", fontSize: "0.93rem" }}
                                >
                                  Cabin: {leg.cabinClass || "-"}
                                </Typography>
                              </Box>
                            </Box>
                          </React.Fragment>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
          {/* Booking Button (Planes page style) */}
          {selectedFlight?.token && (
            <Button
              variant="contained"
              href={`https://flights.booking.com/flights/${selectedFlight.segments[0].departureAirport.code}.AIRPORT-${selectedFlight.segments[0].arrivalAirport.code}.AIRPORT/${selectedFlight.token}?type=ROUNDTRIP`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                mt: 2,
                background: "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
                color: "#232526",
                fontWeight: 700,
                borderRadius: "10px",
                px: 3,
                py: 1.2,
                fontSize: "1.08rem",
                boxShadow: "0 2px 8px 0 rgba(255,215,0,0.10)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
                },
              }}
            >
              Book this flight
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FlightResultCard;
