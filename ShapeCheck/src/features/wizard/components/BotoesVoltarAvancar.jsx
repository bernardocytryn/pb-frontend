import styles from "./BotoesVoltarAvancar.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const BotoesVoltarAvancar = ({
  voltar,
  avancar,
  passoAtual,
  temFoto,
  gerarFichas,
  podeAvancar,
}) => {
  return (
    <div
      className={styles["botoes-voltar-avancar"]}
      style={{ justifyContent: passoAtual === 1 ? "center" : "space-between" }}
    >
      {passoAtual > 1 && (
        <button onClick={voltar} className={styles.voltar}>
          <FaArrowLeft size={14} /> Voltar
        </button>
      )}
      <button
        onClick={passoAtual < 6 ? avancar : gerarFichas}
        disabled={!podeAvancar}
        className={styles.avancar}
        style={{
          backgroundColor: podeAvancar ? "#ffcb3c" : "#2a2a2a",
          color: podeAvancar ? "#121212" : "#6b6b6b",
          cursor: podeAvancar ? "pointer" : "not-allowed",
        }}
      >
        {passoAtual < 6 ? "Avançar" : "Finalizar"}
        <FaArrowRight size={14} />
      </button>
    </div>
  );
};

export default BotoesVoltarAvancar;