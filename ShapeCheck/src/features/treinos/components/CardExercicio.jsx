import { useState, useEffect } from "react";
import styles from "./CardExercicio.module.css";
import { FiX } from "react-icons/fi";
import { useCriarSerie } from "../../../contexts/SeriesContext.jsx";
import { useExercicios } from "../../../contexts/ExerciciosContext.jsx";

export function CardExercicioModal({ exercicio, handleClose, modoCriacao, modoSerie }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [carga, setCarga] = useState("");

  const { adicionarExercicio, exerciciosSelecionados } = useCriarSerie();
  const { fetchDetalhes } = useExercicios();

  useEffect(() => {
    if (exercicio) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const cargasSalvas = JSON.parse(localStorage.getItem("shapecheck_cargas") || "{}");
      const idParaBuscar = exercicio.exerciseId || exercicio.id || exercicio.name;
      if (cargasSalvas[idParaBuscar]) {
        setCarga(cargasSalvas[idParaBuscar]);
      } else {
        setCarga("");
      }
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [exercicio]);

  useEffect(() => {
    if (!exercicio) {
      setDetalhes(null);
      return;
    }

    async function obterDadosRealTime() {
      setCarregando(true);
      const idDeBusca = exercicio.exerciseId || exercicio.id;
      if (idDeBusca) {
        const dados = await fetchDetalhes(idDeBusca);
        if (dados) {
          setDetalhes(dados);
        }
      }
      setCarregando(false);
    }

    obterDadosRealTime();
  }, [exercicio, fetchDetalhes]);

  const handleCargaChange = (e) => {
    const novoValor = e.target.value;
    setCarga(novoValor);

    if (exercicio) {
      const idParaSalvar = exercicio.exerciseId || exercicio.id || exercicio.name;
      const cargasSalvas = JSON.parse(localStorage.getItem("shapecheck_cargas") || "{}");
      cargasSalvas[idParaSalvar] = novoValor;
      localStorage.setItem("shapecheck_cargas", JSON.stringify(cargasSalvas));
    }
  };

  if (!exercicio) return null;

  const ex = detalhes || exercicio;
  const video = detalhes?.videoUrl;
  const imagem = detalhes?.imageUrls?.["480p"] || detalhes?.imageUrls?.["360p"] || detalhes?.imageUrl || detalhes?.gifUrl || exercicio.imageUrl;

  const jaAdicionado = exerciciosSelecionados.find(
    (item) => (item.exerciseId || item.id || item.name) === (exercicio.exerciseId || exercicio.id || exercicio.name)
  );

  const handleAdicionar = () => {
    adicionarExercicio(ex);
    handleClose();
  };

  return (
    <div
      id="fundo-modal"
      className={styles.container}
      onClick={(e) => {
        if (e.target.id === "fundo-modal" && handleClose) handleClose();
      }}
    >
      <div className={styles.modalMobile}>
        <div onClick={handleClose} className={styles.tracoArrastar}></div>

        <div className={styles.cabecalho}>
          <h2 className={styles.tituloModal}>{ex.name}</h2>
          <button onClick={handleClose} className={styles.botaoFecharX}>
            <FiX size={18} />
          </button>
        </div>

        <div className={styles.conteudoRolavel}>
          {carregando ? (
            <p className={styles.textoCarregando}>Carregando execução...</p>
          ) : (
            <>
              {video && video !== "string" ? (
                <video src={video} className={styles.gif} autoPlay loop muted playsInline />
              ) : imagem ? (
                <img src={imagem} alt={ex.name} className={styles.gif} />
              ) : (
                <div className={`${styles.gif} ${styles.gifPlaceholder}`}>
                  <span className={styles.textoPlaceholder}>Imagem indisponível</span>
                </div>
              )}

              {modoSerie && (
                <div className={styles.cargaContainer}>
                  <label htmlFor="inputCarga">Carga (kg):</label>
                  <input
                    id="inputCarga"
                    type="number"
                    value={carga}
                    onChange={handleCargaChange}
                    placeholder="Ex: 20"
                    className={styles.inputCarga}
                  />
                </div>
              )}

              <div className={styles.tagsContainer}>
                {ex.targetMuscles?.[0] && <span className={styles.tagAmarela}>{ex.targetMuscles[0]}</span>}
                {ex.equipments?.[0] && <span className={styles.tagCinza}>{ex.equipments[0]}</span>}
                {ex.bodyParts?.[0] && <span className={styles.tagCinza}>{ex.bodyParts[0]}</span>}
              </div>

              <div className={styles.instrucoes}>
                {ex.overview && <p className={styles.overview}>{ex.overview}</p>}
                {ex.instructions && ex.instructions.length > 0 && (
                  <>
                    <h3 className={styles.subtituloModal}>Como executar</h3>
                    <ol className={styles.lista}>
                      {ex.instructions.map((passo, index) => (
                        <li key={index} className={styles.passo}>{passo}</li>
                      ))}
                    </ol>
                  </>
                )}
              </div>

              {modoCriacao && (
                <button
                  onClick={handleAdicionar}
                  disabled={jaAdicionado}
                  className={`${styles.botaoAdicionarBase} ${jaAdicionado ? styles.botaoAdicionarInativo : styles.botaoAdicionarAtivo}`}
                >
                  {jaAdicionado ? "Exercício já adicionado" : "Adicionar à Série"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}