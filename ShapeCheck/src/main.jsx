import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TelaBemvindo from "./pages/TelaBemvindo.jsx";
import Wizard from "./pages/Wizard.jsx";
import TelaDashboard from "./pages/TelaHome.jsx";
import TelaPerfil from "./pages/TelaPerfil.jsx";
import TelaGraficoEvolucao from "./pages/TelaDashboard.jsx";
import TelaTreinos from "./pages/TelaTreinos.jsx";
import TelaTreino from "./pages/TelaTreino.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <TelaBemvindo/>
      },
      {
        path: "wizard",
        element: <Wizard/>
      },
      {
        path: "home",
        element: <TelaDashboard/>
      },
      {
        path: "dashboard",
        element: <TelaGraficoEvolucao/>
      },
      {
        path: "treinos",
        element: <TelaTreinos/>
      },
      {
        path: "treino",
        element: <TelaTreino/>
      },
      {
        path: "perfil",
        element: <TelaPerfil/>
      }
    ]
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
);
