import { useState } from "react";
import "./App.css";
import TelaBemvindo from "./pages/TelaBemvindo";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <main>
        <Outlet/>
      </main>
    </>
  );
}

export default App;
