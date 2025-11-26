import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || form.password.length < 4) {
      setMessage("Enter a valid email and password (min 4 chars)");
      return;
    }
    try {
      await axiosClient.post("/users/signup", form);
      setMessage("User created");
      navigate("/users");
    } catch (err) {
      console.error(err);
      setMessage("Signup failed — maybe email already exists");
    }
  };

  return (
    <Box component="form" onSubmit={submit}>
      <Typography variant="h5" gutterBottom>Signup</Typography>
      <TextField label="Email" type="email" fullWidth value={form.email} onChange={onChange("email")} sx={{mb:2}} required />
      <TextField label="Password" type="password" fullWidth value={form.password} onChange={onChange("password")} sx={{mb:2}} required />
      <Button variant="contained" type="submit">Signup</Button>
      {message && <Typography sx={{mt:2}}>{message}</Typography>}
    </Box>
  );
}
