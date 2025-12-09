// src/pages/bookings/BookingPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import axiosClient from "../../api/axiosClient";

export default function BookingPage() {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const dest = location.state?.dest; // passed from details – fallback is name only

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    numPeople: 1,
    fromDate: "",
    toDate: "",
  });
  const [message, setMessage] = useState("");

  const onChange = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.fromDate || !form.toDate) {
      setMessage("Please fill in all required fields");
      return;
    }

    try {
      const res = await axiosClient.post(
        `/users/me/bookings/${dest._id}`,
        form
      );
      navigate("/booking/confirmation", { state: { booking: res.data.booking } });
    } catch (err) {
      setMessage("Booking failed");
    }
  };


  return (
    <Box component="form" onSubmit={submit} sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Booking Details
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        {dest?.name || decodeURIComponent(name)}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Full Name"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.fullName}
            onChange={onChange("fullName")}
          />
          <TextField
            label="Email (for confirmation)"
            type="email"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.email}
            onChange={onChange("email")}
          />
          <TextField
            label="Number of People"
            type="number"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={form.numPeople}
            onChange={onChange("numPeople")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="From Date"
            type="date"
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={form.fromDate}
            onChange={onChange("fromDate")}
          />
          <TextField
            label="To Date"
            type="date"
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            value={form.toDate}
            onChange={onChange("toDate")}
          />
        </Grid>
      </Grid>

      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        CONFIRM BOOKING
      </Button>

      {message && (
        <Typography sx={{ mt: 2 }} color="error">
          {message}
        </Typography>
      )}
    </Box>
  );
}
 