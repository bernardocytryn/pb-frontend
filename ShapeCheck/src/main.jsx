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
import CriarSerie from "./pages/CriarSerie.jsx";
import { ExerciciosProvider } from "./contexts/ExerciciosContext.jsx";
import { CriacaoSerieProvider } from "./contexts/SeriesContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.jsx";
import TelaHome from "./pages/TelaHome.jsx";

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
        <CriacaoSerieProvider>
          <App />
        </CriacaoSerieProvider>
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
            <TelaHome />
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
        path: "criar-serie",
        element: (
          <RotaProtegida>
            <CriarSerie />
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
