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
          backgroundColor: "#ffcb3c",
          background: "linear-gradient(90deg, #e5b322, #ffcb3c)",
          transition: "width 0.4s ease-in-out",
          borderRadius: "50px",
        }}
      ></div>
      <span>
        Passo {passoAtual} de {totalPassos}
      </span>
    </div>
  );
};

export default BarraProgresso;