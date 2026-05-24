import { useState } from "react";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useExercicios } from "../contexts/ExerciciosContext";
import { CardExercicioModal } from "../features/treinos/components/CardExercicio";
import styles from "./TelaExercicio.module.css";

export default function TelaExercicio({ onCardClick }) {
  const { exercicios, loading, error } = useExercicios();
  const [busca, setBusca] = useState("");
  const [classeBusca, setClasseBusca] = useState("TODOS");
  const [menuAberto, setMenuAberto] = useState(false);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
  const navigate = useNavigate();

  const opcoes = {
    TODOS: "Todas as categorias",
    NOME: "Apenas no Nome",
    PARTE: "Parte do Corpo",
    ALVO: "Músculo Alvo",
    EQUIPAMENTO: "Equipamento"
  };

  const listaSegura = Array.isArray(exercicios) ? exercicios : [];

  const exerciciosFiltrados = listaSegura.filter((ex) => {
    if (busca.trim() === "") return true;
    const termo = busca.toLowerCase();

    const nome = ex.name?.toLowerCase() || "";
    const parte = ex.bodyParts?.join(" ").toLowerCase() || "";
    const alvo = ex.targetMuscles?.join(" ").toLowerCase() || "";
    const equipamento = ex.equipments?.join(" ").toLowerCase() || "";

    switch (classeBusca) {
      case "NOME":
        return nome.includes(termo);
      case "PARTE":
        return parte.includes(termo);
      case "ALVO":
        return alvo.includes(termo);
      case "EQUIPAMENTO":
        return equipamento.includes(termo);
      case "TODOS":
      default:
        return (
          nome.includes(termo) ||
          parte.includes(termo) ||
          alvo.includes(termo) ||
          equipamento.includes(termo)
        );
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>
            <FiArrowLeft size={18} /> Voltar
          </button>
        </div>
        
        <div className={styles.rotulo}>Consultar</div>

        <div className={styles.areaBusca}>
          <div className={styles.dropdownContainer}>
            <button 
              type="button" 
              className={styles.selectClasse}
              onClick={() => setMenuAberto(!menuAberto)}
            >
              {opcoes[classeBusca]}
              <FiChevronDown 
                size={18} 
                className={`${styles.iconeDropdown} ${menuAberto ? styles.iconeDropdownAberto : ""}`} 
              />
            </button>
            
            {menuAberto && (
              <ul className={styles.dropdownMenu}>
                {Object.entries(opcoes).map(([chave, rotulo]) => (
                  <li 
                    key={chave}
                    className={`${styles.dropdownItem} ${classeBusca === chave ? styles.dropdownItemSelecionado : ""}`}
                    onClick={() => {
                      setClasseBusca(chave);
                      setMenuAberto(false);
                    }}
                  >
                    {rotulo}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="text"
            placeholder="Digite o que deseja encontrar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.inputBusca}
          />
        </div>

        <div className={styles.gridLista}>
          {loading ? (
            <div className={styles.estadoVazio}>
              <p>Carregando biblioteca de exercícios...</p>
            </div>
          ) : error ? (
            <div className={styles.estadoVazio}>
              <p>Erro ao carregar: {error}</p>
            </div>
          ) : exerciciosFiltrados.length > 0 ? (
            exerciciosFiltrados.map((ex) => (
              <div 
                className={styles.cardGrid}
                key={ex.exerciseId}
                onClick={() => {
                  setExercicioSelecionado(ex);
                  if (onCardClick) onCardClick(ex);
                }}
              >
                <img 
                  src={ex.imageUrl}
                  alt={ex.name} 
                  className={styles.imagemGrid}
                />
                <div className={styles.infoGrid}>
                  <h2 className={styles.nomeGrid}>{ex.name}</h2>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.estadoVazio}>
              <p>Nenhum exercício encontrado.</p>
            </div>
          )}
        </div>
      </div>

      <CardExercicioModal 
        exercicio={exercicioSelecionado} 
        handleClose={() => setExercicioSelecionado(null)} 
      />
    </div>
  );
}