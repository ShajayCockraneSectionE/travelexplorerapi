import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Airplane from "../assets/Airplane.jpg";

export default function NavBar({ isLoggedIn }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <img src={Airplane} alt="logo" style={{ width: 40, marginRight: 10 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Travel Explorer
        </Typography>

        {isLoggedIn && (
          <>
            <Button color="inherit" component={RouterLink} to="/destinations">
              Destinations
            </Button>
            {role === "admin" && (
              <Button color="inherit" component={RouterLink} to="/users">
                Users
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
