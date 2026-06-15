import React from "react";
import { IoMdHome } from "react-icons/io";
import { IoBarbell, IoStatsChartSharp } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

import logo from "../../assets/logoshapecheck.png";

import styles from "./Navbar.module.css";

const Navbar = ({ nomeUsuario }) => {
  const estiloLink = ({ isActive }) =>
    isActive ? `${styles.item} ${styles.ativo}` : styles.item;

  return (
    <nav className={styles.navbar} id="navbar">
      <div className={styles.container}>
        <div className={styles.itens}>
          <img
            src={logo}
            alt="ShapeCheck"
            className={styles.logo}
          />

          <NavLink className={estiloLink} to="/home">
            <span className={styles.icone}>
              <IoMdHome />
            </span>

            <span className={styles.texto}>
              Home
            </span>
          </NavLink>

          <NavLink className={estiloLink} to="/treino">
            <span className={styles.icone}>
              <IoBarbell />
            </span>

            <span className={styles.texto}>
              Treinos
            </span>
          </NavLink>

          <NavLink className={estiloLink} to="/dashboard">
            <span className={styles.icone}>
              <IoStatsChartSharp />
            </span>

            <span className={styles.texto}>
              Dashboard
            </span>
          </NavLink>
        </div>

        <div className={styles.itensPerfil}>
          <NavLink className={estiloLink} to="/perfil">
            <div className={styles.perfil}>
              <span className={styles.iconePerfil}>
                <FaUserLarge />
              </span>
            </div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;