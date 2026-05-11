import React from "react";
import LabelInput from "../../../components/ui/LabelInput";
import styles from "./Passo1Form.module.css";

const Passo1Form = ({ respostasForm, errosForm }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Vamos montar seu perfil</h2>
        <p className={styles.subtitle}>
          Preencha seus dados básicos para podermos personalizar sua ficha de
          treino.
        </p>
      </div>
      <div>
        <LabelInput label={"Nome"} placeholder={"Digite seu nome"}  erro={errosForm?.nome}/>
        <LabelInput label={"Idade"} placeholder={"Digite sua idade"} erro={errosForm?.idade}/>
        <LabelInput label={"Peso (kg)"} placeholder={"Ex: 72,5"} erro={errosForm?.peso}/>
        <LabelInput label={"Altura (cm)"} placeholder={"Ex: 180"} erro={errosForm?.altura}/>
      </div>
    </div>
  );
};

export default Passo1Form;
