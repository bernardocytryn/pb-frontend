import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { useStatusTreino } from "../contexts/StatusTreinoContext.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import styles from "./TelaTreinos.module.css";

export default function TelaTreinos() {
  const navigate = useNavigate();
  const { statusSeries, alternarStatus } = useStatusTreino();
  const { usuario } = useAuth();
  
  const series = usuario?.treinos || [];

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        
        <div className={styles.header}>
          <button onClick={() => navigate('/treino')} className={styles.botaoVoltar}>
            <FiArrowLeft size={18} /> Voltar
          </button>
        </div>

        <div className={styles.rotulo}>Minhas Séries</div>

        <button 
          onClick={() => navigate("/criar-serie")}
          className={styles.botaoCriar}
        >
          Criar Nova Série
        </button>

        <div className={styles.lista}>
          {series.length > 0 ? (
            series.map((serie) => {
              const concluida = statusSeries[serie.id];

              return (
                <div 
                  key={serie.id} 
                  onClick={() => navigate(`/series/${serie.id}`)}
                  className={`${styles.cardSerie} ${concluida ? styles.cardConcluido : ""}`}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div>
                    <h2 className={styles.nomeSerie}>{serie.nome}</h2>
                    <p className={styles.infoSerie}>{serie.exercicios?.length || 0} exercícios</p>
                  </div>

                  <button 
                    className={`${styles.botaoCheck} ${concluida ? styles.botaoCheckAtivo : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      alternarStatus(serie.id);
                    }}
                  >
                    <FiCheck size={18} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className={styles.estadoVazio}>
              <p className={styles.vazioTextoPrincipal}>
                Você ainda não possui nenhuma série de treino criada.
              </p>
              <span className={styles.vazioTextoSecundario}>
                Clique no botão acima para começar.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}