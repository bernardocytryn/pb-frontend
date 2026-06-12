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
import TelaAutenticacao from "./pages/TelaAutenticacao.jsx";
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
import { StatusTreinoProvider } from "./contexts/StatusTreinoContext.jsx";
import { useAuth } from "./hooks/useAuth.jsx";

const RotaVisitante = ({ children }) => {
  const { estaAutenticado, completouWizard } = useAuth();
  if (estaAutenticado) {
    return completouWizard ? (
      <Navigate to="/home" replace />
    ) : (
      <Navigate to="/wizard" replace />
    );
  }
  return children;
};

const RotaWizard = ({ children }) => {
  const { estaAutenticado, completouWizard } = useAuth();
  if (!estaAutenticado) return <Navigate to="/auth" replace />;
  if (completouWizard) return <Navigate to="/home" replace />;
  return children;
};

const RotaPrivadaApp = ({ children }) => {
  const { estaAutenticado, completouWizard } = useAuth();
  if (!estaAutenticado) return <Navigate to="/auth" replace />;
  if (!completouWizard) return <Navigate to="/wizard" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ExerciciosProvider>
        <CriacaoSerieProvider>
          <StatusTreinoProvider>
            <App />
          </StatusTreinoProvider>
        </CriacaoSerieProvider>
      </ExerciciosProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <RotaVisitante>
            <TelaBemvindo />
          </RotaVisitante>
        ),
      },
      {
        path: "auth",
        element: (
          <RotaVisitante>
            <TelaAutenticacao />
          </RotaVisitante>
        ),
      },
      {
        path: "wizard",
        element: (
          <RotaWizard>
            <Wizard />
          </RotaWizard>
        ),
      },
      {
        path: "home",
        element: (
          <RotaPrivadaApp>
            <TelaDashboard />
          </RotaPrivadaApp>
        ),
      },
      {
        path: "dashboard",
        element: (
          <RotaPrivadaApp>
            <TelaGraficoEvolucao />
          </RotaPrivadaApp>
        ),
      },
      {
        path: "treinos",
        element: (
          <RotaPrivadaApp>
            <TelaTreinos />
          </RotaPrivadaApp>
        ),
      },
      {
        path: "treino",
        element: (
          <RotaPrivadaApp>
            <TelaTreino />
          </RotaPrivadaApp>
        ),
      },
      {
        path: "series/:id",
        element: (
          <RotaPrivadaApp>
            <TelaListaTreinos />
          </RotaPrivadaApp>
        ),
      },
      {
        path: "consultar",
        element: (
          <RotaPrivadaApp>
            <TelaExercicio />
          </RotaPrivadaApp>
        ),
      },
      {
        path: "criar-serie",
        element: (
          <RotaPrivadaApp>
            <CriarSerie />
          </RotaPrivadaApp>
        ),
      },
      {
        path: "perfil",
        element: (
          <RotaPrivadaApp>
            <TelaPerfil />
          </RotaPrivadaApp>
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
  </StrictMode>
);