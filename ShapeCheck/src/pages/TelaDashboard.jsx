import React from 'react'
import GraficoFrequencia from '../features/dashboard/GraficoFrequencia'
import GraficoKcal from '../features/dashboard/GraficoKcal';
import GraficoPeso from '../features/dashboard/GraficoPeso';
import styles from "./TelaDashboard.module.css"

const TelaDashboard = () => {
   return (
      <div className={styles.container}>
         <main className={styles.main}>
            <div className={styles.rotulo}>Dashboard</div>

            <div className={styles.grid}>

               <div className={`${styles.card} ${styles.gridChild}`}>
                  <div className={styles.cardTitulo}>Calorias Queimadas</div>
                  <GraficoKcal />
               </div>

               <div className={styles.card}>
                  <div className={styles.cardTitulo}>Peso</div>
                  <GraficoPeso />
               </div>

               <div className={styles.card}>
                  <div className={styles.cardTitulo}>Tempo em Atividade</div>
                  <GraficoFrequencia />
               </div>

            </div>
         </main>
      </div>
   );
}

export default TelaDashboard