import React from "react";
import "./styles/theme.css";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";


export const API_URL = "https://food-reel-project-4jlx.onrender.com";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
