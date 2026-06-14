import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarPerfil from "../features/perfil/NavbarPerfil";
import CardPerfil from "../features/perfil/CardPerfil";
import CardStatus from "../features/perfil/CardStatus";
import ListaConfiguracoes from "../features/perfil/ListaConfiguracoes";
import styles from "./TelaPerfil.module.css";

export default function TelaPerfil() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.rotulo}>Perfil</div>
          <CardPerfil />
        </section>

        <section className={styles.section}>
          <div className={styles.rotulo}>Status Fitness</div>
          <CardStatus />
        </section>

        <section className={`${styles.section} ${styles.fullWidth}`}>
          <div className={styles.rotulo}>Conta</div>
          <ListaConfiguracoes />
        </section>
      </main>
    </div>
  );
}
