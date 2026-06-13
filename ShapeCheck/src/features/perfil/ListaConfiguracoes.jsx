import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import EditarPerfil from "./EditarPerfil";
import {
  IcoCadeado,
  IcoUsuario,
  IcoEscudo,
  IcoAjustes,
  IcoSair,
  IcoSetaDir,
} from "./Icones";
import styles from "./ListaConfiguracoes.module.css";

function getIcon(iconKey) {
  const icons = {
    cadeado: <IcoCadeado />,
    usuario: <IcoUsuario />,
    escudo: <IcoEscudo />,
    ajustes: <IcoAjustes />,
    sair: <IcoSair />,
  };
  return icons[iconKey];
}

export default function ListaConfiguracoes() {
  const { sairDaConta } = useAuth();
  const navigate = useNavigate();
  const [showConta, setShowConta] = useState(false);

  const items = [
    { titulo: "Conta", sub: "Gerenciar suas informações", icon: "usuario" },
  ];

  const lidarComClique = (item) => {
    if (item.icon === "sair") {
      sairDaConta();
      navigate('/');
      return;
    }

    if (item.icon === "usuario") {
      setShowConta((s) => !s);
    }
  };

  const handleSair = () => {
    sairDaConta();
    navigate('/');
  };

  return (
    <div className={styles.lista}>
      {items.map((config, i) => (
        <React.Fragment key={i}>
          <div
            className={`${styles.item} ${config.perigo ? styles.perigo : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => lidarComClique(config)}
          >
            <div className={styles.icone}>{getIcon(config.icon)}</div>
            <div className={styles.textoContainer}>
              <div className={styles.titulo}>{config.titulo}</div>
              <div className={styles.subtitulo}>{config.sub}</div>
            </div>
            <div className={styles.seta}>
              <IcoSetaDir />
            </div>
          </div>

          {config.icon === 'usuario' && showConta && (
            <div className={styles.expand}>
              <EditarPerfil />
            </div>
          )}
        </React.Fragment>
      ))}

      <div
        className={`${styles.item} ${styles.perigo}`}
        role="button"
        tabIndex={0}
        onClick={handleSair}
      >
        <div className={styles.icone}>{getIcon('sair')}</div>
        <div className={styles.textoContainer}>
          <div className={styles.titulo}>Sair da conta</div>
          <div className={styles.subtitulo}>Encerrar sessão atual</div>
        </div>
        <div className={styles.seta}>
          <IcoSetaDir />
        </div>
      </div>
    </div>
  );
}
