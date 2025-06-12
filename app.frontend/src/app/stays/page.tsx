"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import { useSearchDestination } from "@/hooks/querys/useSearchDestination";
import { useSearchHotels } from "@/hooks/querys/useSearchHotels";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import FullPageLoader from "@/components/FullPageLoader";
import InPageLoader from "@/components/InPageLoader";

export default function StaysPage() {
  const { data: user, isLoading: userLoading, isError } = useCurrentUser();
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
  const [sortOption, setSortOption] = useState("price_low_high");

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

  // Sorting logic for hotels
  const sortedHotels = hotelsSearch.data?.data?.hotels
    ? [...hotelsSearch.data.data.hotels].sort((a, b) => {
        const getPrice = (hotel: {
          property: { priceBreakdown: { grossPrice: { value: any } } };
        }) => hotel.property.priceBreakdown?.grossPrice?.value || 0;
        const getReview = (hotel: { property: { reviewScore: any } }) =>
          hotel.property.reviewScore || 0;
        if (sortOption === "price_low_high") {
          return getPrice(a) - getPrice(b);
        } else if (sortOption === "price_high_low") {
          return getPrice(b) - getPrice(a);
        } else if (sortOption === "review_high_low") {
          return getReview(b) - getReview(a);
        }
        return 0;
      })
    : [];

  if (userLoading) return <FullPageLoader text="Loading profile..." />;
  if (isError || !user) {
    return <Typography>Error loading profile</Typography>;
  }

  return (
    <>
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
              <Box component="span" sx={{ color: "#FFD700", fontWeight: 900 }}>
                Stay
              </Box>{" "}
              🏨
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
              Search for hotels in your destination city.
              <br />
              Enter your city, dates, and preferences to discover the best
              places to stay.
            </Typography>
          </Box>

          {/* Hotel search section */}
          <Box
            sx={{
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 2px 12px 0 rgba(30,30,30,0.07)",
              border: "1px solid #ececec",
              p: { xs: 2, sm: 3 },
              mb: 5,
              maxWidth: 800,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              position: "relative",
              transition: "box-shadow 0.2s",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: "100%",
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
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  background: "#fafafa",
                  borderRadius: "12px",
                  boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destination"
                    placeholder="Search city or hotel"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              <TextField
                label="Check-in"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={checkinDate}
                onChange={(e) => setCheckinDate(e.target.value)}
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
                label="Check-out"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 120,
                  flex: 1,
                  background: "#fafafa",
                  borderRadius: "10px",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                label="Adults"
                type="number"
                inputProps={{ min: 1, max: 9 }}
                value={adults}
                onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
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
                label="Rooms"
                type="number"
                inputProps={{ min: 1, max: 5 }}
                value={roomQty}
                onChange={(e) =>
                  setRoomQty(Math.max(1, Number(e.target.value)))
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
                Search Hotels
              </Button>
            </Box>
          </Box>

          {/* Results */}
          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            {/* Sort dropdown */}
            {searchTriggered &&
              hotelsSearch.data &&
              hotelsSearch.data.data &&
              hotelsSearch.data.data.hotels.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mb: 2,
                    gap: 1.5,
                  }}
                >
                  <TextField
                    select
                    size="small"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    variant="outlined"
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
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="price_low_high">Price: Low to High</option>
                    <option value="price_high_low">Price: High to Low</option>
                    <option value="review_high_low">
                      Review Score: Highest
                    </option>
                  </TextField>
                </Box>
              )}
            {hotelsSearch.isLoading ? (
              <InPageLoader text="Loading hotel results..." />
            ) : !searchTriggered ||
              !hotelsSearch.data ||
              !hotelsSearch.data.data ||
              hotelsSearch.data.data.length === 0 ? (
              <Typography align="center" color="#ededed" sx={{ py: 4 }}>
                No hotel results yet.
              </Typography>
            ) : (
              sortedHotels.map(
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
                    {hotel.property.photoUrls &&
                      hotel.property.photoUrls[0] && (
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
                          color: "black",
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
                              color: "black",
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
        <Footer />
      </Box>
    </>
  );
}
