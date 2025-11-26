import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axiosClient from "../../api/axiosClient";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await axiosClient.get("/users"); // GET all users
      setUsers(res.data);

      // Pick the first user (or you can pick based on email later)
      if (res.data.length > 0) {
        setCurrentUser(res.data[0]);
      }

    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (!currentUser) {
    return <Typography>No user data found.</Typography>;
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* PAGE TITLE */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        USER PROFILE
      </Typography>

      {/* WELCOME MESSAGE */}
      <Typography variant="h6" sx={{ mb: 3 }}>
        Welcome back, {currentUser.name || currentUser.email}!
      </Typography>

      <Grid container spacing={3}>

        {/* LEFT COLUMN — FAVORITES */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "rgba(255,255,255,0.85)" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Your Favourites
            </Typography>

            <List>
              {currentUser.favorites?.length > 0 ? (
                currentUser.favorites.map((fav, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={fav} />
                  </ListItem>
                ))
              ) : (
                <Typography>No favourites yet.</Typography>
              )}
            </List>

            <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
              Remove Favourites
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN — BOOKINGS */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: "rgba(255,255,255,0.85)" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Your Bookings
            </Typography>

            <List>
              {currentUser.bookings?.length > 0 ? (
                currentUser.bookings.map((book, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={book} />
                  </ListItem>
                ))
              ) : (
                <Typography>No bookings yet.</Typography>
              )}
            </List>

            <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
              Remove Bookings
            </Button>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
