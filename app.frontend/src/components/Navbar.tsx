import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

type NavbarProps = {
  username: string;
};
const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#1e1e1e",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
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
          onClick={() => (window.location.href = "/dashboard")}
        >
          <Image
            src="/polaroid_navbar.svg"
            alt="BookIt Logo"
            width={40}
            height={40}
            style={{ marginRight: "8px", marginBottom: "2px" }}
          />
          BookIt
        </Typography>

        {/* Minimalist Planes and Stays links in the middle */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* Airplane icon (SVG) */}
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.13rem",
              cursor: "pointer",
              opacity: 0.92,
              px: 2,
              display: "flex",
              alignItems: "center",
              letterSpacing: 0.5,
              fontFamily: "Montserrat, Roboto, Arial, sans-serif",
              transition:
                "color 0.3s, opacity 0.3s, text-shadow 0.3s, transform 0.3s",
              textShadow: "0 1px 8px #1976d233",
              "&:hover": {
                color: "#FFD700",
                opacity: 1,
                textDecoration: "none",
                transform: "translateY(-3px)",
                textShadow: "0 2px 12px #FFD70055",
              },
            }}
            onClick={() => {
              router.push("/planes");
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", marginRight: 6 }}
            >
              {/* SVG airplane icon */}
              <Image
                src="/airplane_navbar.svg"
                alt="Airplane Icon"
                width={40}
                height={40}
                style={{ fill: "currentColor" }}
              />
            </span>
            <span style={{ marginTop: 2, letterSpacing: 1 }}>Flights</span>
          </Typography>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.13rem",
              cursor: "pointer",
              opacity: 0.92,
              px: 2,
              display: "flex",
              alignItems: "center",
              letterSpacing: 0.5,
              fontFamily: "Montserrat, Roboto, Arial, sans-serif",
              transition:
                "color 0.3s, opacity 0.3s, text-shadow 0.3s, transform 0.3s",
              textShadow: "0 1px 8px #1976d233",
              "&:hover": {
                color: "#FFD700",
                opacity: 1,
                textDecoration: "none",
                transform: "translateY(-3px)",
                textShadow: "0 2px 12px #FFD70055",
              },
            }}
            onClick={() => {
              router.push("/stays");
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", marginRight: 6 }}
            >
              <Image
                src="/stays_navbar.svg"
                alt="Hotel Icon"
                width={40}
                height={40}
                style={{ fill: "currentColor" }}
              />
            </span>
            <span style={{ marginTop: 2, letterSpacing: 1 }}>Hotels</span>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{ bgcolor: "#FFD700", color: "#333", fontWeight: "bold" }}
              >
                {username[0].toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 150,
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                  padding: "4px 0",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  window.location.href = "/profile";
                }}
                sx={{
                  px: 3,
                  py: 1.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#3c3c3c",
                  },
                }}
              >
                Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
                sx={{
                  px: 3,
                  py: 1.5,
                  transition: "all 0.2s ease",
                  color: "#f87171",
                  "&:hover": {
                    backgroundColor: "#471111",
                    color: "#fff",
                  },
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
