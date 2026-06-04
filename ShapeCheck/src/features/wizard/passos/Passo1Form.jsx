import React from "react";
import LabelInput from "../../../components/ui/LabelInput";
import styles from "./Passo1Form.module.css";
import BotaoOpcao from "../components/BotaoOpcao";

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
          placeholder={"Digite seu nome:"}
          taVazio={camposVazios?.nome}
          valorInput={respostasForm.nome}
          onChange={(e) => {
            const valorFiltrado = e.target.value
              .replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
              .slice(0, 15);
            atualizarForm("nome", valorFiltrado);
          }}
        />
        <div className={styles.inputsPequenos}>
          <LabelInput
            label={"Idade"}
            placeholder={"Digite sua idade:"}
            taVazio={camposVazios?.idade}
            valorInput={respostasForm.idade}
            onChange={(e) => {
              let valorFiltrado = e.target.value.replace(/\D/g, "");
              if (Number(valorFiltrado) > 100) valorFiltrado = "100";
              atualizarForm("idade", valorFiltrado);
            }}
          />
          <LabelInput
            label={"Peso (kg):"}
            placeholder={"Ex: 72,5"}
            taVazio={camposVazios?.peso}
            valorInput={respostasForm.peso}
            onChange={(e) => {
              let valorFiltrado = e.target.value.replace(/[^0-9.,]/g, "");
              if (parseFloat(valorFiltrado.replace(",", ".")) > 500)
                valorFiltrado = "500";
              atualizarForm("peso", valorFiltrado);
            }}
          />
          <LabelInput
            label={"Altura (cm):"}
            placeholder={"Ex: 180"}
            taVazio={camposVazios?.altura}
            valorInput={respostasForm.altura}
            onChange={(e) => {
              let valorFiltrado = e.target.value.replace(/[^0-9.,]/g, "");
              if (parseFloat(valorFiltrado.replace(",", ".")) > 300)
                valorFiltrado = "300";
              atualizarForm("altura", valorFiltrado);
            }}
          />
        </div>
        <div className={styles.sexoContainer}>
          <label className={styles.sexoLabel}>Sexo biológico:</label>
          <div className={styles.sexoRadios}>
            <BotaoOpcao
              opcao={"Masculino"}
              isSelecionado={respostasForm.sexo === "Masculino"}
              onClick={() => atualizarForm("sexo", "Masculino")}
            />
            <BotaoOpcao
              opcao={"Feminino"}
              isSelecionado={respostasForm.sexo === "Feminino"}
              onClick={() => atualizarForm("sexo", "Feminino")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passo1Form;
