import React from "react";
import nivelTreino from "../../../assets/nivel_treino.png";
import ImagemPasso from "../../../features/wizard/components/ImagemPasso";
import Pergunta from "../../../features/wizard/components/Pergunta";
import BotaoOpcao from "../../../features/wizard/components/BotaoOpcao";
import styles from "./Passos2345.module.css";

const Passo3Nivel = ({ respostasWizard, selecionarOpcao }) => {
  return (
    <div className={styles.container}>
      <ImagemPasso imagemURL={nivelTreino} />
      <Pergunta pergunta={"Qual seu nível atual de treino?"} />
      <div className={styles.options}>
        <BotaoOpcao
          opcao={"Iniciante"}
          isSelecionado={respostasWizard.nivel === "Iniciante"}
          onClick={() => selecionarOpcao("nivel", "Iniciante")}
        />
        <BotaoOpcao
          opcao={"Intermediário"}
          isSelecionado={respostasWizard.nivel === "Intermediário"}
          onClick={() => selecionarOpcao("nivel", "Intermediário")}
        />
        <BotaoOpcao
          opcao={"Avançado"}
          isSelecionado={respostasWizard.nivel === "Avançado"}
          onClick={() => selecionarOpcao("nivel", "Avançado")}
        />
      </div>
    </div>
  );
};

export default Passo3Nivel;