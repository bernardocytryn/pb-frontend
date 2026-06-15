import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import { CardExercicioModal } from "../features/treinos/components/CardExercicio";
import { useCriarSerie } from "../contexts/SeriesContext.jsx";
import { useStatusTreino } from "../contexts/StatusTreinoContext.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useExercicios } from "../contexts/ExerciciosContext.jsx";
import styles from "./TelaListaTreinos.module.css";

export default function TelaListaTreinos() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [exercicioAberto, setExercicioAberto] = useState(null);
  const [traduzindo, setTraduzindo] = useState(false);

  const { iniciarEdicao } = useCriarSerie();
  const { statusSeries, treinosConcluidos, alternarStatus, setEstadoConcluido, toggleTreinoConcluido } = useStatusTreino();
  const { usuario, finalizarCadastroWizard } = useAuth();
  const { fetchDetalhes } = useExercicios();

  const temTraduzido = useRef(false);

  useEffect(() => {
    const series = usuario?.treinos || [];
    setSerie(series.find((s) => s.id === id));
  }, [id, usuario]);

  // LOGICA AUTOMATICA (Namespace): Verifica usando a chave composta `${serie.id}_${eid}`
  useEffect(() => {
    if (!serie || !serie.exercicios) return;
    const todosConcluidos = serie.exercicios.every(ex => {
      const eid = ex.exerciseId || ex.id;
      return !!statusSeries[`${serie.id}_${eid}`];
    });
    setEstadoConcluido(serie.id, todosConcluidos);
  }, [statusSeries, serie, setEstadoConcluido]);

  useEffect(() => {
    temTraduzido.current = false;
  }, [id]);

  useEffect(() => {
    const traduzirSerie = async () => {
      if (!serie || !serie.exercicios || temTraduzido.current || traduzindo) return;
      const precisaTraduzir = serie.exercicios.some(ex => ex.name && /[A-Z][a-z]{4,}/.test(ex.name));
      if (precisaTraduzir) {
        temTraduzido.current = true;
        setTraduzindo(true);
        const novosExercicios = await Promise.all(
          serie.exercicios.map(async (ex) => {
            const detalhes = await fetchDetalhes(ex.id || ex.exerciseId);
            return detalhes ? { ...ex, ...detalhes } : ex;
          })
        );
        const serieAtualizada = { ...serie, exercicios: novosExercicios };
        const seriesAtualizadas = usuario.treinos.map(s => s.id === id ? serieAtualizada : s);
        finalizarCadastroWizard(usuario.perfil, seriesAtualizadas);
        setTraduzindo(false);
      }
    };
    traduzirSerie();
  }, [serie]);

  if (!serie) return <div className={styles.container}><div className={styles.estadoVazio}>Série não encontrada.</div></div>;

  const isSerieConcluida = !!treinosConcluidos[serie.id];
  const idsExercicios = serie.exercicios?.map(ex => ex.exerciseId || ex.id) || [];

  const handleEditar = () => {
    if (isSerieConcluida) {
      alert("Desfaça a conclusão do treino antes de editar.");
      return;
    }
    iniciarEdicao(serie);
    navigate('/criar-serie');
  };

  const handleExcluir = () => {
    if (window.confirm("Excluir série?")) {
      const series = usuario?.treinos || [];
      const seriesAtualizadas = series.filter((s) => s.id !== id);
      finalizarCadastroWizard(usuario?.perfil, seriesAtualizadas);
      navigate('/treinos');
    }
  };

  return (
    <div className={styles.container}>
      {traduzindo && <div className={styles.estadoVazio} style={{ fontSize: '0.8rem', color: '#ffcb3c' }}>Atualizando para Português...</div>}

      <div className={styles.header}>
        <div className={styles.tituloContainer}>
          <button onClick={() => navigate('/treinos')} className={styles.botaoVoltar}>
            <FiArrowLeft size={18} /> Voltar
          </button>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className={styles.titulo}>{serie.nome}</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isSerieConcluida && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#4caf50', fontWeight: 'bold' }}>
                  <FiCheck size={14} /> Treino Concluído!
                </span>
              )}
              {isSerieConcluida && (
                <button onClick={() => toggleTreinoConcluido(serie.id, idsExercicios)} className={styles.botaoDesfazer}>
                  Desfazer
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.botoesAcao}>
          <button onClick={handleExcluir} className={styles.botaoExcluir}><FiTrash2 size={18} /></button>
          <button
            onClick={handleEditar}
            className={`${styles.botaoCriar} ${isSerieConcluida ? styles.botaoDesabilitado : ''}`}
          >
            <FiEdit size={18} />
          </button>
        </div>
      </div>

      <div className={styles.gridLista}>
        {serie.exercicios && serie.exercicios.map((ex) => {
          const eid = ex.exerciseId || ex.id;
          // Namespace: Chave única por treino + exercício
          const done = !!statusSeries[`${serie.id}_${eid}`];

          return (
            <div
              key={eid}
              className={`${styles.cardGrid} ${done ? styles.cardConcluido : ''}`}
              onClick={() => setExercicioAberto(ex)}
            >
              <img src={ex.imageUrl} alt={ex.name} className={styles.imagemGrid} />
              <div className={styles.infoGrid}>
                <h2 className={styles.nomeGrid}>{ex.name || "Exercício sem nome"}</h2>
                <button
                  className={`${styles.botaoCheck} ${done ? styles.botaoCheckAtivo : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Namespace: Passando o ID do treino para criar a chave única no contexto
                    alternarStatus(serie.id, eid);
                  }}
                >
                  <FiCheck size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CardExercicioModal
        exercicio={exercicioAberto}
        handleClose={() => setExercicioAberto(null)}
        treinoId={serie.id}
      />
    </div>
  );
}