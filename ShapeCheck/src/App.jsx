import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import Navbar from "./components/layout/Navbar";
import "./App.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const ordemDasTelas = ["/home", "/treino", "/dashboard", "/perfil"];

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const indexAtual = ordemDasTelas.indexOf(location.pathname);
      if (indexAtual !== -1 && indexAtual < ordemDasTelas.length - 1) {
        navigate(ordemDasTelas[indexAtual + 1]);
      }
    },
    onSwipedRight: () => {
      const indexAtual = ordemDasTelas.indexOf(location.pathname);
      if (indexAtual > 0) {
        navigate(ordemDasTelas[indexAtual - 1]);
      }
    },
    preventScrollOnSwipe: false,
    trackTouch: true,
    trackMouse: false,
  });

  const caminhoAtual =
    location.pathname.toLowerCase().replace(/\/$/, "") || "/";

  const rotasSemNavbar = ["/", "/auth", "/wizard"];

  const mostrarNavbar = !rotasSemNavbar.includes(caminhoAtual);

  return (
    <main
      {...handlers}
      className={mostrarNavbar ? "main-with-navbar" : "main"}
      style={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Outlet />
      {mostrarNavbar && <Navbar />}
    </main>
  );
}

export default App;
