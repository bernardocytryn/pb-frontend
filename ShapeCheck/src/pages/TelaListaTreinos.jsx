import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import { CardExercicioModal } from "../features/treinos/components/CardExercicio";
import { useCriarSerie } from "../contexts/SeriesContext.jsx";
import { useStatusTreino } from "../contexts/StatusTreinoContext.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useExercicios } from "../contexts/ExerciciosContext.jsx";
import styles from "./TelaListaTreinos.module.css";

export default function DetalheSerie() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [exercicioAberto, setExercicioAberto] = useState(null);
  const [concluidos, setConcluidos] = useState([]);
  const [traduzindo, setTraduzindo] = useState(false);

  const { iniciarEdicao } = useCriarSerie();
  const { statusSeries, alternarStatus } = useStatusTreino();
  const { usuario, finalizarCadastroWizard } = useAuth();
  const { fetchDetalhes } = useExercicios();

  const temTraduzido = useRef(false);

  useEffect(() => {
    const series = usuario?.treinos || [];
    setSerie(series.find((s) => s.id === id));
  }, [id, usuario]);

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

  const isSerieConcluida = statusSeries[serie.id];

  const handleEditar = () => {
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

  const toggleConcluido = (e, eid) => {
    e.stopPropagation();
    setConcluidos(prev => prev.includes(eid) ? prev.filter(i => i !== eid) : [...prev, eid]);
  };

  const concluirSerie = () => {
    alternarStatus(serie.id);
    if (!isSerieConcluida) {
      setConcluidos([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Adicionei um indicador de carregamento caso esteja traduzindo */}
      {traduzindo && <div className={styles.estadoVazio} style={{ fontSize: '0.8rem', color: '#ffcb3c' }}>Atualizando para Português...</div>}

      <div className={styles.header}>
        <div className={styles.tituloContainer}>
          <button onClick={() => navigate('/treinos')} className={styles.botaoVoltar}>
            <FiArrowLeft size={18} /> Voltar
          </button>
          <h1 className={styles.titulo}>{serie.nome}</h1>
          {isSerieConcluida && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#4caf50', fontWeight: 'bold', marginLeft: '8px' }}>
              <FiCheck size={14} /> Concluída
            </span>
          )}
        </div>
        <div className={styles.botoesAcao}>
          <button onClick={handleExcluir} className={styles.botaoExcluir}><FiTrash2 size={18} /></button>
          <button onClick={handleEditar} className={styles.botaoCriar}><FiEdit size={18} /></button>
        </div>
      </div>

      <div className={styles.gridLista}>
        {serie.exercicios && serie.exercicios.map((ex) => {
          const eid = ex.exerciseId || ex.id;
          const done = concluidos.includes(eid);
          return (
            <div key={eid} className={`${styles.cardGrid} ${done ? styles.cardConcluido : ''}`} onClick={() => setExercicioAberto(ex)}>
              <img src={ex.imageUrl} alt={ex.name} className={styles.imagemGrid} />
              <div className={styles.infoGrid}>
                <h2 className={styles.nomeGrid}>{ex.name || "Exercício sem nome"}</h2>
                <button className={`${styles.botaoCheck} ${done ? styles.botaoCheckAtivo : ''}`} onClick={(e) => toggleConcluido(e, eid)}>
                  <FiCheck size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CardExercicioModal exercicio={exercicioAberto} handleClose={() => setExercicioAberto(null)} />
    </div>
  );
}