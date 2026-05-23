import React from "react";
import NavbarPerfil from "../features/perfil/NavbarPerfil";
import CardPerfil from "../features/perfil/CardPerfil";
import CardStatus from "../features/perfil/CardStatus";
import Calendario from "../features/perfil/Calendario";
import ListaConfiguracoes from "../features/perfil/ListaConfiguracoes";
import styles from "./TelaPerfil.module.css";

export default function TelaPerfil() {
  return (
    <div className={styles.container}>
      {/* <NavbarPerfil /> */}

      <main className={styles.main}>
        <div className={styles.rotulo}>Perfil</div>
        <CardPerfil />

        <div className={styles.rotulo}>Status Fitness</div>
        <CardStatus />

        <div className={styles.rotulo}>Calendário de Treinos</div>
        <Calendario />

        <div className={styles.rotulo}>Conta</div>
        <ListaConfiguracoes />
      </main>
    </div>
  );
}