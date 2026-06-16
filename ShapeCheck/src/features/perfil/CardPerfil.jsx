import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import showError from "../../utils/showError";
import { useAuth } from "../../hooks/useAuth";
import styles from "./CardPerfil.module.css";

export default function CardPerfil() {
  const { usuario, atualizarUsuario } = useAuth();
  const perfil = usuario?.perfil || {};

  const nome = perfil?.nome || usuario?.email || "Usuário";
  const idade = perfil?.idade || "--";
  const email = usuario?.email;
  const photo = perfil?.photo;

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef(null);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const calcularIniciais = (nomeStr) => {
    if (!nomeStr) return "U";
    const partes = nomeStr.trim().split(" ");
    return ((partes[0]?.[0] || "") + (partes[1]?.[0] || "")).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
        avatarRef.current && !avatarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    if (!menuOpen && avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + rect.width / 2,
      });
    }
    setMenuOpen(!menuOpen);
  };

  const processImageFile = (file, maxSize = 800) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("no-file"));
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (ev) => {
        img.onload = () => {
          const minSide = Math.min(img.width, img.height);
          const canvas = document.createElement("canvas");
          const size = Math.min(maxSize, minSide);
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, (img.width - minSide) / 2, (img.height - minSide) / 2, minSide, minSide, 0, 0, size, size);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return showError("Arquivo muito grande.");
    try {
      const dataUrl = await processImageFile(file, 800);
      atualizarUsuario({ perfil: { ...perfil, photo: dataUrl } });
      setMenuOpen(false);
      setShowCamera(false);
    } catch (e) {
      showError("Erro ao processar imagem.");
    }
  };

  const removePhoto = () => {
    atualizarUsuario({ perfil: { ...perfil, photo: null } });
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!showCamera) return;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        showError("Câmera bloqueada.");
        setShowCamera(false);
      }
    };
    start();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, [showCamera]);

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    const size = Math.min(800, Math.min(video.videoWidth, video.videoHeight));
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, (video.videoWidth - size) / 2, (video.videoHeight - size) / 2, size, size, 0, 0, size, size);
    atualizarUsuario({ perfil: { ...perfil, photo: canvas.toDataURL("image/jpeg", 0.9) } });
    setShowCamera(false);
    setMenuOpen(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        <div className={styles.avatarWrapper}>
          <div ref={avatarRef} className={styles.avatar} onClick={toggleMenu} style={{ cursor: "pointer" }}>
            {photo ? <img src={photo} alt="Foto" className={styles.avatarImg} /> : <span className={styles.avatarTxt}>{calcularIniciais(nome)}</span>}
          </div>
          <div className={styles.onlineBadge} />

          {menuOpen && createPortal(
            <div ref={menuRef} className={styles.avatarMenu} role="menu" style={{ top: menuPos.top, left: menuPos.left }}>
              <button className={styles.avatarMenuBtn} onClick={() => { setShowCamera(true); setMenuOpen(false); }}>Tirar foto</button>
              <button className={styles.avatarMenuBtn} onClick={() => fileInputRef.current?.click()}>Escolher imagem</button>
              <button className={styles.avatarMenuBtn} onClick={removePhoto}>Remover foto</button>
            </div>,
            document.body
          )}

          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
        </div>

        {showCamera && (
          <div className={styles.cameraOverlay} onClick={() => setShowCamera(false)}>
            <div className={styles.cameraCard} onClick={(e) => e.stopPropagation()}>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", borderRadius: 8 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className={styles.avatarMenuBtn} onClick={captureFromCamera}>Capturar</button>
                <button className={styles.avatarMenuBtn} onClick={() => setShowCamera(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.info}>
          <div className={styles.nomeRow}>
            <span className={styles.nome}>{nome}</span>
            <span className={styles.idade}>{idade} anos</span>
          </div>
          <p className={styles.handle}>{email || "E-mail não informado"}</p>
        </div>
      </div>
    </div>
  );
}