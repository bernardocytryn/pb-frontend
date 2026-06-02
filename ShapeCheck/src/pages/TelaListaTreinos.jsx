import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import { CardExercicioModal } from "../features/treinos/components/CardExercicio";
import { useCriarSerie } from "../contexts/SeriesContext.jsx";
import styles from "./TelaListaTreinos.module.css";

export default function DetalheSerie() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [exercicioAberto, setExercicioAberto] = useState(null);
  const [concluidos, setConcluidos] = useState([]);
  
  const { iniciarEdicao } = useCriarSerie();

  useEffect(() => {
    const seriesSalvas = JSON.parse(localStorage.getItem('minhasSeries') || '[]');
    const serieEncontrada = seriesSalvas.find((s) => s.id === id);
    setSerie(serieEncontrada);
  }, [id]);

  if (!serie) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tituloContainer}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>
              <FiArrowLeft size={18} /> Voltar
            </button>
          </div>
        </div>
        <div className={styles.estadoVazio}>
          <p>Série não encontrada.</p>
        </div>
      </div>
    );
  }

  const handleEditar = () => {
    iniciarEdicao(serie);
    navigate('/criar-serie');
  };

  const handleExcluir = () => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta série?");
    if (confirmacao) {
      const seriesSalvas = JSON.parse(localStorage.getItem('minhasSeries') || '[]');
      const novasSeries = seriesSalvas.filter((s) => s.id !== id);
      localStorage.setItem('minhasSeries', JSON.stringify(novasSeries));
      navigate('/treinos');
    }
  };

  const toggleConcluido = (e, exerciseId) => {
    e.stopPropagation();
    if (concluidos.includes(exerciseId)) {
      setConcluidos(concluidos.filter((id) => id !== exerciseId));
    } else {
      setConcluidos([...concluidos, exerciseId]);
    }
  };

  const finalizarTreino = () => {
    setConcluidos([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tituloContainer}>
          <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>
            <FiArrowLeft size={18} /> Voltar
          </button>
          <h1 className={styles.titulo}>{serie.nome}</h1>
        </div>

        <div className={styles.botoesAcao}>
          <button onClick={handleExcluir} className={styles.botaoExcluir}>
            <FiTrash2 size={18} />
          </button>
          <button onClick={handleEditar} className={styles.botaoCriar}>
            <FiEdit size={18} />
          </button>
        </div>
      </div>

      <div className={styles.gridLista}>
        {serie.exercicios && serie.exercicios.map((ex) => {
          const estaConcluido = concluidos.includes(ex.exerciseId || ex.id);
          
          return (
            <div 
              key={ex.exerciseId || ex.id} 
              className={`${styles.cardGrid} ${estaConcluido ? styles.cardConcluido : ''}`}
              onClick={() => setExercicioAberto(ex)}
            >
              <img 
                src={ex.imageUrl} 
                alt={ex.name} 
                className={styles.imagemGrid}
              />
              <div className={styles.infoGrid}>
                <h2 className={styles.nomeGrid}>{ex.name}</h2>
                <button 
                  className={`${styles.botaoCheck} ${estaConcluido ? styles.botaoCheckAtivo : ''}`}
                  onClick={(e) => toggleConcluido(e, ex.exerciseId || ex.id)}
                >
                  <FiCheck size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {concluidos.length > 0 && (
        <button onClick={finalizarTreino} className={styles.botaoFinalizar}>
          Concluir Treino
        </button>
      )}

      <CardExercicioModal 
        exercicio={exercicioAberto} 
        handleClose={() => setExercicioAberto(null)} 
      />
    </div>
  );
}