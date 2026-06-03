import styles from './GraficoEvolucao.module.css';

export default function GraficoEvolucao() {
  return (
    <section className={styles.progressSection}>
      <h3 className={styles.sectionTitle}>MEU PROGRESSO</h3>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h4>EVOLUÇÃO DO PESO</h4>
          <span>PERDA TOTAL: -6.8 KG (12 SEMANAS)</span>
        </div>

        <div className={styles.chartArea}>
          <div className={styles.chartGradient}></div>
        </div>
      </div>
    </section>
  );
}