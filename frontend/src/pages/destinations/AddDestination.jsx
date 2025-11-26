import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function AddDestination() {
  const [form, setForm] = useState({
    name: "",
    country: "",
    category: "",
    rating: "",
    pricePerPerson: "",
    activities: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (!form.name || !form.country || !form.category || form.rating === "" || form.pricePerPerson === "") {
      setMessage("Please fill required fields");
      return;
    }
    try {
      const payload = {
        ...form,
        rating: Number(form.rating),
        pricePerPerson: Number(form.pricePerPerson),
        activities: form.activities ? form.activities.split(",").map(a => a.trim()) : [],
      };
      await axiosClient.post("/destinations", payload);
      setMessage("Destination added.");
      navigate("/destinations");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add destination");
    }
  };

  return (
    <Box component="form" onSubmit={submit}>
      <Typography variant="h5" gutterBottom>Add Destination</Typography>

      <TextField label="Name" fullWidth required value={form.name} onChange={onChange("name")} sx={{mb:2}} />
      <TextField label="Country" fullWidth required value={form.country} onChange={onChange("country")} sx={{mb:2}} />
      <TextField label="Category" fullWidth required value={form.category} onChange={onChange("category")} sx={{mb:2}} />
      <TextField label="Rating (0-5)" type="number" fullWidth required value={form.rating} onChange={onChange("rating")} sx={{mb:2}} inputProps={{min:0, max:5, step:0.1}} />
      <TextField label="Price Per Person" type="number" fullWidth required value={form.pricePerPerson} onChange={onChange("pricePerPerson")} sx={{mb:2}} />
      <TextField label="Activities (comma separated)" fullWidth value={form.activities} onChange={onChange("activities")} sx={{mb:2}} />

      <Button variant="contained" type="submit">Add</Button>
      {message && <Typography sx={{mt:2}}>{message}</Typography>}
    </Box>
  );
}
