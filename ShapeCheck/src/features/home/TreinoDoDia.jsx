import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TreinoDoDia.module.css';

export default function TreinoDoDia({ treinoDados, onFinalizar }) {
  const navigate = useNavigate();

  if (!treinoDados || !treinoDados.exercicios || treinoDados.exercicios.length === 0) {
    return (
      <section className={styles.workoutCard}>
        <p className={styles.emptyMessage}>
          Você não tem treinos pendentes para hoje. Dia de descanso!
        </p>
      </section>
    );
  }

  const nomesExercicios = treinoDados.exercicios
    .slice(0, 3)
    .map(ex => ex.name || ex.nome);

  let textoResumo = nomesExercicios.join(', ');
  if (treinoDados.exercicios.length > 3) {
    textoResumo += '...';
  }

  const handleIniciarTreino = () => {
    navigate(`/series/${treinoDados.id}`);
  };
  const handleConcluirTreino = () => {
    onFinalizar();
  };

  return (
    <section className={styles.workoutCard}>
      <div className={styles.workoutContent}>
        <div>
          <p className={styles.cardLabel}>Treino de Hoje:</p>
          <h2 className={styles.workoutTitle}>{treinoDados.nome}</h2>
        </div>

        <div className={styles.infoContainer}>
          <p className={styles.resumoTexto}>{textoResumo}</p>
          <span className={styles.exerciseCount}>
            {treinoDados.exercicios.length} exercícios
          </span>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button
          className={styles.playButton}
          title="Iniciar Treino"
          onClick={handleIniciarTreino}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <polygon points="9 9 15 12 9 15 9 9"></polygon>
            <circle cx="12" cy="12" r="10" fill="none"></circle>
          </svg>
        </button>

        <button
          className={styles.finishButton}
          title="Concluir Treino"
          onClick={handleConcluirTreino}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Concluir
        </button>
      </div>
    </section>
  );
}