"use client";

import { useSearchParams } from "next/navigation";
import { useHotelDetails } from "@/hooks/querys/useHotelDetails";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import FullPageLoader from "@/components/FullPageLoader";
import ErrorPage from "../../error";

export default function HotelDetailsClient() {
  const { data: user, isLoading: userLoading, isError } = useCurrentUser();
  const router = useRouter();
  const params = useSearchParams();
  const hotel_id = params.get("hotel_id") || "";
  const arrival_date = params.get("arrival_date") || "";
  const departure_date = params.get("departure_date") || "";
  const adults = params.get("adults") || "";
  const dest_id = params.get("dest_id") || "";
  const checkin_date = params.get("checkin_date") || "";
  const checkout_date = params.get("checkout_date") || "";
  const room_qty = params.get("room_qty") || "";

  const { data, isLoading, error } = useHotelDetails({
    hotel_id,
    arrival_date,
    departure_date,
    adults,
    currency: user?.preferences?.currency || "USD",
  });

  if (userLoading) return <FullPageLoader text="Loading profile..." />;
  if (isError || !user) return <ErrorPage />;
  if (!hotel_id || !arrival_date || !departure_date || !adults)
    return <ErrorPage />;
  if (isLoading) return <FullPageLoader text="Loading hotel details..." />;
  if (error || !data) return <ErrorPage />;

  const hotel = data.data?.property || {};
  const address = data.data?.accessibilityLabel || data.data?.address || "";
  const price =
    data.data?.product_price_breakdown?.gross_amount?.amount_rounded ||
    data.data?.composite_price_breakdown?.gross_amount?.amount_rounded;
  const currency =
    data.data?.product_price_breakdown?.gross_amount?.currency ||
    data.data?.composite_price_breakdown?.gross_amount?.currency;
  const facilities: { name: string }[] =
    data.data?.facilities_block?.facilities || [];
  const highlightStrip: { name: string }[] =
    data.data?.property_highlight_strip || [];
  const hotelUrl = data.data?.url || "";
  const reviewCount = data.data?.review_nr || hotel.reviewCount || 0;
  const reviewScore = hotel.reviewScore || data.data?.reviewScore;
  const reviewScoreWord = hotel.reviewScoreWord || data.data?.reviewScoreWord;
  const description =
    hotel.description || data.data?.hotel_text?.description || "";
  const city = data.data?.city || "";
  const country = data.data?.country_trans || data.data?.countrycode || "";
  const mainPhotos: string[] = data.data?.photoUrls || [];
  const allRoomPhotos: string[] = (() => {
    const rooms = data.data?.rooms || {};
    let photos: string[] = [];
    Object.values(rooms).forEach((room) => {
      const r = room as {
        photos?: {
          url_max750?: string;
          url_original?: string;
          url_max300?: string;
        }[];
      };
      if (r.photos) {
        photos = photos.concat(
          r.photos.map(
            (p) => p.url_max750 || p.url_original || p.url_max300 || ""
          )
        );
      }
    });
    return photos;
  })();
  const allPhotos = Array.from(
    new Set([...mainPhotos, ...allRoomPhotos])
  ).filter(Boolean);
  const reviews = data.data?.reviews || [];

  return (
    <>
      <Navbar username={user.username} />
      <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
        <Button
          onClick={() => {
            const searchParams = new URLSearchParams({
              dest_id,
              checkin_date,
              checkout_date,
              adults,
              room_qty,
            });
            window.location.href = `/stays?${searchParams.toString()}`;
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
          {allPhotos.length > 0 && (
            <Box sx={{ display: "flex", gap: 2, overflowX: "auto", mb: 2 }}>
              {allPhotos.slice(0, 8).map((url, idx) => (
                <Box
                  key={url + idx}
                  sx={{
                    minWidth: 140,
                    minHeight: 100,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  }}
                >
                  <Image
                    src={url}
                    alt={hotel.name}
                    width={140}
                    height={100}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    unoptimized
                  />
                </Box>
              ))}
            </Box>
          )}

          <Typography
            variant="h4"
            sx={{ color: "black", fontWeight: 700, mb: 1 }}
          >
            {hotel.name || data.data?.hotel_name}
          </Typography>
          <Typography sx={{ color: "#232526", fontWeight: 500, mb: 1 }}>
            {address} {city && `, ${city}`} {country && `, ${country}`}
          </Typography>

          {reviewScore && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box
                sx={{
                  background: "#FFD700",
                  color: "#232526",
                  fontWeight: 700,
                  borderRadius: "8px",
                  px: 1.2,
                  py: 0.2,
                  fontSize: "1.1rem",
                  display: "inline-block",
                }}
              >
                {reviewScore}
              </Box>
              <Typography
                sx={{ color: "#232526", fontWeight: 500, fontSize: "1.1rem" }}
              >
                {reviewScoreWord ? `(${reviewScoreWord})` : ""}
              </Typography>
              <Typography
                sx={{
                  color: "#232526",
                  fontWeight: 400,
                  fontSize: "1.05rem",
                  ml: 1,
                }}
              >
                {reviewCount} reviews
              </Typography>
            </Box>
          )}

          {price && (
            <Typography
              sx={{
                color: "black",
                fontWeight: 600,
                fontSize: "1.15rem",
                mb: 1,
              }}
            >
              Price for your stay:{" "}
              <span style={{ color: "black" }}>{price}</span>
            </Typography>
          )}

          {highlightStrip.length > 0 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography sx={{ fontWeight: 600, color: "#232526", mb: 0.5 }}>
                Highlights:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {highlightStrip.map((f, idx) => (
                  <Box
                    key={f.name || idx}
                    sx={{
                      background: "#FFD700",
                      color: "#232526",
                      borderRadius: 2,
                      px: 1.2,
                      py: 0.3,
                      fontWeight: 500,
                      fontSize: "0.98rem",
                    }}
                  >
                    {f.name}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {facilities.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 600, color: "#232526", mb: 0.5 }}>
                Facilities:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {facilities.map((f, idx) => (
                  <Box
                    key={f.name || idx}
                    sx={{
                      background: "#eee",
                      color: "#232526",
                      borderRadius: 2,
                      px: 1.2,
                      py: 0.3,
                      fontWeight: 500,
                      fontSize: "0.98rem",
                    }}
                  >
                    {f.name}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {description && (
            <Typography sx={{ color: "#232526", mt: 2, mb: 2 }}>
              {description}
            </Typography>
          )}

          {hotelUrl && (
            <Button
              variant="contained"
              color="primary"
              href={hotelUrl}
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
              Book on Booking.com
            </Button>
          )}
        </Box>

        {reviews.length > 0 && (
          <Box
            sx={{
              background: "#fff",
              borderRadius: 3,
              p: 3,
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)",
              mt: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#FFD700", fontWeight: 700, mb: 2 }}
            >
              Guest Reviews
            </Typography>
            {(
              reviews as Array<{
                title?: string;
                user_name?: string;
                positive?: string;
                text?: string;
                comment?: string;
                score?: number;
              }>
            )
              .slice(0, 5)
              .map((review, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography sx={{ color: "#232526", fontWeight: 600 }}>
                    {review.title || review.user_name || "Guest"}
                  </Typography>
                  <Typography sx={{ color: "#232526", fontStyle: "italic" }}>
                    {review.positive || review.text || review.comment}
                  </Typography>
                  {review.score && (
                    <Typography sx={{ color: "#FFD700", fontWeight: 700 }}>
                      Score: {review.score}
                    </Typography>
                  )}
                </Box>
              ))}
          </Box>
        )}
      </Box>
    </>
  );
}
