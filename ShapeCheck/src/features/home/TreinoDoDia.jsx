import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStatusTreino } from '../../contexts/StatusTreinoContext'; // Verifique se o caminho bate com a sua pasta
import styles from './TreinoDoDia.module.css';

export default function TreinoDoDia({ treinoDados }) {
  const navigate = useNavigate();
  const { alternarStatus } = useStatusTreino();

  if (!treinoDados || !treinoDados.exercicios || treinoDados.exercicios.length === 0) {
    return (
      <section className={styles.workoutCard}>
        <p className={styles.emptyMessage}>
          Você não tem treinos pendentes para hoje. Dia de descanso!
        </p>
      </section>
    );
  }

  // Lógica do resumo dos exercícios
  const nomesExercicios = treinoDados.exercicios
    .slice(0, 3)
    .map(ex => ex.name || ex.nome);

  let textoResumo = nomesExercicios.join(', ');
  if (treinoDados.exercicios.length > 3) {
    textoResumo += '...';
  }

  // --- AS NOVAS FUNÇÕES ---

  const handleIniciarTreino = () => {
    // Redireciona para a mesma rota que você usa na sua lista de "Minhas Séries"
    navigate(`/series/${treinoDados.id}`);
  };

  const handleConcluirTreino = () => {
    // Usa a mesma função do botão de check da sua lista
    alternarStatus(treinoDados.id);
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
        {/* Adicionado o onClick para Iniciar */}
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

        {/* Adicionado o onClick para Concluir */}
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