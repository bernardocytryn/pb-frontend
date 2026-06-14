import React, { useMemo } from 'react';
import styles from './TelaHome.module.css';
import OlaMensagem from '../features/home/OlaMensagem';
import TreinoDoDia from '../features/home/TreinoDoDia';
import CalendarioSemanal from '../features/home/CalendarioSemanal';
import { useAuth } from "../hooks/useAuth";
import { useStatusTreino } from "../contexts/StatusTreinoContext";

export default function Home() {

  const { usuario } = useAuth();
  const { statusSeries } = useStatusTreino();
  const seriesSalvas = usuario?.treinos || [];

  const treinoDados = useMemo(() => {
    if (seriesSalvas.length === 0) return null;

    const treinoPendente = seriesSalvas.find(serie => !statusSeries[serie.id]) || seriesSalvas[0];
    const exerciciosAtivos = treinoPendente.exercicios || [];

    const gruposUnicos = [...new Set(exerciciosAtivos.map(ex => ex.bodyPart))].filter(Boolean);

    return {
      id: treinoPendente.id,
      nome: treinoPendente.nome || "TREINO",
      gruposMusculares: gruposUnicos,
      exercicios: exerciciosAtivos
    };
  }, [seriesSalvas, statusSeries]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <OlaMensagem />

        <TreinoDoDia treinoDados={treinoDados} />

        <CalendarioSemanal />
      </main>
    </div>
  );
}