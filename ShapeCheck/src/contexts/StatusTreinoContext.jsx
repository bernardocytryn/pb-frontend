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

  const alternarStatus = (id) => {
    setStatusSeries((prev) => {
      const atual = prev[id] || false;
      const novoStatus = { ...prev, [id]: !atual };
      localStorage.setItem("shapecheck_status_series", JSON.stringify(novoStatus));
      return novoStatus;
    });
  };

  const finalizarTreino = (treinoId, listaExerciciosIds) => {
    //Marca o treino como concluído
    const novosTreinos = { ...treinosConcluidos, [treinoId]: true };
    setTreinosConcluidos(novosTreinos);
    localStorage.setItem("shapecheck_treinos_concluidos", JSON.stringify(novosTreinos));

    //Marca todos os exercícios como true
    setStatusSeries((prev) => {
      const novoStatus = { ...prev };
      listaExerciciosIds.forEach(id => novoStatus[id] = true);
      localStorage.setItem("shapecheck_status_series", JSON.stringify(novoStatus));
      return novoStatus;
    });
  };

  const toggleTreinoConcluido = (treinoId, listaExerciciosIds) => {
    //Inverte o estado global do treino
    const estaConcluido = !!treinosConcluidos[treinoId];
    const novosTreinos = { ...treinosConcluidos, [treinoId]: !estaConcluido };
    setTreinosConcluidos(novosTreinos);
    localStorage.setItem("shapecheck_treinos_concluidos", JSON.stringify(novosTreinos));

    //Sincroniza todos os exercícios para o novo estado (se está desfazendo, desmarca tudo)
    setStatusSeries((prev) => {
      const novoStatus = { ...prev };
      listaExerciciosIds.forEach(id => novoStatus[id] = !estaConcluido);
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
    <StatusTreinoContext.Provider value={{ statusSeries, treinosConcluidos, alternarStatus, finalizarTreino, toggleTreinoConcluido, setEstadoConcluido }}>
      {children}
    </StatusTreinoContext.Provider>
  );
}

export function useStatusTreino() {
  const context = useContext(StatusTreinoContext);
  if (!context) throw new Error("useStatusTreino deve ser usado dentro de um StatusTreinoProvider");
  return context;
}