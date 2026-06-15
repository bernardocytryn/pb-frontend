import React, { useState, useRef, useEffect } from "react";
import showError from "../../utils/showError";
import { useAuth } from "../../hooks/useAuth";
import { IcoEngrenagem } from "./Icones";
import styles from "./CardPerfil.module.css";

export default function CardPerfil() {
  const { usuario, finalizarCadastroWizard } = useAuth();
  const perfil = usuario?.perfil || {};

  const nome = perfil?.nome || usuario?.email || "Usuário";
  const idade = perfil?.idade || "--";
  const email = usuario?.email;
  const photo = perfil?.photo;

  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputCaptureRef = useRef(null);

  const calcularIniciais = (nomeStr) => {
    if (!nomeStr) return "U";
    const partes = nomeStr.trim().split(" ");
    const a = partes[0]?.[0] || "";
    const b = partes[1]?.[0] || "";
    return (a + b).toUpperCase();
  };

  const processImageFile = (file, maxSize = 800) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("no-file"));
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.onload = () => {
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;
          const canvas = document.createElement("canvas");
          const size = Math.min(maxSize, minSide);
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        img.onerror = () => reject(new Error("img-load-error"));
        img.src = ev.target.result;
      };
      reader.onerror = () => reject(new Error("file-read-error"));
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showError("Arquivo muito grande. Tente uma imagem menor que 10MB.");
      return;
    }
    try {
      const dataUrl = await processImageFile(file, 800);
      const novoPerfil = { ...(perfil || {}), photo: dataUrl };
      finalizarCadastroWizard(novoPerfil);
      setMenuOpen(false);
      setShowCamera(false);
    } catch (e) {
      console.error(e);
      console.log("Erro ao processar imagem.");
    }
  };

  const onChangeFile = (e) => {
    const f = e.target.files && e.target.files[0];
    handleFile(f);
    e.target.value = null;
  };

  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!showCamera) return;
    const start = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(
            "Acesso à câmera bloqueado: É necessário estar em HTTPS.",
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        showError(e.message || "Não foi possível acessar a câmera.");
        setShowCamera(false);
      }
    };
    start();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [showCamera]);

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const minSide = Math.min(w, h);
    const sx = (w - minSide) / 2;
    const sy = (h - minSide) / 2;
    const canvas = document.createElement("canvas");
    const size = Math.min(800, minSide);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, sx, sy, minSide, minSide, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const novoPerfil = { ...(perfil || {}), photo: dataUrl };
    finalizarCadastroWizard(novoPerfil);
    setShowCamera(false);
    setMenuOpen(false);
  };

  const removePhoto = () => {
    const novoPerfil = { ...(perfil || {}) };
    delete novoPerfil.photo;
    finalizarCadastroWizard(novoPerfil);
    setMenuOpen(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        <div className={styles.avatarWrapper}>
          <div
            className={styles.avatar}
            onClick={() => setMenuOpen((s) => !s)}
            style={{ cursor: "pointer" }}
          >
            {photo ? (
              <img src={photo} alt="Foto" className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarTxt}>{calcularIniciais(nome)}</span>
            )}
          </div>
          <div className={styles.onlineBadge} />

          {menuOpen && (
            <div className={styles.avatarMenu} role="menu">
              <button
                className={styles.avatarMenuBtn}
                onClick={() => {
                  setShowCamera(true);
                }}
                aria-label="Tirar foto"
              >
                Tirar foto
              </button>
              <button
                className={styles.avatarMenuBtn}
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                aria-label="Escolher imagem"
              >
                Escolher imagem
              </button>
              <button
                className={styles.avatarMenuBtn}
                onClick={removePhoto}
                aria-label="Remover foto"
              >
                Remover foto
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onChangeFile}
          />

          <input
            ref={fileInputCaptureRef}
            type="file"
            accept="image/*"
            capture="user"
            style={{ display: "none" }}
            onChange={onChangeFile}
          />
        </div>

        {showCamera && (
          <div
            className={styles.cameraOverlay}
            onClick={() => setShowCamera(false)}
          >
            <div
              className={styles.cameraCard}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", height: "auto", borderRadius: 8 }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  className={styles.avatarMenuBtn}
                  onClick={captureFromCamera}
                >
                  Capturar
                </button>
                <button
                  className={styles.avatarMenuBtn}
                  onClick={() => setShowCamera(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.info}>
          <div className={styles.nomeRow}>
            <span className={styles.nome}>{nome}</span>
            <span className={styles.idade}>{idade} anos</span>
          </div>
          {email ? (
            <p className={styles.handle}>{email}</p>
          ) : (
            <p className={styles.handle}>E-mail não informado</p>
          )}

          <div className={styles.acoes}></div>
        </div>
      </div>
    </div>
  );
}
