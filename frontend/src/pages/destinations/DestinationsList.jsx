import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function DestinationsList() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await axiosClient.get("/destinations", {
        params: search ? { search } : {},
      });
      setDestinations(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load destinations");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (name) => {
    if (!window.confirm("Delete this destination?")) return;
    try {
      await axiosClient.delete(`/destinations/${encodeURIComponent(name)}`);
      setDestinations((d) => d.filter((x) => x.name !== name));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Destinations
      </Typography>

      
      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
        <TextField
          size="small"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={load}>
          Search
        </Button>

       
        <Button
          variant="outlined"
          onClick={() => navigate("/destinations/add")}
        >
          Add New Destination
        </Button>
      </Box>

      <Grid container spacing={2}>
        {destinations.map((dest) => (
          <Grid item xs={12} md={6} key={dest._id ?? dest.name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{dest.name}</Typography>
                <Typography variant="body2">
                  {dest.country} — {dest.category}
                </Typography>
                <Typography variant="body2">Rating: {dest.rating}</Typography>
                <Typography variant="body2">
                  Price: ${dest.pricePerPerson}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() =>
                    navigate(`/destinations/edit/${encodeURIComponent(dest.name)}`)
                  }
                >
                  Edit
                </Button>
                <Button color="error" onClick={() => handleDelete(dest.name)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
