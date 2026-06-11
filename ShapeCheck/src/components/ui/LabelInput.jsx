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
          border: taVazio ? "2px solid #ff4d4d" : "2px solid transparent",
        }}
        type={type || "text"}
        placeholder={placeholder}
        value={valorInput}
        onChange={onChange}
      />
      <span
        style={{
          visibility: taVazio ? "visible" : "hidden",
          minHeight: "15px",
        }}
      >
        {typeof taVazio === "string" ? taVazio : "Campo obrigatório"}
      </span>
    </div>
  );
};

export default LabelInput;
