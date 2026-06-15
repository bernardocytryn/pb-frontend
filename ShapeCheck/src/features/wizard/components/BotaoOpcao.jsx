import styles from "./BotaoOpcao.module.css";

const BotaoOpcao = ({ opcao, isSelecionado, onClick, style }) => {
  return (
    <button
      className={`${styles["botao-opcao"]} ${isSelecionado ? styles.selecionado : ""}`}
      onClick={onClick}
      style={style}
    >
      {opcao}
    </button>
  );
};

export default BotaoOpcao;
