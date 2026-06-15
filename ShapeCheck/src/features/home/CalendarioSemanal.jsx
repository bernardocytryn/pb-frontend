import React, { useState, useEffect } from "react";
import styles from "./CalendarioSemanal.module.css";
import { useAuth } from "../../hooks/useAuth";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Calcula a semana atual uma única vez
function obterSemanaAtual() {
  const hoje = new Date();
  const domingo = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - hoje.getDay());
  const dias = [];
  for (let i = 0; i < 7; i++) {
    const diaAtual = new Date(domingo.getFullYear(), domingo.getMonth(), domingo.getDate() + i);
    dias.push({
      dia: diaAtual.getDate(),
      mes: diaAtual.getMonth(),
      ano: diaAtual.getFullYear(),
      dataISO: diaAtual.toISOString().split('T')[0],
    });
  }
  return dias;
}

export default function CalendarioSemanal({ diaSelecionado, onSelectDay }) {
  const { usuario } = useAuth();
  const [celulasSemana] = useState(obterSemanaAtual());
  const [hojeISO, setHojeISO] = useState("");

  useEffect(() => {
    setHojeISO(new Date().toISOString().split('T')[0]);
  }, []);

  const plano = usuario?.planoSemanal || [];

  const navegarDia = (direcao) => {
    const novoDia = diaSelecionado + direcao;
    if (novoDia >= 0 && novoDia <= 6) {
      onSelectDay(novoDia);
    }
  };

  return (
    <div className={styles.cardCalendario}>
      <div className={styles.cabecalho}>
        <div className={styles.mes}>
          {MESES[celulasSemana[0]?.mes]}
          <span className={styles.ano}>{celulasSemana[0]?.ano}</span>
        </div>
        <div className={styles.nav}>
          <button className={styles.btnNav} onClick={() => navegarDia(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className={styles.btnNav} onClick={() => navegarDia(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div className={styles.gradeSemana}>
        {celulasSemana.map((c, i) => {
          const isSelecionado = i === diaSelecionado;
          const isHoje = c.dataISO === hojeISO;
          const isTreino = (plano[i] || "Descanso") !== "Descanso";

          let classe = "";
          if (isSelecionado) classe = styles.selecionado;
          else if (isHoje) classe = styles.indicadorHoje;
          else if (isTreino) classe = styles.diaTreino;
          else classe = styles.diaDescanso;

          return (
            <div key={c.dataISO} className={styles.colunaDia} onClick={() => onSelectDay(i)}>
              <span className={styles.diaNome}>{DIAS_SEMANA[i]}</span>
              <div className={`${styles.celulaNumero} ${classe}`}>{c.dia}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}