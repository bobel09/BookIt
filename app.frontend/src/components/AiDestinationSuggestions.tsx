import React, { useState } from "react";
import { Box, Typography, Button, Card, CardActionArea } from "@mui/material";
import InPageLoader from "@/components/InPageLoader";
import { useSuggestPlaces } from "@/hooks/mutations/useSuggestPlaces";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/querys/useCurrentUserQuery";

const goldGradient = "linear-gradient(90deg, #FFD700 60%, #ffe066 100%)";

export default function AiDestinationSuggestions() {
  const { data: user } = useCurrentUser();
  const [selected, setSelected] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { mutate, data, isPending, isError, error } = useSuggestPlaces();
  const router = useRouter();

  const handleAskAI = () => {
    if (!user?.preferences) return;
    mutate({ preferences: user.preferences });
    setShowSuggestions(true);
    setSelected(null);
  };

  const handleLetsDoIt = () => {
    if (!selected) return;
    // Split into city, country
    const [city, country] = selected.split(",");
    router.push(
      `/itinerary?destination=${encodeURIComponent(
        city.trim()
      )}&country=${encodeURIComponent(country?.trim() || "")}`
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1500,
        mx: "auto",
        mt: 10,
        mb: 2,
        p: 4,
        background: "#fff",
        borderRadius: "18px",
        border: "1.5px solid #ececec",
        boxShadow: "0 2px 12px 0 rgba(30,30,30,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          fontWeight: 800,
          fontSize: { xs: "1.3rem", md: "1.6rem" },
          color: "#232526",
          mb: 1,
          textAlign: "center",
        }}
      >
        Don't know where to go?
      </Typography>
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: { xs: "1rem", md: "1.1rem" },
          color: "#6c6c6c",
          mb: 2.5,
          textAlign: "center",
        }}
      >
        Ask the AI to suggest places based on your preferences.
      </Typography>
      <Button
        variant="contained"
        sx={{
          background: goldGradient,
          color: "#232526",
          fontWeight: 700,
          fontSize: "1rem",
          borderRadius: "30px",
          px: 3,
          boxShadow: "0 2px 8px #ffe06655",
          mb: 2,
          "&:hover": {
            background: "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
          },
        }}
        onClick={handleAskAI}
        disabled={isPending || !user?.preferences}
      >
        {isPending ? "Thinking..." : "Ask the AI"}
      </Button>
      {isPending && <InPageLoader text="AI is thinking..." />}
      {isError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error?.message || "Something went wrong. Please try again."}
        </Typography>
      )}
      {data?.suggestions && showSuggestions && (
        <Box
          sx={{
            width: "100%",
            mt: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {data.suggestions.map((suggestion: string, idx: number) => (
            <Card
              key={suggestion}
              sx={{
                border:
                  selected === suggestion
                    ? "2.5px solid #FFD700"
                    : "1.5px solid #ececec",
                borderRadius: "14px",
                boxShadow:
                  selected === suggestion
                    ? "0 4px 16px #ffe06655"
                    : "0 2px 8px #ececec33",
                background: selected === suggestion ? goldGradient : "#fafafa",
                transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0 8px 36px 0 rgba(1, 1, 1, 0.12)",
                  borderColor: "#FFD700",
                },
              }}
            >
              <CardActionArea
                onClick={() => setSelected(suggestion)}
                sx={{
                  p: 2.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    color: selected === suggestion ? "#232526" : "#232526",
                  }}
                >
                  {suggestion}
                </Typography>
                {selected === suggestion && (
                  <span
                    style={{ fontSize: 22, color: "#FFD700", marginLeft: 8 }}
                  >
                    ★
                  </span>
                )}
              </CardActionArea>
            </Card>
          ))}
          <Button
            variant="contained"
            sx={{
              background: goldGradient,
              color: "#232526",
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: "30px",
              px: 3,
              boxShadow: "0 2px 8px #ffe06655",
              mt: 2,
              alignSelf: "center",
              "&:hover": {
                background: "linear-gradient(90deg, #e6c200 60%, #ffe066 100%)",
              },
            }}
            disabled={!selected}
            onClick={handleLetsDoIt}
          >
            Let's do it
          </Button>
        </Box>
      )}
    </Box>
  );
}
