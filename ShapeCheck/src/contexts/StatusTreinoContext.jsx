import { createContext, useContext, useState, useEffect } from "react";

const StatusTreinoContext = createContext();

export function StatusTreinoProvider({ children }) {
  const [statusSeries, setStatusSeries] = useState({});
  const [treinosConcluidos, setTreinosConcluidos] = useState({});

  useEffect(() => {
    const salvosStatus = JSON.parse(localStorage.getItem("shapecheck_status_series") || "{}");
    const salvosTreinos = JSON.parse(localStorage.getItem("shapecheck_treinos_concluidos") || "{}");
    setStatusSeries(salvosStatus);
    setTreinosConcluidos(salvosTreinos);
  }, []);

  const alternarStatus = (treinoId, exercicioId) => {
    const chave = `${treinoId}_${exercicioId}`;
    setStatusSeries((prev) => {
      const atual = prev[chave] || false;
      const novoStatus = { ...prev, [chave]: !atual };
      localStorage.setItem("shapecheck_status_series", JSON.stringify(novoStatus));
      return novoStatus;
    });
  };

  const finalizarTreino = (treinoId, listaExerciciosIds) => {
    const novosTreinos = { ...treinosConcluidos, [treinoId]: true };
    setTreinosConcluidos(novosTreinos);
    localStorage.setItem("shapecheck_treinos_concluidos", JSON.stringify(novosTreinos));

    setStatusSeries((prev) => {
      const novoStatus = { ...prev };
      // Cria chaves compostas para todos os exercícios
      listaExerciciosIds.forEach(id => novoStatus[`${treinoId}_${id}`] = true);
      localStorage.setItem("shapecheck_status_series", JSON.stringify(novoStatus));
      return novoStatus;
    });
  };

  const toggleTreinoConcluido = (treinoId, listaExerciciosIds) => {
    const estaConcluido = !!treinosConcluidos[treinoId];
    const novosTreinos = { ...treinosConcluidos, [treinoId]: !estaConcluido };
    setTreinosConcluidos(novosTreinos);
    localStorage.setItem("shapecheck_treinos_concluidos", JSON.stringify(novosTreinos));

    setStatusSeries((prev) => {
      const novoStatus = { ...prev };
      // Aplica o novo estado (true ou false) para as chaves compostas
      listaExerciciosIds.forEach(id => novoStatus[`${treinoId}_${id}`] = !estaConcluido);
      localStorage.setItem("shapecheck_status_series", JSON.stringify(novoStatus));
      return novoStatus;
    });
  };

  const setEstadoConcluido = (treinoId, status) => {
    setTreinosConcluidos((prev) => {
      if (prev[treinoId] === status) return prev;
      const novosTreinos = { ...prev, [treinoId]: status };
      localStorage.setItem("shapecheck_treinos_concluidos", JSON.stringify(novosTreinos));
      return novosTreinos;
    });
  };

  return (
    <StatusTreinoContext.Provider
      value={{
        statusSeries,
        treinosConcluidos,
        alternarStatus,
        finalizarTreino,
        toggleTreinoConcluido,
        setEstadoConcluido
      }}
    >
      {children}
    </StatusTreinoContext.Provider>
  );
}

export function useStatusTreino() {
  const context = useContext(StatusTreinoContext);
  if (!context) throw new Error("useStatusTreino deve ser usado dentro de um StatusTreinoProvider");
  return context;
}