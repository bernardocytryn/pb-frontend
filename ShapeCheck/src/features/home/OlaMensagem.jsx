import styles from './OlaMensagem.module.css';

export default function OlaMensagem() {
  return (
    <header className={styles.header}>
      <div>
        <span className={styles.label}>Dashboard (home)</span>
        <h1 className={styles.title}>Olá, Bernardo</h1>
      </div>
    </header>
  );
}