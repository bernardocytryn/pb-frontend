import styles from './TreinoDoDia.module.css';

export default function TreinoDoDia() {
  return (
    <section className={styles.workoutCard}>
      <div className={styles.workoutContent}>
        <div>
          <p className={styles.cardLabel}>Treino de Hoje:</p>
          <h2 className={styles.workoutTitle}>TREINO A</h2>
        </div>

        <ul className={styles.exerciseList}>
          <li>Peito</li>
          <li>Ombro</li>
          <li>Tríceps</li>
        </ul>

        <span className={styles.exerciseCount}>7 exercícios</span>
      </div>

      <button className={styles.playButton}>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <polygon points="9 9 15 12 9 15 9 9"></polygon>
          <circle cx="12" cy="12" r="10" fill="none"></circle>
        </svg>
      </button>
    </section>
  );
}