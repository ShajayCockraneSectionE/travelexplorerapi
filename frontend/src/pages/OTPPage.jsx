// src/pages/OTPPage.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function OTPPage({ setIsLoggedIn }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("mfaEmail"); // Temp email for OTP step

  const verify = async () => {
    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      const res = await axiosClient.post("/users/verify-otp", { email, otp });
      const { token, role } = res.data;

      // Save login data permanently
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.removeItem("mfaEmail");

      setIsLoggedIn(true);

      // Redirect based on role
      if (role === "admin") {
        navigate("/users");
      } else {
        navigate("/destinations");
      }

    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
    }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Enter OTP
        </Typography>

        <Typography align="center" sx={{ mb: 2 }}>
          We sent an OTP to: <strong>{email}</strong>
        </Typography>

        <TextField
          label="One-Time Password"
          fullWidth
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" fullWidth onClick={verify}>
          Verify OTP
        </Button>

        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>
    </Box>
  );
}
