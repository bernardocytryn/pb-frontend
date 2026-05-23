import React from "react";
import { dadosUsuario } from "../../data/dadosPerfil";
import { IcoEngrenagem, IcoLapis, IcoCompartilhar } from "./Icones";
import styles from "./CardPerfil.module.css";

export default function CardPerfil() {
  const { nome, iniciais, idade, arroba, email } = dadosUsuario;

  return (
    <div className={styles.card}>
      <button className={`${styles.btnGhost} ${styles.settings}`} style={{padding: '10px'}} aria-label="Opções">
        <IcoEngrenagem />
      </button>

      <div className={styles.inner}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <span className={styles.avatarTxt}>{iniciais}</span>
          </div>
          <div className={styles.onlineBadge} />
        </div>

        <div className={styles.info}>
          <div className={styles.nomeRow}>
            <span className={styles.nome}>{nome}</span>
            <span className={styles.idade}>{idade} anos</span>
          </div>
          <p className={styles.handle}>
            {arroba} · {email}
          </p>

          <div className={styles.acoes}>
            <button className={`${styles.btn} ${styles.btnAmarelo}`}>
              <IcoLapis /> Editar Perfil
            </button>
            <button className={`${styles.btn} ${styles.btnGhost}`}>
              <IcoCompartilhar /> Compartilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}