import React, { useState } from "react";
import { FaCamera, FaUndo } from "react-icons/fa";
import BotaoAmarelo from "../../../components/ui/BotaoAmarelo";
import casaAcademia from "../../../assets/casa_academia.png";
import styles from "./Passo6Foto.module.css";

const Passo6Foto = () => {
  const [previewFoto, setPreviewFoto] = useState(null);
  const tirarFoto = () => {
    setPreviewFoto("foto");
  };
  const refazerFoto = () => setPreviewFoto(null);

  if (previewFoto) {
    return (
      <div className={styles.containerPreview}>
        <img
          src={casaAcademia}
          style={{
            width: "100%",
            maxWidth: 410,
            aspectRatio: "3 / 4",
            objectFit: "cover",
            borderRadius: 10,
            border: "1px solid #f2f2f2"
          }}
          alt="foto-'antes'"
        />
        <BotaoAmarelo
          texto={
            <>
              Refazer <FaUndo />
            </>
          }
          onClick={refazerFoto}
        />
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Sua Jornada começa agora</h1>
          <p className={styles.description}>
            Tire uma foto do "antes" do seu físico. Ver as mudanças no seu corpo
            ao longo do tempo é a melhor forma de medir seu progresso real.
          </p>
        </div>
        <div className={styles.photoCard}>
          <span className={styles.cameraIcon}>
            <FaCamera />
          </span>
        </div>
        <div className={styles.picButton}>
          <BotaoAmarelo
            texto={
              <>
                Tirar foto <FaCamera />
              </>
            }
            onClick={tirarFoto}
          />
        </div>
      </div>
    );
  }
};

export default Passo6Foto;
