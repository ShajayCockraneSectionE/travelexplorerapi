// src/pages/bookings/BookingConfirmation.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography>No booking details found.</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/destinations")}>
          Back to Destinations
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Booking Confirmed!
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Destination: {booking.destinationName}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Name: {booking.fullName}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Email: {booking.email}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Number of people: {booking.numPeople}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        From: {booking.fromDate}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        To: {booking.toDate}
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 3, mr: 2 }}
        onClick={() => navigate("/profile")}
      >
        Go to My Profile
      </Button>
      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => navigate("/destinations")}
      >
        Back to Destinations
      </Button>
    </Box>
  );
}
