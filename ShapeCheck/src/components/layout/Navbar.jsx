import React from "react";
import { IoMdHome } from "react-icons/io";
import { IoBarbell } from "react-icons/io5";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logoshapecheck.png";
import styles from "./Navbar.module.css";

const Navbar = ({ nomeUsuario }) => {
  const location = useLocation();

  const estiloLink = ({ isActive }) =>
    isActive ? `${styles.item} ${styles.ativo}` : styles.item;

  const rotasDeTreino = [
    "/treino",
    "/treinos",
    "/series",
    "/consultar",
    "/criar-serie",
  ];

  const isTreinoAtivo = rotasDeTreino.some((rota) =>
    location.pathname.startsWith(rota),
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.itens}>
        <img src={logo} alt="logo" />

        <NavLink className={estiloLink} to="/home">
          <span className={styles.icone}>
            <IoMdHome />
          </span>
          <span className={styles.texto}>Home</span>
        </NavLink>

        <NavLink
          className={() =>
            isTreinoAtivo ? `${styles.item} ${styles.ativo}` : styles.item
          }
          to="/treino"
        >
          <span className={styles.icone}>
            <IoBarbell />
          </span>
          <span className={styles.texto}>Treinos</span>
        </NavLink>

        <NavLink className={estiloLink} to="/dashboard">
          <span className={styles.icone}>
            <IoStatsChartSharp />
          </span>
          <span className={styles.texto}>Dashboard</span>
        </NavLink>
      </div>

      <div className={styles.itensPerfil}>
        <NavLink className={estiloLink} to="/perfil">
          <span className={styles.icone}>
            <FaUserLarge />
          </span>
          <div className={styles.perfil}>
            <span className={`${styles.texto} ${styles.textoOla}`}>
              Olá, Bernardo{nomeUsuario}
            </span>
            <span className={styles.iconePerfil}>
              <FaUserLarge />
            </span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
