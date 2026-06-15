import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ErrorBanner from "./components/ErrorBanner";
import "./App.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const ordemDasTelas = ["/home", "/treino", "/dashboard", "/perfil"];

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;

      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        const indexAtual = ordemDasTelas.indexOf(location.pathname);

        if (deltaX > 0) {
          if (indexAtual !== -1 && indexAtual < ordemDasTelas.length - 1) {
            navigate(ordemDasTelas[indexAtual + 1]);
          }
        } else {
          if (indexAtual > 0) {
            navigate(ordemDasTelas[indexAtual - 1]);
          }
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      capture: true,
    });
    document.addEventListener("touchend", handleTouchEnd, { capture: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart, {
        capture: true,
      });
      document.removeEventListener("touchend", handleTouchEnd, {
        capture: true,
      });
    };
  }, [location.pathname, navigate]);

  const caminhoAtual =
    location.pathname.toLowerCase().replace(/\/$/, "") || "/";
  const rotasSemNavbar = ["/", "/auth", "/wizard"];
  const mostrarNavbar = !rotasSemNavbar.includes(caminhoAtual);

  return (
    <main
      className={mostrarNavbar ? "main-with-navbar" : "main"}
      style={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <ErrorBanner />
      <Outlet />
      {mostrarNavbar && <Navbar />}
    </main>
  );
}

export default App;
