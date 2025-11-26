import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import LoginImage from "../assets/LoginImage.jpg";

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
    setIsLoggedIn(true);
    navigate("/destinations");
  };

  const handleSignup = async () => {
    try {
      await axiosClient.post("/users/signup", form);
      setIsLoggedIn(true);
      navigate("/destinations");
    } catch (err) {
      console.error(err);
      setMessage("Signup failed");
    }
  };

  return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url(${LoginImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      p: 2,
    }}
  >
    <Paper sx={{ p: 4, maxWidth: 400, width: "100%", bgcolor: "rgba(255,255,255,0.85)" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to Travel Explorer
      </Typography>

      <TextField
        label="Email"
        fullWidth
        value={form.email}
        onChange={onChange("email")}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        value={form.password}
        onChange={onChange("password")}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={handleLogin}>
        Login
      </Button>

      <Button variant="outlined" fullWidth onClick={handleSignup}>
        Sign Up
      </Button>

      {message && (
        <Typography color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  </Box>
)};
