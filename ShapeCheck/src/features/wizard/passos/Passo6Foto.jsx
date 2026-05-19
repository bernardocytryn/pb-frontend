import React, { useRef, useState } from "react";
import { FaCamera, FaUndo } from "react-icons/fa";
import BotaoAmarelo from "../../../components/ui/BotaoAmarelo";
import casaAcademia from "../../../assets/casa_academia.png";
import styles from "./Passo6Foto.module.css";

const Passo6Foto = ({ temFoto, setTemFoto }) => {
  const inputCameraRef = useRef(null);
  const [fotoAntes, setFotoAntes] = useState(null);

  const clicarNaCamera = () => inputCameraRef.current.click();
  const salvarFoto = (e) => {
    const arquivo = e.target.files[0];

    if (arquivo) {
      const urlFoto = URL.createObjectURL(arquivo);
      setFotoAntes(urlFoto);
      setTemFoto(true);
    }
  };

  const refazerFoto = () => {
    setFotoAntes(null);
    setTemFoto(false);
  };

  if (temFoto && fotoAntes) {
    return (
      <div className={styles.containerPreview}>
        <img src={fotoAntes} alt="primeira foto" />
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
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={inputCameraRef}
            onChange={salvarFoto}
            style={{ display: "none" }}
          />
          <BotaoAmarelo
            texto={
              <>
                Tirar foto <FaCamera />
              </>
            }
            onClick={clicarNaCamera}
          />
        </div>
      </div>
    );
  }
};

export default Passo6Foto;
