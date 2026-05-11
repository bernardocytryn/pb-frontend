import { useState } from "react";
import styles from "./Wizard.module.css";
import BarraProgresso from "../features/wizard/components/BarraProgresso";
import BotoesVoltarAvancar from "../features/wizard/components/BotoesVoltarAvancar";
import Passo1Form from "../features/wizard/passos/Passo1Form";
import Passo2Lugar from "../features/wizard/passos/Passo2Lugar";
import Passo3Nivel from "../features/wizard/passos/Passo3Nivel";
import Passo4Frequencia from "../features/wizard/passos/Passo4Frequencia";
import Passo5Objetivo from "../features/wizard/passos/Passo5Objetivo";
import Passo6Foto from "../features/wizard/passos/Passo6Foto";
import Passo7Final from "../features/wizard/passos/Passo7Final";
import { CircularProgress } from "@mui/material";

const Wizard = () => {
  const passos = [
    "Dados Básicos",
    "Local",
    "Nível",
    "Frequência",
    "Objetivo",
    "Foto",
  ];
  const [passoAtual, setPassoAtual] = useState(1);
  const [isCarregando, setIsCarregando] = useState(false);

  const [respostasForm, setRespostasForm] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
  });
  const [respostasWizard, setRespostasWizard] = useState({
    lugar: "",
    nivel: "",
    frequencia: "",
    objetivo: "",
  });

  const finalizarWizard = () => setIsCarregando(true);
  const voltar = () => setPassoAtual((prev) => Math.max(prev - 1, 1));
  const avancar = () => {
    if (passoAtual === 7) {
      finalizarWizard();
    } else {
      setPassoAtual((prev) => prev + 1);
    }
  };

  const selecionarOpcao = (campo, valor) => {
    setRespostasWizard((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const renderizarPasso = () => {
    switch (passoAtual) {
      case 1:
        return <Passo1Form respostasForm={respostasForm} />;
      case 2:
        return (
          <Passo2Lugar
            respostasWizard={respostasWizard}
            selecionarOpcao={selecionarOpcao}
          />
        );
      case 3:
        return (
          <Passo3Nivel
            respostasWizard={respostasWizard}
            selecionarOpcao={selecionarOpcao}
          />
        );
      case 4:
        return (
          <Passo4Frequencia
            respostasWizard={respostasWizard}
            selecionarOpcao={selecionarOpcao}
          />
        );
      case 5:
        return (
          <Passo5Objetivo
            respostasWizard={respostasWizard}
            selecionarOpcao={selecionarOpcao}
          />
        );
      case 6:
        return <Passo6Foto />;
      case 7:
        return <Passo7Final />;
    }
  };

  if (isCarregando) {
    return (
      <div className={styles.loading}>
        <CircularProgress size={80} sx={{ color: "#ffcb3c" }}/>
        <h2>Gerando suas fichas...</h2>
      </div>
    );
  }

  return (
    <div className={styles.wizard}>
      {passoAtual < 7 && (
        <BarraProgresso passoAtual={passoAtual} totalPassos={6} />
      )}
      {renderizarPasso()}
      <BotoesVoltarAvancar
        voltar={voltar}
        avancar={avancar}
        passoAtual={passoAtual}
      />
    </div>
  );
};

export default Wizard;
