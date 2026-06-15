import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { IcoMira, IcoPeso, IcoCalendario, IcoFogo } from "./Icones";
import styles from "./CardStatus.module.css";

function getIcon(iconKey) {
   const icons = {
      mira: <IcoMira />,
      peso: <IcoPeso />,
      calendario: <IcoCalendario />,
      fogo: <IcoFogo />,
   };
   return icons[iconKey];
}

export default function CardStatus() {
   const { usuario } = useAuth();
   const perfil = usuario?.perfil || {};

   const objetivo = perfil?.objetivo || "—";
   const peso = perfil?.peso ? `${perfil.peso} kg` : "—";
   const frequencia = perfil?.frequencia || "—";

   let series = [];
   try {
      series = JSON.parse(localStorage.getItem("minhasSeries") || "null") || usuario?.treinos || [];
   } catch (e) {
      series = usuario?.treinos || [];
   }

   const semanas = Array.isArray(series) ? series.length : 0;

   const stats = [
      { val: objetivo, lbl: "Objetivo atual", icon: "mira" },
      { val: peso, lbl: "Peso atual", icon: "peso" },
      { val: frequencia, lbl: "Frequência semanal", icon: "calendario" },
      { val: semanas > 0 ? `${semanas} sem` : "—", lbl: "Sequência ativa", icon: "fogo", streak: semanas > 0 },
   ];

   return (
      <div className={styles.grid}>
         {stats.map((stat, i) => (
            <div key={i} className={`${styles.statCard} ${stat.streak ? styles.streak : ""}`}>
               <div className={styles.icone}>{getIcon(stat.icon)}</div>
               <div className={styles.valor}>{stat.val}</div>
               <div className={styles.rotulo}>{stat.lbl}</div>
            </div>
         ))}
      </div>
   );
}