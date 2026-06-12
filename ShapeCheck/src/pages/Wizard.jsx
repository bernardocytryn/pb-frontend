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
    
    if (passoAtual === 7) {
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
      const alturaValida = parseFloat(respostasForm.altura.replace(",", ".")) >= 40;
      return respostasForm.sexo && nomeValido && idadeValida && pesoValido && alturaValida;
    }
    if (passoAtual === 2) return respostasWizard.lugar !== "";
    if (passoAtual === 3) return respostasWizard.nivel !== "";
    if (passoAtual === 4) return respostasWizard.frequencia !== "";
    if (passoAtual === 5) return respostasWizard.objetivo !== "";
    return true;
  };

  const renderizarPasso = () => {
    switch (passoAtual) {
      case 1: return <Passo1Form respostasForm={respostasForm} camposVazios={camposVazios} atualizarForm={atualizarForm} />;
      case 2: return <Passo2Lugar respostasWizard={respostasWizard} selecionarOpcao={selecionarOpcao} />;
      case 3: return <Passo3Nivel respostasWizard={respostasWizard} selecionarOpcao={selecionarOpcao} />;
      case 4: return <Passo4Frequencia respostasWizard={respostasWizard} selecionarOpcao={selecionarOpcao} />;
      case 5: return <Passo5Objetivo respostasWizard={respostasWizard} selecionarOpcao={selecionarOpcao} />;
      case 6: return <Passo6Foto temFoto={temFoto} setTemFoto={setTemFoto} />;
      case 7: return <Passo7Final />;
    }
  };

  const finalizarWizard = async () => {
    setIsCarregando(true);
    const dadosDoUsuario = { ...respostasForm, ...respostasWizard, fotoAdicionada: temFoto };
    const listaDisponivel = exercicios.map(ex => ({ id: ex.id, name: ex.name }));

    console.log("--- DEBUG WIZARD ---");
    console.log("1. Quantidade de exercícios no contexto:", exercicios.length);
    console.log("2. Lista que está a ir para a IA:", listaDisponivel);

    try {
      const promptParaIA = `Atue como personal trainer. Crie uma ficha de treino para ${dadosDoUsuario.nome}.
      Objetivo: ${dadosDoUsuario.objetivo}
      Frequência: ${dadosDoUsuario.frequencia}
      Nível: ${dadosDoUsuario.nivel}
      
      REGRA OBRIGATÓRIA: Escolha os exercícios APENAS desta exata lista disponível, usando os nomes exatos: ${JSON.stringify(listaDisponivel)}.
      
      Retorne EXATAMENTE este formato JSON:
      [
        {
          "nome": "Treino A",
          "exercicios": [
            { "nome": "nome do exercicio" }
          ]
        }
      ]`;

      const respostaIA = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY
          },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptParaIA }] }] }),
        }
      );

      if (!respostaIA.ok) {
        const erroAPI = await respostaIA.text();
        console.error("ERRO DA API:", respostaIA.status, erroAPI);
        throw new Error(`Falha na API: ${respostaIA.status}`);
      }

      const dadosDaAPI = await respostaIA.json();
      const textoResposta = dadosDaAPI.candidates[0].content.parts[0].text;
      const jsonMatch = textoResposta.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        console.error("RESPOSTA SEM JSON:", textoResposta);
        throw new Error("Falha na extração.");
      }
      
      const jsonGerado = JSON.parse(jsonMatch[0]);
      
      console.log("3. O que a IA gerou e o código leu:", jsonGerado);

      const seriesGeradas = jsonGerado.map((serie) => {
        const exerciciosDaSerie = serie.exercicios.map((ex) => {
          const correspondente = exercicios.find(item => item.name.toLowerCase() === ex.nome.toLowerCase());
          
          if (correspondente) {
            return {
              exerciseId: correspondente.id,
              name: correspondente.name,
              bodyPart: correspondente.bodyPart,
              equipment: correspondente.equipment,
              imageUrl: correspondente.imageUrl
            };
          }
          return {
            exerciseId: Math.random().toString(36).substring(7),
            name: ex.nome,
            bodyPart: "",
            equipment: "",
            imageUrl: null
          };
        });

        return {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          nome: serie.nome,
          exercicios: exerciciosDaSerie
        };
      });

      finalizarCadastroWizard(dadosDoUsuario, seriesGeradas);
      navigate("/dashboard");
    } catch (erro) {
      console.error("ERRO CAPTURADO:", erro);
      alert("Erro ao gerar o treino. Verifique o console.");
      
      finalizarCadastroWizard(dadosDoUsuario, []);
      navigate("/dashboard");
    } finally {
      setIsCarregando(false);
    }
  };

  if (isCarregando) return <div className={styles.loading}><CircularProgress size={80} sx={{ color: "#ffcb3c" }} /></div>;

  return (
    <div className={styles.wizard}>
      {passoAtual < 7 && <BarraProgresso passoAtual={passoAtual} totalPassos={6} />}
      <div key={passoAtual} className={styles["passo-animado"]}>{renderizarPasso()}</div>
      <BotoesVoltarAvancar voltar={voltar} avancar={avancar} passoAtual={passoAtual} gerarFichas={finalizarWizard} podeAvancar={verificarSePodeAvancar()} />
    </div>
  );
};

export default Wizard;