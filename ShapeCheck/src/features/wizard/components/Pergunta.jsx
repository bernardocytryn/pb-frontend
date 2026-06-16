const Pergunta = ({ pergunta }) => {
  return (
    <h1
      style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        textAlign: "center",
        color: "#ffffff",
        marginBottom: "24px",
        lineHeight: "1.3"
      }}
    >
      {pergunta}
    </h1>
  );
};

export default Pergunta;