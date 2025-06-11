import React from "react";
import { Box, Typography, IconButton, Link } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        background: "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
        color: "#232526",
        textAlign: "center",
        py: { xs: 3, md: 4 },
        px: 2,
        mt: 10,
        boxShadow: "0 -2px 16px 0 rgba(40,40,40,0.08)",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          mx: "auto",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.1rem", md: "1.2rem" },
            letterSpacing: 0.5,
            mb: { xs: 1, md: 0 },
          }}
        >
          &copy; {new Date().getFullYear()} Book It. All rights reserved.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Link
            href="https://instagram.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#232526", mx: 0.5, transition: "color 0.2s" }}
          >
            <IconButton
              sx={{ color: "#232526", "&:hover": { color: "#d32f2f" } }}
            >
              <InstagramIcon fontSize="medium" />
            </IconButton>
          </Link>
          <Link
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#232526", mx: 0.5, transition: "color 0.2s" }}
          >
            <IconButton
              sx={{ color: "#232526", "&:hover": { color: "#007bff" } }}
            >
              <LinkedInIcon fontSize="medium" />
            </IconButton>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
