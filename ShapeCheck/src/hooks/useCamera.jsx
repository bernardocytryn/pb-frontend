import { useState, useRef, useCallback } from "react";
import showError from "../utils/showError";

const useCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraAtiva, setCameraAtiva] = useState(false);

  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraAtiva(true);
    } catch (erro) {
      showError("Permissão de câmera negada ou dispositivo não suportado.");
    }
  };

  const pararCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraAtiva(false);
  }, []);

  const baterFoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const urlFoto = canvas.toDataURL("image/jpeg");
      pararCamera();
      return urlFoto;
    }
    return null;
  };

  return {
    videoRef,
    canvasRef,
    cameraAtiva,
    iniciarCamera,
    pararCamera,
    baterFoto,
  };
};

export default useCamera;
