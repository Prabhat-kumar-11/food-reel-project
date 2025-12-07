import React from "react";
import "./styles/theme.css";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

// Prefer environment variable set in `.env` (VITE_API_URL). Fallback to localhost:8080 for local dev.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
