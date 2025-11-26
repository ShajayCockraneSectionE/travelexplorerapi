import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function EditDestination() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get(`/destinations/${decodeURIComponent(name)}`);
        const dest = res.data;
        setForm({
          name: dest.name,
          country: dest.country || "",
          category: dest.category || "",
          rating: dest.rating ?? 0,
          pricePerPerson: dest.pricePerPerson ?? 0,
          activities: (dest.activities || []).join(", "),
        });
      } catch (err) {
        setMessage("Failed to load destination");
      }
    };
    load();
  }, [name]);

  if (!form) return <Typography>Loading...</Typography>;

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        rating: Number(form.rating),
        pricePerPerson: Number(form.pricePerPerson),
        activities: form.activities ? form.activities.split(",").map(a => a.trim()) : [],
      };
      await axiosClient.put(`/destinations/${encodeURIComponent(form.name)}`, payload);
      setMessage("Updated");
      navigate("/destinations");
    } catch (err) {
      setMessage("Update failed");
    }
  };

  return (
    <Box component="form" onSubmit={submit}>
      <Typography variant="h5" gutterBottom>Edit Destination</Typography>
      <TextField label="Name" fullWidth required value={form.name} onChange={onChange("name")} sx={{mb:2}} />
      <TextField label="Country" fullWidth required value={form.country} onChange={onChange("country")} sx={{mb:2}} />
      <TextField label="Category" fullWidth required value={form.category} onChange={onChange("category")} sx={{mb:2}} />
      <TextField label="Rating (0-5)" type="number" fullWidth required value={form.rating} onChange={onChange("rating")} sx={{mb:2}} inputProps={{min:0, max:5}} />
      <TextField label="Price Per Person" type="number" fullWidth required value={form.pricePerPerson} onChange={onChange("pricePerPerson")} sx={{mb:2}} />
      <TextField label="Activities (comma separated)" fullWidth value={form.activities} onChange={onChange("activities")} sx={{mb:2}} />
      <Button variant="contained" type="submit">Save</Button>
      {message && <Typography sx={{mt:2}}>{message}</Typography>}
    </Box>
  );
}
