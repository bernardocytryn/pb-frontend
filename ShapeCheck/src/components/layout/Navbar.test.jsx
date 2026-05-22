import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("tem que renderizar os 4 navlinks pra navegar entre as paginas", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );
    const linkHome = screen.getByText("Home");
    const linkTreinos = screen.getByText("Treinos");
    const linkProgresso = screen.getByText("Dashboard");

    expect(linkHome).toBeInTheDocument();
    expect(linkTreinos).toBeInTheDocument();
    expect(linkProgresso).toBeInTheDocument();
  });
});
