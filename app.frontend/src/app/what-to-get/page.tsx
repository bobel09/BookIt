"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Paper,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";

const options = [
  { label: "Flights", value: "flights" },
  { label: "Stays", value: "stays" },
  { label: "Itinerary Planner", value: "itinerary" },
];

const WhatToGetPage = () => {
  const { data: user, isError } = useCurrentUser();
  const [selected, setSelected] = useState<string[]>([]);

  if (isError || !user) {
    localStorage.removeItem("token");
    return <Typography>Error loading profile</Typography>;
  }

  const handleChange = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    // Implement your logic here (e.g., navigate or save selection)
    alert(`You selected: ${selected.join(", ")}`);
  };

  return (
    <>
      <Navbar username={user.username} />
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(120deg, #232526 0%, #1e1e1e 60%, #101010 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 8,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 520,
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 8px 32px 0 rgba(255,215,0,0.10)",
            p: { xs: 3, md: 5 },
            mt: 2,
            mb: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "#232526",
              letterSpacing: 1,
              textAlign: "center",
              mb: 1,
              fontFamily: "Montserrat, Roboto, Arial, sans-serif",
              background: "linear-gradient(90deg, #FFD700 40%, #ffe066 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: { xs: "2rem", md: "2.3rem" },
            }}
          >
            What do you want us to get for you?
          </Typography>
          <FormGroup sx={{ gap: 2, alignItems: "flex-start", width: "100%" }}>
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                control={
                  <Checkbox
                    checked={selected.includes(opt.value)}
                    onChange={() => handleChange(opt.value)}
                    sx={{
                      color: "#FFD700",
                      "&.Mui-checked": { color: "#FFD700" },
                      transform: "scale(1.2)",
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.13rem",
                      color: "#232526",
                    }}
                  >
                    {opt.label}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
          <Button
            variant="contained"
            disabled={selected.length === 0}
            onClick={handleSubmit}
            sx={{
              mt: 2,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              fontSize: "1.13rem",
              px: 4,
              py: 1.2,
              letterSpacing: 0.2,
              background: "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)",
              color: "#232526",
              boxShadow: "0 3px 16px 0 rgba(255,215,0,0.13)",
              transition: "background 0.2s, box-shadow 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
                boxShadow: "0 6px 24px 0 rgba(255,215,0,0.18)",
              },
            }}
          >
            Let's do it
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default WhatToGetPage;
