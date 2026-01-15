import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import SalesHistory from "./pages/SalesHistory";
import Navbar from "./components/Navbar";
import UserManagement from "./pages/UserManagement";
import { Toaster } from "react-hot-toast";

function App() {
  // Initialize state from localStorage so login persists on page refresh
  const [userAuth, setUserAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username"),
  });

  const isAuthenticated = !!userAuth.token;

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-100">
        {/* Pass userAuth so Navbar shows correct name/role instantly */}
        {isAuthenticated && (
          <Navbar userAuth={userAuth} setUserAuth={setUserAuth} />
        )}

        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setUserAuth={setUserAuth} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/pos"
            element={isAuthenticated ? <POS /> : <Navigate to="/login" />}
          />
          <Route
            path="/sales"
            element={
              isAuthenticated ? <SalesHistory /> : <Navigate to="/login" />
            }
          />

          {/* Manager Only Routes */}
          <Route
            path="/inventory"
            element={
              isAuthenticated && userAuth.role === "manager" ? (
                <Inventory />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/users"
            element={
              isAuthenticated && userAuth.role === "manager" ? (
                <UserManagement />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
