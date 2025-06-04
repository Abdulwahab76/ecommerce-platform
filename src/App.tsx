import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/navbar";
import { BrowserRouter, useLocation } from "react-router-dom";

const AppWrapper = () => {
  const location = useLocation();

  // Hide Navbar for /admin, /admin/*, /user, /user/*
  const hideNavbar =
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/user");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
