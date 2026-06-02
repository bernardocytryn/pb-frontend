import { useState, useEffect } from "react";
import styles from "./CardExercicio.module.css";
import { FiX } from "react-icons/fi";
import { useCriarSerie } from "../..//../contexts/SeriesContext.jsx";

export function CardExercicioModal({ exercicio, handleClose, modoCriacao }) {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(false);
  
  const { adicionarExercicio, exerciciosSelecionados } = useCriarSerie();

  useEffect(() => {
    if (!exercicio) {
      setDetalhes(null);
      return;
    }

    async function buscarDetalhes() {
      setCarregando(true);
      try {
        const url = `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/${exercicio.exerciseId}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
          }
        };

        const res = await fetch(url, options);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setDetalhes(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    buscarDetalhes();
  }, [exercicio]);

  if (!exercicio) return null;

  const ex = detalhes || exercicio;
  const video = detalhes?.videoUrl;
  const imagem = detalhes?.imageUrls?.["480p"] || detalhes?.imageUrls?.["360p"] || exercicio.imageUrl;

  const jaAdicionado = exerciciosSelecionados.find((item) => item.exerciseId === exercicio.exerciseId);

  const handleAdicionar = () => {
    adicionarExercicio(exercicio);
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
            <p style={{ textAlign: "center", padding: "40px 20px", color: "#a0a0a0" }}>
              Carregando execução...
            </p>
          ) : (
            <>
              {video && video !== "string" ? (
                <video
                  src={video}
                  className={styles.gif}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={imagem}
                  alt={ex.name}
                  className={styles.gif}
                />
              )}

              <div className={styles.tagsContainer}>
                {ex.targetMuscles?.[0] && (
                  <span className={styles.tagAmarela}>
                    {ex.targetMuscles[0]}
                  </span>
                )}
                {ex.equipments?.[0] && (
                  <span className={styles.tagCinza}>
                    {ex.equipments[0]}
                  </span>
                )}
                {ex.bodyParts?.[0] && (
                  <span className={styles.tagCinza}>
                    {ex.bodyParts[0]}
                  </span>
                )}
              </div>

              <div className={styles.instrucoes}>
                {ex.overview && (
                  <p style={{ color: "#a0a0a0", fontSize: "0.9rem", lineHeight: "1.4", marginBottom: "16px" }}>
                    {ex.overview}
                  </p>
                )}

                {ex.instructions && ex.instructions.length > 0 && (
                  <>
                    <h3 className={styles.subtituloModal}>Como executar</h3>
                    <ol className={styles.lista}>
                      {ex.instructions.map((passo, index) => (
                        <li key={index} className={styles.passo}>
                          {passo}
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
              
              {modoCriacao && (
                <button
                  onClick={handleAdicionar}
                  disabled={jaAdicionado}
                  style={{
                    width: "100%",
                    padding: "16px",
                    marginTop: "16px",
                    backgroundColor: jaAdicionado ? "#3a3a3c" : "#ffcb3c",
                    color: jaAdicionado ? "#a0a0a0" : "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: jaAdicionado ? "not-allowed" : "pointer",
                    fontSize: "1rem"
                  }}
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