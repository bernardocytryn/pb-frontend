import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarPerfil from "../features/perfil/NavbarPerfil";
import CardPerfil from "../features/perfil/CardPerfil";
import CardStatus from "../features/perfil/CardStatus";
// Calendario removed from this view per profile-focused changes
import ListaConfiguracoes from "../features/perfil/ListaConfiguracoes";
import styles from "./TelaPerfil.module.css";

export default function TelaPerfil() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.rotulo}>Perfil</div>
        <CardPerfil />

        <div className={styles.rotulo}>Status Fitness</div>
        <CardStatus />

        <div className={styles.rotulo}>Conta</div>
        <ListaConfiguracoes />
      </main>
    </div>
  );
}