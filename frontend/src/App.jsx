import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DestinationsList from "./pages/destinations/DestinationsList";
import UsersList from "./pages/users/UsersList";
import AddDestination from "./pages/destinations/AddDestination";
import EditDestination from "./pages/destinations/EditDestination";
import AuthPage from "./pages/AuthPage";
import OTPPage from "./pages/OTPPage";
import { useState, useEffect } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <BrowserRouter>
      <Layout isLoggedIn={isLoggedIn}>
        <Routes>
          <Route path="/" element={<AuthPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/otp" element={<OTPPage setIsLoggedIn={setIsLoggedIn} />} />

          <Route path="/destinations" element={isLoggedIn ? <DestinationsList /> : <Navigate to="/" />} />
          <Route path="/destinations/add" element={isLoggedIn ? <AddDestination /> : <Navigate to="/" />} />
          <Route path="/destinations/edit/:name" element={isLoggedIn ? <EditDestination /> : <Navigate to="/" />} />
          <Route path="/users" element={isLoggedIn ? <UsersList /> : <Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
