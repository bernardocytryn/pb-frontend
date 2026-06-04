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

import { useAuth } from "../hooks/useAuth";

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

  const { finalizarCadastroWizard } = useAuth();

  const [passoAtual, setPassoAtual] = useState(1);
  const [isCarregando, setIsCarregando] = useState(false);
  const [temFoto, setTemFoto] = useState(false);
  const [camposVazios, setCamposVazios] = useState({});

  const [respostasForm, setRespostasForm] = useState({
    nome: "",
    idade: "",
    peso: "",
    altura: "",
    sexo: "",
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
      if (!respostasForm.sexo) vazios.sexo = true;

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
      const nomeValido = respostasForm.nome.trim().length >= 3;
      const idadeValida = Number(respostasForm.idade) >= 1;
      const pesoValido = parseFloat(respostasForm.peso.replace(",", ".")) >= 10;
      const alturaValida =
        parseFloat(respostasForm.altura.replace(",", ".")) >= 40;

      return (
        respostasForm.sexo &&
        nomeValido &&
        idadeValida &&
        pesoValido &&
        alturaValida
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
        return <Passo6Foto temFoto={temFoto} setTemFoto={setTemFoto} />;
      case 7:
        return <Passo7Final />;
    }
  };

  const finalizarWizard = async () => {
    setIsCarregando(true);

    const dadosDoUsuario = {
      ...respostasForm,
      ...respostasWizard,
      fotoAdicionada: temFoto,
    };

    try {
      const promptParaIA = `Crie uma ficha de treino para ${dadosDoUsuario.nome}, sexo biológico ${dadosDoUsuario.sexo}, idade ${dadosDoUsuario.idade}, peso ${dadosDoUsuario.peso}kg, altura ${dadosDoUsuario.altura}cm. Objetivo: ${dadosDoUsuario.objetivo}. Local: ${dadosDoUsuario.lugar}. Frequência: ${dadosDoUsuario.frequencia}. Nível: ${dadosDoUsuario.nivel}. 
        Retorne APENAS um array JSON contendo objetos de treino. Cada treino deve ter:
        - "id" (string)
        - "nome" (string, ex: 'Treino A - Peito e Tríceps')
        - "exercicios": um array de objetos, onde cada exercício tem "id" (string), "nome" (string, ex: 'Supino Reto'), "series" (string, ex: '3') e "repeticoes" (string, ex: '10 a 12').
      `;

      const respostaIA = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      "Você é um personal trainer especialista em hipertrofia e saúde. Retorne apenas um JSON válido contendo um array de treinos.\n\n" +
                      promptParaIA,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!respostaIA.ok) throw new Error("Falha ao gerar treino");

      const dadosDaAPI = await respostaIA.json();

      let textoDaIA = dadosDaAPI.candidates[0].content.parts[0].text;

      textoDaIA = textoDaIA
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const seriesGeradas = JSON.parse(textoDaIA);

      finalizarCadastroWizard(dadosDoUsuario, seriesGeradas);

      navigate("/dashboard");
    } catch (erro) {
      console.error("Erro ao falar com a IA:", erro);

      const serieDeEmergencia = [
        { id: "1", nome: "Treino de Adaptação", exercicios: [] },
      ];
      finalizarCadastroWizard(dadosDoUsuario, serieDeEmergencia);
      navigate("/dashboard");
    } finally {
      setIsCarregando(false);
    }
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
      <div key={passoAtual} className={styles["passo-animado"]}>
        {renderizarPasso()}
      </div>
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
