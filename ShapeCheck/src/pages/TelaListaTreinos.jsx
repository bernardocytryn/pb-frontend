import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { CardExercicioModal } from "../features/treinos/components/CardExercicio";
import { useCriarSerie } from "../contexts/SeriesContext.jsx";
import { useStatusTreino } from "../contexts/StatusTreinoContext.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useExercicios } from "../contexts/ExerciciosContext.jsx";
import styles from "./TelaListaTreinos.module.css";

function CardExercicioSwipe({ ex, serieId, done, onToggle, onRemove, onClick }) {
  const x = useMotionValue(0);
  const backgroundColor = useTransform(x, [-100, 0, 100], ["#22c55e", "transparent", "#ff4d4d"]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      style={{ x, backgroundColor, touchAction: "none" }}
      onDragEnd={(event, info) => {
        if (info.offset.x < -100) onToggle();
        else if (info.offset.x > 100) onRemove();
      }}
      onClick={onClick}
      className={`${styles.cardGrid} ${done ? styles.cardConcluido : ''}`}
    >
      <img src={ex.imageUrl} alt={ex.name} className={styles.imagemGrid} />
      <div className={styles.infoGrid}>
        <h2 className={styles.nomeGrid}>{ex.name || "Exercício sem nome"}</h2>
        <button
          className={`${styles.botaoCheck} ${done ? styles.botaoCheckAtivo : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <FiCheck size={16} />
        </button>
      </div>
    </motion.div>
  );
}

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

  useEffect(() => {
    if (!serie || !serie.exercicios) return;
    const todosConcluidos = serie.exercicios.every(ex => {
      const eid = ex.exerciseId || ex.id;
      return !!statusSeries[`${serie.id}_${eid}`];
    });
    setEstadoConcluido(serie.id, todosConcluidos);
  }, [statusSeries, serie, setEstadoConcluido]);

  useEffect(() => { temTraduzido.current = false; }, [id]);

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

  if (!serie) return <div className={styles.container}><div className={styles.main}><div className={styles.estadoVazio}>Série não encontrada.</div></div></div>;

  const isSerieConcluida = !!treinosConcluidos[serie.id];

  const handleExcluirExercicio = (eid) => {
    if (window.confirm("Remover este exercício?")) {
      const exerciciosFiltrados = serie.exercicios.filter(item => (item.exerciseId || item.id) !== eid);
      const serieAtualizada = { ...serie, exercicios: exerciciosFiltrados };
      const seriesAtualizadas = usuario.treinos.map(s => s.id === id ? serieAtualizada : s);
      finalizarCadastroWizard(usuario.perfil, seriesAtualizadas);
    }
  };

  const handleEditar = () => {
    if (isSerieConcluida) { alert("Desfaça a conclusão do treino antes de editar."); return; }
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
      <div className={styles.main}>
        {traduzindo && <div className={styles.estadoVazio} style={{ fontSize: '0.9rem', color: '#ffcb3c', marginBottom: '16px', marginTop: '0' }}>Atualizando para Português...</div>}

        <div className={styles.header}>
          <div className={styles.tituloContainer}>
            <button onClick={() => navigate('/treinos')} className={styles.botaoVoltar}><FiArrowLeft size={18} /> Voltar</button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 className={styles.titulo}>{serie.nome}</h1>
              {isSerieConcluida && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#22c55e', fontWeight: '600', marginTop: '4px' }}>
                  <FiCheck size={14} /> Treino Concluído!
                </span>
              )}
            </div>
          </div>
          <div className={styles.botoesAcao}>
            <button onClick={handleExcluir} className={styles.botaoExcluir}><FiTrash2 size={18} /></button>
            <button onClick={handleEditar} className={`${styles.botaoCriar} ${isSerieConcluida ? styles.botaoDesabilitado : ''}`}><FiEdit size={18} /></button>
          </div>
        </div>

        <div className={styles.gridLista}>
          {serie.exercicios && serie.exercicios.map((ex) => {
            const eid = ex.exerciseId || ex.id;
            return (
              <CardExercicioSwipe
                key={eid}
                ex={ex}
                serieId={serie.id}
                done={!!statusSeries[`${serie.id}_${eid}`]}
                onToggle={() => alternarStatus(serie.id, eid)}
                onRemove={() => handleExcluirExercicio(eid)}
                onClick={() => setExercicioAberto(ex)}
              />
            );
          })}
        </div>

        <CardExercicioModal exercicio={exercicioAberto} handleClose={() => setExercicioAberto(null)} treinoId={serie.id} />
      </div>
    </div>
  );
}