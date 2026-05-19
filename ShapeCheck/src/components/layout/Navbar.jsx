import { IoMdHome } from "react-icons/io";
import { IoBarbell } from "react-icons/io5";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.itens}>
        <NavLink
          className={styles.item}
          to="/dashboard"
          style={({ isActive }) => ({
            color: isActive ? "#000000" : "#f2f2f2",
            backgroundColor: isActive ? "#ffcb3c" : "transparent",
          })}
        >
          <span className={styles.icone}>
            <IoMdHome />
          </span>
          <span className={styles.texto}>Home</span>
        </NavLink>
        <NavLink
          className={styles.item}
          to="/treinos"
          style={({ isActive }) => ({
            color: isActive ? "#000000" : "#f2f2f2",
            backgroundColor: isActive ? "#ffcb3c" : "transparent",
          })}
        >
          <span className={styles.icone}>
            <IoBarbell />
          </span>
          <span className={styles.texto}>Treinos</span>
        </NavLink>
        <NavLink
          className={styles.item}
          to="/graficos"
          style={({ isActive }) => ({
            color: isActive ? "#000000" : "#f2f2f2",
            backgroundColor: isActive ? "#ffcb3c" : "transparent",
          })}
        >
          <span className={styles.icone}>
            <IoStatsChartSharp />
          </span>
          <span className={styles.texto}>Progresso</span>
        </NavLink>
        <NavLink
          className={styles.item}
          to="/perfil"
          style={({ isActive }) => ({
            color: isActive ? "#000000" : "#f2f2f2",
            backgroundColor: isActive ? "#ffcb3c" : "transparent",
          })}
        >
          <span className={styles.icone}>
            <FaUserLarge />
          </span>
          <span className={styles.texto}>Perfil</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
