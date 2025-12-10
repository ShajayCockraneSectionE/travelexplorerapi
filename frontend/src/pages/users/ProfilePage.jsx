// src/pages/users/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";


const PAGE_SIZE = 5;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favPage, setFavPage] = useState(0);
  const [bookPage, setBookPage] = useState(0);

  const token = localStorage.getItem("token");

  //to redirect immeadiately if there is no token
  if (!token) {
    navigate("/login");
    return null;
  }


  const loadUser = async () => {
    try {
      const res = await axiosClient.get("/users/me");
      setUser(res.data);
      setFavPage(0);
      setBookPage(0);
    } catch (err) {
      console.error("PROFILE ERROR:", err?.response?.status);
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }else {
      alert("Failed to load profile");
    }
  }
};

  useEffect(() => {
    loadUser();
  }, []);

  const paginate = (arr, page) => arr.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const clearFavs = async () => {
    await axiosClient.delete("/users/me/favourites");
    loadUser();
  };

  const clearBookings = async () => {
    await axiosClient.delete("/users/me/bookings");
    loadUser();
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>My Profile 👤</Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>Welcome back, {user.name || user.email}!</Typography>

      <Grid container spacing={4}>
        
        {/* FAVOURITES */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>⭐ My Favourites</Typography>

            <List sx={{ minHeight: 200 }}>
              {user.favorites?.length ? (
                paginate(user.favorites, favPage).map((d, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={`${d.name} (${d.country}) — $${d.pricePerPerson}/person`}
                      secondary={`Category: ${d.category}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No favourites yet.</Typography>
              )}
            </List>

            {user.favorites?.length > PAGE_SIZE && (
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                <Button disabled={favPage === 0} onClick={() => setFavPage(favPage - 1)}>Prev</Button>
                <Button disabled={(favPage + 1) * PAGE_SIZE >= user.favorites.length} onClick={() => setFavPage(favPage + 1)}>Next</Button>
              </Box>
            )}

            <Button fullWidth sx={{ mt: 2 }} variant="contained" color="error" onClick={clearFavs}>
              Remove All Favourites
            </Button>
          </Paper>
        </Grid>

        {/* BOOKINGS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>📌 My Bookings</Typography>

            <List sx={{ minHeight: 200 }}>
              {user.bookings?.length ? (
                paginate(user.bookings, bookPage).map((b, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={`${b.destination.name} (${b.destination.country}) — $${b.destination.pricePerPerson}/person`}
                      secondary={`${b.fromDate.slice(0,10)} → ${b.toDate.slice(0,10)} | ${b.numPeople} people`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No bookings yet.</Typography>
              )}
            </List>

            {user.bookings?.length > PAGE_SIZE && (
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                <Button disabled={bookPage === 0} onClick={() => setBookPage(bookPage - 1)}>Prev</Button>
                <Button disabled={(bookPage + 1) * PAGE_SIZE >= user.bookings.length} onClick={() => setBookPage(bookPage + 1)}>Next</Button>
              </Box>
            )}

            <Button fullWidth sx={{ mt: 2 }} variant="contained" color="error" onClick={clearBookings}>
              Remove All Bookings
            </Button>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
