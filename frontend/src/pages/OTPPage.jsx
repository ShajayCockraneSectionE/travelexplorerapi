import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function OTPPage({ setIsLoggedIn }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("mfaEmail");

  const verify = async () => {
    try {
      const res = await axiosClient.post("/users/verify-otp", { email, otp });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.removeItem("mfaEmail");
      setIsLoggedIn(true);
      navigate("/destinations");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h6" gutterBottom>Enter OTP</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>We sent an OTP to: {email}</Typography>
        <TextField label="OTP" fullWidth value={otp} onChange={(e) => setOtp(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" fullWidth onClick={verify}>Verify</Button>
        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>
    </Box>
  );
}
