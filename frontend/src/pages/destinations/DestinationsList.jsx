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
  Paper,
} from "@mui/material";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function DestinationsList() {
  const [destinations, setDestinations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    name: "",
    country: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
  });

  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "admin" or "customer"

  const onFilterChange = (key) => (e) =>
    setFilters({ ...filters, [key]: e.target.value });

  const load = async (overridePage) => {
    try {
      const currentPage = overridePage ?? page;
      const params = { page: currentPage };

      if (role === "customer") {
        if (filters.name) params.name = filters.name;
        if (filters.country) params.country = filters.country;
        if (filters.category) params.category = filters.category;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.minRating) params.minRating = filters.minRating;
      }

      const res = await axiosClient.get("/destinations", { params });
      setDestinations(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      if (overridePage != null) setPage(overridePage);
    } catch (err) {
      console.error(err);
      alert("Failed to load destinations");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role]);

  const handleApplyFilters = () => {
    load(1);
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      country: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
    });
    load(1);
  };

  const handleDelete = async (name) => {
    if (!window.confirm("Delete this destination?")) return;
    try {
      await axiosClient.delete(`/destinations/${encodeURIComponent(name)}`);
      // If last item was deleted and not on first page, go back one page:
      if (destinations.length === 1 && page > 1) {
        load(page - 1);
      } else {
        load(page);
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        {role === "admin" ? "Manage Destinations 🔧" : "Explore Destinations 🌍"}
      </Typography>

      <Grid container spacing={3}>
        {/* SIDEBAR FILTERS — only for customers */}
        {role === "customer" && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Filters
              </Typography>
              <TextField
                label="Name"
                fullWidth
                size="small"
                sx={{ mb: 1 }}
                value={filters.name}
                onChange={onFilterChange("name")}
              />
              <TextField
                label="Country"
                fullWidth
                size="small"
                sx={{ mb: 1 }}
                value={filters.country}
                onChange={onFilterChange("country")}
              />
              <TextField
                label="Category"
                fullWidth
                size="small"
                sx={{ mb: 1 }}
                value={filters.category}
                onChange={onFilterChange("category")}
              />
              <TextField
                label="Min Price"
                type="number"
                fullWidth
                size="small"
                sx={{ mb: 1 }}
                value={filters.minPrice}
                onChange={onFilterChange("minPrice")}
              />
              <TextField
                label="Max Price"
                type="number"
                fullWidth
                size="small"
                sx={{ mb: 1 }}
                value={filters.maxPrice}
                onChange={onFilterChange("maxPrice")}
              />
              <TextField
                label="Min Rating"
                type="number"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={filters.minRating}
                onChange={onFilterChange("minRating")}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
              <Button variant="outlined" fullWidth onClick={handleResetFilters}>
                Reset
              </Button>
            </Paper>
          </Grid>
        )}

        {/* DESTINATION CARDS */}
        <Grid item xs={12} md={role === "customer" ? 9 : 12}>
          {/* ADMIN Add Destination button */}
          {role === "admin" && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/destinations/add")}
              >
                Add Destination
              </Button>
            </Box>
          )}

          <Grid container spacing={3}>
            {destinations.map((d) => (
              <Grid item xs={12} sm={6} md={4} key={d._id}>
                <Card
                  sx={{
                    ":hover": { boxShadow: 6, transform: "scale(1.02)" },
                    transition: "0.3s",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {d.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {d.country} · {d.category}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>⭐ {d.rating}</Typography>
                    <Typography sx={{ mt: 1, fontWeight: "bold" }}>
                      💵 ${d.pricePerPerson}/person
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={() =>
                        navigate(
                          `/destinations/details/${encodeURIComponent(d.name)}`
                        )
                      }
                    >
                      View
                    </Button>

                    {role === "admin" && (
                      <>
                        <Button
                          onClick={() =>
                            navigate(
                              `/destinations/edit/${encodeURIComponent(d.name)}`
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDelete(d.name)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

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
        </Grid>
      </Grid>
    </Box>
  );
}
