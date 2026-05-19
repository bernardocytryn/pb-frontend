import { useState } from "react";
import "./App.css";
import TelaBemvindo from "./pages/TelaBemvindo";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

function App() {
  const location = useLocation();

  return (
    <>
      <main>
        <Outlet />
        {location.pathname !== "/" && location.pathname !== "/wizard" && (
          <Navbar />
        )}
      </main>
    </>
  );
}

export default App;
