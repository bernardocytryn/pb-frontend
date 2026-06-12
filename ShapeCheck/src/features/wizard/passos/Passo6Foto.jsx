import React, { useState, useEffect } from "react";
import { FaCamera, FaUndo } from "react-icons/fa";
import BotaoAmarelo from "../../../components/ui/BotaoAmarelo";
import useCamera from "../../../hooks/useCamera";
import styles from "./Passo6Foto.module.css";

const Passo6Foto = ({ temFoto, setTemFoto }) => {
  const [fotoAntes, setFotoAntes] = useState(null);
  const {
    videoRef,
    canvasRef,
    cameraAtiva,
    iniciarCamera,
    pararCamera,
    baterFoto,
  } = useCamera();

  useEffect(() => {
    return () => pararCamera();
  }, [pararCamera]);

  const capturar = () => {
    const foto = baterFoto();
    if (foto) {
      setFotoAntes(foto);
      setTemFoto(true);
    }
  };

  const refazerFoto = () => {
    setFotoAntes(null);
    setTemFoto(false);
    iniciarCamera();
  };

  if (temFoto && fotoAntes) {
    return (
      <div className={styles.containerPreview}>
        <img
          src={fotoAntes}
          alt="primeira foto"
          style={{ width: "100%", borderRadius: "10px" }}
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
  }

  if (cameraAtiva) {
    return (
      <div className={styles.containerPreview}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            borderRadius: "10px",
            backgroundColor: "#000",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <BotaoAmarelo
          texto={
            <>
              Capturar <FaCamera />
            </>
          }
          onClick={capturar}
        />
      </div>
    );
  }

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
              Abrir câmera <FaCamera />
            </>
          }
          onClick={iniciarCamera}
        />
      </div>
    </div>
  );
};

export default Passo6Foto;
