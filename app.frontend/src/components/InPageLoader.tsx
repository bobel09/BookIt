import { Box, Typography } from "@mui/material";

export default function InPageLoader({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        width: "100%",
        position: "relative",
      }}
    >
      {/* Gold Glow Effect */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #FFD70033 0%, #FFD70011 60%, transparent 100%)",
          filter: "blur(10px)",
          zIndex: 1,
          animation: "pulseGlow 2.2s ease-in-out infinite alternate",
          "@keyframes pulseGlow": {
            "0%": { opacity: 0.7 },
            "100%": { opacity: 1 },
          },
        }}
      />
      {/* Loader Spinner */}
      <Box
        sx={{
          width: 48,
          height: 48,
          border: "5px solid #FFD70033",
          borderTop: "5px solid #FFD700",
          borderRight: "5px solid #FFD700",
          borderRadius: "50%",
          animation: "spin 1.1s cubic-bezier(.4,2,.6,1) infinite",
          boxShadow: "0 0 16px #FFD70044, 0 0 0 4px #fff inset",
          mb: 2,
          zIndex: 2,
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      {/* Animated Gold Dots */}
      <Box sx={{ display: "flex", gap: 1, mb: 1, zIndex: 2 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#FFD700",
              opacity: 0.7,
              animation: `bounceDot 1.2s ${
                i * 0.18
              }s infinite cubic-bezier(.4,2,.6,1)`,
              "@keyframes bounceDot": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-10px) scale(1.2)" },
              },
            }}
          />
        ))}
      </Box>
      {text && (
        <Typography
          sx={{
            color: "#FFD700",
            fontWeight: 800,
            fontSize: "1.18rem",
            letterSpacing: 0.7,
            textShadow: "0 2px 8px #FFD70033, 0 2px 8px #00000022",
            zIndex: 2,
            fontFamily: "Inter, sans-serif",
            mt: 0.5,
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
}
