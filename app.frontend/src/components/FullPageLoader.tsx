import { Box, Typography } from "@mui/material";

export default function FullPageLoader({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2000,
        background:
          "radial-gradient(circle at 60% 40%, #232526 60%, #101010 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated Gold Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #FFD70033 0%, #FFD70011 60%, transparent 100%)",
          filter: "blur(32px)",
          zIndex: 1,
          animation: "pulseGlow 2.5s ease-in-out infinite alternate",
          "@keyframes pulseGlow": {
            "0%": { opacity: 0.7 },
            "100%": { opacity: 1 },
          },
        }}
      />
      {/* Loader Spinner */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            border: "10px solid #FFD70033",
            borderTop: "10px solid #FFD700",
            borderRight: "10px solid #FFD700",
            borderRadius: "50%",
            animation: "spin 1.1s cubic-bezier(.4,2,.6,1) infinite",
            boxShadow: "0 0 48px #FFD70044, 0 0 0 8px #232526 inset",
            mb: 3,
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
        {/* Animated Gold Dots */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#FFD700",
                opacity: 0.7,
                animation: `bounceDot 1.2s ${
                  i * 0.2
                }s infinite cubic-bezier(.4,2,.6,1)`,
                "@keyframes bounceDot": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-18px) scale(1.2)" },
                },
              }}
            />
          ))}
        </Box>
        <Typography
          sx={{
            color: "#FFD700",
            fontWeight: 900,
            fontSize: "2.2rem",
            letterSpacing: 1.5,
            textShadow: "0 2px 16px #FFD70044, 0 2px 8px #00000022",
            mt: 1,
            fontFamily: "Inter, sans-serif",
            zIndex: 2,
            textAlign: "center",
          }}
        >
          {text}
        </Typography>
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 400,
            fontSize: "1.1rem",
            letterSpacing: 0.5,
            opacity: 0.7,
            mt: 1.5,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            zIndex: 2,
          }}
        >
          Please wait while we prepare your experience
        </Typography>
      </Box>
    </Box>
  );
}
