import React, { useState, useEffect } from "react";
import styles from "./CalendarioSemanal.module.css";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function obterDiasDaSemana(navOffset) {
  const hoje = new Date();

  const dataAlvo = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + (navOffset * 7));

  const domingo = new Date(dataAlvo.getFullYear(), dataAlvo.getMonth(), dataAlvo.getDate() - dataAlvo.getDay());

  const dias = [];
  for (let i = 0; i < 7; i++) {
    const diaAtual = new Date(domingo.getFullYear(), domingo.getMonth(), domingo.getDate() + i);

    const isHoje =
      diaAtual.getDate() === hoje.getDate() &&
      diaAtual.getMonth() === hoje.getMonth() &&
      diaAtual.getFullYear() === hoje.getFullYear();

    dias.push({
      dia: diaAtual.getDate(),
      mes: diaAtual.getMonth(),
      ano: diaAtual.getFullYear(),
      dataISO: diaAtual.toISOString().split('T')[0],
      tipo: isHoje ? "hoje" : "",
    });
  }

  return dias;
}

export default function CalendarioSemanal() {
  const [_nav, setNav] = useState(0);
  const [celulasSemana, setCelulasSemana] = useState([]);

  useEffect(() => {
    const diasCalculados = obterDiasDaSemana(_nav);
    setCelulasSemana(diasCalculados);
  }, [_nav]);

  if (celulasSemana.length === 0) return null;

  const mesAtual = MESES[celulasSemana[0].mes];
  const anoAtual = celulasSemana[0].ano;

  return (
    <div className={styles.cardCalendario}>
      <div className={styles.cabecalho}>
        <div className={styles.mes}>
          {mesAtual} <span className={styles.ano}>{anoAtual}</span>
        </div>
        <div className={styles.nav}>
          <button
            className={styles.btnNav}
            onClick={() => setNav((n) => n - 1)}
            aria-label="Semana anterior"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            className={styles.btnNav}
            onClick={() => setNav((n) => n + 1)}
            aria-label="Próxima semana"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.gradeSemana}>
        {celulasSemana.map((c, i) => (
          <div key={c.dataISO} className={styles.colunaDia}>
            <span className={styles.diaNome}>{DIAS_SEMANA[i]}</span>
            <div className={`${styles.celulaNumero} ${styles[c.tipo] || ""}`}>
              {c.dia}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}