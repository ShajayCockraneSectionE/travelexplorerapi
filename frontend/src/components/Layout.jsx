// src/components/Layout.jsx
import React from "react";
import { Container, Box } from "@mui/material";
import NavBar from "./NavBar";
import SidebarImage from "../assets/SidebarImage.jpg"; 
import { useLocation } from "react-router-dom";

export default function Layout({ children, isLoggedIn }) {
  const location = useLocation();

  // Detect Homepage
  const isHomePage = location.pathname === "/";

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} />

      {/* Logged-In Pages (except Home Page) use sidebar background */}
      {isLoggedIn && !isHomePage ? (
        <Box
          sx={{
            minHeight: "100vh",
            backgroundImage: `url(${SidebarImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            p: 4,
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              mt: 4,
              bgcolor: "rgba(255,255,255,0.85)",
              borderRadius: 2,
              p: 3,
            }}
          >
            {children}
          </Container>
        </Box>
      ) : (
        // Homepage + Login + OTP pages have NO sidebar background
        <Box sx={{ minHeight: "100vh", p: isHomePage ? 0 : 4 }}>
          <Container
            maxWidth={isHomePage ? false : "lg"}
            disableGutters={isHomePage}
          >
            {children}
          </Container>
        </Box>
      )}
    </>
  );
}
