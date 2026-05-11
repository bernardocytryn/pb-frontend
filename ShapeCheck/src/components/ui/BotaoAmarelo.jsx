import React from "react";
import styles from "./BotaoAmarelo.module.css";

const BotaoAmarelo = ({ texto, onClick }) => {
  return (
    <button className={styles["botao-amarelo"]} onClick={onClick}>
      {texto}
    </button>
  );
};

export default BotaoAmarelo;
