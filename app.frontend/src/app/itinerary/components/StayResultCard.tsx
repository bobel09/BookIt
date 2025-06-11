import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface StayResultCardProps {
  selectedStay: any;
  user: any;
  bookingUrl: string | null; // Optional booking URL
}

const StayResultCard: React.FC<StayResultCardProps> = ({
  selectedStay,
  user,
  bookingUrl,
}) => {
  if (!selectedStay) return null;
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
        Recommended Stay
      </Typography>
      <Box
        sx={{
          background: "#fff",
          mb: 3,
          p: { xs: 2, sm: 3 },
          borderRadius: "16px",
          border: "1.5px solid #ececec",
          boxShadow: "0 2px 12px 0 rgba(30,30,30,0.06)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          alignItems: { xs: "flex-start", sm: "center" },
          transition: "box-shadow 0.2s, transform 0.2s",
          "&:hover": {
            boxShadow: "0 6px 24px 0 rgba(30,30,30,0.10)",
            transform: "scale(1.012)",
            cursor: "pointer",
          },
        }}
      >
        {/* Hotel photo */}
        {selectedStay.property?.photoUrls &&
          selectedStay.property.photoUrls[0] && (
            <Box
              sx={{
                minWidth: 110,
                minHeight: 110,
                width: 110,
                height: 110,
                borderRadius: "14px",
                overflow: "hidden",
                mr: { sm: 3 },
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                flexShrink: 0,
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={selectedStay.property.photoUrls[0]}
                alt={selectedStay.property.name}
                width={110}
                height={110}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          )}
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
            {selectedStay.property.name}
          </Typography>
          {/* Show price, currency, and review count */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}>
            {selectedStay.property.priceBreakdown?.grossPrice?.value && (
              <Typography
                sx={{ color: "#232526", fontWeight: 600, fontSize: "1.08rem" }}
              >
                {selectedStay.property.priceBreakdown.grossPrice.value.toLocaleString(
                  undefined,
                  { maximumFractionDigits: 2 }
                )}{" "}
                {user?.preferences?.currency ||
                  selectedStay.property.priceBreakdown.grossPrice.currency}
              </Typography>
            )}
            {selectedStay.property.reviewCount && (
              <Typography
                sx={{ color: "#888", fontWeight: 500, fontSize: "1.03rem" }}
              >
                {selectedStay.property.reviewCount} reviews
              </Typography>
            )}
          </Box>
          {selectedStay.property.reviewScore && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
            >
              <Box
                sx={{
                  border: "2px solid #FFD700",
                  color: "#bfa600",
                  fontWeight: 700,
                  borderRadius: "8px",
                  px: 1.2,
                  py: 0.2,
                  fontSize: "1rem",
                  display: "inline-block",
                  background: "#fff",
                }}
              >
                {selectedStay.property.reviewScore}
              </Box>
              <Typography
                sx={{ color: "#888", fontWeight: 500, fontSize: "1rem" }}
              >
                {selectedStay.property.reviewScoreWord
                  ? `(${selectedStay.property.reviewScoreWord})`
                  : ""}
              </Typography>
            </Box>
          )}
          {/* Accessibility label (optional) */}
          {selectedStay.accessibilityLabel && (
            <Typography
              sx={{
                color: "#888",
                fontSize: "0.98rem",
                mt: 1,
                whiteSpace: "pre-line",
              }}
            >
              {selectedStay.accessibilityLabel}
            </Typography>
          )}
          {bookingUrl && (
            <Button
              variant="contained"
              href={bookingUrl}
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
              Book this hotel
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StayResultCard;
