import { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useExercicios } from "../contexts/ExerciciosContext";
import { CardExercicioModal } from "../features/treinos/components/CardExercicio";
import styles from "./TelaExercicio.module.css";
import { traduzirEmLote } from "../utils/tradutor";

export default function TelaExercicio({ onCardClick }) {
  const { exercicios, loading, error } = useExercicios();
  const [busca, setBusca] = useState("");
  const [classeBusca, setClasseBusca] = useState("TODOS");
  const [menuAberto, setMenuAberto] = useState(false);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);

  const [quantidadeVisivel, setQuantidadeVisivel] = useState(20);
  const observadorRef = useRef(null);

  const [nomesTraduzidos, setNomesTraduzidos] = useState(() => {
    const cache = localStorage.getItem("shapecheck_nomes_pt");
    return cache ? JSON.parse(cache) : {};
  });

  const navigate = useNavigate();
  const location = useLocation();
  const modoCriacao = location.state?.modoCriacao || false;

  const opcoes = {
    TODOS: "Todas as categorias",
    NOME: "Apenas no Nome",
    PARTE: "Parte do Corpo",
    ALVO: "Músculo Alvo",
    EQUIPAMENTO: "Equipamento"
  };

  const listaSegura = Array.isArray(exercicios) ? exercicios : [];

  useEffect(() => {
    setQuantidadeVisivel(20);
  }, [busca, classeBusca]);

  const exerciciosFiltrados = listaSegura.filter((ex) => {
    if (busca.trim() === "") return true;
    const termo = busca.toLowerCase();

    const nomeBase = nomesTraduzidos[ex.id || ex.exerciseId] || ex.name;
    const nome = nomeBase.toLowerCase();

    const parte = ex.bodyParts?.join(" ").toLowerCase() || "";
    const alvo = ex.targetMuscles?.join(" ").toLowerCase() || "";
    const equipamento = ex.equipments?.join(" ").toLowerCase() || "";

    switch (classeBusca) {
      case "NOME": return nome.includes(termo);
      case "PARTE": return parte.includes(termo);
      case "ALVO": return alvo.includes(termo);
      case "EQUIPAMENTO": return equipamento.includes(termo);
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

  useEffect(() => {
    let isMounted = true;

    const executarTraducao = async () => {
      const cacheAtual = JSON.parse(localStorage.getItem("shapecheck_nomes_pt") || "{}");
      const visiveis = exerciciosFiltrados.slice(0, quantidadeVisivel);
      const paraTraduzir = visiveis.filter(ex => !cacheAtual[ex.id || ex.exerciseId]);

      if (paraTraduzir.length === 0) return;

      const novoCache = await traduzirEmLote(paraTraduzir);

      if (isMounted) {
        setNomesTraduzidos(prev => {
          const estadoAtualizado = { ...prev, ...novoCache };
          localStorage.setItem("shapecheck_nomes_pt", JSON.stringify(estadoAtualizado));
          return estadoAtualizado;
        });
      }
    };

    const timeoutId = setTimeout(executarTraducao, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [quantidadeVisivel, exerciciosFiltrados]);

  const exerciciosParaRenderizar = exerciciosFiltrados.slice(0, quantidadeVisivel);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate('/treino')} className={styles.botaoVoltar}>
            <FiArrowLeft size={18} /> Voltar
          </button>

          {modoCriacao && (
            <button
              onClick={() => navigate('/criar-serie')}
              style={{
                backgroundColor: '#ffcb3c',
                color: '#000',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Voltar para a Série
            </button>
          )}
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
          ) : exerciciosParaRenderizar.length > 0 ? (
            <>
              {exerciciosParaRenderizar.map((ex, index) => {
                const idEx = ex.id || ex.exerciseId || index;

                const nomeExibicao = nomesTraduzidos[idEx] || ex.name;

                return (
                  <div
                    className={styles.cardGrid}
                    key={idEx}
                    onClick={() => {
                      setExercicioSelecionado(ex);
                      if (onCardClick) onCardClick(ex);
                    }}
                  >
                    <img
                      src={ex.imageUrl}
                      alt={nomeExibicao}
                      className={styles.imagemGrid}
                    />
                    <div className={styles.infoGrid}>
                      <h2 className={styles.nomeGrid}>{nomeExibicao}</h2>
                    </div>
                  </div>
                );
              })}

              {/* Âncora invisível que dispara o carregamento dos próximos 20 */}
              {quantidadeVisivel < exerciciosFiltrados.length && (
                <div
                  ref={observadorRef}
                  style={{ height: '20px', width: '100%', gridColumn: '1 / -1' }}
                >
                </div>
              )}
            </>
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
        modoCriacao={modoCriacao}
      />
    </div>
  );
}