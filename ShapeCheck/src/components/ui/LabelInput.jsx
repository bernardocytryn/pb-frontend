import styles from "./LabelInput.module.css";

const LabelInput = ({ label, placeholder }) => {
  return (
    <div className={styles["label-e-input"]}>
      <label>{label}</label>
      <input type="text" placeholder={placeholder} />
    </div>
  );
};

export default LabelInput;
