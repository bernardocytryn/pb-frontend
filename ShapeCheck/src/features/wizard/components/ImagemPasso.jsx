const ImagemPasso = ({ imagemURL }) => {
  return (
    <img
      style={{
        width: "100%",
        maxWidth: "100%",
        maxHeight: "240px",
        aspectRatio: "410 / 233",
        objectFit: "cover",
        borderRadius: "16px",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.4)",
        marginBottom: "16px"
      }}
      src={imagemURL}
      alt="imagem-pergunta"
    />
  );
};

export default ImagemPasso;