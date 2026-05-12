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
          <FaArrowLeft /> Voltar
        </button>
      )}
      <button
        onClick={passoAtual < 7 ? avancar : gerarFichas}
        disabled={!podeAvancar}
        className={styles.avancar}
        style={{
          backgroundColor: podeAvancar ? "" : "#323537",
          color: podeAvancar ? "" : "#939496",
          cursor: podeAvancar ? "pointer" : "not-allowed",
        }}
      >
        {passoAtual < 6
          ? "Avançar"
          : passoAtual === 7
            ? "Finalizar"
            : temFoto
              ? "Avançar"
              : "Pular"}
        <FaArrowRight />
      </button>
    </div>
  );
};

export default BotoesVoltarAvancar;
