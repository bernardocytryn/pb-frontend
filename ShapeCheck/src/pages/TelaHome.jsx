import React, { useState } from 'react';
import styles from './TelaHome.module.css';
import OlaMensagem from '../features/home/OlaMensagem';
import TreinoDoDia from '../features/home/TreinoDoDia';
import CalendarioSemanal from '../features/home/CalendarioSemanal';
import { useAuth } from "../hooks/useAuth";
import { useStatusTreino } from "../contexts/StatusTreinoContext";

export default function Home() {
  const { usuario } = useAuth();
  const { treinosConcluidos, finalizarTreino } = useStatusTreino();
  const [diaSelecionado, setDiaSelecionado] = useState(new Date().getDay());

  const plano = usuario?.planoSemanal || [];
  const treinos = usuario?.treinos || [];

  const statusDoDia = plano[diaSelecionado] || "Descanso";
  const treinoSelecionado = treinos.find(s =>
    s.nome.toLowerCase().includes(statusDoDia.toLowerCase()) ||
    statusDoDia.toLowerCase().includes(s.nome.toLowerCase())
  );

  const isHoje = diaSelecionado === new Date().getDay();
  // Verifica se o treino selecionado está no objeto de concluídos
  const isFinalizado = treinoSelecionado ? !!treinosConcluidos[treinoSelecionado.id] : false;

  const handleFinalizar = () => {
    if (treinoSelecionado) {
      const ids = treinoSelecionado.exercicios.map(ex => ex.exerciseId || ex.id);
      finalizarTreino(treinoSelecionado.id, ids);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <OlaMensagem />

        <TreinoDoDia
          treinoDados={treinoSelecionado}
          statusDoDia={statusDoDia}
          isHoje={isHoje}
          isFinalizado={isFinalizado}
          onFinalizar={handleFinalizar}
        />

        <CalendarioSemanal
          diaSelecionado={diaSelecionado}
          onSelectDay={setDiaSelecionado}
        />
      </main>
    </div>
  );
}