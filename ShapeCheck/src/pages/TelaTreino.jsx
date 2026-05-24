import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./TelaTreino.module.css";

export default function TelaTreino() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.rotulo}>Exercícios</div>

        <div className={styles.cardsContainer}>
          <div className={styles.card} onClick={() => navigate("/treinos")}>
            <h2 className={styles.cardTitulo}>Séries</h2>
            <p className={styles.cardDescricao}>
              Crie, organize e acesse suas rotinas de treino personalizadas.
            </p>
          </div>

          <div className={styles.card} onClick={() => navigate("/consultar")}>
            <h2 className={styles.cardTitulo}>Consultar Exercícios</h2>
            <p className={styles.cardDescricao}>
              Explore a biblioteca completa e veja detalhes e execuções de cada movimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}