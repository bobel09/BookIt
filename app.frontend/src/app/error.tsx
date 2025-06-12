"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(120deg, #232526 0%, #1e1e1e 60%, #101010 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        px: 2,
      }}
    >
      <Navbar username={"error"} />
      <Box
        sx={{
          background: "#fff",
          color: "#232526",
          borderRadius: 4,
          boxShadow: "0 4px 32px 0 #FFD70033",
          p: { xs: 3, sm: 5 },
          mt: 8,
          mb: 6,
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            color: "#FFD700",
            mb: 2,
            fontSize: { xs: "2.2rem", sm: "2.8rem" },
          }}
        >
          Oops!
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Something went wrong.
        </Typography>
        <Typography sx={{ mb: 3, color: "#444" }}>
          The page you are looking for doesn't exist or an unexpected error has
          occurred.
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
            color: "#232526",
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            py: 1.2,
            fontSize: "1.1rem",
            boxShadow: "0 2px 8px #FFD70033",
            "&:hover": {
              background: "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
            },
          }}
          onClick={() => router.push("/")}
        >
          Go Home
        </Button>
      </Box>
      <Footer />
    </Box>
  );
}
