const ImagemPasso = ({ imagemURL }) => {
  return (
    <img
      style={{
        width: "100%",
        maxWidth: 410,
        aspectRatio: "410 / 233",
        objectFit: "cover",
        borderRadius: 10,
      }}
      src={imagemURL}
      alt="imagem-pergunta"
    />
  );
};

export default ImagemPasso;
