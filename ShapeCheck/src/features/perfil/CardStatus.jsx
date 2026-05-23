import React from "react";
import { statsData } from "../../data/dadosPerfil";
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
  return (
    <div className={styles.grid}>
      {statsData.map((stat, i) => (
        <div key={i} className={`${styles.statCard} ${stat.streak ? styles.streak : ""}`}>
          <div className={styles.icone}>{getIcon(stat.icon)}</div>
          <div className={styles.valor}>{stat.val}</div>
          <div className={styles.rotulo}>{stat.lbl}</div>
        </div>
      ))}
    </div>
  );
}