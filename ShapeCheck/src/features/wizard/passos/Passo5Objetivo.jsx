import React from "react";
import BotaoOpcao from "../components/BotaoOpcao";
import Pergunta from "../components/Pergunta";
import styles from "./Passos2345.module.css";

const Passo5Objetivo = ({ respostasWizard, selecionarOpcao }) => {
  return (
    <div className={styles.containerSemImagem}>
      <Pergunta pergunta={"Defina seu objetivo:"} />
      <div className={styles.options}>
        <BotaoOpcao
          opcao={"Ganho de músculo"}
          isSelecionado={respostasWizard.objetivo === "Ganho de músculo"}
          onClick={() => selecionarOpcao("objetivo", "Ganho de músculo")}
        />
        <BotaoOpcao
          opcao={"Emagrecimento"}
          isSelecionado={respostasWizard.objetivo === "Emagrecimento"}
          onClick={() => selecionarOpcao("objetivo", "Emagrecimento")}
        />
        <BotaoOpcao
          opcao={"Força"}
          isSelecionado={respostasWizard.objetivo === "Força"}
          onClick={() => selecionarOpcao("objetivo", "Força")}
        />
        <BotaoOpcao
          opcao={"Condicionamento"}
          isSelecionado={respostasWizard.objetivo === "Condicionamento"}
          onClick={() => selecionarOpcao("objetivo", "Condicionamento")}
        />
      </div>
    </div>
  );
};

export default Passo5Objetivo;