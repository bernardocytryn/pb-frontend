import React from "react";
import { configsData } from "../../data/dadosPerfil";
import { useAuth } from "../../hooks/useAuth";
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

  const lidarComClique = (config) => {
    if (config.icon === "sair") {
      sairDaConta();
    }
  };

  return (
    <div className={styles.lista}>
      {configsData.map((config, i) => (
        <div
          key={i}
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
      ))}
    </div>
  );
}
