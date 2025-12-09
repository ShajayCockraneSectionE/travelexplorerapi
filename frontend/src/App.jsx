import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import DestinationsList from "./pages/destinations/DestinationsList";
import AddDestination from "./pages/destinations/AddDestination";
import EditDestination from "./pages/destinations/EditDestination";
import DestinationDetails from "./pages/destinations/DestinationDetails";
import BookingPage from "./pages/bookings/BookingPage";
import BookingConfirmation from "./pages/bookings/BookingConfirmation";
import ProfilePage from "./pages/users/ProfilePage";
import UsersList from "./pages/users/UsersList";
import AuthPage from "./pages/AuthPage";
import OTPPage from "./pages/OTPPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const role = localStorage.getItem("role");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <BrowserRouter>
      <Layout isLoggedIn={isLoggedIn}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/otp" element={<OTPPage setIsLoggedIn={setIsLoggedIn} />} />

          {/* COMMON (logged in) */}
          <Route path="/destinations" element={isLoggedIn ? <DestinationsList /> : <Navigate to="/auth" />} />
          <Route path="/destinations/details/:name" element={isLoggedIn ? <DestinationDetails /> : <Navigate to="/auth" />} />

          {/* CUSTOMER ONLY */}
          {role === "customer" && (
            <>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/booking/:name" element={<BookingPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            </>
          )}

          {/* ADMIN ONLY */}
          {role === "admin" && (
            <>
              <Route path="/destinations/add" element={<AddDestination />} />
              <Route path="/destinations/edit/:name" element={<EditDestination />} />
              <Route path="/users" element={<UsersList />} />
            </>
          )}

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
