import React, { useEffect, useState } from "react";
import styles from "./ErrorBanner.module.css";

export default function ErrorBanner() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let timeout = null;
    const handler = (e) => {
      const text = e?.detail || "";
      setMsg(text);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setMsg(""), 5000);
    };
    window.addEventListener("app:error", handler);
    return () => {
      window.removeEventListener("app:error", handler);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!msg) return null;

  return (
    <div className={styles.banner} role="alert">
      <span className={styles.text}>{msg}</span>
      <button
        className={styles.close}
        onClick={() => setMsg("")}
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
}
