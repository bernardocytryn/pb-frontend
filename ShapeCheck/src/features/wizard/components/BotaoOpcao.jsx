import styles from "./BotaoOpcao.module.css";

const BotaoOpcao = ({ opcao, isSelecionado, onClick }) => {
  return (
    <button
      className={`${styles["botao-opcao"]} ${isSelecionado ? styles.selecionado : ""}`}
      onClick={onClick}
    >
      {opcao}
    </button>
  );
};

export default BotaoOpcao;
