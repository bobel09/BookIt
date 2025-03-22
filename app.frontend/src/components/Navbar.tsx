import React from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
} from "@mui/material";

const Navbar: React.FC = () => {
  const username = "bobix";

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1e1e1e", // Dark gray background
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)", // Shadow effect
        padding: "8px 0",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          padding: "0 20px",
        }}
      >
        {/* Logo / Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              color: "#FFD700",
              transform: "translateY(-3px)",
              transition: "all 0.3s ease",
            },
          }}
        >
          ✈️ Itinerary Planner
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" passHref>
            <Button sx={navButtonStyle}>Home</Button>
          </Link>
          <Link href="/login" passHref>
            <Button sx={navButtonStyle}>Login</Button>
          </Link>
          <Link href="/welcome" passHref>
            <Button sx={navButtonStyle}>Welcome</Button>
          </Link>

          {/* Username & Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Avatar
              sx={{ bgcolor: "#FFD700", color: "#333", fontWeight: "bold" }}
            >
              {username[0].toUpperCase()}
            </Avatar>
            <Typography sx={{ color: "#fff", fontWeight: "bold" }}>
              {username}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Style for navigation buttons
const navButtonStyle = {
  color: "#fff",
  fontWeight: "bold",
  position: "relative",
  overflow: "hidden",
  padding: "8px 16px",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "#FFD700",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "2px",
    backgroundColor: "#FFD700",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.3s ease",
  },
  "&:hover::after": {
    transform: "scaleX(1)",
  },
};

export default Navbar;
