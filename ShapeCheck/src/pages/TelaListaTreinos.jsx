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
    setSerie(seriesSalvas.find((s) => s.id === id));
  }, [id]);

  if (!serie) return <div className={styles.container}><div className={styles.estadoVazio}>Série não encontrada.</div></div>;

  const handleEditar = () => { 
    iniciarEdicao(serie); 
    navigate('/criar-serie'); 
  };
  
  const handleExcluir = () => {
    if (window.confirm("Excluir série?")) {
      const series = JSON.parse(localStorage.getItem('minhasSeries') || '[]');
      localStorage.setItem('minhasSeries', JSON.stringify(series.filter((s) => s.id !== id)));
      navigate('/treinos');
    }
  };

  const toggleConcluido = (e, eid) => { 
    e.stopPropagation(); 
    setConcluidos(prev => prev.includes(eid) ? prev.filter(i => i !== eid) : [...prev, eid]); 
  };

  const concluirSerie = () => {
    setConcluidos([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tituloContainer}>
          <button onClick={() => navigate('/treinos')} className={styles.botaoVoltar}><FiArrowLeft size={18} /> Voltar</button>
          <h1 className={styles.titulo}>{serie.nome}</h1>
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
                <h2 className={styles.nomeGrid}>{ex.name}</h2>
                <button className={`${styles.botaoCheck} ${done ? styles.botaoCheckAtivo : ''}`} onClick={(e) => toggleConcluido(e, eid)}>
                  <FiCheck size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {concluidos.length > 0 && (
        <div className={styles.containerFinalizar}>
          <button onClick={concluirSerie} className={styles.botaoFinalizar}>Concluir Série</button>
        </div>
      )}
      
      <CardExercicioModal exercicio={exercicioAberto} handleClose={() => setExercicioAberto(null)} />
    </div>
  );
}