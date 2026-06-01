import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useCriarSerie } from '../contexts/SeriesContext.jsx';
import styles from './CriarSerie.module.css';

export default function CriarSerie() {
  const { 
    nomeSerie, 
    setNomeSerie, 
    exerciciosSelecionados, 
    removerExercicio,
    limparRascunho,
    idSerieEdicao
  } = useCriarSerie();
  
  const navigate = useNavigate();

  const irParaBusca = () => {
    navigate('/consultar', { state: { modoCriacao: true } });
  };

  const salvarSerie = () => {
    const serieFinal = {
      id: idSerieEdicao || Date.now().toString(),
      nome: nomeSerie,
      exercicios: exerciciosSelecionados
    };

    const seriesAntigas = JSON.parse(localStorage.getItem('minhasSeries') || '[]');
    
    let seriesAtualizadas;
    
    if (idSerieEdicao) {
      seriesAtualizadas = seriesAntigas.map(s => s.id === idSerieEdicao ? serieFinal : s);
    } else {
      seriesAtualizadas = [...seriesAntigas, serieFinal];
    }
    
    localStorage.setItem('minhasSeries', JSON.stringify(seriesAtualizadas));

    limparRascunho();
    
    if (idSerieEdicao) {
      navigate(`/series/${idSerieEdicao}`);
    } else {
      navigate('/treinos');
    }
  };

  const handleVoltar = () => {
    limparRascunho();
    if (idSerieEdicao) {
      navigate(`/series/${idSerieEdicao}`);
    } else {
      navigate('/treinos');
    }
  };

  return (
    <div className={styles.containerCriacao}>
      <header className={styles.cabecalhoSerie}>
        <button onClick={handleVoltar} className={styles.botaoVoltar}>
          <FiArrowLeft size={18} /> Voltar
        </button>
        
        <input 
          type="text" 
          className={styles.inputNomeSerie}
          placeholder="Nome da Série" 
          value={nomeSerie}
          onChange={(e) => setNomeSerie(e.target.value)}
        />
        <span className={styles.contadorExercicios}>
          Total de exercícios: {exerciciosSelecionados.length}
        </span>
      </header>

      <main className={styles.conteudoPrincipal}>
        <button className={styles.botaoAdicionar} onClick={irParaBusca}>
          + Adicionar Exercício
        </button>

        <ul className={styles.listaExercicios}>
          {exerciciosSelecionados.map((exercicio) => (
            <li key={exercicio.exerciseId || exercicio.id} className={styles.itemExercicio}>
              <span className={styles.nomeExercicio}>{exercicio.name}</span>
              <button 
                className={styles.botaoRemover}
                onClick={() => removerExercicio(exercicio.exerciseId || exercicio.id)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </main>

      <footer className={styles.rodapeAcoes}>
        <button className={styles.botaoCancelar} onClick={handleVoltar}>
          Cancelar
        </button>
        <button 
          className={styles.botaoSalvar}
          onClick={salvarSerie}
          disabled={!nomeSerie || exerciciosSelecionados.length === 0}
        >
          {idSerieEdicao ? "Salvar Alterações" : "Salvar Lista"}
        </button>
      </footer>
    </div>
  );
}