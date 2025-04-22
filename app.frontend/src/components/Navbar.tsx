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

type NavbarProps = {
  username: string;
  onLogout?: () => void;
};
const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
          ✈️ BookIt
        </Typography>

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
                  onLogout?.();
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
