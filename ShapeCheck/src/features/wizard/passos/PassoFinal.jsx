import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./PassoFinal.module.css";

const Passo7Final = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tudo pronto</h1>
      <div className={styles.check}>
        <span>
          <FaCheckCircle />
        </span>
      </div>
      <p className={styles.description}>
        Clique em finalizar para gerar suas fichas de treinos e comece a
        transformar sua vida.
      </p>
    </div>
  );
};

export default Passo7Final;
