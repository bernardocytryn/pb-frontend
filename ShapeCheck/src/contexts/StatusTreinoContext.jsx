import { createContext, useContext, useState, useEffect } from "react";

const StatusTreinoContext = createContext();

export function StatusTreinoProvider({ children }) {
  const [statusSeries, setStatusSeries] = useState({});

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem("shapecheck_status_series") || "{}");
    setStatusSeries(salvos);
  }, []);

  const alternarStatus = (id) => {
    setStatusSeries((prev) => {
      const atual = prev[id] || false;
      const novoStatus = { ...prev, [id]: !atual };
      localStorage.setItem("shapecheck_status_series", JSON.stringify(novoStatus));
      return novoStatus;
    });
  };

  return (
    <StatusTreinoContext.Provider value={{ statusSeries, alternarStatus }}>
      {children}
    </StatusTreinoContext.Provider>
  );
}

export function useStatusTreino() {
  const context = useContext(StatusTreinoContext);
  if (!context) throw new Error();
  return context;
}