"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import { useSearchDestination } from "@/hooks/querys/useSearchDestination";
import { useSearchHotels } from "@/hooks/querys/useSearchHotels";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function StaysPage() {
  const { data: user, isError } = useCurrentUser();
  const [destinationInput, setDestinationInput] = useState("");
  interface Destination {
    dest_id: string;
    label?: string;
    name?: string;
  }
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [roomQty, setRoomQty] = useState(1);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const destinationSearch = useSearchDestination(destinationInput);
  const hotelsSearch = useSearchHotels(
    {
      dest_id: selectedDestination?.dest_id || "",
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      adults,
      room_qty: roomQty,
      currency: user?.preferences?.currency || "USD",
    },
    searchTriggered
  );

  const params = useSearchParams();

  useEffect(() => {
    const dest_id = params.get("dest_id");
    const checkin_date = params.get("checkin_date");
    const checkout_date = params.get("checkout_date");
    const adultsParam = params.get("adults");
    const room_qty = params.get("room_qty");
    if (dest_id) setSelectedDestination({ dest_id });
    if (checkin_date) setCheckinDate(checkin_date);
    if (checkout_date) setCheckoutDate(checkout_date);
    if (adultsParam) setAdults(Number(adultsParam));
    if (room_qty) setRoomQty(Number(room_qty));
    if (dest_id && checkin_date && checkout_date && adultsParam && room_qty) {
      setSearchTriggered(true);
    }
  }, [params]);

  const handleSearchHotels = () => {
    setSearchTriggered(true);
  };

  if (isError || !user) {
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
            Find Your Stay 🏨
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
            Search for hotels in your destination city. Enter your city, dates,
            and preferences to discover the best places to stay.
          </Typography>
        </Box>

        {/* Hotel search section */}
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
          <Autocomplete
            options={destinationSearch.data?.data || []}
            getOptionLabel={(option) => option.label || option.name || ""}
            inputValue={destinationInput}
            onInputChange={(_, value) => setDestinationInput(value)}
            value={selectedDestination}
            onChange={(_, value) => setSelectedDestination(value)}
            loading={destinationSearch.isLoading}
            sx={{ minWidth: 220, background: "#fff", borderRadius: "10px" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination"
                placeholder="Search city or hotel"
                sx={{ borderRadius: "10px" }}
              />
            )}
          />

          <TextField
            label="Check-in"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
            sx={{ background: "#fff", borderRadius: "10px", minWidth: 140 }}
          />

          <TextField
            label="Check-out"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            sx={{ background: "#fff", borderRadius: "10px", minWidth: 140 }}
          />

          <TextField
            label="Adults"
            type="number"
            inputProps={{ min: 1, max: 9 }}
            value={adults}
            onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
            sx={{ background: "#fff", borderRadius: "10px", minWidth: 100 }}
          />

          <TextField
            label="Rooms"
            type="number"
            inputProps={{ min: 1, max: 5 }}
            value={roomQty}
            onChange={(e) => setRoomQty(Math.max(1, Number(e.target.value)))}
            sx={{ background: "#fff", borderRadius: "10px", minWidth: 100 }}
          />

          <Button
            variant="contained"
            disabled={
              !selectedDestination ||
              !checkinDate ||
              !checkoutDate ||
              adults <= 0 ||
              roomQty <= 0
            }
            onClick={handleSearchHotels}
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
            {hotelsSearch.isLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Search Hotels"
            )}
          </Button>
        </Box>

        {/* Results */}
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          {hotelsSearch.isLoading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography align="center" color="#ededed" sx={{ mt: 2 }}>
                Loading hotel results...
              </Typography>
            </Box>
          ) : !searchTriggered ||
            !hotelsSearch.data ||
            !hotelsSearch.data.data ||
            hotelsSearch.data.data.length === 0 ? (
            <Typography align="center" color="#ededed" sx={{ py: 4 }}>
              No hotel results yet.
            </Typography>
          ) : (
            hotelsSearch.data.data.hotels.map(
              (
                hotel: {
                  hotel_id: number;
                  accessibilityLabel?: string;
                  property: {
                    priceBreakdown: any;
                    reviewCount: any;
                    name: string;
                    photoUrls?: string[];
                    reviewScore?: number;
                    reviewScoreWord?: string;
                  };
                },
                index: number
              ) => (
                <Box
                  key={hotel.hotel_id || index}
                  sx={{
                    background: "#fffbe6",
                    mb: 3,
                    p: { xs: 2, sm: 3 },
                    borderRadius: "20px",
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
                      hotel_id: hotel.hotel_id.toString(),
                      arrival_date: checkinDate,
                      departure_date: checkoutDate,
                      adults: adults.toString(),
                      // Add search context for back navigation
                      dest_id: selectedDestination?.dest_id || "",
                      checkin_date: checkinDate,
                      checkout_date: checkoutDate,
                      room_qty: roomQty.toString(),
                    });
                    window.location.href = `/stays/hotel-details?${params.toString()}`;
                  }}
                >
                  {hotel.property.photoUrls && hotel.property.photoUrls[0] && (
                    <Box
                      sx={{
                        minWidth: 110,
                        minHeight: 110,
                        width: 110,
                        height: 110,
                        borderRadius: "16px",
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
                      <Image
                        src={hotel.property.photoUrls[0]}
                        alt={hotel.property.name}
                        width={110}
                        height={110}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        unoptimized
                      />
                    </Box>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FFD700",
                        fontWeight: 700,
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                        mb: 0.5,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                      }}
                    >
                      {hotel.property.name}
                    </Typography>
                    {/* Show price, currency, and review count */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 0.5,
                      }}
                    >
                      {hotel.property.priceBreakdown?.grossPrice?.value && (
                        <Typography
                          sx={{
                            color: "#FFD700",
                            fontWeight: 700,
                            fontSize: "1.08rem",
                          }}
                        >
                          {hotel.property.priceBreakdown.grossPrice.value.toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          )}{" "}
                          {user?.preferences?.currency ||
                            hotel.property.priceBreakdown.grossPrice.currency}
                        </Typography>
                      )}
                      {hotel.property.reviewCount && (
                        <Typography
                          sx={{
                            color: "#232526",
                            fontWeight: 500,
                            fontSize: "1.05rem",
                          }}
                        >
                          {hotel.property.reviewCount} reviews
                        </Typography>
                      )}
                    </Box>
                    {hotel.property.reviewScore && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            background: "#FFD700",
                            color: "#232526",
                            fontWeight: 700,
                            borderRadius: "8px",
                            px: 1.2,
                            py: 0.2,
                            fontSize: "1rem",
                            display: "inline-block",
                          }}
                        >
                          {hotel.property.reviewScore}
                        </Box>
                        <Typography
                          sx={{
                            color: "#232526",
                            fontWeight: 500,
                            fontSize: "1rem",
                          }}
                        >
                          {hotel.property.reviewScoreWord
                            ? `(${hotel.property.reviewScoreWord})`
                            : ""}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )
            )
          )}
        </Box>
      </Box>
    </>
  );
}
