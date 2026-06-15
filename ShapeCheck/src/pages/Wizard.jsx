import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarraProgresso from "../features/wizard/components/BarraProgresso";
import BotoesVoltarAvancar from "../features/wizard/components/BotoesVoltarAvancar";
import Passo1Form from "../features/wizard/passos/Passo1Form";
import Passo2Lugar from "../features/wizard/passos/Passo2Lugar";
import Passo3Nivel from "../features/wizard/passos/Passo3Nivel";
import Passo4Frequencia from "../features/wizard/passos/Passo4Frequencia";
import Passo5Objetivo from "../features/wizard/passos/Passo5Objetivo";
import PassoFinal from "../features/wizard/passos/PassoFinal";
import { CircularProgress } from "@mui/material";
import styles from "./Wizard.module.css";
import { useAuth } from "../hooks/useAuth";
import { useExercicios } from "../contexts/ExerciciosContext";

const Wizard = () => {
  const navigate = useNavigate();
  const { finalizarCadastroWizard } = useAuth();
  const { exercicios } = useExercicios();

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
    setRespostasForm((prev) => ({ ...prev, [campo]: valor }));
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
      }
      setCamposVazios({});
    }

    if (passoAtual === 2 && !respostasWizard.lugar) return;
    if (passoAtual === 3 && !respostasWizard.nivel) return;
    if (passoAtual === 4 && !respostasWizard.frequencia) return;
    if (passoAtual === 5 && !respostasWizard.objetivo) return;

    if (passoAtual === 6) {
      finalizarWizard();
    } else {
      setPassoAtual((prev) => prev + 1);
    }
  };

  const selecionarOpcao = (campo, valor) => {
    setRespostasWizard((prev) => ({ ...prev, [campo]: valor }));
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
        return <PassoFinal />;
    }
  };

  const finalizarWizard = async () => {
    setIsCarregando(true);
    const dadosDoUsuario = {
      ...respostasForm,
      ...respostasWizard,
      fotoAdicionada: temFoto,
    };
    const listaDisponivel = exercicios.map((ex) => ({
      id: ex.id,
      name: ex.name,
    }));

    let seriesGeradas = [];
    let planoSemanal = [];

    try {
      const promptParaIA = `Crie uma ficha de treino para ${dadosDoUsuario.nome}.
      Objetivo: ${dadosDoUsuario.objetivo}
      Frequência: ${dadosDoUsuario.frequencia}
      Nível: ${dadosDoUsuario.nivel}
      
      REGRA CRÍTICA: 
      1. Selecione exercícios APENAS da lista: ${JSON.stringify(listaDisponivel)}
      2. Retorne APENAS um objeto JSON. 
      3. NÃO use blocos de código markdown, não use \`\`\`json, não escreva nada além do JSON.
      4. O formato deve ser estritamente: { "series": [{"nome": "...", "exercicios": [{"nome": "..."}]}], "planoSemanal": ["...", "..."] }`;

      const respostaIA = await fetch(
        "https://api.mistral.ai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
              {
                role: "system",
                content: "Você é um especialista em fitness. Retorne APENAS um JSON puro, sem formatação markdown.",
              },
              {
                role: "user",
                content: promptParaIA,
              },
            ],
            temperature: 0.7,
          }),
        },
      );

      if (!respostaIA.ok) throw new Error("Erro na API da Mistral");

      const dadosDaAPI = await respostaIA.json();
      let textoResposta = dadosDaAPI.choices[0].message.content;

      // Limpeza robusta
      const jsonString = textoResposta.replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonGerado = JSON.parse(jsonString);

      planoSemanal = jsonGerado.planoSemanal || [];
      const seriesDaIA = jsonGerado.series || [];

      // Mapeamento seguro com fallback para array vazio
      seriesGeradas = (seriesDaIA || []).map((serie) => {
        const exerciciosDaSerie = (serie.exercicios || [])
          .map((ex) => {
            const correspondente = exercicios.find(
              (item) => item.name.toLowerCase().trim() === ex.nome.toLowerCase().trim(),
            );
            if (correspondente) {
              return {
                exerciseId: correspondente.id,
                name: correspondente.name,
                bodyPart: correspondente.bodyPart,
                equipment: correspondente.equipment,
                imageUrl: correspondente.imageUrl,
              };
            }
            return null;
          })
          .filter((ex) => ex !== null);

        return {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          nome: serie.nome,
          exercicios: exerciciosDaSerie,
        };
      });

      finalizarCadastroWizard(dadosDoUsuario, seriesGeradas, planoSemanal);
      navigate("/dashboard");
    } catch (erro) {
      console.error("Falha ao gerar ficha com a IA:", erro);
      alert("Houve um erro ao gerar seu treino. Tente novamente.");
      setIsCarregando(false);
    }
  };

  if (isCarregando)
    return (
      <div className={styles.loading}>
        <CircularProgress size={80} sx={{ color: "#ffcb3c" }} />
      </div>
    );

  return (
    <div className={styles.wizard}>
      {passoAtual < 6 && (
        <BarraProgresso passoAtual={passoAtual} totalPassos={5} />
      )}
      <div key={passoAtual} className={styles["passo-animado"]}>
        {renderizarPasso()}
      </div>
      <BotoesVoltarAvancar
        voltar={voltar}
        avancar={avancar}
        passoAtual={passoAtual}
        gerarFichas={finalizarWizard}
        podeAvancar={verificarSePodeAvancar()}
      />
    </div>
  );
};

export default Wizard;