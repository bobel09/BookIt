import { Box, Typography, Chip, Stack } from "@mui/material";

export default function WishlistStats({ wishlist }: { wishlist: string[] }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 4,
        mb: 2,
        py: 4,
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 4px 24px rgba(211,47,47,0.08)",
        transition:
          "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)",
        "&:hover": {
          transform: "scale(1.025)",
          boxShadow: "0 8px 36px 0 rgba(211,47,47,0.12)",
          cursor: "pointer",
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontSize: { xs: "2.2rem", md: "2.8rem" },
          fontWeight: 800,
          color: "#d32f2f",
          letterSpacing: 1,
          mb: 1,
          textAlign: "center",
          textShadow: "0 2px 8px rgba(211,47,47,0.04)",
        }}
      >
        ❤️ Wishlist
      </Typography>
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontSize: { xs: "1.2rem", md: "1.5rem" },
          color: "#d32f2f",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 0.5,
          mt: 0.5,
          mb: 2,
        }}
      >
        <b>{wishlist.length}</b> countries in wishlist
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        justifyContent="center"
        sx={{ maxWidth: 500 }}
      >
        {wishlist.length === 0 ? (
          <Typography color="#888">No countries wishlisted yet.</Typography>
        ) : (
          wishlist.map((country) => (
            <Chip
              key={country}
              label={country}
              sx={{
                background: "#ffeaea",
                color: "#d32f2f",
                fontWeight: 600,
                fontSize: "1rem",
                mb: 1,
              }}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}
