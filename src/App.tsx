import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/navbar";

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
