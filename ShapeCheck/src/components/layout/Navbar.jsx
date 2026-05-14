import { IoMdHome } from "react-icons/io";
import { IoBarbell } from "react-icons/io5";
import { IoStatsChartSharp } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.icones}>
        <NavLink
          className={styles.icone}
          to="/dashboard"
          style={({ isActive }) => ({
            color: isActive ? "#000000" : "#f2f2f2",
            backgroundColor: isActive ? "#ffcb3c" : "transparent",
          })}
        >
          <IoMdHome />
        </NavLink>
        <NavLink
          className={styles.icone}
          to="/treinos"
          style={({ isActive }) => ({
            color: isActive ? "#000000" : "#f2f2f2",
            backgroundColor: isActive ? "#ffcb3c" : "transparent",
          })}
        >
          <IoBarbell />
        </NavLink>
        <NavLink
          className={styles.icone}
          to="/graficos"
          style={({ isActive }) => ({
            color: isActive ? "#000000" : "#f2f2f2",
            backgroundColor: isActive ? "#ffcb3c" : "transparent",
          })}
        >
          <IoStatsChartSharp />
        </NavLink>
        <NavLink
          className={styles.icone}
          to="/perfil"
          style={({ isActive }) => ({
            color: isActive ? "#000000" : "#f2f2f2",
            backgroundColor: isActive ? "#ffcb3c" : "transparent",
          })}
        >
          <FaUserLarge />
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
