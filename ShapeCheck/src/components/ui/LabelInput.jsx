import styles from "./LabelInput.module.css";

const LabelInput = ({ label, placeholder, erro }) => {
  return (
    <div className={styles["label-e-input"]}>
      <label>{label}</label>
      <input
        style={{
          border: erro ? "2px solid #ff4d4d" : "2px solid transparent",
        }}
        type="text"
        placeholder={placeholder}
      />
      <span
        style={{ visibility: erro ? "visible" : "hidden", minHeight: "15px" }}
      >
        Campo obrigatório
      </span>
    </div>
  );
};

export default LabelInput;
