import React from "react";
import styles from "./TelaBemvindo.module.css";
import BotaoAmarelo from "../components/ui/BotaoAmarelo";
import { useNavigate } from "react-router-dom";

const TelaBemvindo = () => {
  const navigate = useNavigate();
  const irParaQuestionario = () => {
    navigate("/auth");
  };

  return (
    <div className={styles.boasvindas}>
      <h1>Bem-vindo ao ShapeCheck</h1>
      <h2>Transforme sua visão em forma.</h2>
      <BotaoAmarelo texto="Começar sua jornada" onClick={irParaQuestionario} />
    </div>
  );
};

export default TelaBemvindo;
