import React from "react";
import { Container, Box } from "@mui/material";
import NavBar from "./NavBar";
import SidebarImage from "../assets/SidebarImage.jpg";   // Background for logged-in pages

export default function Layout({ children, isLoggedIn }) {
  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} />

      {isLoggedIn ? (
        // Background for Destinations + Users pages
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
        // No background on Login page
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {children}
        </Container>
      )}
    </>
  );
}
