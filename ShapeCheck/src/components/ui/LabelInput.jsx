import styles from "./LabelInput.module.css";

const LabelInput = ({
  label,
  placeholder,
  taVazio,
  valorInput,
  onChange,
  type,
}) => {
  return (
    <div className={styles["label-e-input"]}>
      <label>{label}</label>
      <input
        style={{
          borderColor: taVazio ? "#ff4d4d" : "",
        }}
        type={type || "text"}
        placeholder={placeholder}
        value={valorInput}
        onChange={onChange}
        className={taVazio ? styles.inputErro : ""}
      />

      {taVazio && (
        <span>
          {typeof taVazio === "string" ? taVazio : "Campo obrigatório"}
        </span>
      )}
    </div>
  );
};

export default LabelInput;