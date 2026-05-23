import React from "react";
import LabelInput from "../../../components/ui/LabelInput";
import styles from "./Passo1Form.module.css";

const Passo1Form = ({ respostasForm, camposVazios, atualizarForm }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Vamos montar seu perfil</h2>
        <p className={styles.subtitle}>
          Preencha seus dados básicos para podermos personalizar sua ficha de
          treino.
        </p>
      </div>
      <div className={styles.inputs}>
        <LabelInput
          label={"Nome"}
          placeholder={"Digite seu nome"}
          taVazio={camposVazios?.nome}
          valorInput={respostasForm.nome}
          onChange={(e) => atualizarForm("nome", e.target.value)}
        />
        <div className={styles.inputsPequenos}>
          <LabelInput
            label={"Idade"}
            placeholder={"Digite sua idade"}
            taVazio={camposVazios?.idade}
            valorInput={respostasForm.idade}
            onChange={(e) => atualizarForm("idade", e.target.value)}
          />
          <LabelInput
            label={"Peso (kg)"}
            placeholder={"Ex: 72,5"}
            taVazio={camposVazios?.peso}
            valorInput={respostasForm.peso}
            onChange={(e) => atualizarForm("peso", e.target.value)}
          />
          <LabelInput
            label={"Altura (cm)"}
            placeholder={"Ex: 180"}
            taVazio={camposVazios?.altura}
            valorInput={respostasForm.altura}
            onChange={(e) => atualizarForm("altura", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Passo1Form;
