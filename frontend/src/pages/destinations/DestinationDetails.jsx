// src/pages/destinations/DestinationDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import axiosClient from "../../api/axiosClient";

export default function DestinationDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [dest, setDest] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get(
          `/destinations/${decodeURIComponent(name)}`
        );
        setDest(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load destination");
      }
    };
    load();
  }, [name]);

  const handleAddFavourite = async () => {
    try {
      await axiosClient.post(`/users/me/favourites/${dest._id}`);
      setMessage("Added to favourites!");
    } catch (err) {
      setMessage("Failed to add to favourites");
    }
  };

  const handleBookNow = () => {
    navigate(`/booking/${encodeURIComponent(dest.name)}`, { state: { dest } });
  };

  if (!dest) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        {dest.name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {dest.country} — {dest.category}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        Rating: {dest.rating}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Price per person: ${dest.pricePerPerson}
      </Typography>

      {/* Attractions / Activities */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Attractions / Activities
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 1 }}>
        {(dest.activities || []).map((act, idx) => (
          <Chip key={idx} label={act} sx={{ mb: 1 }} />
        ))}
        {(!dest.activities || dest.activities.length === 0) && (
          <Typography>No activities listed.</Typography>
        )}
      </Stack>

      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleAddFavourite}>
          ADD TO FAVOURITES
        </Button>
        <Button variant="outlined" onClick={handleBookNow}>
          BOOK NOW
        </Button>
      </Box>

      {message && (
        <Typography sx={{ mt: 2 }} color="primary">
          {message}
        </Typography>
      )}
    </Box>
  );
}
