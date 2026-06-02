import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useState, useEffect } from "react";
import styles from "./TelaTreinos.module.css";

export default function TelaTreinos() {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const seriesSalvas = JSON.parse(localStorage.getItem('minhasSeries') || '[]');
    setSeries(seriesSalvas);
  }, []);

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
            series.map((serie) => (
              <div 
                key={serie.id} 
                onClick={() => navigate(`/series/${serie.id}`)}
                className={styles.cardSerie}
              >
                <h2 className={styles.nomeSerie}>{serie.nome}</h2>
                <p className={styles.infoSerie}>{serie.exercicios?.length || 0} exercícios</p>
              </div>
            ))
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