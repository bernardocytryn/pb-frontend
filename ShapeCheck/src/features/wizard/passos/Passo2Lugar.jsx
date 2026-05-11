import React from "react";
import casaAcademia from "../../../assets/casa_academia.png";
import ImagemPasso from "../../../features/wizard/components/ImagemPasso";
import Pergunta from "../../../features/wizard/components/Pergunta";
import BotaoOpcao from "../../../features/wizard/components/BotaoOpcao";
import styles from "./Passos2345.module.css";

const Passo2Lugar = ({ respostasWizard, selecionarOpcao }) => {
  return (
    <div className={styles.container}>
      <ImagemPasso imagemURL={casaAcademia} />
      <Pergunta pergunta={"Onde pretende treinar?"} />
      <div className={styles.options}>
        <BotaoOpcao
          opcao={"Casa"}
          isSelecionado={respostasWizard.lugar === "Casa"}
          onClick={() => selecionarOpcao("lugar", "Casa")}
        />
        <BotaoOpcao
          opcao={"Academia"}
          isSelecionado={respostasWizard.lugar === "Academia"}
          onClick={() => selecionarOpcao("lugar", "Academia")}
        />
      </div>
    </div>
  );
};

export default Passo2Lugar;
