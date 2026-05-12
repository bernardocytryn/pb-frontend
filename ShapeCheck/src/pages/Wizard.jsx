import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import styles from "./Wizard.module.css";

const Wizard = () => {
  const passos = [
    "Dados Básicos",
    "Local",
    "Nível",
    "Frequência",
    "Objetivo",
    "Foto",
  ];
  const navigate = useNavigate();
  const [passoAtual, setPassoAtual] = useState(1);
  const [isCarregando, setIsCarregando] = useState(false);
  const [temFoto, setTemFoto] = useState(false);
  const [camposVazios, setCamposVazios] = useState({});

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

  const atualizarForm = (campo, valor) => {
    setRespostasForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const voltar = () => setPassoAtual((prev) => Math.max(prev - 1, 1));
  const avancar = () => {
    if (passoAtual === 1) {
      const vazios = {};

      if (!respostasForm.nome) vazios.nome = true;
      if (!respostasForm.idade) vazios.idade = true;
      if (!respostasForm.peso) vazios.peso = true;
      if (!respostasForm.altura) vazios.altura = true;

      if (Object.keys(vazios).length > 0) {
        setCamposVazios(vazios);
        return;
      } else {
        setCamposVazios({});
      }
    }
    if (passoAtual === 2 && !respostasWizard.lugar) {
      return;
    }
    if (passoAtual === 3 && !respostasWizard.nivel) {
      return;
    }
    if (passoAtual === 4 && !respostasWizard.frequencia) {
      return;
    }
    if (passoAtual === 5 && !respostasWizard.objetivo) {
      return;
    }
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
  const verificarSePodeAvancar = () => {
    if (passoAtual === 1) {
      return (
        respostasForm.nome &&
        respostasForm.idade &&
        respostasForm.peso &&
        respostasForm.altura
      );
    }
    if (passoAtual === 2) return respostasWizard.lugar !== "";
    if (passoAtual === 3) return respostasWizard.nivel !== "";
    if (passoAtual === 4) return respostasWizard.frequencia !== "";
    if (passoAtual === 5) return respostasWizard.objetivo !== "";

    return true;
  };
  const renderizarPasso = () => {
    switch (passoAtual) {
      case 1:
        return (
          <Passo1Form
            respostasForm={respostasForm}
            camposVazios={camposVazios}
            atualizarForm={atualizarForm}
          />
        );
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
        return <Passo6Foto setTemFoto={setTemFoto} />;
      case 7:
        return <Passo7Final />;
    }
  };

  const finalizarWizard = () => {
    setIsCarregando(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  if (isCarregando) {
    return (
      <div className={styles.loading}>
        <CircularProgress size={80} sx={{ color: "#ffcb3c" }} />
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
        temFoto={temFoto}
        gerarFichas={finalizarWizard}
        podeAvancar={verificarSePodeAvancar()}
      />
    </div>
  );
};

export default Wizard;
