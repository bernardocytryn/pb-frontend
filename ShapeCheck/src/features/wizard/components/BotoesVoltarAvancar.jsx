import styles from "./BotoesVoltarAvancar.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const BotoesVoltarAvancar = ({ voltar, avancar, passoAtual }) => {
  
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
      <button onClick={avancar} className={styles.avancar}>
        {passoAtual < 6 ? "Avançar" : passoAtual === 7 ? "Finalizar" : "Pular"}
        <FaArrowRight />
      </button>
    </div>
  );
};

export default BotoesVoltarAvancar;
