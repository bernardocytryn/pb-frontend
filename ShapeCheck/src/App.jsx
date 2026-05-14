import { useState } from "react";
import "./App.css";
import TelaBemvindo from "./pages/TelaBemvindo";
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <>
      <main>
        <Outlet/>
        <Navbar/>
      </main>
    </>
  );
}

export default App;
