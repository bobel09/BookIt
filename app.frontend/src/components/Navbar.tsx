import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type NavbarProps = {
  username: string;
};
const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
          padding: isMobile ? "0 8px" : "0 20px",
          minHeight: isMobile ? 56 : 64,
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: "bold",
            color: "unset",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontSize: isMobile ? "1.1rem" : undefined,
            "& .bookit-book": {
              color: "#fff",
              transition: "color 0.3s",
            },
            "& .bookit-it": {
              color: "#FFD700",
              fontWeight: 900,
              marginLeft: "0.2em",
              transition: "color 0.3s",
            },
            "&:hover .bookit-book": {
              color: "#FFD700",
            },
            "&:hover .bookit-it": {
              color: "#fff",
            },
            "&:hover": {
              transform: "translateY(-3px)",
              transition: "all 0.3s ease",
            },
          }}
          onClick={() => router.push("/dashboard")}
        >
          <Image
            src="/polaroid_navbar.svg"
            alt="BookIt Logo"
            width={isMobile ? 32 : 40}
            height={isMobile ? 32 : 40}
            style={{ marginRight: "8px", marginBottom: "2px" }}
          />
          <span className="bookit-book">Book</span>
          <Box component="span" className="bookit-it">
            It
          </Box>
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              sx={{ ml: -1 }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <Avatar sx={{ bgcolor: "#FFD700", color: "#333" }}>
                {username[0].toUpperCase()}
              </Avatar>
            </IconButton>
            {mobileMenuOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "#1e1e1e",
                  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
                  zIndex: 1200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  py: 2,
                }}
              >
                <Typography
                  sx={{ ...navMobileItemStyle }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/planes");
                  }}
                >
                  <Image
                    src="/airplane_navbar.svg"
                    alt="Airplane Icon"
                    width={22}
                    height={22}
                  />{" "}
                  Flights
                </Typography>
                <Typography
                  sx={{ ...navMobileItemStyle }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/stays");
                  }}
                >
                  <Image
                    src="/stays_navbar.svg"
                    alt="Hotel Icon"
                    width={22}
                    height={22}
                  />{" "}
                  Hotels
                </Typography>
                <Typography
                  sx={{ ...navMobileItemStyle }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/itinerary");
                  }}
                >
                  <Image
                    src="/itinerary_navbar.svg"
                    alt="Itinerary Icon"
                    width={22}
                    height={22}
                  />{" "}
                  Itinerary
                </Typography>
                <Typography
                  sx={{ ...navMobileItemStyle }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/profile");
                  }}
                >
                  <Image
                    src="/camera-photo-photographer-svgrepo-com.svg"
                    alt="Profile Icon"
                    width={22}
                    height={22}
                  />{" "}
                  Profile
                </Typography>
                <Typography
                  sx={{ ...navMobileItemStyle }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <Image
                    src="/boarding-pass-flight-journey-svgrepo-com.svg"
                    alt="Logout Icon"
                    width={22}
                    height={22}
                  />{" "}
                  Logout
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <>
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 6,
                    }}
                  >
                    <Image
                      src="/airplane_navbar.svg"
                      alt="Airplane Icon"
                      width={40}
                      height={40}
                      style={{ fill: "currentColor" }}
                    />
                  </span>
                  <span style={{ marginTop: 2, letterSpacing: 1 }}>
                    Flights
                  </span>
                </Typography>
                {pathname === "/planes" && (
                  <Box
                    sx={{
                      height: 3,
                      width: "70%",
                      background:
                        "linear-gradient(90deg, #FFD700 60%, #fff 100%)",
                      borderRadius: 2,
                      mt: 0.5,
                      transition: "width 0.3s cubic-bezier(.4,1.7,.6,.8)",
                    }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 6,
                    }}
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
                {pathname === "/stays" && (
                  <Box
                    sx={{
                      height: 3,
                      width: "70%",
                      background:
                        "linear-gradient(90deg, #FFD700 60%, #fff 100%)",
                      borderRadius: 2,
                      mt: 0.5,
                      transition: "width 0.3s cubic-bezier(.4,1.7,.6,.8)",
                    }}
                  />
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
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
                    router.push("/itinerary");
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 6,
                    }}
                  >
                    <Image
                      src="/itinerary_navbar.svg"
                      alt="Itinerary Icon"
                      width={40}
                      height={40}
                      style={{ fill: "currentColor" }}
                    />
                  </span>
                  <span style={{ marginTop: 2, letterSpacing: 1 }}>
                    Itinerary
                  </span>
                </Typography>
                {pathname === "/itinerary" && (
                  <Box
                    sx={{
                      height: 3,
                      width: "70%",
                      background:
                        "linear-gradient(90deg, #FFD700 60%, #fff 100%)",
                      borderRadius: 2,
                      mt: 0.5,
                      transition: "width 0.3s cubic-bezier(.4,1.7,.6,.8)",
                    }}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                  sx={{ bgcolor: "#FFD700", color: "#333", fontWeight: "bold" }}
                >
                  {username[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                    setAnchorEl(null);
                    router.push("/profile");
                  }}
                  sx={{
                    px: 3,
                    py: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": { backgroundColor: "#3c3c3c" },
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    handleLogout();
                  }}
                  sx={{
                    px: 3,
                    py: 1.5,
                    transition: "all 0.2s ease",
                    color: "#f87171",
                    "&:hover": { backgroundColor: "#471111", color: "#fff" },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const navMobileItemStyle = {
  color: "#fff",
  cursor: "pointer",
  padding: "10px 0",
  textAlign: "center",
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  fontSize: "1.08rem",
  fontWeight: 500,
  borderBottom: "1px solid #222",
  transition: "background 0.2s",
  "&:hover": { backgroundColor: "#222" },
};

export default Navbar;
