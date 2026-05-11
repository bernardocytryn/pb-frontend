import React from "react";
import frequenciaTreino from "../../../assets/frequencia_treino.png";
import ImagemPasso from "../../../features/wizard/components/ImagemPasso";
import Pergunta from "../../../features/wizard/components/Pergunta";
import BotaoOpcao from "../../../features/wizard/components/BotaoOpcao";
import styles from "./Passos2345.module.css";

const Passo4Frequencia = ({ respostasWizard, selecionarOpcao }) => {
  return (
    <div className={styles.container}>
      <ImagemPasso imagemURL={frequenciaTreino} />
      <Pergunta pergunta={"Frequência semanal de treino?"} />
      <div className={styles.options}>
        <BotaoOpcao
          opcao={"1-2 dias"}
          isSelecionado={respostasWizard.frequencia === "1-2 dias"}
          onClick={() => selecionarOpcao("frequencia", "1-2 dias")}
        />
        <BotaoOpcao
          opcao={"3-4 dias"}
          isSelecionado={respostasWizard.frequencia === "3-4 dias"}
          onClick={() => selecionarOpcao("frequencia", "3-4 dias")}
        />
        <BotaoOpcao
          opcao={"5+ dias"}
          isSelecionado={respostasWizard.frequencia === "5+ dias"}
          onClick={() => selecionarOpcao("frequencia", "5+ dias")}
        />
      </div>
    </div>
  );
};

export default Passo4Frequencia;
