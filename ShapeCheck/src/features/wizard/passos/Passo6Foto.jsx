import React, { useState } from "react";
import { FaCamera, FaUndo } from "react-icons/fa";
import BotaoAmarelo from "../../../components/ui/BotaoAmarelo";
import casaAcademia from "../../../assets/casa_academia.png";
import styles from "./Passo6Foto.module.css";

const Passo6Foto = ({ setTemFoto }) => {
  const [previewFoto, setPreviewFoto] = useState(null);

  const tirarFoto = () => {
    setPreviewFoto("foto");
    setTemFoto(true);
  };
  const refazerFoto = () => {
    setPreviewFoto(null);
    setTemFoto(false);
  };

  if (previewFoto) {
    return (
      <div className={styles.containerPreview}>
        <img src={casaAcademia} alt="foto-'antes'" />
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
