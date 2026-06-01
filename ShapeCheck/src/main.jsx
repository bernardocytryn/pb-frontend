import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import TelaBemvindo from "./pages/TelaBemvindo.jsx";
import Wizard from "./pages/Wizard.jsx";
import TelaDashboard from "./pages/TelaHome.jsx";
import TelaPerfil from "./pages/TelaPerfil.jsx";
import TelaGraficoEvolucao from "./pages/TelaDashboard.jsx";
import TelaTreinos from "./pages/TelaTreinos.jsx";
import TelaTreino from "./pages/TelaTreino.jsx";
import TelaListaTreinos from "./pages/TelaListaTreinos.jsx";
import TelaExercicio from "./pages/TelaExercicio.jsx";
import { ExerciciosProvider } from "./contexts/ExerciciosContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.jsx";

const RotaPublica = ({ children }) => {
  const { completouWizard } = useAuth();
  if (completouWizard) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const RotaProtegida = ({ children }) => {
  const { completouWizard } = useAuth();
  if (!completouWizard) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ExerciciosProvider>
        <App />
      </ExerciciosProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <RotaPublica>
            <TelaBemvindo />
          </RotaPublica>
        ),
      },
      {
        path: "wizard",
        element: (
          <RotaPublica>
            <Wizard />
          </RotaPublica>
        ),
      },

      {
        path: "home",
        element: (
          <RotaProtegida>
            <TelaDashboard />
          </RotaProtegida>
        ),
      },
      {
        path: "dashboard",
        element: (
          <RotaProtegida>
            <TelaGraficoEvolucao />
          </RotaProtegida>
        ),
      },
      {
        path: "treinos",
        element: (
          <RotaProtegida>
            <TelaTreinos />
          </RotaProtegida>
        ),
      },
      {
        path: "treino",
        element: (
          <RotaProtegida>
            <TelaTreino />
          </RotaProtegida>
        ),
      },
      {
        path: "series/:id",
        element: (
          <RotaProtegida>
            <TelaListaTreinos />
          </RotaProtegida>
        ),
      },
      {
        path: "consultar",
        element: (
          <RotaProtegida>
            <TelaExercicio />
          </RotaProtegida>
        ),
      },
      {
        path: "perfil",
        element: (
          <RotaProtegida>
            <TelaPerfil />
          </RotaProtegida>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
