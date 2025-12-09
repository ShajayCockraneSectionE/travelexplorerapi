// src/pages/HomePage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

// Import home images
import BeachImg from "../assets/beach.jpg";
import EiffelImg from "../assets/eiffel.jpg";
import GreatWallImg from "../assets/greatwall.jpg";

export default function HomePage() {
  const navigate = useNavigate();

  // Animation keyframes for fade slideshow
  const slideshow = keyframes`
    0% { background-image: url(${BeachImg}); }
    33% { background-image: url(${EiffelImg}); }
    66% { background-image: url(${GreatWallImg}); }
    100% { background-image: url(${BeachImg}); }
  `;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        backgroundSize: "cover",
        backgroundPosition: "center",
        animation: `${slideshow} 15s ease-in-out infinite`,
      }}
    >
      <Box
        sx={{
          bgcolor: "rgba(0,0,0,0.55)",
          p: 4,
          borderRadius: 4,
          width: "90%",
          maxWidth: 700,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
          Travel Explorer API
        </Typography>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Discover your next adventure 🌍
        </Typography>

        <Typography sx={{ mb: 4 }}>
          Browse destinations, view full details, save favourites, and book trips instantly!
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="contained" size="large" onClick={() => navigate("/auth")}>
            Login / Signup
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate("/destinations")}>
            Explore Destinations
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
