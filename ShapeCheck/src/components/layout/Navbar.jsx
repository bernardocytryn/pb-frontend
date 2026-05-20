import { IoMdHome } from "react-icons/io";
import { IoBarbell } from "react-icons/io5";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logoshapecheck.png";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const estiloLink = ({ isActive }) =>
    isActive ? `${styles.item} ${styles.ativo}` : styles.item;
  return (
    <div className={styles.navbar}>
      <div className={styles.itens}>
        <img src={logo} alt="logo" />
        <NavLink className={estiloLink} to="/dashboard">
          <span className={styles.icone}>
            <IoMdHome />
          </span>
          <span className={styles.texto}>Home</span>
        </NavLink>

        <NavLink className={estiloLink} to="/treinos">
          <span className={styles.icone}>
            <IoBarbell />
          </span>
          <span className={styles.texto}>Treinos</span>
        </NavLink>

        <NavLink className={estiloLink} to="/graficos">
          <span className={styles.icone}>
            <IoStatsChartSharp />
          </span>
          <span className={styles.texto}>Progresso</span>
        </NavLink>

        <NavLink className={estiloLink} to="/perfil">
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
