import styles from "./BarraProgresso.module.css";

const BarraProgresso = ({ passoAtual, totalPassos }) => {
  const porcentagemProgresso = (passoAtual / totalPassos) * 100;
  return (
    <div className={styles["barra-progresso"]}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${porcentagemProgresso}%`,
          backgroundColor: "#3b82f6",
          background: "linear-gradient(90deg, #2563eb, #3b82f6)",
          transition: "width 0.4s ease-in-out",
        }}
      ></div>
      <span>
        Passo {passoAtual} de {totalPassos}
      </span>
    </div>
  );
};

export default BarraProgresso;
