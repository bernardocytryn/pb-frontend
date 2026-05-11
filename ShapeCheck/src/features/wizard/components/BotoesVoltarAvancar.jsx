import styles from "./BotoesVoltarAvancar.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const BotoesVoltarAvancar = ({ voltar, avancar, passoAtual, temFoto, gerarFichas }) => {
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
      <button onClick={passoAtual < 7 ? avancar : gerarFichas} className={styles.avancar}>
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
