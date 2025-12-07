import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setMessage("Email and password required");
      return;
    }
    try {
      // Request backend to send OTP after validating credentials
      await axiosClient.post("/users/login", { email: form.email, password: form.password });
      // store email temporarily for OTP step
      localStorage.setItem("mfaEmail", form.email);
      navigate("/otp");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async () => {
    try {
      await axiosClient.post("/users/signup", form);
      // After signup, automatically log in flow: request OTP
      await axiosClient.post("/users/login", { email: form.email, password: form.password });
      localStorage.setItem("mfaEmail", form.email);
      navigate("/otp");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 2,
    }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Welcome to Travel Explorer
        </Typography>

        <TextField label="Email" fullWidth value={form.email} onChange={onChange("email")} sx={{ mb: 2 }} />
        <TextField label="Password" type="password" fullWidth value={form.password} onChange={onChange("password")} sx={{ mb: 2 }} />

        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={handleLogin}>
          Login
        </Button>

        <Button variant="outlined" fullWidth onClick={handleSignup}>
          Sign Up
        </Button>

        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
      </Paper>
    </Box>
  );
}


  