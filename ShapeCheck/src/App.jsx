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
        {location.pathname !== "/" && location.pathname !== "/wizard"  && (
          <Navbar />
        )}
        <Outlet />
      </main>
    </>
  );
}

export default App;
