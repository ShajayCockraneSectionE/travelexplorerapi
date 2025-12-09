import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";
import axiosClient from "../../api/axiosClient";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (overridePage) => {
    try {
      const currentPage = overridePage ?? page;
      const res = await axiosClient.get("/users", {
        params: {
          page: currentPage,
          search: search || undefined,
        },
      });

      setUsers(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      if (overridePage != null) setPage(overridePage);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const del = async (email, role) => {
    if (role === "admin") return; // safety
    if (!window.confirm("Delete this user?")) return;
    try {
      await axiosClient.delete(`/users/${email}`);
      // reload current page
      if (users.length === 1 && page > 1) {
        load(page - 1);
      } else {
        load(page);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Admin — Manage Users 👥
      </Typography>

      <TextField
        placeholder="Search by email..."
        sx={{ mb: 2 }}
        fullWidth
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          // whenever search changes, reset to page 1
          setPage(1);
        }}
      />

      <Paper sx={{ p: 2 }}>
        <List>
          {users.map((u, i) => (
            <ListItem key={i} divider>
              <ListItemText
                primary={u.email}
                secondary={
                  u.createdAt
                    ? `Joined ${new Date(u.createdAt).toLocaleDateString()}`
                    : "Joined N/A"
                }
              />

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={u.role.toUpperCase()}
                  color={u.role === "admin" ? "primary" : "default"}
                />
                <Button
                  color="error"
                  disabled={u.role === "admin"}
                  onClick={() => del(u.email, u.role)}
                >
                  DELETE
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Pagination Controls */}
      <Box
        sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}
      >
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => load(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => load(page + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
